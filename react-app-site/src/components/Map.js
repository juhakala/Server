import axios from 'axios'
import { useState } from "react"
import { MapInteractionCSS } from 'react-map-interaction';
import './../css/map.css';

const Image = ({map}) => {
	return (
		<MapInteractionCSS>
			<img src={map} alt='baseImg'/>
		</MapInteractionCSS>
	)
}

const Map = () => {
	const [map, setMap] = useState(['https://juhakala.com/maps/base.png']);
	const map_request = () => {
		const x = 10000;
		const y = 10000;
		axios.get(`/api/createmap/${x}/${y}`).then(resp => {
			console.log(resp);
			setMap([`${resp.data}?time=${Date.now()}`]);
		});
	}
	const new_request = () => {
		axios.get(`/api/newmap`).then(resp => {
			console.log(resp);
			setMap([`${resp.data}?time=${Date.now()}`]);
		});
	}
	return (
		<div className='mapBody'>
			<p>map site</p>
			<div onClick={map_request}>req</div>
			<div onClick={new_request}>base</div>
			<div className='mapWrap'>
				<Image map={map} />
			</div>
		</div>
	)
}

export default Map
