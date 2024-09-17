import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    color: {
        type:String,
        required: true
    }
});

const Product = mongoose.model("products", ProductSchema);
export default Product;