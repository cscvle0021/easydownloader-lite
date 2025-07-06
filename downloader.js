const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Additional download functions can be added here
// For example: audio extraction, format conversion, etc.

async function downloadAudio(url, outputPath) {
    return new Promise((resolve, reject) => {
        const stream = ytdl(url, { quality: 'highestaudio' });
        
        ffmpeg(stream)
            .audioBitrate(128)
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err));
    });
}

module.exports = {
    downloadAudio
};