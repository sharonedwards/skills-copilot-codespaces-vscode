// Create web server
// Run: node comments.js
// Then, open browser and go to http://localhost:3000
// To stop server, press Ctrl+C
// To restart server, run: node comments.js

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
var server = http.createServer(function (request, response) {
    // Get URL
    var pathname = url.parse(request.url).pathname;

    // Get query
    var query = url.parse(request.url, true).query;
    var page = query.page;
    var comment = query.comment;

    // Get POST data
    var body = '';
    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        var post = qs.parse(body);
        var page = post.page;
        var comment = post.comment;

        // Save comment
        if (page && comment) {
            fs.appendFile('comments.txt', page + ': ' + comment + '\n', function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }

        // Show comments
        fs.readFile('comments.txt', function (err, data) {
            if (err) throw err;
            var comments = data.toString().split('\n');
            var html = '';
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i];
                if (comment) {
                    html += '<li>' + comment + '</li>';
                }
            }
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('<html><body><ul>' + html + '</ul>');
            response.write('<form method="post" action="/"><input type="text" name="page" value="' + page + '">: <input type="text" name="comment"><input type="submit" value="Submit"></form></body></html>');
            response.end();
        });
    });
});

// Start server
server.listen(3000);
console.log('Server running at http://localhost:3000');

