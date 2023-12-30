import express, { Router, Request, Response, response } from "express";
import { ProductErrors } from "../common/error";
import { ProductModel } from "../models/product";
import { UserModel } from "../models/user";
import { verifyToken } from "./user";
import { getSocket} from "../routes/socket";


const router = Router();
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.get("/", async (Request, response) => {
  try{
    const products = await ProductModel.find({});
    response.json({ products });
  } catch(err){
    response.status(400).json({err})
  }

});

router.post("/checkout", verifyToken, async (request, response) => {
  const { customerID, cartItems } = request.body;
  try {
    const user = await UserModel.findById(customerID);

    const productIDs = Object.keys(cartItems);
    const products = await ProductModel.find({ _id: { $in: productIDs } });

    if (!user) {
      return response.status(400).json({ type: ProductErrors.NO_USERS_FOUND });
    }
    if (products.length !== productIDs.length) {
      return response.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }

    let totalPrice = 0;
    for (const item in cartItems) {
      const product = products.find((product) => String(product._id) === item);
      if (!product) {
        return response.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }

      if (product.stockQuantity < cartItems[item]) {
        return response.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }

      totalPrice += product.price * cartItems[item];
    }

    if (user.availableMoney < totalPrice) {
      return response.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
    }

    user.availableMoney -= totalPrice;
    user.purchasedItems.push(...productIDs);

    await user.save();
    await ProductModel.updateMany(
      { _id: { $in: productIDs } },
      { $inc: { stockQuantity: -1 } }
    );

    const updatedProducts = await ProductModel.find({ _id: { $in: productIDs } });
    
    const socket = getSocket();
    socket.emit("inventoryUpdated", updatedProducts);
    console.log("After emitting updateInventory");

    response.json({ purchasedItems: user.purchasedItems });
  } catch (error) {
    console.log(error);
  }

  
});

router.get(
  "/purchased-items/:customerID",
  verifyToken,
  async (request, response) => {
    const { customerID } = request.params;
    try {
      const user = await UserModel.findById(customerID);

      if (!user) {
        return response.status(400).json({ type: ProductErrors.NO_USERS_FOUND });
      }

      const products = await ProductModel.find({
        _id: { $in: user.purchasedItems },
      });

      response.json({ purchasedItems: products });
    } catch (error) {
      response.status(400).json({ type: ProductErrors.NO_USERS_FOUND });
    }
  }
);

export { router as productRouter };