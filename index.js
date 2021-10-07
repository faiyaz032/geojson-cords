const express = require('express');
const mongoose = require('mongoose');

mongoose
   .connect('mongodb://localhost:27017/mapdata')
   .then(() => console.log(`app is successfully connected to database`))
   .catch((error) => console.log(error));

const cordsSchema = new mongoose.Schema({
   name: { type: String, unique: true },
   location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
   },
});
cordsSchema.index({ location: '2dsphere' });

const Coordinates = mongoose.model('coordinate', cordsSchema);

const kmsToRadian = function (kms) {
   var earthRadiusInKms = 6371;
   return kms / earthRadiusInKms;
};

const fetchCords = async function (data) {
   const cords = await Coordinates.find({
      location: {
         $geoWithin: {
            $centerSphere: [[data.coordinates[1], data.coordinates[0]], kmsToRadian(0.1)],
         },
      },
   }).select({ __v: 0 });

   return cords.map((cord) => {
      return {
         _id: cord._id,
         latitude: cord.location.coordinates[0],
         longitude: cord.location.coordinates[1],
      };
   });
};

const geoJsonData = {
   type: 'Point',
   coordinates: [-77.0145665, 38.8993487],
};

fetchCords(geoJsonData).then((value) => {
   console.log(value);
});
