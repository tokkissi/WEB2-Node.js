var http = require("http");
var fs = require("fs");
function templateHTML(title, list, body) {
  return `<!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${body}
          </body>
          </html>`;
}

function templateList(filelist) {
  var list = "<ul>";
  for (let i = 0; i < filelist.length; i++) {
    list += `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;
  }
  list += "</ul>";
  return list;
}

var app = http.createServer(function (request, response) {
  // var url = require("url");  // url.parse 가 지원안되므로 불필요
  var _url = request.url;
  // url.parse 를 대체할 새로운 기술로 절대경로를 인자로 갖는 URL 객체를 이용한다
  const queryData = new URL("http://localhost:3000" + _url);
  // var queryData = url.parse(_url, true).query;  // 더이상 사용, 지원되지 않는다
  // 쿼리로 받아온 pathname 이 '/' 면 다음을 실행
  if (queryData.pathname === "/") {
    // 쿼리로 받아온 id 값이 null 이면 다음을 실행
    if (queryData.searchParams.get("id") === null) {
      fs.readdir("./data", (error, filelist) => {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>
            <p>${description}</p>`
        );
        response.writeHead(200); //서버의 상태코드를 반환한다. 정상적으로 페이지를 찾을 수 있으므로 정상 상태를 나타내는 200 을 리턴한다
        response.end(template); // 클라이언트에게 괄호 안의 데이터를 보내고 응답을 끝낸다
        // 쿼리로 받아온 id 값이 null 이 아니면 다음을 실행
      });
    } else {
      fs.readdir("./data", (error, filelist) => {
        fs.readFile(
          `data/${queryData.searchParams.get("id")}`,
          "utf-8",
          (err, description) => {
            var title = queryData.searchParams.get("id");
            var list = templateList(filelist);
            var template = templateHTML(
              title,
              list,
              `<h2>${title}</h2>
            <p>${description}</p>`
            );
            response.writeHead(200); //서버의 상태코드를 반환한다. 정상적으로 페이지를 찾을 수 있으므로 정상 상태를 나타내는 200 을 리턴한다
            response.end(template); // 클라이언트에게 괄호 안의 데이터를 보내고 응답을 끝낸다
          }
        );
      });
    }
  } else {
    response.writeHead(404); //  // 서버의 상태코드를 반환한다. 페이지를 찾을 수 없다면 해당 상태인 상태 코드 404 을 리턴한다
    response.end("not found"); // 클라이언트에게 괄호 안의 데이터를 보내고 응답을 끝낸다. 페이지를 찾지 못했다는 의미의 not found 를 적어주었다
  }
});
app.listen(3000); // 3000 번 포트를 사용한다
