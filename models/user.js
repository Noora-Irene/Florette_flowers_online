const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   cart: {
      items: [
         {
            articleId: {
               type: Schema.Types.ObjectId,
               ref: 'Article',
               required: true
            },
            quantity: {
               type: Number,
               required: true
            }
         }
      ]
   }
});

userSchema.methods.addToCart = function(article) {
   const cartArticleIndex = this.cart.items.findIndex(a => {
      return a.articleId.toString() === article._id.toString();
   });

   let newQuantity = 1;
   const updatedCartItems = [...this.cart.items];

   if (cartArticleIndex >= 0) {
      newQuantity = this.cart.items[cartArticleIndex].quantity + 1;
      updatedCartItems[cartArticleIndex].quantity = newQuantity;
   } else {
      updatedCartItems.push({
         articleId: article._id, // same names as in schema!
         quantity: newQuantity
      });
   }
   const updatedCart = {
      items: updatedCartItems
   };
   this.cart = updatedCart;
   return this.save();
};

userSchema.methods.deleteCartItem = function(articleId) {
   const updatedCartItems = this.cart.items.filter(item => {
      return item.articleId.toString() !== articleId.toString();
   });
   this.cart.items = updatedCartItems;
   return this.save();
};

userSchema.methods.clearCart = function() {
   this.cart = { items: [] };
   return this.save();
};

module.exports = mongoose.model('User', userSchema);