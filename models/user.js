'use strict';
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;
class User  {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    save() {
        const db = getDb();
        return db.collection('user')
            .insertOne(this)
            .then()
            .catch(error => {
                console.log(error)
            });
    }

    // for adding product to cart
    addToCart(productInCart) {
        const cartProductIndex = this.cart.items.findIndex(pro => {
                return pro.productId.toString() === productInCart._id.toString();
                //  return pro.productId == productInCart._id;
            });
        
        let newQuantity = 1;
          const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({productId: new ObjectId(productInCart._id), quantity: newQuantity })
        }
      
     
        // productInCart.quantity = 1;
        const updatedCart = { items: updatedCartItems};
        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                {$set: {cart:updatedCart}}
            )
            .then(userCart => {
                // console.log(user);
                return userCart;
            })
            .catch(error => {
                console.log(error)
            });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users')
            .findOne({
                _id: new ObjectId(userId)
            })
            .then(user => {
                // console.log(user);
                return user;
            })
            .catch(error => {
                console.log(error)
            });
        
    }
};

module.exports = User;
