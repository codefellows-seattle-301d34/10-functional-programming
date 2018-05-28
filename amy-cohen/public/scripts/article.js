'use strict';
var app = app || {};

//is this how? Nothing else is working and there is so much online that shows different options. Hoping when you said wrap it that you meant the whole thing.
(function (module) {

function Article(rawDataObj) {
  // REVIEW: In Lab 8, we explored a lot of new functionality going on here. Let's re-examine the concept of context. Normally, "this" inside of a constructor function refers to the newly instantiated object. However, in the function we're passing to forEach, "this" would normally refer to "undefined" in strict mode. As a result, we had to pass a second argument to forEach to make sure our "this" was still referring to our instantiated object. One of the primary purposes of lexical arrow functions, besides cleaning up syntax to use fewer lines of code, is to also preserve context. That means that when you declare a function using lexical arrows, "this" inside the function will still be the same "this" as it was outside the function. As a result, we no longer have to pass in the optional "this" argument to forEach!
  Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
};

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

  // OLD forEach():
  // articleData.forEach(articleObject => Article.all.push(new Article(articleObject)));
  
 Article.all = articleData.map(articleObject => new Article(articleObject));

};

Article.fetchAll = callback => {
  // console.log(`Is Article.fetchAll this is being hit?`);

  $.get('/articles')
    .then(results => {
      Article.loadAll(results);
      callback();
    })
};

// Hint: What property of an individual instance contains the main text of the article?
Article.numWordsAll = () => {
  // WHAT????
  return Article.all.map(article => article.body.split(' ').length).reduce((a, b) => a + b, 0);
};

// Hint: Make sure to return an array and avoid duplicates.
Article.allAuthors = () => {
  return Article.all.map(article => article.author).reduce((names, name) => {
    if (names.includes(name)) names.push(name);
    return names;
  }, []);
  console.log(names);
};


Article.numWordsByAuthor = () => {
  // console.log(Article.all.filter(a, a.author === a).map(body.split(' ').length).reduce((acc, curr) => acc += curr, 0));
  console.log(`Is this even being hit?`); 
  return Article.allAuthors().map(author => {
    return {
      name: author,
      // Hint: you will need to chain some combination of .filter(), .map(), and .reduce() to get the value of the numWords property
      numWords: Article.all.map(a => a.body.split(' ').length).reduce((a, b) => a + b, 0),
    }
    console.log(numWords);
    });
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

//http://stackabuse.com/how-to-use-module-exports-in-node-js/
//https://gist.github.com/stormwild/4238330
module.Article = Article;

// console.log(Article);
})(app);
console.log(app);