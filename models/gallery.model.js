const mongooose = require('mongoose');

const gallerySchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Kitchen', 'Bathroom'],
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    modalImages: [{
      imageId: { type: String },
      applications: { type: String },
      location: { type: String },
      description: { type: String },

    }],
  },
);
const GalleryModel = mongooose.model('gallery', gallerySchema);

module.exports = GalleryModel;
