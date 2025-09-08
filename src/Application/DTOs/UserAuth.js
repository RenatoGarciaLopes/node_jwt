// src/Application/DTOs/UserOutput.js
class UserAuth {
    constructor(user) {
      this.user = {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }
  }
  
  module.exports = UserAuth;