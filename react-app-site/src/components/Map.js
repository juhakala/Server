//import axios from 'axios'
import { useState } from "react"
import './../css/map.css';

const Image = ({map}) => {
	var mouseStart;
	var imgStart = [0, 0];
//	var imgScale = 1;

//	var currentMouseY;
//	var currentMouseX;
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
		const elem1 = document.getElementsByClassName('imgWrap')[0];
		const bound1 = elem1.getBoundingClientRect();

		const elem2 = document.getElementsByClassName('image')[0];
		const bound2 = elem2.getBoundingClientRect();

		var factor = 0.98;
		if (event.deltaY < 0) {
			factor = 1/factor;
		}
		if (parseFloat(bound2.width) * factor > 40000 || parseFloat(bound2.width) * factor < 300 )
			return ;
		elem2.style.width = (parseFloat(bound2.width) * factor) + 'px';

		const currentMouseY = event.screenY - bound1.y;
		const currentMouseX = event.screenX - bound1.x;

		const xx = bound2.x - bound1.x;
		const yy = bound2.y - bound1.y;

		const dx = (currentMouseX - xx) * (factor - 1);
		const dy = (currentMouseY - yy) * (factor - 1);
		elem2.style.left = (xx - dx) + 'px';
		elem2.style.top = (yy - dy) + 'px';
//		console.log(dx);

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
	const centerToHome = () => {
		const elem = document.getElementsByClassName('image')[0];
		elem.style.width = '39999px';
		elem.style.left = '-19629px';
		elem.style.top = '-19730px';
	}

	return (
		<>
			<p id='info' className='info'>50</p>
			<div className="center" onClick={ centerToHome }>center</div>
			<div onDoubleClick={fullScreen} className='mapWrap'>
				<div className='imgWrap'
					onMouseDown={ mouseDownEvent }
//					onContextMenu={zo}
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