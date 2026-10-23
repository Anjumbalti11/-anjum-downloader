import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=os.path.join(BASE_DIR, 'public'), static_url_path='')
CORS(app)

@app.route('/')
def home():
    try:
        public_dir = os.path.join(BASE_DIR, 'public')
        return send_from_directory(public_dir, 'index.html')
    except Exception as e:
        return f"Error loading index.html: {str(e)}", 404

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

    ydl_opts = {
        'format': 'best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'proxy': '', # Proxy bypass force karein
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        'extractor_args': {
            'tiktok': {
                'app_info': ['7355728856979392262/trill/34.5.0/340500/1180']
            }
        }
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get('formats', [])
            
            video_url = info.get('url', '')
            audio_url = ''
            
            if not video_url and formats:
                for f in formats:
                    if f.get('ext') == 'mp4' and f.get('vcodec') != 'none' and f.get('url'):
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
        return jsonify({'error': f'Download failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
