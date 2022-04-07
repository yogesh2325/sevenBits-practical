import styles from "./styles.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Main = () => {
	const [error, setError] = useState("");
	const [userData, setUserData] = useState([]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	useEffect(() => {

		handleUserList();

	}, []);
	const handleUserList = async () => {
		try {
			const url = "http://localhost:8080/api/users/userList";
			const { data: res } = await axios.get(url);
			console.log(res);
			setUserData(res);
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
			<div className={styles.signup_container}>
				<div className={styles.signup_form_container}>
					<table className={styles.content_table}>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Email</th>
								<th>Action</th>
							</tr>

						</thead>
						<tbody>
							{userData.map((userList, i) => {
								return (
									<tr key={i}>
										<td>{i + 1}</td>
										<td>{userList.firstName}</td>
										<td>{userList.lastName}</td>
										<td>{userList.email}</td>
										<td>{<Link to={`/edit-user/${userList._id}`}><button className={styles.update_btn}>
											Update
										</button></Link>}</td>
									</tr>
								)
							})}

						</tbody>
					</table>
				</div>
			</div>

		</div>
	);
};

export default Main;
