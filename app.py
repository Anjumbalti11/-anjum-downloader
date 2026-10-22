from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import requests

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Anjum Downloader API is Live!"

@app.route('/api/social')
def social_download():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400

    # 1. TikTok Link (No watermark)
    if 'tiktok.com' in url:
        try:
            # TikTok API se direct no-watermark link nikalna
            api_url = f"https://api.douyin.wtf/api/hybrid/video_data?url={url}&minimal=false"
            res = requests.get(api_url, timeout=10)
            data = res.json()
            
            if data.get('code') == 200:
                video_url = data['data']['video_data']['nwm_video_url_HQ']
                return jsonify({
                    'success': True,
                    'title': 'TikTok Video',
                    'thumbnail': data['data']['cover_data']['origin_cover']['url_list'][0],
                    'video_url': video_url,
                    'audio_url': ''
                })
        except Exception as e:
            pass # Agar pehli API fail ho toh yt-dlp try karega

    # 2. Instagram, Facebook, Twitter & Vimeo (Using yt-dlp)
    ydl_opts = {
        'format': 'best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'extractor_args': {'tiktok': {'webapp': ['']}} # TikTok watermark remove
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Best Video aur Audio nikalne ki logic
            video_url = ''
            audio_url = ''
            
            if info.get('url'):
                video_url = info['url']
            elif info.get('formats'):
                # Try to find the best mp4
                for f in info['formats']:
                    if f.get('ext') == 'mp4' and f.get('vcodec') != 'none':
                        video_url = f['url']
                        break
                # Try to find audio only
                for f in info['formats']:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        audio_url = f['url']
                        break
            
            if not video_url:
                return jsonify({'error': 'Video link not found. Instagram may require login.'}), 400

            return jsonify({
                'success': True,
                'title': info.get('title', 'Social Media Video'),
                'thumbnail': info.get('thumbnail', ''),
                'video_url': video_url,
                'audio_url': audio_url
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Direct MP4 / M3U8 Links ke liye
@app.route('/api/direct')
def direct_download():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400

    return jsonify({
        'success': True,
        'title': 'Direct Media File',
        'thumbnail': 'https://cdn-icons-png.flaticon.com/512/716/716784.png',
        'video_url': url,
        'audio_url': ''
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
