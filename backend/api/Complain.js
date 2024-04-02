const express = require("express");
const router = express.Router();
const Complain = require("./../models/ComplainSchema");
const { protect, checkUser } = require("../middleware/authMiddleware");
const getCoordsForAddress = require("../util/location")

// POST a complaint for a specific user
router.post("/post", protect, checkUser, async (req, res) => {
  console.log("=============================================================================================")
  try {
    const { userId, name, email, location, road, phone, photo, message } = req.body;
    let coords;
    try {
      coords = await getCoordsForAddress(location);
    } catch (err) {
      return res.status(400).json({ message: "Could not find the specified location" });
    }

    const complain = new Complain({
      userId,
      name,
      email,
      photo,
      message,
      road,
      phone,
      location: location,
    });

    await complain.save();
    return res.status(201).json({ message: "Complaint Saved Successfully", data: complain });
  } catch (error) {
    console.error("Error saving complain:", error);
    return res.status(500).json({ message: "Error saving complain", error: error.message });
  }
});


// GET all complaints for a specific user
router.get("/", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated user
    const complains = await Complain.find({ userId });
    return res.json(complains);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving complains", error: error.message });
  }
});

router.get("/all", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated user
    const complains = await Complain.find({ });
    return res.json(complains);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving complains", error: error.message });
  }
});


// GET a specific complaint for a specific user
router.get("/:id", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated user
    const complaint = await Complain.findOne({ _id: req.params.id, userId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving complaint", error: error.message });
  }
});

router.get("/one/:id", protect, checkUser, async (req, res) => {
  try {
    const complaint = await Complain.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving complaint", error: error.message });
  }
});


// Delete a specific complaint for a specific user
router.delete("/:id", protect, checkUser, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated user
    const deletedComplaint = await Complain.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting complaint", error: error.message });
  }
});

module.exports = router;