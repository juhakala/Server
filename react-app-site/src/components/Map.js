//import axios from 'axios'
import { useState } from "react"
import './../css/map.css';

const Image = ({map}) => {
	var mouseStart;
	var imgStart = [0, 0];
	var imgScale = 1;
	const EventListenerMode = {capture: true};
	function mousemoveListener (e) {
		e.preventDefault();
		e.target.style.left = -(mouseStart[0] - e.screenX - imgStart[0]) + "px";
		e.target.style.top = -(mouseStart[1] - e.screenY - imgStart[1]) + "px";
	}
	const mouseDownEvent = (event) => {
		if (event.target.className !== "image")
			return ;
		mouseStart = [event.screenX, event.screenY];
		if (event.target.style.left)
			imgStart = [parseInt(event.target.style.left), parseInt(event.target.style.top)]
		document.addEventListener ('mousemove', mousemoveListener, EventListenerMode);
		document.addEventListener ('mouseup',   mouseupListener,   EventListenerMode);
	}
	function mouseupListener (e) {
		document.removeEventListener ('mouseup',   mouseupListener,   EventListenerMode);
		document.removeEventListener ('mousemove', mousemoveListener, EventListenerMode);
	}
	const handleScroll = (event) => {
		const elem = document.getElementsByClassName('image')[0];
//		console.log(elem.style.transform);
		const tmp = imgScale + 0.01 * event.deltaY;
		if (tmp > 0.5 && tmp < 150) {
			imgScale = tmp;
			elem.style.transform = `scale(${imgScale})`;
			document.getElementById('info').innerHTML = imgScale;
		}
	}
	const disableScroll = () => {
		document.body.style.overflow = "hidden";
	}
	const enableScroll = () => {
		document.body.style.overflow = "auto";
	}
	const fullScreen = (event) => {
		const elem = document.getElementsByClassName('mapWrap')[0];
		if (!document.fullscreenElement) {
			if (elem.requestFullscreen)
				elem.requestFullscreen();
			else if (elem.webkitRequestFullscreen) /* Safari */
				elem.webkitRequestFullscreen();
		} else
			document.exitFullscreen();
	}

	return (
		<>
			<p id='info' className='info'>1</p>
			<div onDoubleClick={fullScreen} className='mapWrap'>
				<div className='imgWrap'
					onMouseDown={ mouseDownEvent }
					onWheel={ handleScroll }
					onMouseEnter={ disableScroll }
					onMouseLeave={ enableScroll }
				>
					<img className='image' src={map} alt='baseImg'/>
				</div>
			</div>
		</>
	);
}

const Map = () => {
	const [map, setMap] = useState(['https://juhakala.com/maps/00.png']);

	
	return (
		<div className='mapBody'>
			<p className='info'>map site</p>
			<Image map={map} />
		</div>
	)
}

export default Map