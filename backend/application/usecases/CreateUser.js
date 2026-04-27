const User = require('../../domain/entities/User');

class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(data) {
    const user = new User(data);
    user.validate();
    return await this.userRepository.create(user);
  }
}

module.exports = CreateUser;