const { ChatOpenAI } = require("@langchain/openai");
const Order = require("../modal/order");
const OrderFun = async (req, res) => { //this is order fetch and openai integration function
  try {
    const { message } = req.body;
    const chatModel = new ChatOpenAI({ // creating new instance for openAI 
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    let response;
    const orderIdRegex = /\b\d{8}\b/; //regex for maching order id
    const orderIdMatch = message.match(orderIdRegex); // if we get order id from payload and matching it into our formate
    if (!orderIdMatch) { //if it is not matched then we will use only openAi for sending response
      response = await chatModel.invoke(message);
      res.send(response.content); //here we are sending message response to the client side 
    } else if (orderIdMatch[0].length > 0) { // if we are getting order id 
      const orderId = orderIdMatch[0];
      const fetchedData = await Order.findOne({ order_id: orderId }); //here we are checking that order id is correct or not
      if (fetchedData) { //if order is matched from our database 


        if(fetchedData.order_status==="delivered"){
          let changeInto = fetchedData.estimated_delivery; 
          let temp = await chatModel.invoke(
            `change ${changeInto} into like with month and date name ,Hint :first one is date 2nd one is month and 3rd one is year`
          ); //here i am just creating date formate according to our requirement 
          response = `Thankyou for your patience. I just checked that your Order <strong> ${fetchedData.order_id} </strong>is  <strong>${fetchedData.order_status}</strong>, I apologise for the delay
          `;
          res.send(response); //sending response according to need
        }else{

          let changeInto = fetchedData.estimated_delivery; 
          let temp = await chatModel.invoke(
            `change ${changeInto} into like with month and date name ,Hint :first one is date 2nd one is month and 3rd one is year`
          ); //here i am just creating date formate according to our requirement 
          response = `Thankyou for your patience. I just checked that your Order <strong> ${fetchedData.order_id} </strong>is  <strong>${fetchedData.order_status}</strong>and will be delivered by<strong> ${temp.content}</strong>. I apologise for the delay
          `;
          res.send(response); //sending response according to need
        }
      } else {
        response = `Sorry! but please check your order id, I have not find any order with this order Id`;
        res.send(response); //if we did not get the order id then this response will send
      }
    } 
  } catch (error) {}
};

const addOrderData = async (req, res) => { //this api is for uploading or adding order into mongodb database
  try {
    const {
      order_id,
      customer_name,
      order_date,
      order_time,
      order_items,
      order_status,
      estimated_delivery,
      payment_type,
      coins_used,
    } = req.body;
    const newOrder = new Order({ //here i am saving that order into database
      order_id,
      customer_name,
      order_date,
      order_time,
      order_items,
      order_status,
      estimated_delivery,
      payment_type,
      coins_used,
    });
    await newOrder.save();
    res.status(200).json({ message: "order created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { OrderFun, addOrderData };