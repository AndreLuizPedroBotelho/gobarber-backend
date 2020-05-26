import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;

let showProfile: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able  show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'André',
      email: 'andre@hotmail.com',
      password: '1234',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('André');
    expect(profile.email).toBe('andre@hotmail.com');
  });

  it('should not be able show the profile from no-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existind-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
