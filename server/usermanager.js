var User = require("./user").User;
var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

function UserManager() {
    this.users = new Array();
    this.currentUserID = 0;
}

UserManager.prototype.addUser = function(callback) {
    client.incr("userid");
    client.get("userid", function(err, userid) {
	console.log("Created user " + userid);
	client.hmset("user:" + userid, "password", "12345", "username", "todo", "userID", userid);
	client.hgetall("user:" + userid, function(err, user) {
	    callback(user);
	});
    });
}

UserManager.prototype.auth = function (userID, key, callback) {
    if (userID === undefined || userID < 0) {
        callback(false);
    }

    this.findUserByID(userid, function(user) {
	if(user === null) {
	    callback(false);
	} else {
	    callback(true);
	}
    });
}

UserManager.prototype.findUserByID = function (userID, callback) {
    if (userID === undefined || userID < 0) {
        callback(null);
    }
    client.hgetall("user:" + userID, function(err, user) {
	callback(user);
    });
}

exports.UserManager = UserManager;
