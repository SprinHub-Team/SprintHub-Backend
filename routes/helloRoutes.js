import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.post("/", (req, res) => {
  const { name } = req.body;
  res.send(`Hello, ${name}!`);
});

router.patch("/:id", (req, res) => {
	const { id } = req.params;
  const { name } = req.body;
  res.send(`Hello, ${name}! (updated)  and the id is ${id}`);
});

router.delete("/:id", (req, res) => {
	const { id } = req.params;
  res.send(`Goodbye, World! Deleted resource with ID: ${id}`);
});

export default router;



