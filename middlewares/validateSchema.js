const AppError = require('../utils/CustomError');

exports.validateSchema = (schema) => async (req, res, next) => {
  const { query, body, params } = req;

  // Test Query String Params
  const { error: queryError } = await schema?.queryStringParameters?.validate(
    query
  );
  if (queryError) return next(returnCustomError(queryError));

  // Test Req Body
  const { error: bodyError } = await schema?.body?.validate(body);
  if (bodyError) return next(returnCustomError(bodyError));

  // Test Path Params
  const { error: pathError } = await schema?.pathParameters?.validate(params);
  if (pathError) return next(returnCustomError(pathError));

  next();
};

const returnCustomError = (error) => {
  // return error;
  return new AppError(
    error?.message?.replace(/"/g, '') || 'Invalid request',
    400
  );
};
