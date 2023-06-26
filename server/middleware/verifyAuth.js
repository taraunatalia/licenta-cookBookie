const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.user;

const verifyToken = (req, res, next) => {
	const header = req.headers.Authorization || req.headers.authorization;
	const token = header && header.split(' ')[1];

	if (!token) {
		res.status(403).send({ message: 'No token provided!' });
		return;
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			res.status(401).send({ message: 'Unauthorized!' });
			return;
		}
		req.userId = decoded.id;
		next();
	});
};

const isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId).populate('role', '-__v').exec();
		if (!user) {
			res.status(401).send({ message: 'Unauthorized!' });
			return;
		}
		if (!user.role.isAdmin) {
			res.status(403).send({ message: 'Admin role required!' });
			return;
		}
		next();
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

const verifyAuth = {
	verifyToken,
	isAdmin,
};

module.exports = verifyAuth;
