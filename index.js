import express from 'express';
import cors from 'cors';

import userRoute from './routes/user.route.js';
import commentRoute from './routes/comment.js';
import postRoute from "./routes/post.route.js";

const app = express();

app.use(cors());    

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
app.use("/post", postRoute);
app.use("/comment", commentRoute);

export default app;