var redis = require("redis"),
    client = redis.createClient();

var User = require("./user").User;

function UserManager() {
    this.users = new Array();
    this.currentUserID = 0;
}

UserManager.prototype.addUser = function(mycallback) {
    client.incr("global:nextUserID", function(err, userID) {
        client.hmset("user:" + userID, "userID", userID, "username", "newUser", "password", "12345", function(err, user) {
            client.hgetall("user:" + userID, function(err, user) {
                mycallback(user);
            });
        });
    });
}

UserManager.prototype.auth = function (userID, key) {
    if (userID === undefined || userID < 0 || userID >= this.users.size)
        return false;

    if (this.findUserByID().key === key)
        return true;
    else 
        return false;
}

UserManager.prototype.findUserByID = function (userID, mycallback) {
    if (userID === undefined || userID < 0 || userID >= this.users.size)
        return null;
    client.hgetall("user:" + userID, function(err, user) {
        console.log(err);
        mycallback(err, user);
    });
}

exports.UserManager = UserManager;
