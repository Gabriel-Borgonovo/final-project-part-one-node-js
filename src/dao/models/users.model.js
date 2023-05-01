import mongoose from "mongoose";
import { cartsCollection } from "./carts.model.js";

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    edad: {type: Number, required: true},
    password: { type: String, required: true },
    cart: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: cartsCollection
                }
            }
        ]
    },
    role: {
        type: String,
        default: 'user'
    }
});

usersSchema.pre('findOne', function () {
    this.populate('cart.cart');
});

usersSchema.pre('find', function() {
    this.populate('cart.cart');
});

export const usersModel = mongoose.model(usersCollection, usersSchema);