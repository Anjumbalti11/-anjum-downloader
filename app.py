from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Anjum All-in-One Downloader API is Live!"

@app.route('/api/download')
def download_media():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400

    # 1. Direct MP4 / MP3 Links handle karein
    if url.endswith('.mp4') or url.endswith('.mp3') or url.endswith('.m3u8'):
        return jsonify({
            'success': True,
            'title': 'Direct Media File',
            'thumbnail': 'https://cdn-icons-png.flaticon.com/512/716/716784.png',
            'video_url': url,
            'audio_url': ''
        })

    # 2. Cookies Setup (Agar cookies.txt mojood hai toh use karein)
    # Instagram/FB ke liye yeh bohot zaroori hai
    cookie_path = '/app/cookies.txt' if os.path.exists('/app/cookies.txt') else 'cookies.txt'

    # 3. yt-dlp Options (Bot protection bypass ke liye)
    ydl_opts = {
        'format': 'best', 
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'impersonate': 'chrome-131', # Browser ki tarah behave karega
        'extractor_args': {
            'tiktok': {
                # TikTok Mobile API (No watermark ke liye)
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
            
            # Link nikalen
            if info.get('url'):
                video_url = info['url']
            elif formats:
                for f in formats:
                    if f.get('ext') == 'mp4' and f.get('vcodec') != 'none' and f.get('url'):
                        video_url = f['url']
                        break
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none' and f.get('url'):
                        audio_url = f['url']
                        break
            
            if not video_url:
                return jsonify({'error': 'Link nahi mila. Instagram private ho sakta hai.'}), 400

            return jsonify({
                'success': True,
                'title': info.get('title', 'Social Media Video'),
                'thumbnail': info.get('thumbnail', ''),
                'video_url': video_url,
                'audio_url': audio_url
            })
            
    except Exception as e:
        # Agar koi error aaye toh app crash na ho, balke JSON message bheje
        error_msg = str(e)
        print(f"Error Log: {error_msg}")
        return jsonify({'error': f'Download failed: {error_msg}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
