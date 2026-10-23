from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import os
import traceback

app = Flask(__name__)
CORS(app)  # Yeh InfinityFree wali website se connect hone ke liye zaroori hai

@app.route('/')
def home():
    return "Anjum All-in-One Downloader API is Live!"

# Saare media (TikTok, Insta, FB, MP4) ke liye ek hi endpoint
@app.route('/api/download')
def download_media():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400

    # 1. Agar user direct .mp4 ya .mp3 ka link daalta hai
    if url.endswith('.mp4') or url.endswith('.mp3') or url.endswith('.m3u8'):
        return jsonify({
            'success': True,
            'title': 'Direct Media File',
            'thumbnail': 'https://cdn-icons-png.flaticon.com/512/716/716784.png',
            'video_url': url,
            'audio_url': ''
        })

    # 2. Cookies ka path (Instagram/FB ke block se bachne ke liye)
    cookie_path = '/app/cookies.txt' if os.path.exists('/app/cookies.txt') else 'cookies.txt'

    # 3. yt-dlp ki settings (Bot protection bypass)
    ydl_opts = {
        'format': 'best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        # 'chrome-131' browser ki tarah behave karega (curl_cffi library ke zariye)
        'impersonate': 'chrome-131', 
        'extractor_args': {
            'tiktok': {
                # TikTok Mobile API (No watermark ke liye)
                'app_info': ['7355728856979392262/trill/34.5.0/340500/1180'] 
            }
        }
    }

    # Agar cookies file mojood hai toh use karein
    if os.path.exists(cookie_path):
        ydl_opts['cookiefile'] = cookie_path

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get('formats', [])
            
            video_url = ''
            audio_url = ''
            
            # Direct video URL
            if info.get('url'):
                video_url = info['url']
            
            # Formats se best MP4 aur Audio nikalna
            elif formats:
                for f in formats:
                    if f.get('ext') == 'mp4' and f.get('vcodec') != 'none' and f.get('url'):
                        video_url = f['url']
                        break
                
                # Agar MP4 na mile toh koi bhi video stream le lein
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
        # Agar koi error aaye toh traceback print karein (Wasmer logs mein dekhne ke liye)
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        
        # Frontend ko JSON error bhejein taake app crash na ho
        return jsonify({'error': f'Download failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
