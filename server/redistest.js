var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

// client.set("usergames:" + 1, "notset");
client.del("usergames:" + 1, 1);
client.lrange("usergames:" + 1, 0, -1, function(err, obj) {
    console.log(obj);
});

client.quit();
