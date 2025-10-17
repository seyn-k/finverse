import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

router.use(authMiddleware);

router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select(
      "email verificationStep pan aadhar bank kyc"
    );
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({
      id: user.id,
      email: user.email,
      verificationStep: user.verificationStep,
      pan: user.pan,
      aadhar: user.aadhar,
      bank: user.bank,
      kyc: user.kyc,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/advance", async (req, res, next) => {
  try {
    const { to } = req.body || {};
    const allowed = ["pan", "aadhar", "bank", "kyc", "done"];
    if (!allowed.includes(to)) return res.status(400).json({ message: "Invalid step" });
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { verificationStep: to } },
      { new: true }
    ).select("email verificationStep");
    res.json({ id: user.id, email: user.email, verificationStep: user.verificationStep });
  } catch (e) {
    next(e);
  }
});

// Save PAN details and advance to aadhar
router.post("/pan", async (req, res, next) => {
  try {
    const { number, name, dob } = req.body || {};
    if (!number) return res.status(400).json({ message: "PAN number is required" });
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          pan: { number, name, dob },
          verificationStep: "aadhar",
        },
      },
      { new: true }
    ).select("email verificationStep pan");
    res.json({ id: user.id, email: user.email, verificationStep: user.verificationStep, pan: user.pan });
  } catch (e) {
    next(e);
  }
});

// Save Aadhaar details and advance to bank
router.post("/aadhar", async (req, res, next) => {
  try {
    const { number, name, dob } = req.body || {};
    if (!number) return res.status(400).json({ message: "Aadhaar number is required" });
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          aadhar: { number, name, dob },
          verificationStep: "bank",
        },
      },
      { new: true }
    ).select("email verificationStep aadhar");
    res.json({ id: user.id, email: user.email, verificationStep: user.verificationStep, aadhar: user.aadhar });
  } catch (e) {
    next(e);
  }
});

// Save Bank details and advance to kyc
router.post("/bank", async (req, res, next) => {
  try {
    const { accountNumber, ifsc, holderName } = req.body || {};
    if (!accountNumber || !ifsc) return res.status(400).json({ message: "accountNumber and ifsc are required" });
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          bank: { accountNumber, ifsc, holderName },
          verificationStep: "kyc",
        },
      },
      { new: true }
    ).select("email verificationStep bank");
    res.json({ id: user.id, email: user.email, verificationStep: user.verificationStep, bank: user.bank });
  } catch (e) {
    next(e);
  }
});

// Complete KYC and set done
router.post("/kyc/complete", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: { "kyc.status": "completed", verificationStep: "done" },
        $currentDate: { "kyc.completedAt": true },
      },
      { new: true }
    ).select("email verificationStep kyc");
    res.json({ id: user.id, email: user.email, verificationStep: user.verificationStep, kyc: user.kyc });
  } catch (e) {
    next(e);
  }
});

export default router;


