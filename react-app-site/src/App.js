import { HashRouter, Switch, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Map from "./components/Map"
import Login from "./components/Login"
import Admin from "./components/Admin"
import Log from "./components/Log"
import "./css/App.css"


function App() {
//console.log(process.env.REACT_APP_NOT_SECRET_CODE)
//console.log(process.env.NODE_ENV)
	return (
		<HashRouter>
			<div>
				<Header />
				<div className="mainBody">
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/map" exact component={Map} />
						<Route path="/login" exact component={Login} />
						<Route path="/admin" exact component={Admin} />
						<Route path="/log" exact component={Log} />
					</Switch>
				</div>
				<Footer />
			</div>
		</HashRouter>
	);
}

export default App;
