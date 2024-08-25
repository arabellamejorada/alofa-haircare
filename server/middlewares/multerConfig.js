const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const productName = req.body.name || 'untitled';
    const sanitizedProductName = productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const extname = path.extname(file.originalname);
    cb(null, `${sanitizedProductName}-${Date.now()}${extname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    console.log('ReQ.FILE', req.file);
    console.log('File rejected: ', file);
    cb(new Error('Only images are allowed!'));
  }
});

module.exports = upload;
