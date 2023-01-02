const User = require("../models/User.js")
const router = require("express").Router();
const bcrypt = require("bcrypt");
const Post = require("../models/Post.js");
const { find, findById } = require("../models/User.js");


//update user
router.put('/:id', async (req,res) => {

    //Will compare userId entered in json format in postman and param id and if it is equal then only it will work...
    if(req.body.userId === req.params.id || req.user.isAdmin){

        //If password is changed then new hash password get created...
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            catch(err){
                res.status(500).json(err)
            }
        }

        //Find param id in mongo and update mongo data with our postman data
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body
            })

            res.status(200).json("Account has been successfully updated...")
        }
        catch(err){
            res.status(500).json(err)
        }

    }
    else{
        res.status(403).json("You can only update your account...")
    }
})


//Delete User
router.delete('/:id', async(req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(`User is deleted successfully...`)
    }catch(err){
        res.status(404).json(err)
    }

})

//Get All user in database
router.get('/get_all_users', async(req,res) =>{
    try{
        User.find({}, function (err, users) {
          /*  const len = users.length
            const total_users = new Array(len);
            for(var i=0;i<len;i++){
                total_users[i] = users[i].username
            }
            res.json(total_users)*/
                res.json(users)
        });
    }
    catch(err){
        res.status(401).json(err)
    }
})

//Get All user in database
router.get('/:id/get_suggested_friend', async(req,res) =>{
    

    try{
    const suggested_friends = new Array();
    var index = 0;   
    const user =  await User.findById(req.params.id)
    const num_of_following = user.following.length;
    const userfollowing = new Array(num_of_following);
    const userfollowing_name = new Array(num_of_following);
    const userfollowing_name_detail_id = new Array(num_of_following);
    const userfollowing_name_detail = new Array(num_of_following);
    for(var i=0;i<num_of_following;i++){
     userfollowing[i] = await User.findById(user.following[i])
     userfollowing_name[i] = userfollowing[i].username
     userfollowing_name_detail[i] = userfollowing[i]
     userfollowing_name_detail_id[i] = userfollowing_name_detail[i]._id
    }

     User.find({}, function (err, users) {
        const all_users_id = new Array(users.length);

        for(var i=0;i<users.length;i++){
            all_users_id[i] = users[i]._id
        }  

        for(var j=0;j<users.length;j++){
            if(!all_users_id.includes(users[j]._id)){
                suggested_friends[index] = users[j]._id;
                index++;
            }
            
        } 
    
        res.json(suggested_friends)    
    })
       
    
    }

    catch(err){
        res.status(401).json(err)
    }
})


//Get User
router.get('/:id', async(req,res) =>{
    try{
        const user = await User.find({_id:req.params.id});
        if(user){
            res.json(user)
        }
        else{
            res.status(300).json("NO user with this id found..")
        }

    }
    catch(err){
        res.status(400).json(err)
    }

})


/*Search User Based on name*/
router.get("/:name/search", async(req,res) =>{
    try{
        const user = await User.find({username:req.params.name})
         if(user){
           res.json(user)
         }
        else{
            res.status(300).json("NO user with this id found..")
        }
  
    }
    catch(err){
        res.status(400).json(err)
    }
  })


//Follow a User... Here req.body.userId(currentUser) will follow req.params.id(user)...
router.put('/:id/follow', async(req,res) =>{

    //checks if both id are different...
    if(req.body.userId !== req.params.id){

        try{

            //user stores params.id and currentUser stores body.userId...
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)

            //checks if user does not have currentUser in its followers list...
            if(!user.follower.includes(req.body.userId)){

                //user will add body.userId(currentUser) in its follower...
                await user.updateOne({$push:{follower : req.body.userId}})
                await currentUser.updateOne({$push:{following: req.params.id}})
                res.status(200).json("User has been followed...")
            }

            //If both id are same then it will execute else block...
            else{
                res.status(403).json("You are already following this user...")
            }

        }
        catch(err){
            res.status(404).json(err)
        }

    }
    //If both id are same then execute this else block...
    else{
        res.json("You cannot follow your account...")
    }
})

//Same as follow but insted of push it is pull....
//UnFollow a User... Here req.body.userId(currentUser) will unfollow req.params.id(user)...
router.put('/:id/unfollow', async(req,res) =>{

    if(req.body.userId !== req.params.id){
        try{
           const user = await User.findById(req.params.id)
           const currentUser = await User.findById(req.body.userId)
           if(user.follower.includes(req.body.userId)){
                await user.updateOne({$pull: {follower:req.body.userId}})
                await currentUser.updateOne({$pull: {following: req.params.id}})
                res.status(200).json("User has been unfollowed...")
           }
           else{
               res.json("To unfollow this user, first you need to follow the user...")
           }
        }
        catch(err){
            res.status(400).json(err)
        }
    }
    else{
        res.json("You cannot unfollow yourself...")
    }

})

//Get Followers...
router.get("/:id/getfollowers", async(req,res) =>{
    try{

        //user will store user of params.id... and num_of_follower will store number of followers user has...
        const user = await User.findById(req.params.id)
        const num_of_follower = user.follower.length;

        //We make two array... First array will store all users with follower id ...second array will store followers username...
        const userfollowers = new Array(num_of_follower);
        const userfollowers_name = new Array(num_of_follower);

        for(var i=0;i<num_of_follower;i++){
         userfollowers[i] = await User.findById(user.follower[i])
         userfollowers_name[i] = userfollowers[i].username
        }

       res.json(user.username+" has "+num_of_follower+" followers:  "+ userfollowers_name)
    }
    catch(err){
        res.status(404).json(err)
    }
})


//Get Following...
router.get("/:id/getfollowing", async(req,res) =>{
    try{
        const user = await User.findById(req.params.id)
        const num_of_following = user.following.length;

        const userfollowing = new Array(num_of_following);
        const userfollowing_name = new Array(num_of_following);
        const userfollowing_name_detail = new Array(num_of_following);

        for(var i=0;i<num_of_following;i++){
         userfollowing[i] = await User.findById(user.following[i])
         userfollowing_name[i] = userfollowing[i].username
         userfollowing_name_detail[i] = userfollowing[i]

        }

        res.json(userfollowing_name_detail)
    }
    catch(err){
        res.status(404).json(err)
    }
})



/* Suggested Friends... */
router.get("/:id/suggestFriends" ,async(req,res) =>{
    const user = await User.findById(req.params.id)
     
})


/* Get User's all post*/ 

router.get("/:id/getmypost", async(req,res) => {
    const user = await User.findById(req.params.id)
    const post = await Post.find({userId:req.params.id})
    try{
        if(post){
            res.json(post)
        } 
        else{
            res.json("You have no post yet...")
        }
    }
    catch(err){
        res.status(404).json(err)
    }
})

//Get BirthDay Boy
router.get("/get/birthday_boy", async(req,res)=>{
    var d = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
   // console.log((d.getDate()+" "+ monthNames[d.getMonth()]) )
   try{
    const user = await User.find({birthday:d.getDate()+" "+ monthNames[d.getMonth()]})
    if(user){
        res.status(200).json(user)
    }
    else{
        res.status(200).json('No Birthday Today')
    }
    
   }
   catch(err){
       res.status(406).json(err)
   }
    

})

module.exports = router
