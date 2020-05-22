var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSantizer = require('express-sanitizer');

//App config
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSantizer());
app.use(methodOverride("_method")); 

// Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
//     body: "Hi this is test blog.",
// });


//RESTful Routes
app.get("/",function(req,res){
    res.redirect("/blog");
});

// INDEX Route
app.get("/blog",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});

// NEW Route
app.get("/blog/new",function(req,res){
    res.render("new");
});

// CREATE Route
app.post("/blog",function(req,res){
    // sanitize the input
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //create blog
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            //render a new form page.
            res.render("new");
        }
        else{
            //then, redirect to blog page
            res.redirect("/blog");
        }
    });
});


// SHOW Route
app.get("/blog/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blog")
        }
        else{
            res.render("show",{blog: foundBlog});
        }
    })
});

// EDIT Route
app.get('/blog/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
})

// UPDATE Route
app.put('/blog/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blog")
        }else{
            res.redirect("/blog/"+req.params.id);
        }
    })
})

// DELETE Route
app.delete('/blog/:id',function(req,res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog");
        }
    })
})

app.listen(3000,function(){
    console.log("Server is running")
});
