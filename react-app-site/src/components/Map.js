import axios from 'axios'
import { useState } from "react"
import { MapInteractionCSS } from 'react-map-interaction';
import './../css/map.css';

const Image = ({map}) => {
	const [values, setValues] = useState({
		x: -315, y: -4635, scale: 0.068
	})
	const styles = { 
        transform: `translate(${values.x}px, ${values.y}px) scale(${values.scale})` 
	};
/*
	const EventListenerMode = {capture: true};
	function mousemoveListener (e) {
		e.preventDefault();
		console.log(e.screenX, e.screenY)
	}
	const mouseDownEvent = (event) => {
		console.log(event)
		document.addEventListener ('mousemove', mousemoveListener, EventListenerMode);
		document.addEventListener ('mouseup',   mouseupListener,   EventListenerMode);
		console.log('in');
	}
	function mouseupListener (e) {
		document.removeEventListener ('mouseup',   mouseupListener,   EventListenerMode);
		document.removeEventListener ('mousemove', mousemoveListener, EventListenerMode);
		console.log('out');
	}

	return (
		<div className='first' onMouseDown={ mouseDownEvent } >
			<div className='second'>
				<div style={styles}>
					<img className='image' src={map} alt='baseImg'/>
				</div>
			</div>
		</div>
	)
*/
	return (
		<MapInteractionCSS anchor={{x: '50%', y: '50%'}}>
			<div className='imgWrap'>
				<img className='image' src={map} alt='baseImg'/>
			</div>
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
	const fullScreen = (event) => {
		const elem = document.getElementsByClassName('mapWrap')[0];
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) { /* Safari */
			elem.webkitRequestFullscreen();
		}
	}
	return (
		<div className='mapBody'>
			<p>map site</p>
			<div className='button' onClick={map_request}>req</div>
			<div className='button' onClick={new_request}>base</div>
			<div onDoubleClick={fullScreen} className='mapWrap'>
				<Image map={map} />
			</div>
		</div>
	)
}

export default Map