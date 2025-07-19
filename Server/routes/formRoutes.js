import express from "express";
import { createForm, getForm, getAllForms} from "../controllers/formController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";
import { validateFormCreation, validateFormResponse } from "../middlewares/validationMiddleware.js";
import { submitFormResponse, getFormResponses, getFormSummary, exportFormResponsesCSV } from "../controllers/formSubmissionController.js";
const router = express.Router()


router.post("/createForm", isAuthenticated, isAdmin, validateFormCreation, createForm)
router.get("/getForm/:formId", getForm)
router.post("/submit/:formId", validateFormResponse, submitFormResponse);
router.get("/getAllForms", isAuthenticated, isAdmin, getAllForms);
router.get("/getFormResponses/:formId", isAuthenticated, isAdmin, getFormResponses);
router.get("/getFormSummary/:formId", isAuthenticated, isAdmin, getFormSummary);
router.get("/export/:formId", isAuthenticated, isAdmin, exportFormResponsesCSV);
export default router;
