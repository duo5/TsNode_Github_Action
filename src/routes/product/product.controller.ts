import { NextFunction, Request, Response } from 'express';
import IProductModel, { Product } from '../../database/models/product.model';
import IReviewModel, { Review } from '../../database/models/review.model';

/**
 * @api {post} /user/refesh Request To Get new refresh token
 * @apiPermission User
 * @apiName getAllProduct
 * @apiGroup Product
 *
 * @apiSuccess {Object[]} products list of product.
 * @apiSuccess {String} products._id product id.
 * @apiSuccess {String} products.title Product name.
 * @apiSuccess {String} products.description Product description.
 *
 *
 * @apiError Invalid Incorect Email or password.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Invalid
 *     {
 *       "error": "Incorect Email"
 *     }
 */
export async function getAllProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await Product.find({});
        products.map( p => {
            p.toJSON();
        });
        return res.json({products});
    } catch (error) {
        next(error);
    }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        return res.json(product.toJSON());
    } catch (error) {
        next(error);
    }
}

export  async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const product: IProductModel = new Product();
        product.sku = req.body.sku;
        product.title = req.body.title;
        product.description = req.body.description;
        product.size = req.body.size;
        product.color = req.body.color;
        product.price = req.body.price;
        await product.save();
        return res.json(product.toJSON());
    } catch (error) {
        next(error);
    }
}

export async function editProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const filter = { _id: id };
        const product = await Product.findByIdAndUpdate(filter, req.body, { new: true });
        return res.json(product.toJSON());
    } catch (error) {
        next(error);
    }
}

export async function removeProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const filter = {_id: id};
        await Product.findByIdAndRemove(filter, req.body);
        const products = await Product.find({});
        return res.json({products});
    } catch (error) {
        next(error);
    }
}

export async function review(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const pro = await createComment(id, {
            productOwner: id,
            star: req.body.star,
            comment: req.body.comment,
            date: Date.now()
        });
        return res.json(pro.toJSON());
    } catch (error) {
        next(error);
    }
}

export async function getAllReview(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const rv = await Product.findById(id).populate('reviews');
        return res.json(rv.reviews);
    } catch (error) {
        next(error);
    }
}

const createComment = async (productID, comment) => {
    const docComment = await Review.create(comment);
    console.log(docComment);
    if (docComment) {
        return await Product.findByIdAndUpdate(
            productID,
            { $push: { reviews: docComment._id } },
            { new: true, useFindAndModify: false }
          );
    
}
};
