const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
   articles: [{
      article: {
         type: Object,
         required: true
      },
      quantity: {
         type: Number,
         required: true
      }
   }],
   user: {
      name: {
         type: String,
         required: true
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User', // use name of the model
         required: true
      }
   }
});

module.exports = mongoose.model('Order', orderSchema);