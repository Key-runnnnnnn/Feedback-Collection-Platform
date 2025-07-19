import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      questions: [
        {
          type: {
            type: String,
            enum: ['text', 'multiple-choice'],
            required: true
          },
          question: {
            type: String,
            required: true
          },
          options: [String]
        }
      ],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
})

const Form = mongoose.models.Form || mongoose.model("Form", formSchema);  

export default Form;
