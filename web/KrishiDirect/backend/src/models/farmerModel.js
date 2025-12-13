import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  crops: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Farmer model
export default mongoose.model('Farmer', farmerSchema);