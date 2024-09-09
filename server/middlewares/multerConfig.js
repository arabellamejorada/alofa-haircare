const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // Here, we'll sanitize the product name for the file and attach a timestamp
    const sanitizedProductName = (req.body.name || 'untitled').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    // Ensure each variation has its own unique timestamp
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);  // Ensure unique filenames
    cb(null, `${sanitizedProductName}-${uniqueSuffix}${extname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },  // Limit files to 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;  // Accept only certain file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    console.log('File rejected: ', file);
    cb(new Error('Only images are allowed!'));  // Return an error if file is not an image
  }
});

module.exports = upload;
