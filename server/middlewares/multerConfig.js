const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if this is a proof image upload
    if (file.fieldname === 'proof_image') {
      cb(null, 'public/uploads/payment/'); // Set directory for proof images
    } else {
      cb(null, 'public/uploads/'); // Default directory for other files
    }
  },
  filename: function (req, file, cb) {
    // Generate a filename based on product name and variation value or use a generic name
    const productName = (req.body.name || 'untitled').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const variationValue = (req.body.variations?.[0]?.value || 'default').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    // Unique timestamp suffix for filename
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Math.round(Math.random() * 1E3);
    
    // Check if this is a proof image and set a simpler filename
    const filename = file.fieldname === 'proof_image'
      ? `proof-${Date.now()}-${uniqueSuffix}${extname}`
      : `${productName}-${variationValue}-${uniqueSuffix}${extname}`;

    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },  // Limit files to 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
  }
});

module.exports = upload;
