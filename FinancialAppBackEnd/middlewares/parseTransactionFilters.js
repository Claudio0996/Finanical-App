const parseTransactionFilter = (schema) => (req, res, next) => {
  const filters = req.query;

  try {
    const data = schema.safeParse(filters);

    req.filters = { ...data };
    next();
  } catch (err) {
    res.status(422).json({
      message: err.errors || "Dados inválidos",
    });
  }
};

module.exports = { parseTransactionFilter };
