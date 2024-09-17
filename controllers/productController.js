import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
  const { name, price, description, image, category, color } = req.body;
  try {
    const oldProduct = Product.findOne({ name });
    if (oldProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const newproduct = new Product({
      name,
      price,
      description,
      image,
      category,
      color,
    });
    await newproduct.save();
  } catch (error) {
    console.error({ message: "Error in createProduct", error: error.message });
    return res
      .status(400)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getProductByID = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error({ message: "Error in getProductByID", error: error.message });
    return res
      .status(400)
      .json({ message: "Internal Server Error", error: error.message });
  }s
};

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("color");
    res.json(products);
  } catch (error) {
    console.error({ message: "Error in getProduct", error: error.message });
    return res
      .status(400)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
