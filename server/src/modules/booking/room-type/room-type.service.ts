import { Injectable } from '@nestjs/common';
import { CreateRoomTypeInput } from './dto/create-room-type.input';
import { UpdateRoomTypeInput } from './dto/update-room-type.input';

@Injectable()
export class RoomTypeService {
  create(createRoomTypeInput: CreateRoomTypeInput) {
    return 'This action adds a new roomType';
  }

  findAll() {
    return `This action returns all roomType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomType`;
  }

  update(id: number, updateRoomTypeInput: UpdateRoomTypeInput) {
    return `This action updates a #${id} roomType`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomType`;
  }
}
