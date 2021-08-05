const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
// Logging
app.use(morgan("dev"));
// Info GET endpoint
app.get("/info", (req, res, next) => {
  res.send(
    "Tudo está funcionando!!"
  );
});

app.use(
  "/",
  createProxyMiddleware({
    logLevel: "debug",
    target: {host:"docs.google.com", port:443, protocol:"https:", },
    changeOrigin: true,
    autoRewrite : true,
    followRedirects : true,
    
    onError:(err, req, res, target)=>{
      console.log(err);
    }
  })
);

app.listen(process.env.PORT || 8080);
