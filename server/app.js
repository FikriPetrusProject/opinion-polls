require("dotenv").config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./routers/router');
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});