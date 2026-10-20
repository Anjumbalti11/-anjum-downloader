const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // yt-dlp command to extract JSON metadata without downloading the file
    const command = `yt-dlp -j --no-playlist "${videoUrl}"`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ 
                error: 'Failed to extract video info. YouTube might have restricted the request.' 
            });
        }

        try {
            const info = JSON.parse(stdout);
            
            // Format options extract karna
            const formats = info.formats.map(f => ({
                format_id: f.format_id,
                ext: f.ext,
                resolution: f.resolution || 'audio only',
                url: f.url,
                hasVideo: f.vcodec !== 'none',
                hasAudio: f.acodec !== 'none'
            }));

            res.json({
                title: info.title,
                thumbnail: info.thumbnail,
                duration: info.duration,
                formats: formats
            });
        } catch (parseError) {
            res.status(500).json({ error: 'Failed to parse media information' });
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
