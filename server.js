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

// === YAHAN TABDEELI HUI HAI ===
// Ab Express 'public' folder ke andar ki files (html, css, images) serve karega
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // index.html ab public folder ke andar hai
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ==============================

// 1. API: Video Info
app.get('/api/info', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await ytdl.getInfo(videoUrl);
    
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

    ytdl(url, { quality: itag })
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