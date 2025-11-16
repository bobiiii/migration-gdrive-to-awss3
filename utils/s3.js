require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();


function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream'; // fallback
  }
}


async function uploadToS3(buffer, folder, filename) {
  const mimeType = getMimeType(filename);

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${folder}/${filename}`, // folder + file name
    Body: buffer,
    ContentType: mimeType,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.Location); // S3 public URL
    });
  });
}

module.exports = { uploadToS3 };