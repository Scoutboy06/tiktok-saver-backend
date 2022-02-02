export default function asyncHandler(func) {
	return async (req, res, next) => {
		try {
			func(req, res, next);
		} catch (err) {
			res.status(err.status).send(err);
		}
	};
}