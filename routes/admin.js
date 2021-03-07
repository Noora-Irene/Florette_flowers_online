const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/add-article', adminController.getAddArticle);
router.get('/articles', adminController.getArticles);

router.post('/add-article', adminController.postAddArticle);

router.get('/edit-article/:articleId', adminController.getEditArticle);
router.post('/edit-article', adminController.postEditArticle);
router.post('/delete-article', adminController.postDeleteArticle);

module.exports = router;
