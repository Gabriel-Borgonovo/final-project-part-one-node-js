import multer from 'multer';
import fileDirName from './fileDirName.js';
import * as path from 'path';
const {__dirname } = fileDirName(import.meta);

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const price = req.body.price;
        let destinationFolder;
        if(price !== undefined){
            destinationFolder = 'products';
        } else {
            destinationFolder = 'profiles';
        }
        cb(null, path.join(__dirname, '..', 'public', 'img', destinationFolder));
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const avatarUploader = multer({storage});  