import mongoose from "mongoose";

export const ticketCollection = 'tickets';

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
      },
      purchase_datetime: {
        type: Date,
        default: Date.now,
      },
      amount: {
        type: Number,
        required: true,
      },
      purchaser: {
        type: String,
        required: true,
      } 
});


const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;