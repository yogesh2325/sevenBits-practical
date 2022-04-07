const router = require("express").Router();
const { User, validate, validateUpdate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/userList", async (req, res) => {
	try {
		const user = await User.find();
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/getUser/:id", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


router.put("/updateUser/:id", async (req, res) => {
	try {
		// console.log(req.body);
		const { error } = validateUpdate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({$and:[{ email: req.body.email },  {_id :{"$ne": req.params.id }}]});
		if (user)
		{
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });
		}
		else{
			await User.findOneAndUpdate({ _id: req.params.id },{...req.body });
			return res
				.status(200)
				.send({ message: "User Updated successfully" });
		}
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


module.exports = router;
