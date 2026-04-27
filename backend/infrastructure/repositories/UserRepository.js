const UserModel = require('../models/UserModel');
const User = require('../../domain/entities/User');

class UserRepository {
  async create(user) {
    const created = await UserModel.create(user);
    return new User({ id: created._id.toString(), ...created.toObject() });
  }

  async findAll() {
    const users = await UserModel.find();
    return users.map(u => new User({ id: u._id.toString(), ...u.toObject() }));
  }

  async findById(id) {
    const u = await UserModel.findById(id);
    if (!u) return null;
    return new User({ id: u._id.toString(), ...u.toObject() });
  }

  async findByEmail(email) {
    const u = await UserModel.findOne({ email });
    if (!u) return null;
    return new User({ id: u._id.toString(), ...u.toObject() });
  }

  async update(id, data) {
    const u = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!u) return null;
    return new User({ id: u._id.toString(), ...u.toObject() });
  }

  async delete(id) {
    const u = await UserModel.findByIdAndDelete(id);
    if (!u) return null;
    return { message: 'User deleted' };
  }
}

module.exports = UserRepository;
