import React, { Component } from 'react';

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
					src={require('./moonmoonlayer.png')}
					className='moonlogo'
					alt='logo'
				/>
				<img
					src={require('./moonstarlayer.png')}
					className='starslogo'
					alt='logo'
				/>
			</div>
		);
	}
}

export default ProgressMoon;
