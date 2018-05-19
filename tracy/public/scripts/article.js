'use strict';
var  app = app || {};
// var Article = Article || {};

// var Article = (function() {
(function(module) {
module.Article = {};

module.Article = function(rawDataObj) {
  // REVIEW: In Lab 8, we explored a lot of new functionality going on here. Let's re-examine the concept of context. Normally, "this" inside of a constructor function refers to the newly instantiated object. However, in the function we're passing to forEach, "this" would normally refer to "undefined" in strict mode. As a result, we had to pass a second argument to forEach to make sure our "this" was still referring to our instantiated object. One of the primary purposes of lexical arrow functions, besides cleaning up syntax to use fewer lines of code, is to also preserve context. That means that when you declare a function using lexical arrows, "this" inside the function will still be the same "this" as it was outside the function. As a result, we no longer have to pass in the optional "this" argument to forEach!
  Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
}

module.Article.all = [];

module.Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// Article.loadAll = articleData => {
let loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));

  module.Article.all = articleData.map(obj => new module.Article(obj));
};

module.Article.fetchAll = callback => {
  $.get('/articles')
    .then(results => {
      // Article.loadAll(results);
      loadAll(results);
      callback();
    })
};

// Hint: What property of an individual instance contains the main text of the article?
module.Article.numWordsAll = () => {
  return module.Article.all.map(o => o.body.split(' ').length).reduce((a, c) => a + c, 0);
};

// Hint: Make sure to return an array and avoid duplicates.
module.Article.allAuthors = () => {
  return module.Article.all.map(o => o.author)
    .reduce((acc, curr) => {
      if (!acc.includes(curr)) {
        acc.push(curr);
      }
      return acc
    },[]);
};

module.Article.numWordsByAuthor = () => {
  return module.Article.allAuthors().map(author => {
    return {name: author,
      numWords: module.Article.all
        .filter(a => a.author === author )
        .map(o => o.body.split(' ').length)
        .reduce((a, c) => a + c, 0),
      numArticles: module.Article.all
        .filter(a => a.author === author)
        .length
    }})
};

module.Article.truncateTable = callback => {
  $.ajax({
    url: '/articles',
    method: 'DELETE',
  })
    .then(console.log)
  // REVIEW: Check out this clean syntax for just passing 'assumed' data into a named function! The reason we can do this has to do with the way Promise.prototype.then() works. It's a little outside the scope of 301 material, but feel free to research!
    .then(callback);
};

module.Article.prototype.insertRecord = function(callback) {
  // REVIEW: Why can't we use an arrow function here for .insertRecord()?
  // COMMENT: because of the use of contextual this.
  $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
    .then(console.log)
    .then(callback);
};

module.Article.prototype.deleteRecord = function(callback) {
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'DELETE'
  })
    .then(console.log)
    .then(callback);
};

module.Article.prototype.updateRecord = function(callback) {
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'PUT',
    data: {
      author: this.author,
      authorUrl: this.authorUrl,
      body: this.body,
      category: this.category,
      publishedOn: this.publishedOn,
      title: this.title,
      author_id: this.author_id
    }
  })
    .then(console.log)
    .then(callback);
};

// return Article;
// module.Article = Article;
})(app);