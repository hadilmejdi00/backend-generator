class UpdateUsers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, data) {
    return await this.userRepository.update(id, data);
  }
}

module.exports = UpdateUsers;