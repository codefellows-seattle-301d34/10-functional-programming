'use strict';
var app = app || {};


//because of all the app.Article(s) used, this needs to be an IIFE, but can rawDataObj be the module since that is just potato?  Also, wouldn't ALL Article references need to be app.Article then so it can be revealed correctly?
(function Article(rawDataObj) {
  // REVIEW: In Lab 8, we explored a lot of new functionality going on here. Let's re-examine the concept of context. Normally, "this" inside of a constructor function refers to the newly instantiated object. However, in the function we're passing to forEach, "this" would normally refer to "undefined" in strict mode. As a result, we had to pass a second argument to forEach to make sure our "this" was still referring to our instantiated object. One of the primary purposes of lexical arrow functions, besides cleaning up syntax to use fewer lines of code, is to also preserve context. That means that when you declare a function using lexical arrows, "this" inside the function will still be the same "this" as it was outside the function. As a result, we no longer have to pass in the optional "this" argument to forEach!
  Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
})(app);

//if Article above is wrapped as an IIFE, then this will need to be called app.Article.all
app.Article.all = [];

app.Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

app.Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  /* OLD forEach():
  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)));
  */

};

app.Article.fetchAll = callback => {
  $.get('/articles')
    .then(results => {
      Article.loadAll(results);
      callback();
    })
};

// Hint: What property of an individual instance contains the main text of the article?
app.Article.numWordsAll = () => {
  return Article.body.map().reduce()
};

// Hint: Make sure to return an array and avoid duplicates.
app.Article.allAuthors = () => {
  return Article.all.map().reduce();
};


app.Article.numWordsByAuthor = () => {
  return Article.allAuthors().map(author => 
    return {
      name: Article.author,
      // Hint: you will need to chain some combination of .filter(), .map(), and .reduce() to get the value of the numWords property
      numWords: Article.all.map().reduce(),
    });
};

app.Article.truncateTable = callback => {
  $.ajax({
    url: '/articles',
    method: 'DELETE',
  })
    .then(console.log)
  // REVIEW: Check out this clean syntax for just passing 'assumed' data into a named function! The reason we can do this has to do with the way Promise.prototype.then() works. It's a little outside the scope of 301 material, but feel free to research!
    .then(callback);
};

app.Article.prototype.insertRecord = function(callback) {
  // REVIEW: Why can't we use an arrow function here for .insertRecord()?
  $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
    .then(console.log)
    .then(callback);
};

app.Article.prototype.deleteRecord = function(callback) {
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'DELETE'
  })
    .then(console.log)
    .then(callback);
};

app.Article.prototype.updateRecord = function(callback) {
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
