import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from './base.model';
import { MODEL_NAMES } from '../modelNames';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';

export type ContactUsDocument = HydratedDocument<ContactUs>;

@Schema()
export class ContactUs {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false, type: String })
  message: string;

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: 1, enum: STATUS_NAMES })
  status: number;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);

ContactUsSchema.index({ email: 1, phone: 1 }); // Example index, adjust as needed
