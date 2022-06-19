const validateSchema = async (schema, obj) => {
  const { error } = await schema.validate(obj);

  if (error) throw new Error(error?.message);

  return true;
};

module.exports = { validateSchema };
