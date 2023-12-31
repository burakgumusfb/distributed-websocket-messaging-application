import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom } from '@schemas/chat-room.schema';
import { User } from '@schemas/user.schema';
import { ParticipantDto } from '../dtos/participant.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async createChatRoomIfNotExist(): Promise<ChatRoom> {
    let chatRoom = await this.chatRoomModel.findOne().lean().exec();
    if (!chatRoom) {
      chatRoom = new this.chatRoomModel();
      await chatRoom.save();
    }
    return chatRoom;
  }
  async addParticipant(participantDto: ParticipantDto): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomModel.findById(
      participantDto.chatRoomId,
    );

    const user = await this.userModel.findById(participantDto.participantId);
    if (user) {
      const participantExists = chatRoom.participants.some((p: User) =>
        p._id.equals(participantDto.participantId),
      );
      if (!participantExists) {
        chatRoom.participants.push(user._id);
      }
      await chatRoom.save();
    }
    return chatRoom;
  }
}
