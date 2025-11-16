// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const contactSchema = new mongooose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    zipcode: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: Number,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    office: {
      type: String,
      required: true,
      trim: true,
    },
    upload: {
      type: String,
      required: true,
      trim: true,
    },
    checked: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const contactModel = mongooose.model('contacts', contactSchema);

module.exports = contactModel;
