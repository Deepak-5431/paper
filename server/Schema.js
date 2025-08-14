import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true }, 
  options: { type: [String], required: true },
  correctAnswer: { type: String }, 
  note: { type: String },          
  type: { type: String, default: "MCQ" },
  marks: {
    positive: { type: Number, default: 1 },
    negative: { type: Number, default: 0 }
  },
  category: { type: String, default: "general" }, 
  createdate: { type: Date, default: Date.now }
});

export const praninam = mongoose.model("praninam", QuestionSchema);

 const User = new mongoose.Schema({
  username: {type:String,required:true},
  password:{type:String,required:true}
})

export const student = mongoose.model("student",User);

