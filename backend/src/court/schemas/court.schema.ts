import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema()
export class Court {
  @Prop()
  courtNumber: number;
  @Prop()
  locationId: Types.ObjectId;
}
export const CourtSchema = SchemaFactory.createForClass(Court);
