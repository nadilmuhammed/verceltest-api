import express from "express"
import { deleteUser, getAllUsers, getUsersByID, googleAuthenticationLogin, googleAuthenticationSignUp, logout, signin, signup, updateUser } from "../controllers/userController.js";
import multer from "multer";
import path from "path"

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null,  `${Date.now()}-${file.originalname}`); // Use the current timestamp as a unique filename
    },
  });

  const upload = multer({ storage });

router.post("/googleauth", googleAuthenticationSignUp)
router.post("/googlelogin", googleAuthenticationLogin)
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

router.put("/update/:id",upload.single('profilePic'), updateUser);
router.delete("/deleteuser/:id", deleteUser)
router.get("/getusers", getAllUsers);
router.get("/getusersbyid/:id", getUsersByID);

export default router;