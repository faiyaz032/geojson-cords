const express = require('express');
const mongoose = require('mongoose');

mongoose
   .connect(
      'mongodb+srv://faiyaz:tncZi0cn9skkOnbJ@cluster0.peotm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
   )
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
   try {
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
            name: cord.name,
            latitude: cord.location.coordinates[0],
            longitude: cord.location.coordinates[1],
         };
      });
   } catch (error) {
      console.log(error);
   }
};

const geoJsonData = {
   type: 'Point',
   coordinates: [-77.0388276, 38.9024583],
};

fetchCords(geoJsonData).then((value) => {
   console.log(value);
});
