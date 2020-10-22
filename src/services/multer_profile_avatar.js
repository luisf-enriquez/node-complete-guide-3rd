const multer = require('multer');
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|png|jpeg|tiff)$/)) {
            // To reject this file pass an error, like so:
            
            return cb(new Error('File extension is not valid'));
        }
        
        // To accept the file pass `true`, like so:
        cb(null, true)
    }
});

module.exports = upload;