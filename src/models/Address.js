import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Speeds up queries when fetching a user's addresses
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true,
    },
    building: {
      type: String,
      required: [true, 'Building is required'],
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String, // Changed from Number to String
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false, // Changed from true to false
    },
  },
  {
    timestamps: true,
  }
);


addressSchema.index({ user: 1, isDefault: 1 });

const Address = mongoose.model('Address', addressSchema);
export default Address;