import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class GeoLocation {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  ip: string;

  @Prop()
  url: string | null;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  continent_name: string;

  @Prop({ required: true })
  country_name: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  zip: string | null;
}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);
