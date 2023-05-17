import mongoose, { InferSchemaType } from 'mongoose';

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

export type Planet = InferSchemaType<typeof planetSchema>;

export default mongoose.model('Planet', planetSchema);
