import './../css/header.css';

const Header = () => {
	const navHome = {
		"marginLeft": "auto"
	}
	return (
		<div className="navBar">
			<div className="navItem">
				<a className="navLink" href="/#/login">Login</a>
			</div>
			<div className="navItem">
				<a className="navLink" href="/#/admin">Admin</a>
			</div>
			<div style={navHome} className="navItem">
				<a className="navLink" href="/">Home</a>
			</div>
		</div>
	)
}

export default Header