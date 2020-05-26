import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider
    );
  });
  it('should be able to list the appoitments on a specific day', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'André Luiz Pedro',
      email: 'andre2@hotmail.com',
      password: '123456',
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: loggedUser.id,
      user_id: loggedUser.id,
      date: new Date(2020, 5, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: loggedUser.id,
      user_id: loggedUser.id,
      date: new Date(2020, 5, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      month: 6,
      day: 20,
      provider_id: loggedUser.id,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
