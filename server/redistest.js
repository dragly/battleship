var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

client.hmset("users:1000", "userID", "0", "username", "lars", "password", "1234");
client.hmset("user:1001", "userID", "1", "username", "kalle", "password", "abcd");
client.hgetall("user:1000", function (err, obj) {
    console.log(obj);
});
client.hgetall("user:1001", function (err, obj) {
    console.log(obj);
});
client.quit();
