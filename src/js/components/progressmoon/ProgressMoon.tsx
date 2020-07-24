import React, { Component } from "react";
import '../../../style/components/progressMoon/ProgressMoon.scss'

interface ProgressMoonProps {}

interface ProgressMoonState {}

class ProgressMoon extends Component<ProgressMoonProps, ProgressMoonState> {
	constructor(props: any) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className='logo'>
				<img
					src={require('../../../style/components/progressMoon/moonmoonlayer.png')}
					className='moonlogo'
					alt='logo'
				/>
				<img
					src={require('../../../style/components/progressMoon/moonstarlayer.png')}
					className='starslogo'
					alt='logo'
				/>
			</div>
		);
	}
}

export default ProgressMoon;
