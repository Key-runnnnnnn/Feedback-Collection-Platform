import mongoose from 'mongoose';

const formResponseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      answer: mongoose.Schema.Types.Mixed   
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const FormResponse = mongoose.models.FormResponse || mongoose.model("FormResponse", formResponseSchema);

export default FormResponse;