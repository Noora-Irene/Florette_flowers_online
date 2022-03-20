const express = require('express');
const boutiqueController = require('../controllers/boutique');
const router = express.Router();

router.get('/', boutiqueController.getIndex);
router.get('/articles', boutiqueController.getArticles);
router.get('/articles/:articleId', boutiqueController.getArticle);

router.get('/cart', boutiqueController.getCart);
router.post('/cart', boutiqueController.postCart);
router.post('/delete-cart-item', boutiqueController.postCartDelete);

router.post('/create-order', boutiqueController.postOrder);
router.get('/orders', boutiqueController.getOrders);

module.exports = router;