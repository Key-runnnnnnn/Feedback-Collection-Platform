import Form from "../models/Form.js";
import FormResponse from "../models/FormResponse.js";
import { Parser as Json2csvParser } from 'json2csv';

export const submitFormResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found." });
    }

    const response = await FormResponse.create({
      form: formId,
      answers,
      submittedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Response submitted successfully.",
      response
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await FormResponse.find({ form: formId });
    res.status(200).json({
      success: true,
      responses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
  


export const getFormSummary = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found." });
    }

    const responses = await FormResponse.find({ form: formId });

    const summary = {};
    form.questions.forEach(q => {
      if (q.type === 'multiple-choice') {
        summary[q._id] = {};
        q.options.forEach(opt => {
          summary[q._id][opt] = 0;
        });
      }
    });

    responses.forEach(resp => {
      resp.answers.forEach(ans => {
        const q = form.questions.id(ans.questionId);
        if (q && q.type === 'multiple-choice') {
          if (Array.isArray(ans.answer)) {
            ans.answer.forEach(opt => {
              if (summary[ans.questionId] && summary[ans.questionId][opt] !== undefined) {
                summary[ans.questionId][opt] += 1;
              }
            });
          } else {
            if (summary[ans.questionId] && summary[ans.questionId][ans.answer] !== undefined) {
              summary[ans.questionId][ans.answer] += 1;
            }
          }
        }
      });
    });

    res.status(200).json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const exportFormResponsesCSV = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found." });
    }
    const responses = await FormResponse.find({ form: formId });
    if (!responses.length) {
      return res.status(404).json({ success: false, message: "No responses found." });
    }
    
    const csvData = responses.map(resp => {
      const row = { submittedAt: resp.submittedAt };
      resp.answers.forEach(ans => {
        row[ans.questionId] = Array.isArray(ans.answer) ? ans.answer.join('; ') : ans.answer;
      });
      return row;
    });
    
    const fields = ['submittedAt', ...form.questions.map(q => q._id.toString())];
    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(csvData);
    res.header('Content-Type', 'text/csv');
    res.attachment(`form_${formId}_responses.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};