const UserRepository = require('../../infrastructure/repositories/UserRepository');
const CreateUser = require('../../application/usecases/CreateUser');
const GetAllUsers = require('../../application/usecases/GetAllUsers');
const GetByIdUsers = require('../../application/usecases/GetByIdUsers');
const UpdateUsers = require('../../application/usecases/UpdateUsers');
const DeleteUsers = require('../../application/usecases/DeleteUsers');

const userRepository = new UserRepository();

exports.createUser = async (req, res) => {
    try {
        const usecase = new CreateUser(userRepository);
        const user = await usecase.execute(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const usecase = new GetAllUsers(userRepository);
        const user = await usecase.execute();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getByIdUsers = async (req, res) => {
    try {
        const usecase = new GetByIdUsers(userRepository);
        const user = await usecase.execute(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUsers = async (req, res) => {
    try {
        const usecase = new UpdateUsers(userRepository);
        const user = await usecase.execute(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUsers = async (req, res) => {
    try {
        const usecase = new DeleteUsers(userRepository);
        const result = await usecase.execute(req.params.id);
        if (!result) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
