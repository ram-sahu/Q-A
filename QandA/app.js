var express       = require("express"),
    app           = express(),
    mongoose      = require("mongoose"),
    bodyParser    = require("body-parser"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    path            = require("path"),
    crypto          = require("crypto"),
    multer          = require("multer"),
    GridFsStorage   = require("multer-gridfs-storage"),
    Grid            = require("gridfs-stream");

var questionRoutes   = require("./routes/questions"),
    answerRoutes     = require("./routes/answers"),
    indexRoutes      = require("./routes/index"),
    profileRoutes    = require("./routes/profile");
    
app.use(require("express-session")({
    secret: "This is the Minor Project - Q&A",
    resave: false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});
app.use(express.static(__dirname + "/public"));
    
mongoose.connect("mongodb://hatim:hatim123@ds117868.mlab.com:17868/q_and_a",{useNewUrlParser: true});   
//mongoose.connect("mongodb://localhost:27017/QandA",{useNewUrlParser: true});
const conn = mongoose.createConnection("mongodb://hatim:hatim123@ds117868.mlab.com:17868/q_and_a",{useNewUrlParser: true});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(questionRoutes);
app.use(answerRoutes);
app.use(indexRoutes);
app.use(profileRoutes);

let gfs;

//Init Stream
conn.once('open' ,function(){
   gfs = Grid(conn.db ,mongoose.mongo);
   gfs.collection("uploads");
});

//Create Storage Engine

const storage = new GridFsStorage({
    url: "mongodb://hatim:hatim123@ds117868.mlab.com:17868/q_and_a",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

app.post("/questions/:userid/questions/:id/profile" , upload.single("file") , function(req,res){
    User.findById(req.params.userid ,function(err ,user){
        if(err){
            console.log("error");
        }else{
            user.profilePhoto = req.file.filename;
            user.save();
            res.redirect("back");
        }
    })
    
});

app.get("/questions/profile/:filename",function(req,res){
    gfs.files.findOne({filename: req.params.filename}, function(err , file){
        if(err){
            console.log(err);
        }else if(!file || file.length == 0 ){
            return res.status(404).json({
              err: "NO such file" 
            });
        }
        //Check if image
        if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
            //Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }else{
            res.status(404).json({
                err: "not an image"
            }); 
        }
    });
});

app.listen(process.env.PORT ,process.env.IP ,function(){
   console.log("Server Started !"); 
});