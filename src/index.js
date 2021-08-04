const express = require("express");
const morgan = require("morgan");
const {
  createProxyMiddleware,
  responseInterceptor,
  
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
    target: {host:"docs.google.com", port:443, protocol:"https:", },
    changeOrigin: true,
    //selfHandleResponse: true,
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
      /*
      proxyReq.setHeader("referrerPolicy", "strict-origin-when-cross-origin");
      proxyReq.setHeader("body", "null");
      proxyReq.setHeader("credentials", "omit");
      proxyReq.setHeader('mode', 'cors');
      proxyReq.setHeader('host', 'docs.google.com');
*/
    },

    onError:(err, req, res, target)=>{
      console.log(err);
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
