import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";
const prodDao = new ProductDaoMongoDB();

import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongoDB();

export const getAll = async () => {
  try {
    return await cartDao.getAll();
  } catch (error) {
    console.log(error);
  }
};

export const getById = async (id) => {
  try {
    return await cartDao.getById(id);
  } catch (error) {
    console.log(error);
  }
};

export const create = async () => {
  try {
    const newcart = await cartDao.create();
    if (!newcart) return false;
    else return newcart;
  } catch (error) {
    console.log(error);
  }
};

export const update = async (id, obj) => {
  try {
    return await cartDao.update(id, obj);
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (id) => {
  try {
    const cartDel = await cartDao.delete(id);
    if (!cartDel) return false;
    else return cartDel;
  } catch (error) {
    console.log(error);
  }
};

export const addProdToCart = async (cartId, prodId) => {
  try {
    const existCart = await getById(cartId);
    if (!existCart) return null;

    const existProd = await prodDao.getById(prodId);
    if (!existProd) return null;

    return await cartDao.addProdToCart(cartId, prodId);
  } catch (error) {
    console.log(error);
  }
};

export const removeProdToCart = async (cartId, prodId) => {
  try {
    const existCart = await getById(cartId);
    if (!existCart) return null;
    const existProdInCart = await cartDao.existProdInCart(cartId, prodId);
    if (!existProdInCart) return null;
    return await cartDao.removeProdToCart(cartId, prodId);
  } catch (error) {
    console.log(error);
  }
};

export const updateProdQuantityToCart = async (cartId, prodId, quantity) => {
  try {
    const existCart = await getById(cartId);
    if (!existCart) return null;

    const existProdInCart = await cartDao.existProdInCart(cartId, prodId);
    if (!existProdInCart) return null;
    
    return await cartDao.updateProdQuantityToCart(cartId, prodId, quantity);
  } catch (error) {
    console.log(error);
  }
};

export const clearCart = async (cartId) => {
  try {
    const existCart = await getById(cartId);
    if (!existCart) return null;
    return await cartDao.clearCart(cartId)
  } catch (error) {
    console.log(error);
  }
};

// Entrega final
export const finalizarCompra = async (cartId, user) => {
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

    return ticket;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
