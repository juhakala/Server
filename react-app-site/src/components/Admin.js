import axios from "axios"
import { useEffect, useState } from "react";

const Admin = () => {
	const [message, setMessage] = useState('Not logged in');
	useEffect(() => {
		axios.get('/api/admin')
		.then(resp => {
			console.log(resp);
			setMessage(resp.data);
		}).catch(err => {
			console.log(err);
		})
	}, []);
	return (
		<>
			<h2>Admin page. placeholder, after Login</h2>
			<p>{message}</p>
		</>
	)
}

export default Admin
