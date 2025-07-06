const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get video info
app.get('/info', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const info = await ytdl.getInfo(url);
        const formats = info.formats
            .filter(format => format.hasVideo && format.hasAudio)
            .map(format => ({
                itag: format.itag,
                quality: format.qualityLabel || format.quality,
                container: format.container,
                url: format.url
            }));

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            formats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch video info' });
    }
});

// API endpoint to download video
app.get('/download', async (req, res) => {
    try {
        const url = req.query.url;
        const itag = req.query.itag;
        
        if (!url || !itag) {
            return res.status(400).json({ error: 'URL and itag are required' });
        }

        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: itag });
        
        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${format.container}"`);
        ytdl(url, { quality: itag }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Download failed' });
    }
});

app.listen(PORT, () => {
    console.log(`EasyDownloader Lite running on http://localhost:${PORT}`);
});