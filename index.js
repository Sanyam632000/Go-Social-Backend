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
//const PORT = process.env.PORT || 8000

/*mongoose.connect(process.env.MONGO_URL, {useNewUrlParser : true,useUnifiedTopology: true,useCreateIndex: true,  }, (req,res) =>{
    console.log("MongoDB connected.")
})*/




//Youtube link to refer mongo connection....

const connectDB =async()=>{
    try{
        /*const con = mongoose.connect(process.env.MONGO_URL,{useNewUrlParser : true,useUnifiedTopology: true})
        console.log("Connected")*/

        const db = "mongodb+srv://Sanyam632000:Snp632000@cluster0.rl9zf.mongodb.net/Users?retryWrites=true&w=majority";
      mongoose.connect(db).then(() => {
        console.log("Connected to database");
      });
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

connectDB();

app.use("/image",express.static(path.join(__dirname,"public/image")));

//middleware
app.use(cors())
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

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

app.use("/",userRouter);
app.use("/",authRouter);
app.use("/post",postRouter);
app.use("/conversation",conversationRouter);
app.use("/message",messageRouter)


app.use(express.static(path.join(__dirname, "/social_media_Frontend")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/social_media_Frontend/build', 'index.html'));
});


app.listen(process.env.PORT || 3030,(req,res) => {
    console.log(`This is backend`)
})