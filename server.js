const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Public folder se frontend index.html serve karne ke liye (Agar same server par ho)
app.use(express.static(path.join(__dirname, 'public')));

// 1. Video Meta Data Endpoint (/api/info)
app.get('/api/info', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL field is required' });
    }

    // Extract metadata without downloading video
    const command = `yt-dlp -j --no-playlist "${videoUrl}"`;

    exec(command, { maxBuffer: 1024 * 1024 * 20 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error fetching info: ${error.message}`);
            return res.status(500).json({ error: 'Failed to fetch video info. IP might be restricted or URL is invalid.' });
        }

        try {
            const info = JSON.parse(stdout);

            // Filter Video Formats (Audio + Video combined where possible)
            const videoFormats = info.formats
                .filter(f => f.vcodec !== 'none' && f.ext === 'mp4')
                .map(f => ({
                    itag: f.format_id,
                    quality: f.format_note || f.resolution || `${f.height}p`,
                    size: f.filesize || f.filesize_approx || 0,
                    ext: f.ext
                }));

            // Filter Audio Formats
            const audioFormats = info.formats
                .filter(f => f.vcodec === 'none' && (f.ext === 'm4a' || f.ext === 'webm' || f.ext === 'mp3'))
                .map(f => ({
                    itag: f.format_id,
                    quality: `${Math.round(f.abr || 128)} kbps (${f.ext})`,
                    size: f.filesize || f.filesize_approx || 0,
                    ext: f.ext
                }));

            res.json({
                title: info.title,
                thumbnail: info.thumbnail,
                uploader: info.uploader || info.channel || 'YouTube Creator',
                duration: info.duration || 0,
                videoFormats: videoFormats,
                audioFormats: audioFormats
            });

        } catch (parseErr) {
            res.status(500).json({ error: 'Failed to process YouTube response' });
        }
    });
});

// 2. Direct Media Stream/Download Endpoint (/api/download)
app.get('/api/download', (req, res) => {
    const { url, itag, type } = req.query;

    if (!url || !itag) {
        return res.status(400).json({ error: 'URL and ITAG parameters are required' });
    }

    // Direct download stream URL filter via yt-dlp
    const command = `yt-dlp -g -f "${itag}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error || !stdout.trim()) {
            return res.status(500).json({ error: 'Failed to generate direct download link' });
        }

        const streamUrl = stdout.trim().split('\n')[0];
        
        // Browser ko direct download file stream redirect karna
        res.redirect(streamUrl);
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Anjum Downloader v19 Server Running on Port ${PORT}`);
});
