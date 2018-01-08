"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = (function () {
    function User(username, password, connectionLink) {
        this.username = username;
        this.password = password;
        this.connectionLink = connectionLink;
        this.username = username;
        this.password = password;
        this.connectionLink = connectionLink;
    }
    User.prototype.getUsername = function () {
        return this.username;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.getConnectionLink = function () {
        return this.connectionLink;
    };
    User.prototype.setConnectionLink = function (connectionLink) {
        this.connectionLink = connectionLink;
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.model.js.map