import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./../css/cube.css"

const SCALE = 5;
const COLOR1 = '#8F6950';
const COLOR2 = '#E4C8A1';

function Box({ position, color, lock }) {
	const [active, setActive] = useState(false);
	const handleClick = () => {
		if (lock !== false)
			setActive(!active);
	}

	return (
		<mesh visible position={[position[0] / (10 / SCALE), position[1] / (10 / SCALE), position[2] / (10 / SCALE)]} onClick={(event) => handleClick()} >
			<boxBufferGeometry args={[0.1 * SCALE, 0.1 * SCALE, 0.01 * SCALE]} />
			<meshStandardMaterial color={position[0] % 2 === 0 ? color[0] : color[1]} transparent metalness={active === true ? 0.9 : 0.0} />
		</mesh>
	)
}

const BoardRow = ({row, color, lock}) => {
	return (
		<>
		<Box position={[0, row, 0]} color={color} lock={lock} />
		<Box position={[1, row, 0]} color={color} lock={lock} />
		<Box position={[2, row, 0]} color={color} lock={lock} />
		<Box position={[3, row, 0]} color={color} lock={lock} />
		<Box position={[4, row, 0]} color={color} lock={lock} />
		<Box position={[5, row, 0]} color={color} lock={lock} />
		<Box position={[6, row, 0]} color={color} lock={lock} />
		<Box position={[7, row, 0]} color={color} lock={lock} />
		</>
	)
}

const Board = ({position, lock}) => {
	const mesh = useRef()
	useFrame(() => {
//		mesh.current.rotation.x = mesh.current.rotation.y += 0.005
//		mesh.current.rotation.x += 0.005
//		console.log(mesh.current.position);
//		mesh.current.position.x += 0.01;
	});

	return (
		<mesh visible ref={mesh} position={position} >
			<BoardRow row={0} color={[COLOR1, COLOR2]} lock={lock} />
			<BoardRow row={1} color={[COLOR2, COLOR1]} lock={lock} />
			<BoardRow row={2} color={[COLOR1, COLOR2]} lock={lock} />
			<BoardRow row={3} color={[COLOR2, COLOR1]} lock={lock} />
			<BoardRow row={4} color={[COLOR1, COLOR2]} lock={lock} />
			<BoardRow row={5} color={[COLOR2, COLOR1]} lock={lock} />
			<BoardRow row={6} color={[COLOR1, COLOR2]} lock={lock} />
			<BoardRow row={7} color={[COLOR2, COLOR1]} lock={lock} />
		</mesh>
	)
}

const Camera = ({ position, lock }) => {
/*	const ref = useRef();
	const { setDefaultCamera } = useThree();
	useEffect(() => void setDefaultCamera(ref.current), []);
	useFrame(() => ref.current.updateMatrixWorld());
	return (
		<perspectiveCamera ref={ref} position={position} />
	)*/
	const { camera, gl } = useThree();
	useEffect(() => {
		const controls = new OrbitControls(camera, gl.domElement);
		controls.minDistance = 1;
		controls.maxDistance = 20;
		controls.enableRotate = !lock;
		controls.enableZoom = !lock;
		return () => { controls.dispose();};
	}, [camera, gl, lock]);
	return null;
}

const Cube = () => {
	const [lock, setLock] = useState(false);
	const handleFullScreen = () => {
		const elem = document.getElementsByClassName('boardCanvas')[0];
		if (!document.fullscreenElement) {
			if (elem.requestFullscreen)
				elem.requestFullscreen();
			else if (elem.webkitRequestFullscreen) /* Safari */
				elem.webkitRequestFullscreen();
		} else {
//			document.exitFullscreen();
		}
	}
	return (
		<div className='boardWrap'>
			<p className='boardInfo'><strong>controls:</strong><br/>
				dbclick => fullscreen<br/>
				mouse drag => rotate board<br/>
				contextmenu drag => move board <br/>
				mousewheel/pad => zoom board <br/>
				click tile(s) => active tile
			</p>
			<div className='lockToggle'>
				<label className="label">
					<div className="toggle" style={{ 'background': lock === false ? 'grey' : '#039dfc' }}>
						<input className="toggle-state" type="checkbox" name="check" value="check" onClick={() => setLock(!lock)}/>
 						<div className="indicator"></div>
					</div>
					<div className="label-text">disable Board rotate/zoom</div>
				</label>
			</div>
			<div className='boardCanvasWrap'>
				<Canvas className='boardCanvas' style={{width:'100%',height:'100%',background:'grey'}}
				onDoubleClick={() => handleFullScreen()}>
					<Camera position={[0, 0, 0]} lock={lock} />
					<ambientLight />
					<pointLight position={[-10, 10, 10]} />
					<Board position={[-0.35 * SCALE, -0.35 * SCALE, 0 * SCALE]} lock={lock} />
				</Canvas>
			</div>
		</div>
	)
}

export default Cube
