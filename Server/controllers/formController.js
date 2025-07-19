import Form from "../models/Form.js";

export const createForm = async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions) || questions.length < 3 || questions.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Title and 3-5 questions are required."
      });
    }
    const createdBy = req.user._id;
    const form = await Form.create({ title, questions, createdBy });
    const publicUrl = `http://localhost:5000/api/v1/form/getForm/${form._id}`;
    res.status(201).json({
      success: true,
      message: "Form created successfully.",
      form,
      publicUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found."
      });
    }
    res.status(200).json({
      success: true,
      form
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
    
export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json({
      success: true,
      forms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
  
