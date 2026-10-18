import express from 'express';
import cors from 'cors';
import ytdl from '@distube/ytdl-core';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// YAHAN APNI YOUTUBE COOKIES PASTE KAREIN
// ==========================================
// Neeche quotes ke andar apni copy ki hui cookie paste karein
const cookieString = "[
{
    "domain": ".youtube.com",
    "expirationDate": 1823890504.192238,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDTS",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjQBkldj_4OtT7SbcWFB6ROdHnAU-MiZZYAphJsB56P-2xwvDI1E5WknAXCkKnEzGY0iCDk8EAA",
    "id": 1
},
{
    "domain": ".youtube.com",
    "expirationDate": 1826878295.23913,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-3PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "rQfR1PUyrtE4aIIg/A6WnfDr6xkBoy0W_W",
    "id": 2
},
{
    "domain": ".youtube.com",
    "expirationDate": 1826878295.239223,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a000DwnetW7kmdpwhArqraPoqOCB6GIiQtmPae9xrpJsnHE491J9okiMuf9yxWDISA7SXS96hAACgYKAfISARISFQHGX2MiqyRGb74arF2eKL9dJzkfRRoVAUF8yKrLfgs9rfRR7SAYQHOy1syf0076",
    "id": 3
},
{
    "domain": ".youtube.com",
    "expirationDate": 1823890504.193031,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzUXchdj7fuUiC7FwowOGgj6y9kqRRdukTvAiZJ2nN7dMKOE_W7bsMN89WTvi3E95zzHfg",
    "id": 4
},
{
    "domain": ".youtube.com",
    "expirationDate": 1823890504.192719,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjQBkldj_4OtT7SbcWFB6ROdHnAU-MiZZYAphJsB56P-2xwvDI1E5WknAXCkKnEzGY0iCDk8EAA",
    "id": 5
},
{
    "domain": ".youtube.com",
    "expirationDate": 1807870281.167537,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-BUCKET",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "CLIB",
    "id": 6
},
{
    "domain": ".youtube.com",
    "expirationDate": 1826878296.290289,
    "hostOnly": false,
    "httpOnly": true,
    "name": "LOGIN_INFO",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AFmmF2swRQIgVsbCn2cMe6GJjw_LJjZobYGcM9FM__lJjKLUcBGntycCIQDGuBRPN42pyhgdu8icXXBplhTmZm5R-ai_lNPNtk_IPA:QUQ3MjNmd19fY3I2UzVwQmQtcUhSVWlqLUhsU0sxT1E1QlBUeHlwbmtFTGEzbE1McG5UUW5iTVVsem5PYnpfMnRoSFg4TjR2WDJGLWM5RnFXUllDSngtMzU2S3VEc1BjaDFleEQ2enVNeW0yaDJIVTBmWlZxMEN3WmxLeTBLcjQtSGt1WlNLUWtJQlNwZTZyRWRIWEV5dXlfUGRGb2dMeTFB",
    "id": 7
},
{
    "domain": ".youtube.com",
    "expirationDate": 1826911932.440637,
    "hostOnly": false,
    "httpOnly": false,
    "name": "PREF",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "tz=Asia.Karachi",
    "id": 8
}
]"; 

app.use(cors());

// Public folder se static files serve karna
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 1. API: Video Info
app.get('/api/info', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    // Yahan getInfo mein cookie pass ki gayi hai
    const info = await ytdl.getInfo(videoUrl, {
      requestOptions: {
        headers: {
          cookie: cookieString,
        },
      },
    });
    
    const videoFormats = [];
    const audioFormats = [];

    info.formats.forEach(format => {
      if (format.hasVideo && format.hasAudio) {
        videoFormats.push({
          itag: format.itag,
          quality: format.qualityLabel || format.quality,
          size: format.contentLength ? parseInt(format.contentLength) : null
        });
      } else if (format.hasAudio && !format.hasVideo) {
        audioFormats.push({
          itag: format.itag,
          quality: format.audioBitrate ? `${format.audioBitrate} kbps` : 'Audio',
          size: format.contentLength ? parseInt(format.contentLength) : null
        });
      }
    });

    const uniqueVideo = Array.from(new Map(videoFormats.map(f => [f.quality, f])).values());
    const uniqueAudio = Array.from(new Map(audioFormats.map(f => [f.quality, f])).values());

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      uploader: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds,
      videoFormats: uniqueVideo.reverse(),
      audioFormats: uniqueAudio.reverse()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Video info fetch nahi ho saki. Link check karein.' });
  }
});

// 2. API: Download
app.get('/api/download', async (req, res) => {
  const { url, itag, type } = req.query;
  if (!url || !itag) return res.status(400).send('Missing parameters');

  try {
    const title = encodeURIComponent('AnjumDownloader_File');
    const extension = type === 'audio' ? 'mp3' : 'mp4';
    res.header('Content-Disposition', `attachment; filename="${title}.${extension}"`);

    // Yahan bhi download ke waqt cookie pass ki gayi hai
    ytdl(url, { 
      quality: itag,
      requestOptions: {
        headers: {
          cookie: cookieString,
        },
      },
    })
      .on('error', (err) => {
        console.error(err);
        res.status(500).end();
      })
      .pipe(res);
  } catch (error) {
    res.status(500).send('Download failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
