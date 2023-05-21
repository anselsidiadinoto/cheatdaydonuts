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

const uploadMenuImage = uploadRouter.post(
  '/menu_image/:menu_id/',
  upload.single('img'),
  async function (req, res) {
    try {
      let current_image_public_id = req.body.image_id;

      const menu_id = req.params.menu_id;
      const image_public_id = req.file.filename;
      const image_url = req.file.path;

      if (current_image_public_id == null) {
        return;
      } else {
        cloudinary.uploader.destroy(
          current_image_public_id,
          function (error, result) {}
        );
      }

      await pool.query(
        'UPDATE menu_item SET menu_img_public_id=$1, menu_img_url=$2 WHERE id=$3',
        [image_public_id, image_url, menu_id]
      );

      res.redirect('/admin/general');
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = {
  uploadMenuImage,
};
