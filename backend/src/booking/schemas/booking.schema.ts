import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Booking {
  @Prop()
  username: string;

  @Prop()
  courtId: Types.ObjectId;

  @Prop()
  shiftId: Types.ObjectId;

  @Prop()
  locationId: Types.ObjectId;

  @Prop()
  date: string;

  @Prop()
  price: number;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop()
  createdAt: string;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);
