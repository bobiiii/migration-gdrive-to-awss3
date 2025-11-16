const { collectionModel } = require('./models'); // update path if needed
const { startDB } = require('./DB');

const { uploadToS3 } = require('./utils/s3');
const { downloadFromDrive, getDriveFileName } = require('./utils/drive');
const slugify = require('./utils/slugify');

async function migrate() {
  await startDB();
  const collections = await collectionModel.find();

  for (const col of collections) {
    const collectionFolder = slugify(col.collectionName);

    for (const variety of col.variety) {
      if (!variety.fullSlabImage) continue;

      try {
        const originalName = await getDriveFileName(variety.fullSlabImage);

        const dotIndex = originalName.lastIndexOf(".");
        let baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
        const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : "";
        baseName = baseName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

        const varietyFolder = variety.varietyName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
        const finalFileName = `${baseName}-FS-${Math.floor(100 + Math.random() * 900)}${ext}`;

        const buffer = await downloadFromDrive(variety.fullSlabImage);
        const s3Url = await uploadToS3(buffer, `${collectionFolder}/${varietyFolder}`, finalFileName);

        variety.s3FullSlabImage = s3Url;
        await col.save();
        console.log(`✔ Saved ${variety.varietyName}`);
      } catch (err) {
        console.error(`⚠ Error for ${variety.varietyName}:`, err.message);
      }
    }
  }
}

// Run the migration if the file is executed directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log("🎉 Full Slab Image Migration Completed!");
      process.exit(0);
    })
    .catch(err => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}

// Export in case you want to import it elsewhere
module.exports = migrate;
