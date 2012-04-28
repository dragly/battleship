var redis = require("redis"),
    client = redis.createClient();

var User = require("./user").User;
var ObjectHelper = require("../shared/objecthelper").ObjectHelper;

function UserManager() {
    this.users = new Array();
    this.currentUserID = 0;
}

UserManager.prototype.addUser = function(mycallback) {
    var user = new User();
    client.incr("global:nextUserID", function(err, userID) {
        user.userID = userID;
        client.set("user:" + userID, JSON.stringify(user), function(err, response) {
            mycallback(user);
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
    client.get("user:" + userID, function(err, userData) {
        console.log(err);
        console.log("Found " + userData);
        var user = new User();
        ObjectHelper.copyDataToObject(JSON.parse(userData), user);
        mycallback(err, user);
    });
}

exports.UserManager = UserManager;
