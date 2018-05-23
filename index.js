const restify = require("restify");

const server = restify.createServer({
  name: "myapp",
  version: "1.0.0"
});

server.get(
  /\/(.*)?.*/,
  restify.plugins.serveStatic({
    directory: "./dist",
    default: "index.html"
  })
);

server.listen(8080, function() {
  console.log("%s listening at %s", server.name, server.url);
});
