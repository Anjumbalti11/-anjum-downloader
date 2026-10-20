import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
// Note: Agar aap Vimeo downloader use karna chahte hain to package install karein
// npm install vimeo-downloader

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 1. API: Video Info (Generic)
app.get('/api/info', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    // Agar direct .mp4 link hai
    if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')) {
      return res.json({
        title: "Direct Video Download",
        thumbnail: "https://via.placeholder.com/640x360?text=Video",
        uploader: "Direct Link",
        duration: "Unknown",
        videoFormats: [{ itag: "direct", quality: "Original Quality", size: null }],
        audioFormats: []
      });
    }

    // Agar Vimeo ka link hai (Yahan aap vimeo-downloader logic laga sakte hain)
    if (videoUrl.includes('vimeo.com')) {
       // Vimeo logic yahan aayega (Please note: Vimeo ki apni API limits hoti hain)
       return res.status(500).json({ error: 'Vimeo support abhi under development hai.' });
    }

    // Agar koi aur link hai jo ytdl support karta hai (jaise Facebook)
    // Hum yahan generic error de rahe hain
    res.status(400).json({ error: 'Yeh link supported nahi hai. Please direct .mp4 link ya Vimeo link dalein.' });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ error: 'Video info fetch nahi ho saki.' });
  }
});

// 2. API: Download
app.get('/api/download', async (req, res) => {
  const { url, type } = req.query;
  if (!url) return res.status(400).send('Missing parameters');

  try {
    // Agar direct link hai toh axios se stream karein
    if (url.endsWith('.mp4') || url.endsWith('.webm')) {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });

      res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
      response.data.pipe(res);
      return;
    }

    res.status(400).send('Download not supported for this URL');
  } catch (error) {
    res.status(500).send('Download failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
