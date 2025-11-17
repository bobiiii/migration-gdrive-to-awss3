// migrateOgImages.js

require('dotenv').config();


const { startDB } = require('./DB'); // keep your existing DB starter
const { uploadToS3 } = require('./utils/s3');
const { downloadFromDrive, getDriveFileName } = require('./utils/drive');


const { MetadataModel } = require("./models"); 


async function migrateOgImages() {
  await startDB();

  const allMetadata = await MetadataModel.find();
  console.log(`Found ${allMetadata.length} metadata records`);

  for (const meta of allMetadata) {
    if (!meta.ogImageId) {
      console.log(`⏩ Skipping: no ogImageId for ${meta.entityType} - ${meta.entityId}`);
      continue;
    }

    try {
      const originalName = await getDriveFileName(meta.ogImageId);

      const dotIndex = originalName.lastIndexOf(".");
      let baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
      const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : "";

      baseName = baseName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      const entityFolder = meta.entityType;
      const idFolder = meta.entityId.toString();

      const finalFileName = `${baseName}-OG-${Math.floor(
        100 + Math.random() * 900
      )}${ext}`;

      const buffer = await downloadFromDrive(meta.ogImageId);

      const s3Url = await uploadToS3(
        buffer,
        `og-images/${entityFolder}/${idFolder}`,
        finalFileName
      );

      meta.s3OgImageId = s3Url;
      await meta.save();

      console.log(`✔ Uploaded OG Image | ${meta.entityType} | ${meta.entityId}`);
    } catch (err) {
      console.error(
        `⚠ Error for ${meta.entityType} (${meta.entityId}):`,
        err.message
      );
    }
  }

  console.log("🎉 OG Image Migration Completed!");
}

migrateOgImages();
