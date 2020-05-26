import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let listProvider: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvider = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'André',
      email: 'andre@hotmail.com',
      password: '1234',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'André Luiz',
      email: 'andre2@hotmail.com',
      password: '12345',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'André Luiz Pedro',
      email: 'andre2@hotmail.com',
      password: '123456',
    });

    const providers = await listProvider.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
