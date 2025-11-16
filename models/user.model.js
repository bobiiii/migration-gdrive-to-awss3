// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const userSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 15,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['EDITOR', 'ADMIN'],
      default: 'EDITOR',
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongooose.model('users', userSchema);

module.exports = UserModel;
