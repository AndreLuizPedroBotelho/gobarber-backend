import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'André',
      email: 'andre@hotmail.com',
      password: '1234',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'André Teste',
      email: 'andre3@hotmail.com',
    });

    expect(updateUser.name).toBe('André Teste');
    expect(updateUser.email).toBe('andre3@hotmail.com');
  });

  it('should not be able to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'André',
      email: 'andre@hotmail.com',
      password: '1234',
    });

    const user = await fakeUsersRepository.create({
      name: 'André Luiz',
      email: 'andre5@hotmail.com',
      password: '1234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'André',
        email: 'andre@hotmail.com',
        old_password: '1234',
        password: '12345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'André',
      email: 'andre@hotmail.com',
      password: '1234',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'André Teste',
      email: 'andre3@hotmail.com',
      old_password: '1234',
      password: '12345',
    });

    expect(updateUser.password).toBe('12345');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'André',
      email: 'andre@hotmail.com',
      password: '1234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'André',
        email: 'andre@hotmail.com',
        password: '12345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'André',
      email: 'andre@hotmail.com',
      password: '1234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'André',
        email: 'andre@hotmail.com',
        password: 'wrong-old-password',
        old_password: '12345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able update the profile from no-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existind-id',
        name: 'André',
        email: 'andre@hotmail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
