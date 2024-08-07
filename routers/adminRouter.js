import express from "express";
import { adminSignin, getUserById, logout, updateAdmin } from "../controllers/adminController.js";
import multer from "multer";

const router = express.Router();
const adminStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'adminuploads/'); // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null,  `${Date.now()}-${file.originalname}`); // Use the current timestamp as a unique filename
    },
  });

  const uploadAdmin = multer({ storage: adminStorage });


router.post('/login', adminSignin);
router.post('/logout', logout);
router.put('/updateuser/:id',uploadAdmin.single('profilePic'), updateAdmin);
router.get('/getuser/:id', getUserById);

export default router;