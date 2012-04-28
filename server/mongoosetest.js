require('./mongoosetwo');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/my_database');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title     : String
  , body      : String
  , date      : Date
});

var BlogPost = new Schema({
    author    : String
  , title     : String
  , body      : String
  , buf       : Buffer
  , date      : Date
  , comments  : [CommentSchema]
  , meta      : {
      votes : Number
    , favs  : Number
  }
});

var Post = mongoose.model('BlogPost', BlogPost);
var Comment = mongoose.model('Comment', CommentSchema);

Post.prototype.func = function() {
            return "Banana";
        }

Post.prototype.create = function() {
            this.title = "Watta";
            return this;
        }

var post1 = new Post().create();
//post1.title = 'hello';
var comment1 = new Comment();
comment1.title = "Test";
post1.kasse = "lasse";
post1.comments.push(comment1);
post1.save(function (err) {
  //
});


Post.find({}, function (err, docs) {
    docs.forEach(function(val) {
        console.log(val.title);
        if(val.comments.length > 0) {
            console.log(val.comments[0].title);
        }
    });
});

console.log(post1.func());
console.log("Kasse is " + post1.kasse);
