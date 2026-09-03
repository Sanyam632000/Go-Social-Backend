const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require('./Route/users.js')
const authRouter = require('./Route/auth.js')
const postRouter = require('./Route/posts.js')
const conversationRouter = require('./Route/conversations.js')
const messageRouter = require("./Route/messages.js")
const multer = require("multer")
const path = require("path")
var cors = require('cors')

dotenv.config();

const connectDB =async()=>{
    try{
      mongoose.connect(process.env.db).then(() => {
        console.log("Connected to database");
      });
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://go-social.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Set to true to prevent blocking during initial testing
      }
    },
    credentials: true,
  })
);

app.use("/image",express.static(path.join(__dirname,"public/image")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
//app.use(cors())

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,"public/image")
    },
    filename: (req,file,cb) =>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage});
app.post("/post/upload", upload.single("file"), (req,res) =>{
    try{
        return res.status(200).json("File upload successfully... ")
    }catch(err){
        console.log(err)
    }
})

// Root Health Check Route (Required for Render deployment checks)
app.get("/", (req, res) => {
  res.status(200).send("Go-Social Backend API is up and running!");
});

app.use("/",userRouter);
app.use("/",authRouter);
app.use("/post",postRouter);
app.use("/conversation",conversationRouter);
app.use("/message",messageRouter)

/*
app.use(express.static(path.join(__dirname, "/social_media_Frontend")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/social_media_Frontend/build', 'index.html'));
});
*/

app.listen(process.env.PORT || 3030,(req,res) => {
    console.log(`This is backend`)
})
