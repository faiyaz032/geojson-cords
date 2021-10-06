const express = require('express');
const mongoose = require('mongoose');

mongoose
   .connect('mongodb://localhost:27017/mapdata')
   .then(() => console.log(`app is successfully connected to database`))
   .catch((error) => console.log(error));

const Coordinates = mongoose.model('coordinate', {
   latitude: Number,
   longitude: Number,
});



const fetchCords = async function (data) {
 try {
   
    const cords = await Coordinates.findOne({latitude:data.coordinates[1], longitude:data.coordinates[0]});

    return  {
        id: cords._id,
        latitude: cords.latitude,
        longitude: cords.longitude,
        radius:100
    }
 } catch (error) {
     console.log(error)
 }
};

const geoJsonData = {
    "type" : "Point",
    "coordinates" : [   
        -763.48,
        256.23
    ]
  };

fetchCords(geoJsonData).then((val)=>console.log(val))
