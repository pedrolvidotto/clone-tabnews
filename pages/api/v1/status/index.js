function status(request, response) {
  response.status(200).json({ chave: 1 });
}

export default status;
