const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if user is logged in and has valid access token
    if (req.session && req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        
        // Verify JWT token - CHANGED SECRET KEY TO MATCH
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Authenticated, proceed
            } else {
                return res.status(403).json({message: "User not authenticated. Token verification failed."});
            }
        });
    } else {
        return res.status(403).json({message: "User not logged in. Please login first."});
    }
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
