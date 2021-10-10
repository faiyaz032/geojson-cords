//mongoose
const mongoose = require('mongoose');
//* Coordinates model and schema
const cordsSchema = new mongoose.Schema({
   name: { type: String, unique: true },
   location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
   },
});
cordsSchema.index({ location: '2dsphere' });
const Coordinates = mongoose.model('coordinate', cordsSchema);

module.exports = Coordinates;
