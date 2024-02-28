var mongoose=require("mongoose");
var plm=require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pin");

const userSchema=mongoose.Schema({
  username:String,
  email:String,
  contact:Number,
  password:String,
  profileImg:String,
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"post"
    }
  ],
  boards:{
    type:Array,
    default:[]
  }
})
userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);