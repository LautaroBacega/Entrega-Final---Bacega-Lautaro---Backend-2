import * as service from '../services/cart.services.js'

import { ProductModel } from "../daos/mongodb/models/product.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { cartDto } from "../dtos/cart.dto.js";
import { uuid } from "uuidv4";

export const getAll = async (req, res, next) => {
    try {
      const response = await service.getAll();
      res.status(200).json(response);
    } catch (error) {
      next(error.message);
    }
  };
  
  export const getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await service.getById(id);
      if (!response) res.status(404).json({ msg: "Cart Not found!" });
      else res.status(200).json(response);
    } catch (error) {
      next(error.message);
    }
  };
  
  export const create = async (req, res, next) => {
    try {
      const newCart = await service.create();
      if (!newCart) res.status(404).json({ msg: "Error create cart!" });
      else res.status(200).json(newCart);
    } catch (error) {
      next(error.message);
    }
  };
  
  export const update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const cartUpd = await service.update(id, req.body);
      if (!cartUpd) res.status(404).json({ msg: "Error update cart!" });
      else res.status(200).json(cartUpd);
    } catch (error) {
      next(error.message);
    }
  };
  
  export const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const cartDel = await service.remove(id);
      if (!cartDel) res.status(404).json({ msg: "Error delete cart!" });
      else res.status(200).json({ msg: `Cart id: ${id} deleted` });
    } catch (error) {
      next(error.message);
    }
  };

export const addProdToCart = async (req, res, next) => {
    try {
      const { idCart } = req.params;
      const { idProd } = req.params;
      const newProdToUserCart = await service.addProdToCart(
        idCart,
        idProd,
      );
      if (!newProdToUserCart) res.json({ msg: "Error add product to cart" });
      else res.json(newProdToUserCart);
    } catch (error) {
      next(error.message);
    }
  };

  export const removeProdToCart = async (req, res, next) => {
    try {
      const { idCart } = req.params;
      const { idProd } = req.params;
      const delProdToUserCart = await service.removeProdToCart(
        idCart,
        idProd,
      );
      if (!delProdToUserCart) res.json({ msg: "Error remove product to cart" });
      else res.json({msg: `product ${idProd} deleted to cart`});
    } catch (error) {
      next(error.message);
    }
  };

  export const updateProdQuantityToCart = async (req, res, next) => {
    try {
      const { idCart } = req.params;
      const { idProd } = req.params;
      const { quantity } = req.body;
      const  updateProdQuantity = await service.updateProdQuantityToCart(
        idCart,
        idProd,
        quantity
      );
      if (!updateProdQuantity) res.json({ msg: "Error update product quantity to cart" });
      else res.json(updateProdQuantity);
    } catch (error) {
      next(error.message);
    }
  };

  export const clearCart = async (req, res, next) => {
    try {
      const { idCart } = req.params;
      const clearCart = await service.clearCart(
        idCart,
      );
      if (!clearCart) res.json({ msg: "Error clear cart" });
      else res.json(clearCart);
    } catch (error) {
      next(error.message);
    }
  };

  // Entrega final
  export const finalizarCompra = async (req, res, next) => {
    try {
      const { id } = req.params;
      const ticket = await service.finalizarCompra(id, req.user);
      if (!ticket) {
        res.status(404).json({ error: "No se encontró el carrito o stock insuficiente" });
      } else {
        res.status(200).json({ message: "Compra finalizada", ticket });
      }
    } catch (error) {
      next(error.message);
    }
  };

  /* Finalización de compra
En la función finalizarCompra, cuando actualizas el stock de los productos, deberías manejar el rollback en caso de que alguna operación falle después de haber descontado el stock, para evitar inconsistencias en la base de datos. */

/* export const finalizarCompra = async (cartId, user) => {
  const session = await CartModel.startSession();
  session.startTransaction();
  try {
    const cart = await cartDao.getById(cartId).populate("products.product");

    if (!cart) return null;

    for (let item of cart.products) {
      if (item.product.stock < item.quantity) {
        throw new Error(`El producto ${item.product.name} no tiene stock suficiente`);
      }
    }

    // Descontar stock de cada producto
    for (let item of cart.products) {
      await productDao.updateStock(item.product._id, item.product.stock - item.quantity);
    }

    // Crear ticket de compra
    const ticket = await ticketDao.create({
      code: uuid(),
      purchase_datetime: new Date(),
      amount: cart.products.reduce(
        (acc, curr) => acc + curr.quantity * curr.product.price,
        0
      ),
      purchaser: user._id,
    });

    await session.commitTransaction();
    session.endSession();

    return ticket;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    throw error;
  }
};
 */