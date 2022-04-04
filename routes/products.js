var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");

const { Product } = require("../models");

const v = new Validator();

router.get("/", async (req, res, next) => {
  const products = await Product.findAll();
  return res.json(products);
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findByPk(id);
  return res.json(product || { message: "product not found" });
});

router.post("/", async (req, res) => {
  const schema = {
    name: "string",
    brand: "string",
    deskripsi: "string|optional",
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  const product = await Product.create(req.body);
  res.json(product);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  let product = await Product.findByPk(id);

  if (!product) {
    return res.json({ message: "product not found" });
  }

  const schema = {
    name: "string|optional",
    brand: "string|optional",
    deskripsi: "string|optional",
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }

  product = await product.update(req.body);
  res.json(product);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  let product = await Product.findByPk(id);

  if (!product) {
    return res.json({ message: "product not found" });
  }

  product = await product.destroy();
  res.json({ message: "product terhapus" });
});

module.exports = router;
