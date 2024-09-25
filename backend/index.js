const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const dbConnect = require("./config/dbConfig");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");

const blogRouter = require("./routes/blogRoute");

const enqRouter = require("./routes/enqRoute");

const uploadRouter = require("./routes/uploadRoute");

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");




dbConnect();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("path " + req.path + " method " + req.method);
  next();
});

app.use("/api/user", authRouter);

app.use("/api/blog", blogRouter);


app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);


app.use(notFound);
app.use(errorHandler);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); 







 

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});


