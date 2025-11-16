const mongooose = require('mongoose');

const newsletterSchema = new mongooose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
);

const newsletterModel = mongooose.model('newsletter', newsletterSchema);

module.exports = newsletterModel;
