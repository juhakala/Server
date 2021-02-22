//import axios from 'axios'
import axios from "axios";
import { useEffect, useState } from "react"
import './../css/map.css';

const MenuWrap = ({ map, setMap, dimensions }) => {
	const gridStyle = {
		gridTemplateColumns: `repeat(${Number.isInteger(dimensions.columns) ? dimensions.columns : 0}, 20px)`,
		gridTemplateRows: `repeat(${Number.isInteger(dimensions.rows) ? dimensions.rows : 0}, 20px)`
	}
	const changeToMap = (id) => {
		if (id === 0)
			return ;
		const tmp1 = map[0];
		const tmp2 = map[id];
		const newMap = [...map];
		newMap[0] = tmp2;
		newMap[id] = tmp1;
		setMap(newMap);
	}
	const numEmpty = dimensions.rows * dimensions.columns - map.length;
	var empties = [];
	for (var i = 0; i < numEmpty; i++) {
		empties.push(<div key={-i} className='empty' />);
	}
//	map.forEach(item => {
//		console.log(dimensions.columns + item.x, dimensions.columns, item.x)
//		console.log(dimensions.rows + item.y, dimensions.rows, item.y);		
//	});
	return (
		<div className='menuWrap'>
			{map.map((item, index) => <p style={{ cursor:'pointer', width:'fit-content' }}key={item.id} onClick={() => changeToMap(index)}>{item.path}</p>)}
			<div style={gridStyle} className='gridContainer'>
				{empties}
				{map.map((item, index) => 
				<div
					onClick={() => changeToMap(index)}
					style={{
						gridColumn: dimensions.columns + item.x,
						gridRow: dimensions.rows + item.y,
						background: index !== 0 ? 'coral' : 'blue',
					}}
					className='gridItem'
					key={item.id}
				></div>
				)}
			</div>
		</div>
	)
}

const Image = ({map, setMap, dimensions}) => {
	const [selectedMap, setSelectedMap] = useState(0);
	var mouseStart;
	var imgStart = [0, 0];

	const EventListenerMode = {capture: true};
	function mousemoveListener (e) {
		e.preventDefault();
		if (e.target !== document.getElementsByClassName('image')[0])
			return ;
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
		document.getElementsByClassName('mapBody')[0].style.overflow = "hidden";
	}
	const enableScroll = () => {
		document.getElementsByClassName('mapBody')[0].style.overflow = "overlay";
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
		const elem = document.getElementsByClassName('image')[0];
		elem.style.filter = `brightness(${event.target.value})`;
	}

	const mapSelector = (event) => {
		event.preventDefault();
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
			<MenuWrap map={map} setMap={setMap} dimensions={dimensions} />
		</>
	);
}

const Map = () => {
	const [map, setMap] = useState(null);
	const [dimensions, setDimensions] = useState({ xMin:0, xMax:0, yMin:0, yMax:0, columns:0, rows:0 });
	useEffect(() => {
		axios.get('/api/maps')
		.then(data => {
			setMap(data.data);
			const x = data.data.map(item => { return item.x })
			const y = data.data.map(item => { return item.y })
			const newDims = {
				xMin: Math.min(...x),
				xMax: Math.max(...x),
				yMin: Math.min(...y),
				yMax: Math.max(...y)
			};
			newDims.columns = newDims.xMax - newDims.xMin + 1;
			newDims.rows = newDims.yMax - newDims.yMin + 1;
//			console.log('d',newDims)
			setDimensions(newDims);
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
			<p className='info'>
				<strong>map controls</strong><br/>
				zoom with mouse or pad<br/>
				move with mouse down<br/>
				map selection context menu (right click)<br/>
			</p>
			<Image map={map} setMap={setMap} dimensions={dimensions} />
		</div>
	)
}

export default Map