import React from "react";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { IProduct } from "../../models/interfaces";
// import socketIOClient from "socket.io-client";
import { socket } from "../../socket";

interface Props {
  product: IProduct;
}

export const Product = (props: Props) => {
  const { _id, productName, description, price, stockQuantity, imageURL } =
    props.product;
  const { addToCart, getCartItemCount } = useContext(ShopContext);
  const [updatedStock, setUpdatedStock] = useState(stockQuantity);


useEffect(() => {
  const handleInventoryUpdated = (updatedProducts) => {
    const updatedProduct = updatedProducts.find((product) => product._id === _id);
    if (updatedProduct) {
      setUpdatedStock(updatedProduct.stockQuantity);
    }
    alert(`Received inventoryUpdated event for ${productName}. Stock left: ${updatedProduct.stockQuantity}`);
  };

  socket.on("inventoryUpdated", handleInventoryUpdated);

  return () => {
    socket.off("inventoryUpdated", handleInventoryUpdated);
  };
}, []);



  const cartItemCount = getCartItemCount(_id);

  return (
    <div className="product">
      <img src={imageURL} alt={productName} />
      <div className="description">
        <h3>{productName}</h3>
        <p>{description}</p>
        <p> £{price}</p>
        <p>
          <strong>Quantity available: {updatedStock}</strong>
        </p>
      </div>
      <button
        className="addToCartBttn"
        onClick={() => addToCart(_id)}
        disabled={updatedStock === 0}
      >
        Add To Cart {cartItemCount > 0 && <> ({cartItemCount})</>}
      </button>

      <div className="stockQuantity">
        {updatedStock === 0 && <h1> OUT OF STOCK</h1>}
      </div>
    </div>
  );
};

export default Product;
