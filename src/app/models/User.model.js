"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(username, password, connectionLink) {
        this.username = username;
        this.password = password;
        this.connectionLink = connectionLink;
        this.username = username;
        this.password = password;
        this.connectionLink = connectionLink;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getConnectionLink() {
        return this.connectionLink;
    }
    setConnectionLink(connectionLink) {
        this.connectionLink = connectionLink;
    }
}
exports.User = User;
//# sourceMappingURL=User.model.jsdel.js.map
