const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  entityType: {
    type: String,
    enum: ['collection', 'product', 'ambient', 'color', 'blog'],
    required: true,
  },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  canonical: { type: String, trim: true },
  // ogSitename: { type: String, trim: true },
  ogTitle: { type: String, trim: true },
  ogDescription: { type: String, trim: true },
  // ogURL: { type: String, trim: true },
  ogImageId: { type: String, trim: true },
  ogImageAlt: { type: String, trim: true },
});

const MetadataModel = mongoose.model('metadata', metadataSchema);

module.exports = {
  MetadataModel,
};
