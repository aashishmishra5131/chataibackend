const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  order_id: {
    type: Number,
  },
  customer_name: {
    type: String,
  },
  order_date: {
    type: String,
  },
  order_time: {
    type: String,
  },
  order_items: {
    type: String,
  },

  order_status: {
    type: String,
  },
  estimated_delivery: {
    type: String,
  },
  payment_type: {
    type: String,
  },
  coins_used: {
    type: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order; // it is just order schema for saving data into database