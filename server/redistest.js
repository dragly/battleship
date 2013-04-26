var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

// client.set("userid", 0);
client.incr("userida");
client.get("userida", function(err, obj) {
    console.log(obj);
});
client.hmset("user:1000", "userID", "0", "username", "lars", "password", "1234");
client.hmset("user:1001", "userID", "1", "username", "kalle", "password", "abcd");
client.hmset("user:1002", "userID", "2", "username", "per", "password", "abcd");
client.hgetall("user:1000", function (err, obj) {
    console.log(obj);
});
client.hgetall("user:1004", function (err, obj) {
    console.log(obj);
});
client.hgetall("user:1002", function (err, obj) {
    console.log(obj.username);
});
client.quit();
