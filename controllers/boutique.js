const Article = require('../models/article');

exports.getIndex = (req, res, next) => {
   res.render('boutique/index', {
      path: '/',
      pageTitle: 'Lovely Florette'
   });
};

exports.getArticles = (req, res, next) => {
   Article.find()
      .then(articles => {
         res.render('boutique/articles-user', {
            path: '/articles',
            arts: articles,
            pageTitle: 'Tuotteet',
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
            pageTitle: article.title
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
            articles: articles
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
   let fetchedCart;
   req.user
      .getCart()
      .then(cart => {
         fetchedCart = cart;
         return cart.getArticles();
      })
      .then(articles => {
         return req.user
            .createOrder()
            .then(order => {
               return order.addArticles(
                  articles.map(article => {
                     article.orderItem = {
                        quantity: article.cartItem.quantity
                     };
                     return article;
                  }));
            })
            .catch(err => console.log(err));
      })
      .then(result => {
         return fetchedCart.setArticles(null);
      })
      .then(result => {
         res.redirect('/orders');
      })
      .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
   req.user
      .getOrders({ include: ['articles'] })
      .then(orders => {
         res.render('boutique/orders', {
            path: '/orders',
            pageTitle: 'Tilaukset',
            orders: orders
         });
      })
      .catch(err => console.log(err));
};