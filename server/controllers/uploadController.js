const sharp = require('sharp');
const twitterClient = require('../config/twitterConfig');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.processImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const sizes = [
      { width: 300, height: 250 },
      { width: 728, height: 90 },
      { width: 160, height: 600 },
      { width: 300, height: 600 }
    ];

    let uploadedMediaIds = [];

    for (let size of sizes) {
      const resizedBuffer = await sharp(req.file.buffer)
        .resize(size.width, size.height)
        .toBuffer();

      const tempFilePath = path.join(os.tmpdir(), `resized-${size.width}x${size.height}.png`);
      await sharp(resizedBuffer).toFile(tempFilePath);

      const mediaId = await twitterClient.v1.uploadMedia(tempFilePath, { type: 'png' });
      uploadedMediaIds.push({ size: `${size.width}x${size.height}`, mediaId });

      fs.unlink(tempFilePath, (err) => {
        if (err) console.error('Error removing temp file:', err);
      });
    }

    const tweetResponse = await twitterClient.v1.tweet('Automated image post', {
      media_ids: uploadedMediaIds.map(item => item.mediaId)
    });

    return res.status(200).json({
      message: 'Image processed and posted successfully',
      tweet: tweetResponse,
      media: uploadedMediaIds
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({ message: 'Error processing image', error: error.message });
  }
};
