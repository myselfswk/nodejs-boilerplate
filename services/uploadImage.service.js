import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.uploadFolder || 'general';
        const targetDir = path.join(__dirname, '../uploads', folder);

        // Create the directory if it doesn't exist
        fs.mkdirSync(targetDir, { recursive: true });

        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.png', '.svg', '.jpg', '.gif', '.jpeg', '.mp3', '.mp4'];

        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error('Only images and mp3 files are allowed'));
        }

        const fileName = Date.now() + "-" + (req.user ? req.user.id : 'guest') + "-" + file.originalname;
        cb(null, fileName);
    }
});

export const upload = multer({
    storage: Storage,
    fileFilter: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.png', '.svg', '.jpg', '.gif', '.jpeg', '.mp3', '.mp4'];

        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error('Only images and mp3 files are allowed'));
        }
        cb(null, true);
    }
});