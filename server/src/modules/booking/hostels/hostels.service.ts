import { Injectable } from '@nestjs/common';
import { CreateHostelInput } from './dto/create-hostel.input';
import { UpdateHostelInput } from './dto/update-hostel.input';

@Injectable()
export class HostelsService {
  create(createHostelInput: CreateHostelInput) {
    return 'This action adds a new hostel';
  }

  findAll() {
    return `This action returns all hostels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hostel`;
  }

  update(id: number, updateHostelInput: UpdateHostelInput) {
    return `This action updates a #${id} hostel`;
  }

  remove(id: number) {
    return `This action removes a #${id} hostel`;
  }
}
