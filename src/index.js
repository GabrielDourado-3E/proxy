const express = require("express");
const morgan = require("morgan");
const {
  createProxyMiddleware,
  responseInterceptor
} = require("http-proxy-middleware");

const app = express();
// Logging
app.use(morgan("dev"));
// Info GET endpoint
app.get("/info", (req, res, next) => {
  res.send(
    "This is a proxy service which proxies to Billing and Account APIs."
  );
});

app.use(
  "/",
  createProxyMiddleware({
    logLevel: "debug",
    //target: "https://jsonplaceholder.typicode.com",
    target: "https://docs.google.com",
    changeOrigin: true,
    selfHandleResponse: true,
    autoRewrite : true,
    followRedirects : true,
    pathRewrite: {
      [`^/api`]: ""
    },
/*
    onProxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, req, res) => {
        const response = responseBuffer.toString("utf8"); // convert buffer to string
        return response.replace(/bolsonaro/gi, "Bozo"); // manipulate response and return the result
      }
    ),
    */
    onProxyReq:  (proxyReq, req, res)=> {
      proxyReq.setHeader("referrerPolicy", "strict-origin-when-cross-origin");
      proxyReq.setHeader("body", "null");
      proxyReq.setHeader("credentials", "omit");
      proxyReq.setHeader('mode', 'cors');
      console.log(proxyReq.headers);
    }
  })
);

// // Authorization
// app.use("", (req, res, next) => {
//   if (req.headers.authorization) {
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// });

app.listen(process.env.PORT || 8080);
