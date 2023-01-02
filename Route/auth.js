const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

//Register

router.post("/registers", (req,res) => {
    
try{
    //for keeping password encrypted...
    const salt =  bcrypt.genSaltSync(10);
    const hashedPassword =  bcrypt.hashSync(req.body.password,salt);

    //Syntax according to which user should be added in postman and detail of the send user will be stored in newUser variable...
    const newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }) 

    //user will save all the details...
    const user =  newUser.save();
    res.status(200);
    res.json(newUser);
}
catch(err){
    console.log(err)
}

})




//Login
router.post('/login', async (req,res) => {
    
    try{
        //Find if entered email exist in mongo or not...
        const user =await User.findOne({email:req.body.email});

        //Execute if entered email does not exist in mongo...and if entered email exist than goes to else block...
        if(!user){
            res.status(404).json(`User does not exist...`)
        }
        else{
            const validPassword = await bcrypt.compare(req.body.password,user.password)
            !validPassword && res.status(404).json("Your password is incorrect...")
        } 
        res.json(user);
           
    }
    catch(err){
        console.log(err);
    }   
})


module.exports = router