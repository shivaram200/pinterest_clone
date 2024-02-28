const mongoose=require("mongoose");

const postSchema=mongoose.Schema({

    image:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:String,
    description:String,

})

module.exports=mongoose.model("post",postSchema);