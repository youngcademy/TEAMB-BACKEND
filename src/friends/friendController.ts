import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
} from 'tsoa';
import { Friend } from './friend';
import { FriendsService, FriendCreationParams } from './friendsService';

@Route('friends')
export class FriendsController extends Controller {
    @Get('{friendId}')
    public async getFriend(
        @Path() friendId: number,
        @Query() name?: string
    ): Promise<Friend> {
        return new FriendsService().get(friendId, name);
    }

    @SuccessResponse('201', 'Created') // Custom success response
    @Post()
    public async createFriend(
        @Body() requestBody: FriendCreationParams
    ): Promise<void> {
        this.setStatus(201); // set return status 201
        new FriendsService().create(requestBody);
        return;
    }
}
