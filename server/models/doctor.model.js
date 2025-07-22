import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
  },
});

doctorSchema.index({ location: '2dsphere' }); // Enable geospatial queries

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
