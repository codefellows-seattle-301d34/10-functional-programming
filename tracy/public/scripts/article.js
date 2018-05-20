'use strict';

var  app = app || {};

(function(module) {

var Article = {};

Article.all = [];

// PUBLIC FUNCTIONS AND METHODS

Article = function(rawDataObj) {
  Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
}

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.prototype.insertRecord = function(callback) {
  // REVIEW: Why can't we use an arrow function here for .insertRecord()?
  // COMMENT: because of the use of contextual this.
  $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
    .then(console.log)
    .then(callback);
};

Article.prototype.deleteRecord = function(callback) {
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'DELETE'
  })
    .then(console.log)
    .then(callback);
};

Article.prototype.updateRecord = function(callback) {
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


Article.numWordsAll = () => {
  return Article.all.map(o => o.body.split(' ').length).reduce(sumElements, 0);
};

Article.allAuthors = () => {
  return Article.all.map(o => o.author)
    .reduce((acc, curr) => {
      if (!acc.includes(curr)) {
        acc.push(curr);
      }
      return acc
    },[]);
};

Article.numWordsByAuthor = () => {
  return Article.allAuthors().map(author => {
    return {name: author,
      numWords: Article.all
        .filter(a => a.author === author )
        .map(o => o.body.split(' ').length)
        .reduce(sumElements, 0),
      numArticles: Article.all
        .filter(a => a.author === author)
        .length
    }})
};

Article.truncateTable = callback => {
  $.ajax({
    url: '/articles',
    method: 'DELETE',
  })
    .then(console.log, console.log)
  // REVIEW: Check out this clean syntax for just passing 'assumed' data into a named function! The reason we can do this has to do with the way Promise.prototype.then() works. It's a little outside the scope of 301 material, but feel free to research!
  // COMMENT: Does "success" come from the promise? Because
  // server.js just sends "delete complete" but console.log
  // outputs "delete complete success". I added the second
  // callback (for error case if I read the docs right) and
  // tried triggering it by updating a record in an empty
  // database but it thought that was fine apparently. Got
  // the same success message.
    .then(callback);
};

Article.fetchAll = callback => {
  $.get('/articles')
    .then(results => {
      loadAll(results);
      callback();
    })
};

// PRIVATE FUNCTIONS

let sumElements = (a, c) => a + c;

let loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));

  Article.all = articleData.map(obj => new Article(obj));
};

module.Article = Article;
})(app);