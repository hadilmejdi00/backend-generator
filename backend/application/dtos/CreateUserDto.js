class CreateUserDto {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.name) throw new Error('Name is required');
    if (!this.email) throw new Error('Email is required');
    if (!this.email.includes('@')) throw new Error('Email is invalid');
    if (!this.password) throw new Error('Password is required');
    if (this.password.length < 6) throw new Error('Password must be at least 6 characters');
  }
}

module.exports = CreateUserDto;