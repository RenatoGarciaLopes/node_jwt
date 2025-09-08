// src/Application/UseCases/Auth/RegisterUser.js
const User = require('src/Domain/User/User');
const UserAuth = require('src/Application/DTOs/UserAuth');
const UserAlreadyExistsException = require('src/Domain/Exceptions/UserAlreadyExistsException');

class RegisterUser {
  constructor (userRepository) {
    this.userRepository = userRepository; // IUserRepository
  }

  async execute(input) { // input é RegisterUserInput
    const existingUser = await this.userRepository.findByEmail(input.email);
    
    if (existingUser) {
      throw new UserAlreadyExistsException('User with this email already exists.');
    }

    const user = new User (input.name, input.email, input.password);
    
    const savedUser = await this.userRepository.save(user);

    const outputUser = {
      id: savedUser.id || user.id,
      name: (savedUser.name && savedUser.name.value) || savedUser.name || (user.name && user.name.value) || user.name,
      email: (savedUser.email && savedUser.email.value) || savedUser.email || (user.email && user.email.value) || user.email,
    };

    return new UserAuth(outputUser);
  }
}

module.exports = RegisterUser;


