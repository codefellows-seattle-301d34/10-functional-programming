'use strict';
var app = app || {};

function Article(rawDataObj) {
  // REVIEW: In Lab 8, we explored a lot of new functionality going on here. Let's re-examine the concept of context. Normally, "this" inside of a constructor function refers to the newly instantiated object. However, in the function we're passing to forEach, "this" would normally refer to "undefined" in strict mode. As a result, we had to pass a second argument to forEach to make sure our "this" was still referring to our instantiated object. One of the primary purposes of lexical arrow functions, besides cleaning up syntax to use fewer lines of code, is to also preserve context. That means that when you declare a function using lexical arrows, "this" inside the function will still be the same "this" as it was outside the function. As a result, we no longer have to pass in the optional "this" argument to forEach!
  Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  /* OLD forEach():
  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)));
  */

};

Article.fetchAll = callback => {
  $.get('/articles')
    .then(results => {
      Article.loadAll(results);
      callback();
    })
};

// Hint: What property of an individual instance contains the main text of the article? -- the body contains the main text of the article
// I want to get the article body and map it (don't change the original), then reduce the number of words in the article to a number (numWordsAll) as a total, using .reduce.  
Article.numWordsAll = () => {
  return Article.all.map(request.body.body).reduce(request.body.body)
};

// Hint: Make sure to return an array and avoid duplicates.
// I can think that I need to return the array of author names here, but I don't understand how to .reduce them.  Is this asking for a count of all the authors in the table ?  I'm assuming I need to use .filter here somewhere to avoid duplicates as requested.  
Article.allAuthors = () => {
  return Article.all.map().reduce();
};


Article.numWordsByAuthor = () => {
  return Article.allAuthors().map(author => 
    return {
      name:
      // Hint: you will need to chain some combination of .filter(), .map(), and .reduce() to get the value of the numWords property
      // Pseudocode on this goes like this (I think):
      // I want to get the number of words per author.  Get the author first.  Find the intersection of all articles published by that author by using a SQL query. Apply the numWordsbyAuthor function to all the articles and get a total by article by using the .map function (don't hange the original array of items.  Take that answer (as an array) and apply the .reduce method to it to add all the numbers of words per articles together to get a sum.
      numWords:   
    })
};

Article.truncateTable = callback => {
  $.ajax({
    url: '/articles',
    method: 'DELETE',
  })
    .then(console.log)
  // REVIEW: Check out this clean syntax for just passing 'assumed' data into a named function! The reason we can do this has to do with the way Promise.prototype.then() works. It's a little outside the scope of 301 material, but feel free to research!
    .then(callback);
};

Article.prototype.insertRecord = function(callback) {
  // REVIEW: Why can't we use an arrow function here for .insertRecord()?
  // .insertRecord() uses the contextual this.  
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
