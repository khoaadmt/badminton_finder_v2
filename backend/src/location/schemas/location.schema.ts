import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

interface Timeline {
  start: string;
  end: string;
}
@Schema()
export class Location {
  @Prop()
  name: string;

  @Prop()
  city: string;

  @Prop()
  address: string;

  @Prop()
  contactPhone: string;

  @Prop()
  img: string[];

  @Prop()
  description: string;

  @Prop()
  numberOfCourts: number;

  @Prop()
  priceMin: number;

  @Prop()
  priceMax: number;

  @Prop({ type: Object, required: true })
  openHours: Timeline;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}
export const LocationSchema = SchemaFactory.createForClass(Location);
