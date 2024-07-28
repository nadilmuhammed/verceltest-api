import express from "express"
import { deleteUser, getAllUsers, getUsersByID, googleAuthenticationLogin, googleAuthenticationSignUp, logout, signin, signup, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/googleauth", googleAuthenticationSignUp)
router.post("/googlelogin", googleAuthenticationLogin)
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

router.put("/update/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser)
router.get("/getusers", getAllUsers);
router.get("/getusersbyid/:id", getUsersByID);

export default router;