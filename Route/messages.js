const Message = require("../models/Message.js")
const Conversation = require("../models/Conversation.js")
const User = require("../models/User.js");
const { rawListeners } = require("../models/Conversation.js");
const router = require("express").Router();

//Post messages
/*router.post("/:id", async(req,res) => {

   

    try{
        const sender = await User.findById(req.params.id)
        const receiver = await User.findById(req.body.receiverId)

        if(sender && receiver){

            
            


            const newMessage = new Message({
                senderId: req.params.id,
                receiverId: req.body.receiverId,
                text: req.body.text,
                chatId: req.params.id+""+req.body.receiverId
            })  

            const fixed_chat
          
            const conversation = await Conversation.find({
                members: [req.params.id,req.body.receiverId] 
              });

            const for_chat_ID = await Conversation.find({
                members:{$all:[req.params.id,req.body.receiverId]}
            })
             
            if(conversation.length == 0){

                const newConversation = new Conversation({
                    members:[req.params.id, req.body.receiverId],
                    chatId: req.params.id + Date.now()
                    })
                const conversation = await newConversation.save();

            }

            

            
            

            const message = await newMessage.save();
            res.status(200).json(for_chat_ID.length);
            
        }
    }
    catch(err){
        res.status(500).json(err)
    }

    
    


   
})*/



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