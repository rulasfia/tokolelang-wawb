import cdnr from "cloudinary";

// const cloudinary = require("cloudinary").v2;
const cloudinary = cdnr.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
