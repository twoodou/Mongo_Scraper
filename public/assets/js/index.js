// var axios = require('axios');

var currentNewestID = "1337";
var numNewArticles = 0;

$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  var articleContainer = $("#articles");
  var mainHeading = $("#mainHeading");
  var subHeading = $("#subHeading");

  $(document).on("click", ".btn.save", saveArticle);
  $(document).on("click", ".scrape-new", scrapeArticle);
  $(document).on("click", ".viewSaved", viewSaved);

  // Once the page is ready, run the initPage function to kick things off
  initPage();

  function initPage() {
    // Empty the article container, run an AJAX request for any unsaved headlines
    articleContainer.empty();
    $.get("/articles").then(function(data) {
      console.log("DATTAAAAAA");
      console.log(data);
      if ((data.length === 0) && (currentNewestID === "1337")) {
        renderEmpty();
        console.log("rendering EMPTY");

      } else if ((data.length) && (currentNewestID == data[0]._id)) {
        bootbox.alert("<h3 class='text-center m-top-80'>" + "Sorry, there's not any new content!" + "<h3>");
        // console.log(currentNewestID);
        // console.log(data[0]._id);
      }

      else {
        numNewArticles = parseInt(data.length);
        // console.log(data);
        currentNewestID = data[0]._id;
        // mainHeading.html("<h2>" + "Welcome back! See your latest " + numNewArticles + " articles below!" + "</h2>");
        subHeading.text("Welcome back! See your latest " + numNewArticles + " articles below!");
        renderArticles(data);
        console.log("rendering articles");

      }

    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articlePanels = [];
    // We pass each article JSON object to the createPanel function which returns a bootstrap
    // panel with our article data inside
    for (var i = 0; i < articles.length; i++) {
      var j = i + 1;
      articlePanels.push(createPanel(articles[i], j));
    }
    // Once we have all of the HTML for the articles stored in our articlePanels array,
    // append them to the articlePanels container
    articleContainer.prepend(articlePanels);
  }

  function createPanel(article, i) {
    console.log("CREATEPANEL ARTICLE:::::::::***************");
    console.log(article);
    // This functiont takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article panel
    var panel = $([
      "<div class='panel panel-default'>",
      "<div class='panel-heading'>",
      "<p class='numberer'>",
      "<h4 id='numberer'>",
      "Article: ",
      i,
      "</h4>",
      "</p>",
      "<h4 id='resultsTitle'>",
      // "<p id='resultsTitle'>",
      article.title,
      // "</p>",
      "</h4>",
      "<a class='btn btn-warning save'>",
      "Save Article",
      "</a>",
      // "</h3>",
      "</div>",
      "<div class='panel-body'>",
      "<a id= 'resultsLink' class='article-link' target='" + article.link + "' href='" + article.link + "'>",
      article.link,
      "</a>",
      "</div>",
      "</div>"
    ].join(""));
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    panel.data("_id", article._id);
    // We return the constructed panel jQuery element
    return panel;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $([
      "<div class='alert alert-warning text-center'>",
      "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
      "</div>",
      "<div class='panel panel-default'>",
      "<div class='panel-heading text-center'>",
      "<h3>What Would You Like To Do?</h3>",
      "</div>",
      "<div class='panel-body text-center'>",
      "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
      "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
      "</div>",
      "</div>"
    ].join(""));
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function saveArticle() {
    //
    //
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.isSaved = true;
    console.log("ARTICLE SAVED");
    bootbox.alert("Article Saved!");
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({method: "PUT", url: "/saveArticles", data: articleToSave}).then(function(data) {
      if (data.ok) {
        // Run the initPage function again. This will reload the entire list of articles
        initPage();
      }
    });
  }

  function scrapeArticle() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/scrape").then(function(scrapedData) {
      console.log(scrapedData);
      if (scrapedData._id) {
        currentNewestID = scrapedData._id;
        initPage();
        // bootbox.alert("<h3 class='text-center m-top-80'>" + "Sorry, no new content has been added! Try again soon!" + "<h3>");
      } else {
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80'>" + "No New Articles Added :'(" + "<h3>");
      }
    });
  }

  function viewSaved() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/savedArticles").then(function(savedData) {
      // console.log(savedData);
      renderArticles(savedData);
    });
  }

});
