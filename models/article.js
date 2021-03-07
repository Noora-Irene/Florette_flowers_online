const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // use name of the model
      required: true
   }
});

module.exports = mongoose.model('Article', articleSchema);