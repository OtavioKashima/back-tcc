const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const usuariosRoute = require('./routes/usuarios.route');
const filasRoute = require('./routes/filas.route');
const notificationRoute = require("./routes/notification.route");
const brinquedosRoute = require("./routes/brinquedos.route");

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE");
    }

    next();

});

app.use("/user", userRoute);
app.use("/login", loginRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);

module.exports = app;