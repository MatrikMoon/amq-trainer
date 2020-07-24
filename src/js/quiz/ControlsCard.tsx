import React, { Component } from 'react';
import {
	Card,
	CardContent,
	createStyles,
	withStyles,
	WithStyles,
	Grid,
	Slider,
} from '@material-ui/core';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

const styles = createStyles({
	root: {
		background: '#40444b',
		color: 'white',
		height: 'fit-content',
		margin: '15px',
	},
	content: {
		padding: '16px',
		'&:last-child': {
			paddingBottom: '16px',
		},
	},
	slider: {
		width: 100,
	},
});

interface ControlsCardProps extends WithStyles {
	onVolumeChange?: (volume: number) => void;
}

interface ControlsCardState {
	volume: number;
}

class ControlsCard extends Component<ControlsCardProps, ControlsCardState> {
	constructor(props: any) {
		super(props);

		this.state = {
			volume: 50,
		};

		this.handleVolumeChange = this.handleVolumeChange.bind(this);
	}

	private handleVolumeChange(event: any, newValue: number | number[]) {
		this.setState({ volume: newValue as number });

		this.props.onVolumeChange?.call(this, newValue as number);
	}

	render() {
		const { classes } = this.props;

		return (
			<Card className={classes.root}>
				<CardContent className={classes.content}>
					<Grid container spacing={2}>
						<Grid item>
							<VolumeDown />
						</Grid>
						<Grid item xs>
							<Slider
								className={classes.slider}
								value={this.state.volume}
								onChange={this.handleVolumeChange}
							/>
						</Grid>
						<Grid item>
							<VolumeUp />
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		);
	}
}

export default withStyles(styles)(ControlsCard);
