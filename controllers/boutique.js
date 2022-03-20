const Article = require('../models/article');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
   res.render('boutique/index', {
      path: '/',
      pageTitle: 'Lovely Florette',
      isAuthOk: req.session.isLoggedIn
   });
};

exports.getArticles = (req, res, next) => {
   Article.find()
      .then(articles => {
         res.render('boutique/articles-list', {
            path: '/articles',
            arts: articles,
            pageTitle: 'Tuotteet',
            isAuthOk: req.session.isLoggedIn
         });
      })
      .catch(err => {
         console.log(err)
      });
};

exports.getArticle = (req, res, next) => {
   const artId = req.params.articleId;
   Article.findById(artId)
      .then(article => {
         res.render('boutique/article-detail', {
            article: article,
            path: '/articles',
            pageTitle: article.title,
            isAuthOk: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
   req.user
      .populate('cart.items.articleId')
      .execPopulate()
      .then(user => {
         const articles = user.cart.items;
         res.render('boutique/cart', {
            path: '/cart',
            pageTitle: 'Ostoskorisi',
            articles: articles,
            isAuthOk: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
   const artId = req.body.articleId;
   Article.findById(artId)
      .then(article => {
         return req.user.addToCart(article);
      })
      .then(result => {
         console.log(result);
         res.redirect('/cart');
      });
};

exports.postCartDelete = (req, res, next) => {
   const artId = req.body.articleId;
   req.user
      .deleteCartItem(artId)
      .then(result => {
         res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
   req.user
      .populate('cart.items.articleId')
      .execPopulate()
      .then(user => {
         const articles = user.cart.items.map(i => {
            return { quantity: i.quantity, article: { ...i.articleId._doc } };
         });
         const order = new Order({
            user: {
               name: req.user.name,
               userId: req.user
            },
            articles: articles
         });
         return order.save();
      })
      .then(result => {
         return req.user.clearCart();
      })
      .then(() => {
         res.redirect('/orders');
      })
      .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
   Order.find({ 'user.userId': req.user._id })
      .then(orders => {
         res.render('boutique/orders', {
            path: '/orders',
            pageTitle: 'Tilauksesi',
            orders: orders,
            isAuthOk: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
};