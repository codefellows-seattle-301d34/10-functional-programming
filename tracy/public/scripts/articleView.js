'use strict';

var app = app || {};

(function(module){

var articleView = {};

// PUBLIC FUNCTIONS

articleView.initIndexPage = () => {
  module.Article.all.forEach(a => $('#articles').append(a.toHtml()));

  populateFilters();
  handleCategoryFilter();
  handleAuthorFilter();
  handleMainNav();
  setTeasers();
  $('pre code').each((i, block) => hljs.highlightBlock(block));
};

articleView.initNewArticlePage = () => {
  $('.tab-content').show();
  $('#export-field').hide();
  $('#article-json').on('focus', function(){
    this.select();
  });

  $('#new-form').on('change', 'input, textarea', create);
  $('#new-form').on('submit', submit);
};

articleView.initAdminPage = () => {
  
  // REVIEW: We use .forEach() here because we are relying on the side-effects of the callback function: appending to the DOM. The callback is not required to return anything.
  let adminTemplate = Handlebars.compile($('#admin-template').text());
  module.Article.numWordsByAuthor().forEach(stat => $('.author-stats').append(adminTemplate(stat)));
  // REVIEW: Simply write the correct values to the page:
  $('#blog-stats .authors').text(module.Article.allAuthors().length);
  $('#blog-stats .articles').text(module.Article.all.length);
  $('#blog-stats .words').text(module.Article.numWordsAll());
};

// PRIVATE FUNCTIONS

let populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

let handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

let handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

let handleMainNav = () => {
  $('nav').on('click', '.tab', function(e) {
    e.preventDefault();
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('nav .tab:first').click();
};

let setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

let create = () => {
  var article;
  $('#articles').empty();

  article = new module.Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: new Date().toISOString()
  });

  $('#articles').append(article.toHtml());
  $('pre code').each((i, block) => hljs.highlightBlock(block));
};

let submit = event => {
  event.preventDefault();
  let article = new module.Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: new Date().toISOString()
  });

  article.insertRecord();

  // REVIEW: The following line of code redirects the user back to the home page after submitting the form.
  window.location = '../';
}

module.articleView = articleView;
})(app);