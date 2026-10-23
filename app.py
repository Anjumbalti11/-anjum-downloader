import os
import traceback
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

@app.route('/')
def home():
    try:
        # Debugging ke liye: Check karein ke file kahan hai
        current_dir = os.path.dirname(os.path.abspath(__file__))
        public_dir = os.path.join(current_dir, 'public')
        file_path = os.path.join(public_dir, 'index.html')
        
        print(f"Looking for file at: {file_path}")
        
        if os.path.exists(file_path):
            return send_from_directory(public_dir, 'index.html')
        else:
            # Agar file nahi mili, toh error message bhejein
            return f"Error: index.html not found at {file_path}", 404
            
    except Exception as e:
        # Agar koi aur error aaye, toh traceback print karein
        print(traceback.format_exc())
        return "An internal error occurred while serving the homepage.", 500

@app.route('/api/download')
def download_media():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400

    if url.endswith('.mp4') or url.endswith('.mp3'):
        return jsonify({
            'success': True,
            'title': 'Direct Media File',
            'thumbnail': 'https://cdn-icons-png.flaticon.com/512/716/716784.png',
            'video_url': url,
            'audio_url': ''
        })

    cookie_path = '/app/cookies.txt' if os.path.exists('/app/cookies.txt') else 'cookies.txt'

    ydl_opts = {
        'format': 'best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        'extractor_args': {
            'tiktok': {
                'app_info': ['7355728856979392262/trill/34.5.0/340500/1180'] 
            }
        }
    }

    if os.path.exists(cookie_path):
        ydl_opts['cookiefile'] = cookie_path

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get('formats', [])
            
            video_url = ''
            audio_url = ''
            
            if info.get('url'):
                video_url = info['url']
            elif formats:
                for f in formats:
                    if f.get('ext') == 'mp4' and f.get('vcodec') != 'none' and f.get('url'):
                        video_url = f['url']
                        break
                if not video_url:
                    for f in formats:
                        if f.get('vcodec') != 'none' and f.get('url'):
                            video_url = f['url']
                            break
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none' and f.get('url'):
                        audio_url = f['url']
                        break
            
            if not video_url:
                return jsonify({'error': 'Video link nahi mila. Private ho sakta hai.'}), 400

            return jsonify({
                'success': True,
                'title': info.get('title', 'Social Media Video'),
                'thumbnail': info.get('thumbnail', ''),
                'video_url': video_url,
                'audio_url': audio_url
            })
            
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': f'Download failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
