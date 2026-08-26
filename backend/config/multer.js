import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads/resumes folder if it doesn't exist
const uploadDir = "uploads/resumes";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// Accept only PDF files
const fileFilter = (req, file, cb) => {

    console.log("========== FILE OBJECT ==========");
    console.log(file);
    console.log("================================");

    cb(null, true);
};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024 // 5 MB

    }

});

export default upload;