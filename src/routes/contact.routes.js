import { Router } from "express";

import {
  submitClientRequest,
  submitCandidateApplication,
} from "../controllers/contact.controller.js";

import { upload } from "../middleware/upload.js";


const router = Router();


router.post(
  "/devis",
  submitClientRequest
);


router.post(
  "/candidatures",
  upload.single("cv"),
  submitCandidateApplication
);


export default router;