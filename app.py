from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Anjum Social Media Downloader API is Live!"

@app.route('/api/download')
def download_video():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400

    # Direct MP4 / MP3 link handle karein
    if url.endswith('.mp4') or url.endswith('.mp3'):
        return jsonify({
            'success': True,
            'title': 'Direct Media File',
            'thumbnail': 'https://cdn-icons-png.flaticon.com/512/716/716784.png',
            'video_url': url,
            'audio_url': ''
        })

    # Cookies file (agar mojood ho toh Instagram/FB ke liye)
    cookie_path = '/app/cookies.txt' if os.path.exists('/app/cookies.txt') else 'cookies.txt'

    # yt-dlp Options
    ydl_opts = {
        'format': 'best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        # TikTok ke liye Mobile API force karein (Webpage error fix)
        'extractor_args': {
            'tiktok': {
                'app_info': ['7355728856979392262'] # Ek random IID (Install ID)
            }
        }
    }

    # Agar cookies file mojood hai toh use karein (Instagram block se bachne ke liye)
    if os.path.exists(cookie_path):
        ydl_opts['cookiefile'] = cookie_path

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get('formats', [])
            
            # Best Video aur Audio nikalne ki logic
            video_url = ''
            audio_url = ''
            
            if info.get('url'):
                video_url = info['url']
            elif formats:
                for f in formats:
                    if f.get('ext') == 'mp4' and f.get('vcodec') != 'none':
                        video_url = f['url']
                        break
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        audio_url = f['url']
                        break
            
            if not video_url:
                return jsonify({'error': 'Video link not found. Link private ho sakta hai.'}), 400

            return jsonify({
                'success': True,
                'title': info.get('title', 'Social Media Video'),
                'thumbnail': info.get('thumbnail', ''),
                'video_url': video_url,
                'audio_url': audio_url
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
