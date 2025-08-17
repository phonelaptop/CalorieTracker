const { model, Schema } = require("mongoose");

const foodEntrySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    consumedAt: {
      type: Date,
      default: Date.now,
    },
    ingredientName: {
      type: String,
      required: true,
    },
    portionSize_g: {
      type: Number,
      required: true,
    },
    // Basic macronutrients
    calories: {
      type: Number,
      required: true,
    },
    protein_g: {
      type: Number,
      required: true,
    },
    carbohydrates_g: {
      type: Number,
      required: true,
    },
    fat_g: {
      type: Number,
      required: true,
    },
    fiber_g: {
      type: Number,
      default: 0,
    },
    sugar_g: {
      type: Number,
      default: 0,
    },
    sodium_mg: {
      type: Number,
      default: 0,
    },
    // Vitamins
    vitamin_A: {
      type: Number,
      default: 0,
    },
    vitamin_C: {
      type: Number,
      default: 0,
    },
    vitamin_D: {
      type: Number,
      default: 0,
    },
    vitamin_E: {
      type: Number,
      default: 0,
    },
    vitamin_K: {
      type: Number,
      default: 0,
    },
    vitamin_B1: {
      type: Number,
      default: 0,
    },
    vitamin_B2: {
      type: Number,
      default: 0,
    },
    vitamin_B3: {
      type: Number,
      default: 0,
    },
    vitamin_B6: {
      type: Number,
      default: 0,
    },
    vitamin_B12: {
      type: Number,
      default: 0,
    },
    folate: {
      type: Number,
      default: 0,
    },
    // Minerals
    calcium: {
      type: Number,
      default: 0,
    },
    iron: {
      type: Number,
      default: 0,
    },
    magnesium: {
      type: Number,
      default: 0,
    },
    phosphorus: {
      type: Number,
      default: 0,
    },
    potassium: {
      type: Number,
      default: 0,
    },
    zinc: {
      type: Number,
      default: 0,
    },
    selenium: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

foodEntrySchema.index({ userId: 1, consumedAt: -1 });

module.exports = { FoodEntry: model("FoodEntry", foodEntrySchema) };