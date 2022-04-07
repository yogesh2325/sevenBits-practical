// import styles from "./styles.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";


const EditUser = () => {
	const params = useParams();
	const [error, setError] = useState("");
	// const [userData, setUserData] = useState("");
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};
	const handleUserList = async () => {
		try {
			const url = `http://localhost:8080/api/users/getUser/${params.slug}`;
			const { data: res } = await axios.get(url);
			console.log(res);

			setData({
				firstName: res.firstName,
				lastName: res.lastName,
				email: res.email
			});
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	useEffect(() => {
		handleUserList();
	}, []);

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `http://localhost:8080/api/users/updateUser/${params.slug}`;
			const { data: res } = await axios.put(url, data);
			navigate("/");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Practical</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>

			</nav>
			<div className={styles.signup_container1}>
				<div className={styles.signup_form_container1}>
					<div className={styles.right}>
						<form className={styles.form_container} onSubmit={handleSubmit}>
							<h1>Update User</h1>
							<input
								type="text"
								placeholder="First Name"
								name="firstName"
								onChange={handleChange}
								value={data.firstName}
								required
								className={styles.input}
							/>
							<input
								type="text"
								placeholder="Last Name"
								name="lastName"
								onChange={handleChange}
								value={data.lastName}
								required
								className={styles.input}
							/>
							<input
								type="email"
								placeholder="Email"
								name="email"
								onChange={handleChange}
								value={data.email}
								required
								className={styles.input}
							/>
							{error && <div className={styles.error_msg}>{error}</div>}
							<button type="submit" className={styles.update_btn}>
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>

		</div>
	);
};

export default EditUser;
