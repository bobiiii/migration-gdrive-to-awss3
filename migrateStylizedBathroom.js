/**
 * migrateAmbients_ModernKitchen.js
 *
 * Run with:
 *   node migrateAmbients_ModernKitchen.js
 *
 * Requirements:
 * - startDB() should initialize mongoose connection.
 * - uploadToS3(buffer, folder, filename) -> returns public URL (same as your other scripts)
 * - downloadFromDrive(fileId) -> returns Buffer
 * - getDriveFileName(fileId) -> returns original filename string
 * - slugify(text) -> returns slug string
 *
 * This script processes ONLY documents with name === 'Stylized Bathroom' (case-insensitive).
 */

require('dotenv').config();


const { startDB } = require('./DB'); // keep your existing DB starter
const { uploadToS3 } = require('./utils/s3');
const { downloadFromDrive, getDriveFileName } = require('./utils/drive');
const slugify = require('./utils/slugify');
const { AmbientModel } = require('./models');

// small helper to sanitize a filename base
function sanitizeBaseName(name) {
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// generate final filename with random suffix before extension
function makeFinalFilename(originalName, suffixLabel = '') {
  const dotIndex = originalName.lastIndexOf('.');
  const base = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : '';
  const sanitized = sanitizeBaseName(base);
  const randomNum = Math.floor(100 + Math.random() * 900); // 100-999
  const labelPart = suffixLabel ? `-${suffixLabel}` : '';
  return `${sanitized}${labelPart}-${randomNum}${ext}`;
}

// main migration
async function migrateStylizedBathroom() {
  console.log('🔁 Starting Ambients (Stylized Bathroom) migration...');
  await startDB();

  // Find documents where name is Stylized Bathroom (case-insensitive)
  const docs = await AmbientModel.find({ name: { $regex: '^\\s*Stylized Bathroom\\s*$', $options: 'i' } });

  if (!docs || docs.length === 0) {
    console.log('ℹ No "Stylized Bathroom" documents found. Exiting.');
    process.exit(0);
  }

  // We'll process every document that matches (usually 1)
  for (const doc of docs) {
    console.log('\n===========================================');
    console.log(`📦 Processing document: ${doc.name} (id: ${doc._id})`);
    console.log('===========================================');

    const ambientSlug = slugify(doc.name); // e.g. "modern-kitchen"
    const baseFolder = `ambients/${ambientSlug}`;

    // ---- collection-level cardImage ----
    if (doc.cardImage) {
      try {
        // Skip if already migrated
        if (doc.s3CardImage) {
          console.log(`ℹ collection cardImage already migrated: ${doc.s3CardImage}`);
        } else {
          console.log('↳ Processing collection cardImage (cardImage)...');
          const originalName = await getDriveFileName(doc.cardImage);
          console.log(`    • Original Drive filename: ${originalName}`);

          const finalFileName = makeFinalFilename(originalName, 'card');
          console.log(`    • Uploading as: ${baseFolder}/${finalFileName}`);

          const buffer = await downloadFromDrive(doc.cardImage);
          console.log(`    • Downloaded ${buffer.length} bytes`);

          const s3Url = await uploadToS3(buffer, baseFolder, finalFileName);
          console.log(`    • Uploaded to S3: ${s3Url}`);

          // Save back
          doc.s3CardImage = s3Url;
          await doc.save();
          console.log('    ✓ Saved collection s3CardImage to DB');
        }
      } catch (err) {
        console.error('    ❌ Error processing collection cardImage:', err && err.message ? err.message : err);
      }
    } else {
      console.log('↳ No collection cardImage found, skipping.');
    }

    // ---- per-color images ----
    if (!Array.isArray(doc.colors) || doc.colors.length === 0) {
      console.log('ℹ No colors array found, skipping color uploads.');
      continue;
    }

    // process colors one by one, set fields on nested color objects then save once per color processed
    let colorIndex = 0;
    for (const color of doc.colors) {
      colorIndex++;
      console.log(`\n--- Color ${colorIndex}: ${color.colorName || '(no name)'} ---`);

      const colorSlug = sanitizeBaseName(color.colorName || `color-${colorIndex}`);
      const colorFolder = `${baseFolder}/${colorSlug}`; // ambients/modern-kitchen/es-carrara-sharif

      // colorCardImage -> s3ColorCardImage
      if (color.colorCardImage) {
        try {
          if (color.s3ColorCardImage) {
            console.log(`  ℹ colorCardImage already migrated: ${color.s3ColorCardImage}`);
          } else {
            console.log('  ↳ Processing colorCardImage...');
            const originalName = await getDriveFileName(color.colorCardImage);
            console.log(`    • Original: ${originalName}`);

            const finalFileName = makeFinalFilename(originalName, 'cc'); // cc = color card
            console.log(`    • Uploading as: ${colorFolder}/${finalFileName}`);

            const buffer = await downloadFromDrive(color.colorCardImage);
            console.log(`    • Downloaded ${buffer.length} bytes`);

            const s3Url = await uploadToS3(buffer, colorFolder, finalFileName);
            console.log(`    • Uploaded to S3: ${s3Url}`);

            // save nested field and persist doc
            color.s3ColorCardImage = s3Url;
            await doc.save();
            console.log('    ✓ Saved color.s3ColorCardImage to DB');
          }
        } catch (err) {
          console.error('    ❌ Error processing colorCardImage:', err && err.message ? err.message : err);
        }
      } else {
        console.log('  ↳ No colorCardImage for this color, skipping.');
      }

      // mainImage -> s3MainImage
      if (color.mainImage) {
        try {
          if (color.s3MainImage) {
            console.log(`  ℹ mainImage already migrated: ${color.s3MainImage}`);
          } else {
            console.log('  ↳ Processing mainImage...');
            const originalName = await getDriveFileName(color.mainImage);
            console.log(`    • Original: ${originalName}`);

            const finalFileName = makeFinalFilename(originalName, 'main'); // main
            console.log(`    • Uploading as: ${colorFolder}/${finalFileName}`);

            const buffer = await downloadFromDrive(color.mainImage);
            console.log(`    • Downloaded ${buffer.length} bytes`);

            const s3Url = await uploadToS3(buffer, colorFolder, finalFileName);
            console.log(`    • Uploaded to S3: ${s3Url}`);

            // save nested field and persist doc
            color.s3MainImage = s3Url;
            await doc.save();
            console.log('    ✓ Saved color.s3MainImage to DB');
          }
        } catch (err) {
          console.error('    ❌ Error processing mainImage:', err && err.message ? err.message : err);
        }
      } else {
        console.log('  ↳ No mainImage for this color, skipping.');
      }
    } // end colors loop

    console.log(`\n✅ Finished processing document id=${doc._id} (${doc.name})`);
  } // end docs loop

  console.log('\n🎉 Migration for Stylized Bathroom complete.');
  process.exit(0);
}

// run when executed directly
if (require.main === module) {
  migrateStylizedBathroom().catch(err => {
    console.error('Fatal migration error:', err);
    process.exit(1);
  });
}

// export for possible import
module.exports = migrateStylizedBathroom;
