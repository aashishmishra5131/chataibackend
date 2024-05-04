require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db.js");
const {OrderFun,addOrderData}=require("./controller/order.js")
const router = express.Router();
const app = express();
const port = process.env.PORT || 5454;
app.use(cors());
connectDB() //database connection 
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('hello world');
});
app.use('/fetch-data', OrderFun); //fetch and openai and langchain api 
app.use('/addorder', addOrderData); //internal api for adding order according to our requirement
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});