const CreateUser = require('../application/usecases/CreateUser');
const GetAllUsers = require('../application/usecases/GetAllUsers');
const GetByIdUsers = require('../application/usecases/GetByIdUsers');
const UpdateUsers = require('../application/usecases/UpdateUsers');
const DeleteUsers = require('../application/usecases/DeleteUsers');

const mockUserRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

describe('User UseCases', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('CreateUser - doit créer un utilisateur', async () => {
    const userData = { name: 'Hadil', email: 'hadil@test.com', password: '123456' };
    mockUserRepository.create.mockResolvedValue(userData);

    const usecase = new CreateUser(mockUserRepository);
    const result = await usecase.execute(userData);

    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(userData);
  });

  test('GetAllUsers - doit retourner tous les utilisateurs', async () => {
    const users = [
      { name: 'Hadil', email: 'hadil@test.com' },
      { name: 'Ahmed', email: 'ahmed@test.com' }
    ];
    mockUserRepository.findAll.mockResolvedValue(users);

    const usecase = new GetAllUsers(mockUserRepository);
    const result = await usecase.execute();

    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
  });

  test('GetByIdUsers - doit retourner un utilisateur par ID', async () => {
    const user = { name: 'Hadil', email: 'hadil@test.com' };
    mockUserRepository.findById.mockResolvedValue(user);

    const usecase = new GetByIdUsers(mockUserRepository);
    const result = await usecase.execute('123');

    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(user);
  });

  test('UpdateUsers - doit modifier un utilisateur', async () => {
    const updated = { name: 'Hadil Updated', email: 'hadil@test.com' };
    mockUserRepository.update.mockResolvedValue(updated);

    const usecase = new UpdateUsers(mockUserRepository);
    const result = await usecase.execute('123', updated);

    expect(mockUserRepository.update).toHaveBeenCalledWith('123', updated);
    expect(result).toEqual(updated);
  });

  test('DeleteUsers - doit supprimer un utilisateur', async () => {
    mockUserRepository.delete.mockResolvedValue({ message: 'User deleted' });

    const usecase = new DeleteUsers(mockUserRepository);
    const result = await usecase.execute('123');

    expect(mockUserRepository.delete).toHaveBeenCalledWith('123');
    expect(result).toEqual({ message: 'User deleted' });
  });

});