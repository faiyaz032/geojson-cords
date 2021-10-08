//dependencies
const mongoose = require('mongoose');

//* Database Connection
//? by changing the mongodb connection string you can connect to your own database
mongoose
   .connect(
      'mongodb+srv://faiyaz:tncZi0cn9skkOnbJ@cluster0.peotm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
   )
   .then(() => console.log(`app is successfully connected to database`))
   .catch((error) => console.log(error));

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

//* Function to convert kilometer to earth radian
const kmsToRadian = function (kms) {
   var earthRadiusInKms = 6371;
   return kms / earthRadiusInKms;
};

//* By changing this variable you can change the value of radius as your need. Make sure to pass the radius value on KILOMETERS
const radiusInKilometers = 0.1;

//* Main function to fetch the coordinates from database within a cetrain radius. In that case it is 100 meter or 0.1 kilometers
const fetchCords = async function (data) {
   try {
      const cords = await Coordinates.find({
         location: {
            $geoWithin: {
               $centerSphere: [[data.coordinates[1], data.coordinates[0]], kmsToRadian(radiusInKilometers)],
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
