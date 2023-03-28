import mongoose from "mongoose";

export const productsCollection = 'products';

const productsSchema = mongoose.Schema({
     
    code: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: Array,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    }  
});



const productsModel = mongoose.model(productsCollection, productsSchema);
export default productsModel;