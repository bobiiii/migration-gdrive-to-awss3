// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },

    cardImage: {
      type: String,
      required: true,
    },
    blogBannerImage: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['design', 'development', 'marketing'],
    },

    shortDesc: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    contentImageIds: {
      type: [String],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const BlogModel = mongoose.model('Blogs', blogSchema);

module.exports = BlogModel;
