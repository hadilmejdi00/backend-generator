class UpdateUserDto {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  validate() {
    if (this.email && !this.email.includes('@')) throw new Error('Email is invalid');
    if (this.password && this.password.length < 6) throw new Error('Password must be at least 6 characters');
  }
}

module.exports = UpdateUserDto;