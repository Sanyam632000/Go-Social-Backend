const router = require("express").Router();
const Post = require("../models/Post.js");
const User = require("../models/User.js");

//Create A Post...
router.post("/create", async(req,res) =>{
    const newPost = await new Post(req.body);

    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        res.status(404).json(err);
    }
})


//Update Post
router.put("/:id", async(req,res) =>{
    try{
        if(req.body.user_Id === req.params.id){
            const post = await Post.findByIdAndUpdate(req.params.id,{$set:req.body})
            res.status(200).json("Your post has been updated...")
        }
        else{
            res.json("You can only update your account...")
        }
    }
    catch(err){
        res.status(404).json(err)
    }
    
})

//Delete Post
/*router.delete("/:id", async(req,res) =>{
    try{
        if(req.body.userId === req.params.id){
            const post = await Post.findByIdAndDelete(req.params.id)
            res.status(200).json("Your post has been deleted...")
        }
        else{
            res.json("You can only delete your posts....")
        }
    }
    catch(err){
        res.status(404).json(err)
    }
    
})*/

router.delete('/:id', async(req,res) => {
    try{
        const post = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json(`Post is deleted successfully...`)
    }catch(err){
        res.status(404).json(err)
    }
    
})


//Like and Dislike Post
router.put("/:id/like", async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.like.includes(req.body.userId)){
            await post.updateOne({$push:{like:req.body.userId}})
            res.status(200).json("Your post has been liked...")
        }
        else{
             await post.updateOne({$pull:{like:req.body.userId}})
             res.status(200).json("Your post has been disliked.... ")
        }
    }
    catch(err){
        res.status(404).json(err)
    }
})

//Get a Post
router.get("/:id", async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch(err){
        res.status(404).json(err)
    }
})


//Get post of a user
router.get("/user/:id", async(req,res) =>{
    try{
        const post = await Post.find({userId:req.params.id})
        res.status(200).json(post)
    }
    catch(err){
        res.status(404).json(err)
    }
})

//
router.get("/user_name/:username", async(req,res) =>{
    try{
        const user = await User.find({username:req.params.username})
        
       // const post = await Post.findById(id)
        res.status(200).json(user)
    }
    catch(err){
        res.status(404).json(err)
    }
})



//Get Timeline
router.get("/timeline/:userId", async(req,res) =>{
    try{
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({userId : currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        res.json(userPosts.concat(...friendPosts))
    }
    catch(err){
        res.status(500).json(err)
    }
})

//save and unsave post... params.id is for user...and userId is for post... So user(params.id) saves post(userId)
router.put("/:id/save", async(req,res) =>{
    try{

        const user = await User.findById(req.params.id)
        const post = await Post.findById(req.body.userId)
        if(!user.savedPost.includes(req.body.userId)){
            await user.updateOne({$push:{savedPost:req.body.userId}})
            res.status(200).json("Your post has been saved...")
        }
        else{
             await user.updateOne({$pull:{savedPost:req.body.userId}})
             res.status(200).json("Your post has been removed from save.... ")
        }

    }
    catch(err){
        res.status(404).json(err)
    }
   
})

//GEt Save Post
router.get("/:id/getsave", async(req,res) =>{
    try{
        const user = await User.findById(req.params.id)
        const num_of_savePost = user.savedPost.length;

        
        const userSavePost = new Array(num_of_savePost);
        const userSavePost_description = new Array(num_of_savePost);

        for(var i=0;i<num_of_savePost;i++){
         userSavePost[i] = await Post.findById(user.savedPost[i])
         userSavePost_description[i] = userSavePost[i].description 
        }

       res.json(userSavePost_description)   
    }
    catch(err){
        res.status(404).json(err)
    }
})



module.exports = router