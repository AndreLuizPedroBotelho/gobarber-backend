import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });
  it('should be able to list the month availability from providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'André Luiz Pedro',
      email: 'andre2@hotmail.com',
      password: '123456',
    });

    await fakeAppointmentsRepository.create({
      provider_id: loggedUser.id,
      user_id: loggedUser.id,
      date: new Date(2020, 5, 20, 8, 0, 0),
    });

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );

    for await (const value of eachHourArray) {
      fakeAppointmentsRepository.create({
        provider_id: loggedUser.id,
        user_id: loggedUser.id,
        date: new Date(2020, 4, 21, value, 0, 0),
      });
    }

    const availability = await listProviderMonthAvailability.execute({
      month: 5,
      provider_id: loggedUser.id,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: true },
        { day: 21, available: false },
        { day: 22, available: true },
      ])
    );
  });
});
