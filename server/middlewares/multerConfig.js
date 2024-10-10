const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Ensure the destination folder exists or create it
  },
  filename: function (req, file, cb) {
    // We'll use the product name and variation value for the filename
    const productName = (req.body.name || 'untitled').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    // Extract the variation value from the request body
    const variationValue = (req.body.variations?.[0]?.value || 'default').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    // Ensure each image has a unique timestamp
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Math.round(Math.random() * 1E3);
    cb(null, `${productName}-${variationValue}-${uniqueSuffix}${extname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },  // Limit files to 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
  }
});

module.exports = upload;