const bcrypt = require('bcryptjs');
const db = require('../models');
const ratingController = require('./rating.controller');

const User = db.user;
const Role = db.role;

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find().populate('role', '-__v').exec();
		res.send({
			users: users.map((u) => ({
				...u._doc,
				password: null,
				currentUser: u._id.toString() === req.userId,
			})),
		});
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.createUser = async (req, res) => {
	try {
		const role = await Role.findOne({ name: req.body.role || 'user' }).exec();
		if (!role) {
			res.status(400).send({ message: 'Given role does not exist' });
			return;
		}
		const user = await User.findOne({ email: req.body.email }).exec();
		if (user) {
			res.status(400).send({ message: 'A user already exists for this email' });
			return;
		}
		await new User({
			name: req.body.name?.trim(),
			email: req.body.email?.trim(),
			password: bcrypt.hashSync(req.body.password?.trim(), 8),
			role: role._id,
		}).save();
		res.send({ message: 'User created successfully!' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

const getUserFromRequest = (req) => {
	const user = {};
	if (req.body.name) {
		user.name = req.body.name?.trim();
	}
	if (req.body.email) {
		user.email = req.body.email?.trim();
	}
	return user;
};

exports.updateUser = async (req, res) => {
	try {
		const role = await Role.findOne({ name: req.body.role }).exec();
		const user = getUserFromRequest(req);
		if (role) {
			user.role = role._id;
		}
		const updatedUser = User.findByIdAndUpdate(req.body.userId, user).exec();
		if (!updatedUser) {
			res.status(400).send({ message: 'No user with the given id exists!' });
			return;
		}
		res.send({ message: 'Updated user successfully' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

// const deleteUserAccount = async (userId) => {
// 	const session = await User.startSession();
// 	await session.withTransaction(async () => {
// 		const deletedUser = await User.findByIdAndDelete(userId).exec();
// 		if (deletedUser) {
// 			await ratingController.deleteRating(userId);
// 		}
// 	});
// 	session.endSession();
//};

exports.deleteUser = async (req, res) => {
	try {
		await deleteUserAccount(req.body.id);
		res.send({ message: 'User deleted successfully!' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.userId).populate('role', '-__v').exec();
		res.send({ user });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const user = getUserFromRequest(req);
		const updatedUser = await User.findByIdAndUpdate(req.userId, user).exec();
		if (!updatedUser) {
			res.status(400).send({ message: 'Token id not valid!' });
			return;
		}
		res.send({ message: 'Updated user successfully' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};

exports.deleteProfile = async (req, res) => {
	try {
		await deleteUserAccount(req.userId);
		res.send({ message: 'Account deleted successfully!' });
	} catch (err) {
		res.status(500).send({ message: err });
	}
};
