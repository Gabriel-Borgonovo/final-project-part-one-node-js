import mongoose from "mongoose";
import { productsCollection } from "./products.model.js";

export const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
     products:{
        type: [
          {
               product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: productsCollection,
                    },
               quantity: Number,
               total: {
                    type: Number,
                    default: 0,
               }
          }
        ],
        default: []          
     },
     total: {
          type: Number,
          default: 0,
     } 
});

cartsSchema.pre('find', function(){
     this.populate('products.product');
 }); //Después de ejecutar el find() a ese find hacele  .populate
 
 cartsSchema.pre('findOne', function(){
     this.populate('products.product');
 }); //El middleware es para una operación particular

const cartsModel = mongoose.model(cartsCollection, cartsSchema);
export default cartsModel;