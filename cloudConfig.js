const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'airbnbcloone_images',
    format: async (req, file) => {'jpg','png','jpeg'}, // supports promises as well
  },
});
 
module.exports = {
    cloudinary,
    storage
};