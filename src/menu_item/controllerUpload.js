const { Router } = require('express');
const pool = require('../../db');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const uploadRouter = Router();

// ---------- CLOUDINARY SETTINGS --------------
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ path: __dirname + '/../../.env' });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------ MULTER SETTINGS ----------------
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: function (req, file) {
    let fileName = file.originalname + '-' + new Date().toISOString();
    return {
      folder: 'cheatday-images',
      format: 'jpeg',
      public_id: fileName,
    };
  },
});

const upload = multer({ storage: storage });

// ------------ UPLOAD ROUTE ----------------
//prettier-ignore
const uploadMenuImage = uploadRouter.post('/menu_image', upload.single('img'), function (req, res) {
  console.log(req.file);
  res.redirect(req.file.path)
  }
);

module.exports = {
  uploadMenuImage,
};
