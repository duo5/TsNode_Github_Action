import { Document, Model, model, Schema } from 'mongoose';
import { IProduct } from '../../interfaces/product.interface';
import mongooseUniqueValidator = require('mongoose-unique-validator');

export default interface IProductModel extends IProduct, Document {
    toJSON(): any;
}

const ProductSchema = new Schema({
    sku: Schema.Types.String,
    title: Schema.Types.String,
    description: Schema.Types.String,
    size: Schema.Types.Number,
    color: Schema.Types.String,
    price: Schema.Types.Number,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

ProductSchema.plugin(mongooseUniqueValidator, {message: 'is already taken.'});

ProductSchema.methods.toJSON = function (): any {
    return {
        _id: this._id,
      title: this.title,
      description: this.description,
      size: this.size,
      color: this.color,
      quantity: this.quantity,
      price: this.price,
      reviews: this.reviews
    };
};

export const Product: Model<IProductModel> = model<IProductModel>('Product', ProductSchema);
