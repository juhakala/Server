import axios from 'axios'
import './../css/header.css';

const Header = ({ status }) => {
	const navHome = {
		"marginLeft": "auto"
	}
//	console.log('head', status)
	const handleLogout = () => {
		axios.post('api/logout').then(resp => {
			window.location.reload();
			window.location.href = "/#/login";
		}).catch(err => {
			console.log(err);
			window.location.reload();
			window.location.href = "/#/login";
		})
	}
	if (status && status.status === 200) {
		return (
		<div className="navBar">
			<div className="navItem">
				<a className="navLink" href="/#/map">Map</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/tasks">Tasks</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/admin">Admin</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/log">Log</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/cube">Cube</a>
			</div>
			<div style={navHome} className="navItem">
				<a className="navLink" href="/#/user">{status.data.name}</a>
			</div>
			<div className="navItem">
				<a className="navLink" onClick={handleLogout} href="/#/">Logout</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/">Home</a>
			</div>
		</div>
		)
	}
	return (
		<div className="navBar">
			<div className="navItem">
				<a className="navLink" href="/#/map">Map</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/log">Log</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/cube">Cube</a>
			</div>
			<div style={navHome} className="navItem">
				<a className="navLink" href="/#/login">Login</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/">Home</a>
			</div>
		</div>
	)
}

export default Header