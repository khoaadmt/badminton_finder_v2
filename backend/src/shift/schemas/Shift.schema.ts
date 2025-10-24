import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema()
export class Shift {
  @Prop()
  shiftNumber: number;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  period: string;

  @Prop()
  price: number;

  @Prop()
  locationId: Types.ObjectId;
}
export const ShiftSchema = SchemaFactory.createForClass(Shift);
