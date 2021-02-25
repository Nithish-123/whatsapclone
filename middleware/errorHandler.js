const errorHandler = (res, error) => {
	return res.json(error).status(404);
};
export default errorHandler;
