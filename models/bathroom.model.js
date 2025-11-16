const mongooose = require('mongoose');

const colorsSchema = new mongooose.Schema({
  colorName: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  colorCardImage: {
    type: String,
  },
  mainImage: {
    type: String,
  },
}, { timestamps: true });

const bathroomSchema = new mongooose.Schema(
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

const bathroomModel = mongooose.model('bathrooms', bathroomSchema);

module.exports = bathroomModel;
