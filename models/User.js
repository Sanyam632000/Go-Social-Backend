const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        min:5,
        max:50
    },

    email:{
        type:String,
        require:true,
        unique:true,
        min:8,
    },

    password:{
        type:String,
        require:true,
        min:6,
    },

    profilePicture:{
        type:String,
        default:"https://media.istockphoto.com/vectors/missing-image-of-a-person-placeholder-vector-id1288129985?k=20&m=1288129985&s=612x612&w=0&h=OHfZHfKj0oqIDMl5f_oRqH13MHiB63nUmySYILbWbjE="
    },

    follower:{
        type:Array,
        default:[]
    },

    following:{
        type:Array,
        default:[]
    },

    savedPost:{
        type:Array,
        default:[]
    },

    isAdmin:{
        type:Boolean,
        default:false
    },
    
    description:{
        type:String,
    },

    birthday:{
        type:String,
    },

    city:{
        type:String
    },

    relationship:{
        type:Number,
        enum:[1,2,3]
    }

    
},
    {timestamps:true}
)



module.exports = mongoose.model("User",UserSchema);

