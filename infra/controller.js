import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMarchHandler(request, response) {
  const publicErroObject = new MethodNotAllowedError();
  response.status(publicErroObject.statusCode).json(publicErroObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMarchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
