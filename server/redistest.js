var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});
var lars = "petter";
var userID = 0;
client.incr("global:nextUserID", function(err, userIDa) {
    console.log(err);
    console.log(userIDa);
    userID = userIDa;
    console.log(userID + " " + userIDa + " woow")
    client.hmset("user:" + userID, "userID", userID, "username", "lars petter", "password", "1230", function(err, obj1) {
         console.log(err);
         console.log(obj1);
         console.log("Looking for " + "user:" + userID)
         client.hgetall("user:" + userID, function (err, obj) {
             console.log(obj);
             client.quit();
         });
    });
});

//client.hmset("user:10010", "userID", "1", "username", "ABA", "password", "abcd");
//client.hgetall("user:10010", function (err, obj) {
//    console.log(obj.username);
//});
//client.hgetall("user:1001", function (err, obj) {
//    console.log(obj);
//});

