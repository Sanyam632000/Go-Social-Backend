const Message = require("../models/Message.js")
const Conversation = require("../models/Conversation.js")
const User = require("../models/User.js");
const { rawListeners } = require("../models/Conversation.js");
const router = require("express").Router();

//Post messages




//Post Messages

router.post("/", async(req,res) =>{
    const newMessage = new Message(req.body)

    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }
    catch(err){
        res.status(500).json(err)
    }
})


//GEt Messages

router.get("/getMessage/:chat_id", async(req,res) => {
    try{
        const message = await Message.find({
            chatId:req.params.chat_id
        })
        res.status(200).json(message)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router