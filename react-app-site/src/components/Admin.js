import axios from "axios"
import { useEffect, useState } from "react";

const Admin = ({ status }) => {
	if (status && status.status === 200) {
		return (
			<>
				<h2>Admin page. placeholder, after Login</h2>
			</>
		)
	} else {
		return null;
	}
}

export default Admin
