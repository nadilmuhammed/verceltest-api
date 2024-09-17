import express from "express";
import { adminSignin, getUserById, logout, updateAdmin } from "../controllers/adminController.js";
import { createProduct, getProduct, getProductByID } from "../controllers/productController.js";

const router = express.Router();


router.post('/login', adminSignin);
router.post('/logout', logout);
router.put('/updateuser/:id', updateAdmin);
router.get('/getuser/:id', getUserById);

router.post("/createproduct", createProduct);
router.get("/getproduct/:id", getProductByID);
router.get("/getproduct", getProduct);

export default router;