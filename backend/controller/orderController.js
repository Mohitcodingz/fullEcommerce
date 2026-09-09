const order = require("../model/order");
const user = require("../model/user");
async function myOrders(req, res) {
  try {
    const orders = await order.find({ user: req.user._id });
    res
      .status(200)
      .json({ message: "Your Orders are fetched successfully", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "The error occured while myOrder function ", error });
  }
}
async function createOrder(req, res) {
  try {
    const { product, totalAmount, address, paymentId } = req.body;
    if (
      !product ||
      !product.productId ||
      !product.quantity ||
      !product.price ||
      !address ||
      !totalAmount ||
      !paymentId
    ) {
      return res.status(400).json({
        message: "Invalid order Data",
      });
    } else {
      const orders = new order({
        user: req.user._id,
        product,
        totalAmount,
        address,
        paymentId,
      });
      await orders.save();

      return res.status(201).json({
        message: "Order created successfully",
        order: orders,
      });
    }
  } catch (error) {
    res.status(202).json({ message: "Error occured", error: error.message });
  }
}
async function getOrder(req, res) {
  try {
    const Orders = await order.find({});
    res.status(201).json({ message: "The data fetched successfully", Orders });
  } catch (error) {
    res.status(404).json({
      message: "The getOrder function got an error",
      error: error.message,
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const findUser = await order.findOne({
      user: req.user._id,
      _id: req.params.id,
    });
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "There is no Order matching such Order Id." });
    } else {
      if (req.body.product) findUser.product = req.body.product;
      if (req.body.totalAmount) findUser.totalAmount = req.body.totalAmount;
      if (req.body.address) findUser.address = req.body.address;
      if (req.body.paymentId) findUser.paymentId = req.body.paymentId;
      if (req.body.status) findUser.status = req.body.status;
      await findUser.save();
      res
        .status(200)
        .json({ message: "Order updated successfully", order: UpdatedUser });
    }
  } catch (error) {
    res.status(404).json({
      message: "The updateOrderLists function got an error",
      error: error.message,
    });
  }
}

module.exports = { getOrder, updateOrderStatus, createOrder, myOrders };
