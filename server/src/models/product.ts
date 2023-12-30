import { Schema, model } from "mongoose";

export interface IProduct {
  productName: string;
  price: number;
  description: string;
  stockQuantity: number;
  imageURL: string;
}

const ProductSchema = new Schema<IProduct>({
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: [1, 'Price of product should be above 1.']},
  description: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  imageURL: { type: String, required: true },
});

export const ProductModel = model<IProduct>("product", ProductSchema);