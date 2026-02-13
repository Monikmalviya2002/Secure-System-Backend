import multer from "multer";
import path from "path";


      const storage = multer.diskStorage({
          destination: (req, file, cb) => {
          cb(null, "uploads/");
             },
        filename: (req, file, cb) => {
           const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
              },
             });


          const fileFilter = (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|pdf/;
          const ext = path.extname(file.originalname).toLowerCase();

           if (allowedTypes.test(ext)) {
               cb(null, true);
            } else {
        cb(new Error("Only images and PDFs are allowed"));
            }
                };

             const upload = multer({
              storage,
             limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
                fileFilter,
               });

          export default upload;
