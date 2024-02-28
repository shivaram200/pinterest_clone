var express = require('express');
var router = express.Router();
var userModel=require("./users");
var postModel=require("./posts");
const passport = require('passport');
var localStrategy=require('passport-local');
var upload=require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{val:false});
});
router.get('/register', function(req, res, next) {
  res.render('signup',{val:false});
});

router.get("/profile",isLoggedIn,async function(req,res){
  var user=await userModel.findOne({username:req.session.passport.user}).populate("posts");
  // console.log(user)
  res.render('profile',{user,val:true});
})

router.get("/uploadpost",isLoggedIn,function(req,res){
  res.render('createpost',{val:true});
})

router.get('/show/posts',isLoggedIn,async function(req,res){
  let user=await userModel.findOne({username:req.session.passport.user}).populate("posts");
  // let posts=postModel.find().populate("user");
  res.render("showPosts",{user,val:true});
})

router.post("/createpost",isLoggedIn,upload.single('post'),async function(req,res){
  let user=await userModel.findOne({username:req.session.passport.user});
  let post= await postModel.create({
    image:req.file.filename,
    user:user._id,
    title:req.body.title,
    description:req.body.desc
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
})

router.get("/feed",isLoggedIn,async function(req,res){
  let user=await userModel.findOne({username:req.session.passport.user});
  let posts=await postModel.find().populate("user");
  res.render('feed',{user,posts,val:true});

})

router.post("/uploaddp",isLoggedIn,upload.single('dp'),async function(req,res){
  let user = await userModel.findOne({username:req.session.passport.user});
  user.profileImg=req.file.filename;
  await user.save();
  res.redirect('/profile');
 
})

router.post("/register",function(req,res){
  // {username,email,contact} = req.body;
  const data=new userModel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact
  });
  userModel.register(data,req.body.password).then(function(registereduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect("/profile");
    })
  })
})

// router.post('/register',function(req,res){
//   var userData=new userModel({
//     username:req.body.username,
//     secret:req.body.secret
//   });
//   userModel.register(userData,req.body.password).then(function(registereduser){
//     passport.authenticate('local')(req,res,function(){
//       res.redirect("/profile");
//     })
//   })
// })

router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res){})

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if (err) { return next(err);}
    res.redirect('/');
  })
})

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
