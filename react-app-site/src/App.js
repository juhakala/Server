import { HashRouter, Switch, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Map from "./components/Map"
import Login from "./components/Login"
import Admin from "./components/Admin"
import Log from "./components/Log"
import Tasks from "./components/Tasks"
import "./css/App.css"
import { useEffect, useState } from "react"
import axios from "axios"


function App() {
	const [status, setStatus] = useState(0);
	useEffect(() => {
		axios.get('/api/verify').then(resp => { setStatus(resp); }).catch(err => { setStatus(err.status); });
	}, [])
	const getXY = (e) => {
		//console.log('XY', e.screenX, e.screenY, e.clientX, e.clientY);
	}
	return (
		<HashRouter>
			<div onContextMenu={getXY}>
				<Header status={status}/>
				<div className="mainBody">
					<Switch>
						<Route path="/" exact component={()=> <Home />} />
						<Route path="/map" exact component={()=> <Map />} />
						<Route path="/login" exact component={()=> <Login status={status}/>} />
						<Route path="/admin" exact component={()=> <Admin status={status}/>} />
						<Route path="/log" exact component={()=> <Log />} />
						<Route path="/tasks" exact component={()=> <Tasks />} />
					</Switch>
				</div>
				<Footer />
			</div>
		</HashRouter>
	);
}

export default App;
