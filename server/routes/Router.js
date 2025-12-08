const express = require("express");
const router = express();

// router.use("/api", require("./ContadoresRoutes"));
// router.use("/api", require("./ConcelhosRoutes"));
// router.use("/api", require("./LoginSSDRoutes"));

//Teste router
router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
