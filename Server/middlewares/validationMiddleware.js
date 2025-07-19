import { body, validationResult } from "express-validator";


export const validateAuth = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];


export const validateFormCreation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("questions").isArray({ min: 3, max: 5 }).withMessage("3-5 questions required"),
  body("questions.*.type").isIn(["text", "multiple-choice"]).withMessage("Invalid question type"),
  body("questions.*.question").notEmpty().withMessage("Question text required"),
  body("questions.*.options").custom((options, { req, path }) => {
    const idx = parseInt(path.split(".")[1], 10);
    const type = req.body.questions[idx]?.type;
    if (type === "multiple-choice" && (!options || options.length < 2)) {
      throw new Error("Multiple-choice questions must have at least 2 options");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];


export const validateFormResponse = [
  body("answers").isArray({ min: 1 }).withMessage("Answers are required"),
  body("answers.*.questionId").notEmpty().withMessage("questionId is required"),
  body("answers.*.answer").not().isEmpty().withMessage("Answer is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];