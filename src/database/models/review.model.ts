import { Document, Model, model, Schema } from 'mongoose';
import { IReview } from '../../interfaces/review.interface';
import mongooseUniqueValidator = require('mongoose-unique-validator');

export default interface IReviewModel extends IReview, Document {
    toJSON(): any;
}

const ReviewSchema = new Schema({
    productOwner: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    star: {
        type: Schema.Types.Number,
        min: [1, 'min rate is 1'],
        max: [5, 'max rate is 5']
    },
    comment: Schema.Types.String,
    date: Schema.Types.Date
});

ReviewSchema.plugin(mongooseUniqueValidator, {message: 'is already taken.'});

ReviewSchema.methods.toJSON = function(): any {
    return {
        _id: this._id,
        star: this.star,
        comment: this.comment,
        date: this.date,
    };
};

export const Review: Model<IReviewModel> = model<IReviewModel>('Review', ReviewSchema);
