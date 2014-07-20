var feed = require('feed-read'), //rss reader
    http = require("http"),
    port = process.env.PORT || 3000, 
    feed_sources = [
        "http://feeds.bbci.co.uk/news/rss.xml",
        "http://news.sky.com/feeds/rss/home.xml"
    ];

http.createServer(function (req, res) {
  
     res.writeHead(200, {
        "Content-Type": "text/html",        
        "Transfer-Encoding": "chunked"
    });

     res.write("<html>\n<head>\n<title>RSS Feeds</title>\n</head>\n<body>");

     processFeed(res);

}).listen(port);
console.log("HTTP Listening on port: "+port);

var source_cnt=0
var source_length=10;
function processFeed(res){
  var feedSource = feed_sources.shift();

  if(feedSource){
    source_cnt++;
    if((source_cnt)%2!=0) res.write('<div style="background-color:#ACACAD;">');//distinguish feed sources
    else res.write('<div>');
    
    feed(feedSource, function(err, articles) {
        if(articles){
          articles.slice(0,10).forEach(function(article){
            displayArticle(res, article);
          });

          res.write('</div>');

          processFeed(res);
        }
     });
  } else {
    res.end("</body>\n</html>"); 
  }
}

// html for each article
function displayArticle(res, a) {

  var author = a.author || a.feed.name;//in case author is missing
  var articleHmtl='<div style="border:1px solid;">'+
                  '<h3>'+a.title +'</h3>'+
                  '<p><strong>' +author +' - ' +a.published +'</strong> <br />'+
                  a.content+'</p>'+
                  '</div>';

  res.write(articleHmtl);

}