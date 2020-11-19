import faker from 'faker';
import { User } from '../database/models/user.model';

type DummyUser = {email: string, password: string, username: string, userId: string};
type AuthorizedDummyUser = {email: string, password: string, username: string, userId: string, token: string};

export function dummy() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.name.firstName()
  };
}

export async function createDummy(): Promise<DummyUser> {
    const user = dummy();
    const dbUser = new User(user);
    await dbUser.save();
    return {...user, userId: dbUser._id.toString()};
  }

export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
    const user = dummy();
    const dbUser = new User(user);
    const userS = await dbUser.save();
    const dummyy = {...user, userId: dbUser._id.toString()};
    const authToken = dbUser.generateJWT();
    return {...dummyy, token: authToken};
}

export async function deleteUser(userId: string): Promise<void> {
  const dbUser = await User.findById(userId);
  await dbUser!.deleteOne();
}
