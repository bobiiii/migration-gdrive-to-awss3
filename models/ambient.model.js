// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const colorsSchema = new mongooose.Schema({
  colorName: {
    type: String,
  },
  collectionName: {
    type: String,
  },
  slug: {
    type: String,
  },
  colorCardImage: {
    type: String,
  },
  mainImage: {
    type: String,
  },
}, { timestamps: true });

const kitchenSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['KITCHEN', 'BATHROOM'],
      required: true,
    },
    cardImage: {
      type: String,
      required: true,
      trim: true,
    },
    colors: [colorsSchema],

  },
  {
    timestamps: true,
  },
);

const AmbientModel = mongooose.model('kitchens', kitchenSchema);

module.exports = AmbientModel;
