require('dotenv').config();
const { google } = require('googleapis');


const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

async function getDriveFileName(fileId) {
  const file = await drive.files.get({
    fileId,
    fields: 'name',
  });

  return file.data.name;
}


async function downloadFromDrive(fileId) {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' },
  );
  return Buffer.from(response.data);
}

module.exports = { downloadFromDrive, getDriveFileName };