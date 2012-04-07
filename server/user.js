function User() {
    this.userID = 0;
    this.username = "";
    this.password = "";
    this.key = "";
}

User.prototype.auth = function (userID, key) {
    return (userID === this.userID && key === this.key);
}
User.prototype.generateRandomKey = function () {
    return "4";   // chosen by fair dice roll.
    // guaranteed to be random.
}

exports.User = User;
