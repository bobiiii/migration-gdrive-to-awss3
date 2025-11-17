const { startDB } = require('./DB');
const {contactModel} = require('./models');

const { uploadToS3 } = require('./utils/s3');
const { downloadFromDrive, getDriveFileName } = require('./utils/drive');
const slugify = require('./utils/slugify');

async function migrateContactUploads() {
  await startDB();

  const contacts = await contactModel.find();

  for (const item of contacts) {
    if (!item.upload || item.upload.trim() === 'Not Provided') {
      console.log(`⚠ Skipped (no upload field): ${item._id}`);
      continue;
    }



    try {
      const originalName = await getDriveFileName(item.upload);

      // Build safe filename
      const dotIndex = originalName.lastIndexOf(".");
      let baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
      const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : "";

      baseName = slugify(baseName);

      const finalFileName = `${baseName}-UP-${Math.floor(100 + Math.random() * 900)}${ext}`;

      // Download from drive
      const buffer = await downloadFromDrive(item.upload);

      // Upload to S3 inside folder contacts/uploads/
      const s3Url = await uploadToS3(
        buffer,
        `contacts/uploads`,
        finalFileName
      );

      // Save to DB
      item.s3Upload = s3Url;
      await item.save({ validateBeforeSave: false });

      console.log(`✔ Saved for contact: ${item._id}`);
    } catch (err) {
      console.error(`⚠ Error for contact ${item._id}:`, err.message);
    }
  }

  console.log("🎉 DONE: Contact uploads migration complete.");
}

module.exports = migrateContactUploads;

// Allow running script via: node migrateContactUploads.js
if (require.main === module) {
  migrateContactUploads();
}
