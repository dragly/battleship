var User = require("./user").User;

function UserManager() {
    this.users = new Array();
    this.currentUserID = 0;
}

UserManager.prototype.addUser = function() {
            var user = new User();
            user.userID = this.currentUserID;
            user.password = "12345";
            this.users[this.currentUserID] = user;
            this.currentUserID++;
            return user;
        }

UserManager.prototype.findUserByID = function(userID) {
            return this.users[userID];
            // SLOW MODE:
//            for(var i = 0; i < this.users.length; i++) {
//                var user = users[i];
//                if(user.userID === userID) {
//                    return user;
//                } else {
//                    return null;
//                }
//            }
        }

exports.UserManager = UserManager;
