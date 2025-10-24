import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
@Schema()
export class TimeSlot {
  @Prop()
  courtId: ObjectId;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  period: string;

  @Prop()
  price: number;
}
export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);
