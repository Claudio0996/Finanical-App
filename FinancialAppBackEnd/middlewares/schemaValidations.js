const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);

    req.body = { ...data };
    next();
  } catch (err) {
    return res.status(422).json({
      message: err.errors || "Dados inválidos",
    });
  }
};

module.exports = { validate };
