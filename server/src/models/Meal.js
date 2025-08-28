import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    quartier: { type: String, required: true },
    portions: { type: Number, default: 1, min: 1 },
    limiteHeure: { type: Date, required: true },
    reserved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Meal', mealSchema);


