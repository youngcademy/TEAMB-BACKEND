import { Friend } from './friend';

// A post request should not contain an id.
export type FriendCreationParams = Pick<
    Friend,
    'email' | 'name' | 'phoneNumbers'
>;

export class FriendsService {
    public get(id: number, name?: string): Friend {
        return {
            id,
            email: 'jane@doe.com',
            name: name ?? 'Jane Doe',
            status: 'Happy',
            phoneNumbers: [],
        };
    }

    public create(friendCreationParams: FriendCreationParams): Friend {
        return {
            id: Math.floor(Math.random() * 10000), // Random
            status: 'Happy',
            ...friendCreationParams,
        };
    }
}
