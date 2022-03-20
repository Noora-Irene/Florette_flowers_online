const Article = require('../models/article');

exports.getAddArticle = (req, res, next) => {
   res.render('admin/edit-article', {
      pageTitle: 'Lisää tuote',
      path: '/admin/add-article',
      editing: false,
      isAuthOk: req.session.isLoggedIn
   });
};

exports.postAddArticle = (req, res, next) => {
   const title = req.body.title;
   const image = req.body.image;
   const price = req.body.price;
   const description = req.body.description;
   const article = new Article({
      title: title, // right: data received in controller action, left: keys of schema
      image: image,
      price: price,
      description: description,
      userId: req.user
   });
   article
      .save() // method comes from mongoose
      .then(result => {
         console.log('Created Product');
         res.redirect('/admin/articles');
      })
      .catch(err => {
         console.log(err);
      });
};

exports.getEditArticle = (req, res, next) => {
   const editMode = req.query.edit;
   if (!editMode) {
      return res.redirect('/');
   }
   const artId = req.params.articleId;
   Article.findById(artId)
      .then(article => {
         if (!article) {
            return res.redirect('/');
         }
         res.render('admin/edit-article', {
            pageTitle: 'Manage Articles',
            path: '/admin/edit-article',
            editing: editMode,
            article: article,
            isAuthOk: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
};

exports.postEditArticle = (req, res, next) => {
   const artId = req.body.articleId;
   const updatedTitle = req.body.title;
   const updatedImage = req.body.image;
   const updatedPrice = req.body.price;
   const updatedDescription = req.body.description;
   Article.findById(artId)
      .then(article => {
         article.title = updatedTitle;
         article.image = updatedImage;
         article.price = updatedPrice;
         article.description = updatedDescription;
         return article.save();
      })
      .then(result => {
         console.log('Article updated')
         res.redirect('/admin/articles');
      })
      .catch(err =>
         console.log(err));
};

exports.getArticles = (req, res, next) => {
   Article.find()
      .then(articles => {
         res.render('admin/articles', {
            arts: articles,
            pageTitle: 'Admin Articles',
            path: '/admin/articles',
            isAuthOk: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
};

exports.postDeleteArticle = (req, res, next) => {
   const artId = req.body.articleId;
   Article.findByIdAndRemove(artId)
      .then(() => {
         console.log('Article destroyed')
         res.redirect('/admin/articles');
      })
      .catch(err => console.log(err));
};