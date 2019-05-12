var express     = require("express"),
    app         = express();
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Photo       = require("./models/photo"),
    Comment     = require("./models/comment")
    User        = require("./models/user"),
    methodOverride = require("method-override");

//requring routes
var indexRoutes      = require("./routes/index"),
    photoRoutes      = require("./routes/photos"),
    userRoutes       = require("./routes/user"),
    commentRoutes    = require("./routes/comment")
    likeRoutes       = require("./routes/like");

mongoose.connect("mongodb://localhost/instagram-v2", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Authenticate is importane",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error   = req.flash("error");
    res.locals.success  = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/photos", photoRoutes);
app.use("/users",userRoutes);
app.use("/photos/:id/comments", commentRoutes);
app.use("/photos/:id/likes", likeRoutes);


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening");
})
