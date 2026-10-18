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
		"name": "__Secure-1PAPISID",
		"value": "FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.119254,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": false,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-1PSID",
		"value": "g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4JxRWKYY2m8ejX2VkccU1D38AACgYKASwSARISFQHGX2Mi6qh48kRRh4xiQUDIRgaOQBoVAUF8yKqOBvARu1ybphtz9WWBA4Mv0076",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.120069,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-1PSIDCC",
		"value": "AKEyXzXyBaPmZ8-FzU_th1OUCU8X7Zq7_IjS25l9B128SG9D2E-yqvscRIAaStB6E5UNsGoe",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1823894928.898819,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-1PSIDTS",
		"value": "sidts-CjUBkldj_10aL1FjXg-8VD9U12u_kB1NBmLDugqKmYiDvGIvVC_T2o_d4NV3ieljTU5vqnYmZxAA",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1823894928.897718,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-3PAPISID",
		"value": "FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.119515,
		"sameSite": "no_restriction",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": false,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-3PSID",
		"value": "g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4JxczigZjY0wtYdu8EJA-h5hQACgYKAWASARISFQHGX2Mi2wC7SF97eerbsGD3JiLprRoVAUF8yKqJUJGZopQkiKzxZ_S77Ndz0076",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.120333,
		"sameSite": "no_restriction",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-3PSIDCC",
		"value": "AKEyXzXeh3WgXiLKnhRUwQXtXbeIuXYCcEMauhiVzsQ5nzSN4VcdHVYgJpPHpCocg_FV2zna4g",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1823894928.899127,
		"sameSite": "no_restriction",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-3PSIDTS",
		"value": "sidts-CjUBkldj_10aL1FjXg-8VD9U12u_kB1NBmLDugqKmYiDvGIvVC_T2o_d4NV3ieljTU5vqnYmZxAA",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1823894928.898217,
		"sameSite": "no_restriction",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "__Secure-BUCKET",
		"value": "CMQC",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1807688958.766446,
		"sameSite": "lax",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "APISID",
		"value": "Xez30c4tu2R3w-xi/AlTCHVXaN_DU4bTXP",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.118724,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": false,
		"secure": false,
		"session": false
	},
	{
		"name": "HSID",
		"value": "AN3YMxVCwrZRS_rrF",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.118183,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": false,
		"session": false
	},
	{
		"name": "LOGIN_INFO",
		"value": "AFmmF2swRgIhAN_QKcQYsGqG9YCh8KRIXqPoj5B4LdF0L68ZJV5wVmMOAiEAxb-j8klr7-3nUuKKDZandfAMiNb4ueXnazecVKyJ5Ys:QUQ3MjNmeGJSdGl2NkQxZV9uUmhBUWRkSVJjcDRvU0JrN01ZVi1TWUQ0cXk2Q3dNaWZ6UVoxOVhDUmhNWHpVY0ZmaXRrV2tlS1F3aEN3aFp6dl92NHp6cmQ5cUFfR2F0ampUazg3d2EtLTdqUDNMdUZVQ2k3MmpXZ1UzRE95cVpGWG8tclJJNFZ5MVdZVW9GbUZjSGtBUlZqcjBVWjJFVG93",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826696962.398489,
		"sameSite": "no_restriction",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
	},
	{
		"name": "PREF",
		"value": "tz=Asia.Karachi",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826917720.35529,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": false,
		"secure": true,
		"session": false
	},
	{
		"name": "SAPISID",
		"value": "FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.11899,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": false,
		"secure": true,
		"session": false
	},
	{
		"name": "SID",
		"value": "g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4Jx_Gbo_5FoimhkzofUryp5WAACgYKASESARISFQHGX2Miqb79XIyAuLyxgAcn9rpSWBoVAUF8yKpdS-TCnCNrBGT6a_ICU-0X0076",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.119799,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": false,
		"secure": false,
		"session": false
	},
	{
		"name": "SIDCC",
		"value": "AKEyXzX8CWopw2FBvqY8OCR9cdsU3KPLRCr_7a0Hu74-FPq1f8jheurD_f28CDjyutzHiyyu",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1823894928.89853,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": false,
		"secure": false,
		"session": false
	},
	{
		"name": "SSID",
		"value": "ALYg6rxSjrT_Yga34",
		"domain": ".youtube.com",
		"path": "/",
		"expirationDate": 1826698229.11845,
		"sameSite": "unspecified",
		"storeId": "0",
		"hostOnly": false,
		"httpOnly": true,
		"secure": true,
		"session": false
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
