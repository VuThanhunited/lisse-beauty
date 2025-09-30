const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getCustomerStories,
  getFeaturedCustomerStories,
  createCustomerStory,
  updateCustomerStory,
  deleteCustomerStory,
} = require("../controllers/customerStoryController");

// Public routes
router.get("/", getCustomerStories);
router.get("/featured", getFeaturedCustomerStories);

// Admin routes (these should have auth middleware in production)
router.post(
  "/",
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  createCustomerStory
);
router.put(
  "/:id",
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  updateCustomerStory
);
router.delete("/:id", deleteCustomerStory);

module.exports = router;
