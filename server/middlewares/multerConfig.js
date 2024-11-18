const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "refund_proof") {
      cb(null, "public/uploads/refund/"); // Directory for refund proofs
    } else if (file.fieldname === "proof_image") {
      cb(null, "public/uploads/payment/"); // Directory for payment proofs
    } else {
      cb(null, "public/uploads/"); // Default directory for other files
    }
  },
filename: function (req, file, cb) {
    const orderId = req.body.order_id || 'unknown'; // Use order_id for filenames
    const extname = path.extname(file.originalname); // Get the file extension
    const uniqueSuffix = Date.now(); // Ensure unique filenames

    // Generate filenames based on fieldname
    const filename = file.fieldname === 'refund_proof'
      ? `${orderId}-refund-${uniqueSuffix}${extname}` // For refund proofs
      : file.fieldname === 'proof_image'
      ? `proof-${Date.now()}-${uniqueSuffix}${extname}` // For proof images
      : `file-${uniqueSuffix}${extname}`; // Default fallback

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
