import express from 'express';
import cors from 'cors';
import ytdl from '@distube/ytdl-core';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// YAHAN APNI NAYI COOKIE PASTE KAREIN
// (Bilkul yahan quotes ke andar, bina kisi extra space ke)
// ==========================================
const cookieString = "__Secure-3PSID=g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4JxczigZjY0wtYdu8EJA-h5hQACgYKAWASARISFQHGX2Mi2wC7SF97eerbsGD3JiLprRoVAUF8yKqJUJGZopQkiKzxZ_S77Ndz0076;SIDCC=AKEyXzVIPJFTJLPqdDxXGiko3s9xAD7HYC4wPZOc235k3bukYM1vGecuh7fG12NdB_A0sBI4;SID=g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4Jx_Gbo_5FoimhkzofUryp5WAACgYKASESARISFQHGX2Miqb79XIyAuLyxgAcn9rpSWBoVAUF8yKpdS-TCnCNrBGT6a_ICU-0X0076;__Secure-1PSIDTS=sidts-CjUBkldj_1aISaPn0S3dwOG5dEh9PkgGeIinV_6Qqp-GL2ojVgl3obvpHwR1k2CHWtqMFIx1nRAA;SAPISID=FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa;__Secure-1PSIDCC=AKEyXzU6Xsg_OEMFVoYbieqSjYKGT-ljEx3nAD60IxEAPFABGFLQR5EyX-elhshNEq2jvyYy;SSID=ALYg6rxSjrT_Yga34;__Secure-1PAPISID=FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa;__Secure-1PSID=g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4JxRWKYY2m8ejX2VkccU1D38AACgYKASwSARISFQHGX2Mi6qh48kRRh4xiQUDIRgaOQBoVAUF8yKqOBvARu1ybphtz9WWBA4Mv0076;__Secure-3PAPISID=FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa;__Secure-3PSIDCC=AKEyXzVlGHHrzeX5f_NKGaf0a-CROF3K02VDs-FEvk4C8N7_GQJgFuGdK5zhk4ppi4UVJDglJQ;__Secure-3PSIDTS=sidts-CjUBkldj_1aISaPn0S3dwOG5dEh9PkgGeIinV_6Qqp-GL2ojVgl3obvpHwR1k2CHWtqMFIx1nRAA;__Secure-BUCKET=CMQC;APISID=Xez30c4tu2R3w-xi/AlTCHVXaN_DU4bTXP;HSID=AN3YMxVCwrZRS_rrF;LOGIN_INFO=AFmmF2swRgIhAN_QKcQYsGqG9YCh8KRIXqPoj5B4LdF0L68ZJV5wVmMOAiEAxb-j8klr7-3nUuKKDZandfAMiNb4ueXnazecVKyJ5Ys:QUQ3MjNmeGJSdGl2NkQxZV9uUmhBUWRkSVJjcDRvU0JrN01ZVi1TWUQ0cXk2Q3dNaWZ6UVoxOVhDUmhNWHpVY0ZmaXRrV2tlS1F3aEN3aFp6dl92NHp6cmQ5cUFfR2F0ampUazg3d2EtLTdqUDNMdUZVQ2k3MmpXZ1UzRE95cVpGWG8tclJJNFZ5MVdZVW9GbUZjSGtBUlZqcjBVWjJFVG93;PREF=tz=Asia.Karachi";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 1. API: Video Info
app.get('/api/info', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await ytdl.getInfo(videoUrl, {
      requestOptions: {
        headers: {
          cookie: cookieString,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

    // Duplicate qualities hataein
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
    // Agar error aaye toh console mein print karein taake pata chale asal masla kya hai
    console.error("YOUTUBE ERROR:", error.message);
    res.status(500).json({ error: 'Video info fetch nahi ho saki. Server par IP block ho sakta hai.' });
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

    ytdl(url, { 
      quality: itag,
      requestOptions: {
        headers: {
          cookie: cookieString,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
      },
    })
      .on('error', (err) => {
        console.error("DOWNLOAD ERROR:", err.message);
        res.status(500).end();
      })
      .pipe(res);
  } catch (error) {
    res.status(500).send('Download failed');
  }
});

// Catch-all route (Agar koi galat URL khole toh index.html par bhej de)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
