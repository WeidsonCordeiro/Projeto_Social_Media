const express = require("express");
const router = express.Router(); // Use express.Router() for modular routing

// Define routes
router.use("/users", require("./userRoutes"));
router.use("/posts", require("./postRoutes"));

// Test route under /api

router.get("/", (req, res) => {
  res.send("API is working!");
});

module.exports = router;
