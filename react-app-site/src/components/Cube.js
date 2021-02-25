import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./../css/cube.css"

const SCALE = 5;
const COLOR1 = '#8F6950';
const COLOR2 = '#E4C8A1';

function Box({ position, color }) {
	const [active, setActive] = useState(false);
	const handleClick = () => {
		setActive(!active);
	}

	return (
		<mesh visible position={[position[0] / (10 / SCALE), position[1] / (10 / SCALE), position[2] / (10 / SCALE)]} onClick={(event) => handleClick()} >
			<boxBufferGeometry args={[0.1 * SCALE, 0.1 * SCALE, 0.01 * SCALE]} />
			<meshStandardMaterial color={position[0] % 2 === 0 ? color[0] : color[1]} transparent metalness={active === true ? 0.9 : 0.0} />
		</mesh>
	)
}

const BoardRow = ({row, color}) => {
	return (
		<>
		<Box position={[0, row, 0]} color={color} />
		<Box position={[1, row, 0]} color={color} />
		<Box position={[2, row, 0]} color={color} />
		<Box position={[3, row, 0]} color={color} />
		<Box position={[4, row, 0]} color={color} />
		<Box position={[5, row, 0]} color={color} />
		<Box position={[6, row, 0]} color={color} />
		<Box position={[7, row, 0]} color={color} />
		</>
	)
}

const Board = ({position}) => {
	const mesh = useRef()
	useFrame(() => {
//		mesh.current.rotation.x = mesh.current.rotation.y += 0.005
//		mesh.current.rotation.x += 0.005
//		console.log(mesh.current.position);
//		mesh.current.position.x += 0.01;
	});

	return (
		<mesh visible ref={mesh} position={position} >
			<BoardRow row={0} color={[COLOR1, COLOR2]}/>
			<BoardRow row={1} color={[COLOR2, COLOR1]}/>
			<BoardRow row={2} color={[COLOR1, COLOR2]}/>
			<BoardRow row={3} color={[COLOR2, COLOR1]}/>
			<BoardRow row={4} color={[COLOR1, COLOR2]}/>
			<BoardRow row={5} color={[COLOR2, COLOR1]}/>
			<BoardRow row={6} color={[COLOR1, COLOR2]}/>
			<BoardRow row={7} color={[COLOR2, COLOR1]}/>
		</mesh>
	)
}

const Camera = ({ position }) => {
/*	const ref = useRef();
	const { setDefaultCamera } = useThree();
	useEffect(() => void setDefaultCamera(ref.current), []);
	useFrame(() => ref.current.updateMatrixWorld());
	return (
		<perspectiveCamera ref={ref} position={position} />
	)*/
	const { camera, gl } = useThree();
	useEffect(
	  () => {

		const controls = new OrbitControls(camera, gl.domElement);
  
		controls.minDistance = 1;
		controls.maxDistance = 20;
		return () => {
		  controls.dispose();
		};
	  },
	  [camera, gl]
	);
	return null;

}

const Cube = () => {
	const handleFullScreen = () => {
		const elem = document.getElementsByClassName('boardCanvas')[0];
		if (!document.fullscreenElement) {
			if (elem.requestFullscreen)
				elem.requestFullscreen();
			else if (elem.webkitRequestFullscreen) /* Safari */
				elem.webkitRequestFullscreen();
		} else
			document.exitFullscreen();
	}
	return (
		<div className='boardWrap'>
			<p className='info'><strong>controls:</strong><br/>
				dbclick => fullscreen<br/>
				mouse drag => rotate board<br/>
				contextmenu drag => move board <br/>
				mousewheel/pad => zoom board <br/>
				click tile(s) => active tile
			</p>
			<Canvas className='boardCanvas' style={{width:700,height:500,background:'grey'}}
			onDoubleClick={() => handleFullScreen()}>
				<Camera position={[0, 0, 0]} />
				<ambientLight />
				<pointLight position={[-10, 10, 10]} />
				<Board position={[-0.35 * SCALE, -0.35 * SCALE, 0 * SCALE]} />
			</Canvas>
		</div>
	)
}

export default Cube