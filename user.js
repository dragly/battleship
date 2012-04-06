function User() {
    this.userID = 0;
    this.username = 0;
    this.password = 0;
    this.key = 0;
}

User.prototype.authData = function() {
            return {
                userID: this.userID,
                key: this.key
            }
        }
