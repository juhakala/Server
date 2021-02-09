import axios from 'axios'
import { useEffect, useState } from 'react'
import "./../css/log.css"

const Message = ({ item }) => {
	return (
		<div className="message">
			<div className="timestamp">
				<span>{item.time}</span>
			</div>
			<p>{item.start}</p>
			<p>{item.message}</p>
		</div>
	)
}

const Panel = ({ log }) => {
	if (!log)
		return null;
	return (
		<div className='panel'>
			{log.map(item => <Message key={item.id} item={item}/>)}
		</div>
	)
}

const Log = () => {
	const [log, setLog] = useState({});
	useEffect(() => {
		axios
		.get('/api/log')
		.then(resp => {
			setLog(resp.data);
			console.log('here', resp.data)
		})
		.catch(error => {
			console.log('log axios error: ', error);
		})
	}, [])
	return (
		<div>
			<Panel log={log.stdout}/>
			<Panel log={log.stderr}/>
		</div>
	)
}

export default Log;