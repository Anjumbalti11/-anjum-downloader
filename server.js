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
// 1. YAHAN APNI NAYI COOKIE PASTE KAREIN (Jo aapne abhi copy ki hai)
// ==========================================
const cookieString = "ST-3opvp5=session_logininfo=AFmmF2swRgIhAN_QKcQYsGqG9YCh8KRIXqPoj5B4LdF0L68ZJV5wVmMOAiEAxb-j8klr7-3nUuKKDZandfAMiNb4ueXnazecVKyJ5Ys%3AQUQ3MjNmeGJSdGl2NkQxZV9uUmhBUWRkSVJjcDRvU0JrN01ZVi1TWUQ0cXk2Q3dNaWZ6UVoxOVhDUmhNWHpVY0ZmaXRrV2tlS1F3aEN3aFp6dl92NHp6cmQ5cUFfR2F0ampUazg3d2EtLTdqUDNMdUZVQ2k3MmpXZ1UzRE95cVpGWG8tclJJNFZ5MVdZVW9GbUZjSGtBUlZqcjBVWjJFVG93;ST-xuwub9=session_logininfo=AFmmF2swRgIhAN_QKcQYsGqG9YCh8KRIXqPoj5B4LdF0L68ZJV5wVmMOAiEAxb-j8klr7-3nUuKKDZandfAMiNb4ueXnazecVKyJ5Ys%3AQUQ3MjNmeGJSdGl2NkQxZV9uUmhBUWRkSVJjcDRvU0JrN01ZVi1TWUQ0cXk2Q3dNaWZ6UVoxOVhDUmhNWHpVY0ZmaXRrV2tlS1F3aEN3aFp6dl92NHp6cmQ5cUFfR2F0ampUazg3d2EtLTdqUDNMdUZVQ2k3MmpXZ1UzRE95cVpGWG8tclJJNFZ5MVdZVW9GbUZjSGtBUlZqcjBVWjJFVG93;__Secure-3PSID=g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4JxczigZjY0wtYdu8EJA-h5hQACgYKAWASARISFQHGX2Mi2wC7SF97eerbsGD3JiLprRoVAUF8yKqJUJGZopQkiKzxZ_S77Ndz0076;SIDCC=AKEyXzW6jVl9bYD6rt8z7zYIxe0NirZ5ihpeKdaqejGDNPe48VQSCWCIjX_gIXgELcHNS5BjOQ;SID=g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4Jx_Gbo_5FoimhkzofUryp5WAACgYKASESARISFQHGX2Miqb79XIyAuLyxgAcn9rpSWBoVAUF8yKpdS-TCnCNrBGT6a_ICU-0X0076;__Secure-1PSIDTS=sidts-CjUBkldj_zbA_ujUdx1O1J8-i3ObdWbLAEP28tRYxYZuczJ5-UjMuHiXVV2hESp1_3skFz6jcRAA;SAPISID=FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa;__Secure-1PSIDCC=AKEyXzXLoUMJpad1HGBwBKc_wi4VRrkq01sPTN5QfcikPuZbfU-lkacV3E-RQ5kZvvFs_NUB4g;SSID=ALYg6rxSjrT_Yga34;__Secure-1PAPISID=FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa;__Secure-1PSID=g.a000DwkQzeCoDIXbK_ca_yJMzzEBGvDAKTPQzek1O-s1jjleZ4JxRWKYY2m8ejX2VkccU1D38AACgYKASwSARISFQHGX2Mi6qh48kRRh4xiQUDIRgaOQBoVAUF8yKqOBvARu1ybphtz9WWBA4Mv0076;__Secure-3PAPISID=FxQJsllqX_459Svh/AwIl9dh9-HTc6bvTa;__Secure-3PSIDCC=AKEyXzVXNLmo7lPZjhGR_tYDRWnlNjnMJ3LC_SappRXec0FoIORVhT9oyXEC_aOhUNzXAxQzFWQ;__Secure-3PSIDTS=sidts-CjUBkldj_zbA_ujUdx1O1J8-i3ObdWbLAEP28tRYxYZuczJ5-UjMuHiXVV2hESp1_3skFz6jcRAA;__Secure-BUCKET=CMQC;APISID=Xez30c4tu2R3w-xi/AlTCHVXaN_DU4bTXP;HSID=AN3YMxVCwrZRS_rrF;LOGIN_INFO=AFmmF2swRgIhAN_QKcQYsGqG9YCh8KRIXqPoj5B4LdF0L68ZJV5wVmMOAiEAxb-j8klr7-3nUuKKDZandfAMiNb4ueXnazecVKyJ5Ys:QUQ3MjNmeGJSdGl2NkQxZV9uUmhBUWRkSVJjcDRvU0JrN01ZVi1TWUQ0cXk2Q3dNaWZ6UVoxOVhDUmhNWHpVY0ZmaXRrV2tlS1F3aEN3aFp6dl92NHp6cmQ5cUFfR2F0ampUazg3d2EtLTdqUDNMdUZVQ2k3MmpXZ1UzRE95cVpGWG8tclJJNFZ5MVdZVW9GbUZjSGtBUlZqcjBVWjJFVG93;PREF=tz=Asia.Karachi"; 

// ==========================================
// 2. PROXY (Screenshot wali list se li gayi hai)
// ==========================================
// Germany wali proxy (IP: 128.140.113.110, Port: 8081)
const PROXY_URL = "http://128.140.113.110:8081"; 

// Proxy Agent banayein
const proxyAgent = ytdl.createProxyAgent({ uri: PROXY_URL });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 1. API: Video Info
app.get('/api/info', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await ytdl.getInfo(videoUrl, {
      agent: proxyAgent,
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
    console.error("YOUTUBE ERROR:", error.message);
    res.status(500).json({ error: 'Video info fetch nahi ho saki. Proxy fail ho gayi ho sakti hai.' });
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
      agent: proxyAgent,
      requestOptions: {
        headers: {
          cookie: cookieString,
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
