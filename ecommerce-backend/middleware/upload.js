const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials (get these from cloudinary.com)
cloudinary.config({
  cloud_name: 'dddqgvcic',
  api_key: '249271618946486',
  api_secret: 'QA73BIKbQYWNkQIc22mEj8INXZg'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'maesha_store',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });
module.exports = upload;