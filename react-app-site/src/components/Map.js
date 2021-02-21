//import axios from 'axios'
import axios from "axios";
import { useEffect, useState } from "react"
import './../css/map.css';

const MenuWrap = ({ map, setMap }) => {
	const changeToMap = (id) => {
	/*
		console.log(id)
		console.log(map[0])
		console.log(map[id])
		console.log(map);
	*/
		if (id === 0)
			return ;
		const tmp1 = map[0];
		const tmp2 = map[id];
		const newMap = [...map];
		newMap[0] = tmp2;
		newMap[id] = tmp1;
		setMap(newMap);
	}
	return (
		<>
			{map.map((item, index) => <p key={item.id} onClick={() => changeToMap(index)}>{item.path}</p>)}
		</>
	)
}

const Image = ({map, setMap}) => {
	const [selectedMap, setSelectedMap] = useState(0);
	var mouseStart;
	var imgStart = [0, 0];

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

		var factor = 0.96;
		if (event.deltaY < 0)
			factor = 1/factor;
		if (parseFloat(bound2.width) * factor > 40000 || parseFloat(bound2.width) * factor < 300 )
			return ;
		elem2.style.width = (parseFloat(bound2.width) * factor) + 'px';

		const currentMouseY = event.clientY - bound1.y;
		const currentMouseX = event.clientX - bound1.x;

		const xx = bound2.x - bound1.x;
		const yy = bound2.y - bound1.y;

		const dx = (currentMouseX - xx) * (factor - 1);
		const dy = (currentMouseY - yy) * (factor - 1);
		elem2.style.left = (xx - dx) + 'px';
		elem2.style.top = (yy - dy) + 'px';
	}

	const disableScroll = () => {
		document.body.style.overflow = "hidden";
	}
	const enableScroll = () => {
		document.body.style.overflow = "auto";
	}
	const fullScreen = (event) => {
		event.preventDefault();
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
		elem.style.width = '6370px';
		elem.style.left = '-2831px';
		elem.style.top = '-2879px';
	}

	const changeSlider = (event) => {
//		console.log(event.target.value);
		const elem = document.getElementsByClassName('image')[0];
		elem.style.filter = `brightness(${event.target.value})`;
//		console.log(elem.style.filter.brightness);
//		console.log(elem.style.filter);
	}

	const mapSelector = (event) => {
		event.preventDefault();
		console.log('mappi', map);
		const elem = document.getElementsByClassName('menuWrap')[0];
		const bound = document.getElementsByClassName('mapBody')[0].getBoundingClientRect();
		elem.style.display = 'block';
		elem.style.left = event.clientX + 'px';
		elem.style.top = event.clientY - bound.y + 'px';
	}
	return (
		<>
			<div className="center" onClick={ centerToHome }>center</div>
			<div onDoubleClick={fullScreen} className='mapWrap'>
				<div className='imgWrap'
					onContextMenu={ mapSelector }
					onMouseDown={ mouseDownEvent }
					onWheel={ handleScroll }
					onMouseEnter={ disableScroll }
					onMouseLeave={ enableScroll }
				>
					<img className='image' src={`https://juhakala.com/maps/${map[selectedMap].path}`} alt='baseImg'/>
				</div>
			</div>
			<div className='controlsWrap'>
				<div className='controls'>
					<input id='slider' onChange={changeSlider} type="range" min="1" max="100" defaultValue="25" />
				</div>
			</div>
			<div className='menuWrap'>
				<MenuWrap map={map} setMap={setMap} />
			</div>
		</>
	);
}

const Map = () => {
	const [map, setMap] = useState(null);//useState([{id:1,path:'00.png',x:0,y:0}]);
useEffect(() => {
		axios.get('/api/maps')
		.then(data => {
			console.log(data.data);
			setMap(data.data);
		})
		.catch(err => {
			console.log(err);
		})
	}, [])
	const hideMenu = (event) => {
		const elem = document.getElementsByClassName('menuWrap')[0];
		if (elem && elem.style.display === 'block' && !elem.contains(event.target))
			elem.style.display = 'none';
	}
	if (map === null)
		return null;
	return (
		<div className='mapBody' onClick={hideMenu}>
			<Image map={map} setMap={setMap} />
		</div>
	)
}

export default Map