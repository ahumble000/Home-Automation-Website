import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose.connect("mongodb://127.0.0.1:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Home_Automation',
})
  .then(() => console.log("Database is connected."))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required : true,
  },

  email: {
    type : String,
    required : true,
    unique : true,
    trim : true,
    lowercase : true,
    match: /^\S+@\S+\.\S+$/,
  },

  password: {
    type : String,
    required : true,
  },
});

const User = mongoose.model('UserData', userSchema);

const app = express();

app.set("view engine", "ejs");
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const isAuthenticated = async (req, res, next) => {

    try {
    
        const { token } = req.cookies;
        if (!token) {
          throw new Error("Token is missing.");
        }
    
        const decoded = jwt.verify(token, "adghaifbfasdj");
        req.user = await User.findById(decoded._id);
    
        next();
      }
      
      catch (error) {
        console.error("Authentication error : ", error.message);
        return res.redirect("/login");
      }

};
  
app.get("/", isAuthenticated, (req, res) => {
  res.render("index",{name : req.user.name});
});


app.get("/register",(req, res) => {
  res.render("register");
});
app.get("/login",(req, res) => {
  res.render("login");
});
app.get("/forgetpass",(req, res) => {
  res.render("forgetpass");
});


app.get('/index2', (req, res) => {
  res.render('index2');
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
  
    let user = await User.findOne({email});
    if(user)  return res.redirect("/login");

    let userName = await User.findOne({name});
    if(userName)  return res.render("register",{email : email,errorMessage : "User name already taken"});
         
    const hashPassword = await bcrypt.hash(password,10);
  
    user = await User.create({ name, email, password : hashPassword, });
  
    const token = jwt.sign({ _id: user._id }, "adghaifbfasdj");
    console.log(token);
  
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 600000 * 100000000),
    });
  
    res.redirect("/");
  }
    
  catch (error) {
    console.error("User creation error : ", error.message);
    res.render("login");
  }
  
});

app.post("/login", async (req, res) => {

  try {
    const {email, password } = req.body;

    let user = await User.findOne({email});
 
    if(!user)   return res.redirect("/register");

    const isMatch = await bcrypt.compare(password,user.password);  
         
    if(!isMatch)  return res.render("login",{email : email ,errorMessage : "Please enter correct password!"})

    const token = jwt.sign({ _id: user._id }, "adghaifbfasdj");
    console.log(token);
    
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 600000 * 100000000),
    });
    
    res.redirect("/");
  }
  
  catch (error) {
    console.error("User login error : ", error.message);
    return res.render("login");
  }
  
});

app.post("/forgetpass", async (req, res) => {
  try {
    const { email, password } = req.body;
  
    let user = await User.findOne({email});
    if(!user)  return res.redirect("/register");
         
    const hashPassword = await bcrypt.hash(password,10);
  
    user = await User.findOneAndUpdate({email},{$set : { password : hashPassword, }});
  
    res.redirect("/login");
  } 

  catch (error) {
    console.error("Passward Update Error : ", error.message);
    res.render("login");
  }
  
});
app.get("/index", (req,res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    console.log(req.cookies);
    res.redirect('/');
});

const PORT = 2000;
app.listen(PORT, () => console.log('Server is working.'));