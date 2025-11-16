// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const varietySchema = new mongooose.Schema({
  varietyName: {
    type: String,
  },
  varietyHeading: {
    type: String,
  },

  slug: {
    type: String,
    required: true,
  },
  varietyCardImage: {
    type: String,
  },
  s3FullSlabImage: {
    type: String,
  },
  fullSlabImage: {
    type: String,
  },
  closeLookUp: {
    type: String,
  },
  s3CloseLookUp: {
    type: String,
  },
  s3InstalLook: {
    type: String,
  },
  instalLook: {
    type: String,
  },
  description: {
    type: String,
  },
  grip: {
    type: String,
  },
  mate: {
    type: String,
  },
  thickness: {
    type: String,
  },
}, { timestamps: true });

const collectionSchema = new mongooose.Schema(
  {
    collectionHeading: {
      type: String,
      required: true,
      trim: true,
    },
    collectionDescription: {
      type: String,
      required: true,
      trim: true,

    },
    collectionName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    collectionImage: {
      type: String,
      required: true,
      trim: true,
    },
    s3CollectionImage: {
      type: String,
      required: true,
      trim: true,
    },
    s3DropDownImage: {
      type: String,
      required: true,
      trim: true,
    },
    dropDownImage: {
      type: String,
      required: true,
    },
    variety: [varietySchema],
  },
  {
    timestamps: true,
  },
);

const collectionModel = mongooose.model('collections', collectionSchema);

module.exports = collectionModel;
