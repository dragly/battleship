var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});
var lars = "petter";
var userID = 0;
//client.incr("global:nextUserID", function(err, userIDa) {
//    console.log(err);
//    console.log(userIDa);
//    userID = userIDa;
//    console.log(userID + " " + userIDa + " woow")
//    client.hmset("user:" + userID, "userID", userID, "username", "lars petter", "password", "1230", function(err, obj1) {
//         console.log(err);
//         console.log(obj1);
//         console.log("Looking for " + "user:" + userID)
//         client.hgetall("user:" + userID, function (err, obj) {
//             console.log(obj);
//             client.quit();
//         });
//    });
//});

function Banana() {
    this.x = 2;
    this.y = 3;
}
Banana.prototype.test = function() {
    console.log("Tatata");
}

var banana = new Banana();
var banana2 = new Banana();
banana2.y = 44;
var keys = Object.keys(banana);
console.log(banana);
console.log(banana2);
for(var i = 0; i < keys.length; i++) {
    banana[keys[i]] = banana2[keys[i]] ;
}
console.log(banana);
console.log(banana2);

console.log(JSON.stringify(banana));

//client.hset("user:1000",
//    "userID", 100,
//    "player0data", JSON.stringify({
//        userID: 100,
//        boatMask: 5,
//    }),
//    function(err, obj) {
//    client.hgetall("testing", function(err, game) {
//        console.log(JSON.parse(game.player0data).userID);
//    });
//});

//client.hmset("user:10010", "userID", "1", "username", "ABA", "password", "abcd");
//client.hgetall("user:10010", function (err, obj) {
//    console.log(obj.username);
//});
//client.hgetall("user:1001", function (err, obj) {
//    console.log(obj);
//});

