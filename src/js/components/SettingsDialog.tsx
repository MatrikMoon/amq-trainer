import React, { Component } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Switch,
	Grid,
	Slider,
	Input,
	Typography,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { loadSettings, saveSettings, Settings } from '../utils/storage';

interface SettingsDialogProps {
	open: boolean;

	onClose: () => void;
}

interface SettingsDialogState {
	settings: Settings;

	animeTitleInput: string;
	animeUrlInput: string;

	multipleChoice: boolean;

	guessTime: number;
	postGuessTime: number;
}

class SettingsDialog extends Component<SettingsDialogProps, SettingsDialogState> {
	constructor(props: any) {
		super(props);

		const settings = loadSettings();

		this.state = {
			settings: settings,

			animeTitleInput: '',
			animeUrlInput: '',
			multipleChoice: settings.multipleChoice,
			guessTime: settings.guessTime,
			postGuessTime: settings.postGuessTime,
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.multipleChoiceSwitched = this.multipleChoiceSwitched.bind(this);
		this.onAnimeTitleChange = this.onAnimeTitleChange.bind(this);
		this.onAnimeUrlChange = this.onAnimeUrlChange.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.handleAddClick = this.handleAddClick.bind(this);
		this.handleGuessTimeSliderChange = this.handleGuessTimeSliderChange.bind(this);
		this.handleGuessTimeInputChange = this.handleGuessTimeInputChange.bind(this);
		this.handlePostGuessTimeSliderChange = this.handlePostGuessTimeSliderChange.bind(this);
		this.handlePostGuessTimeInputChange = this.handlePostGuessTimeInputChange.bind(this);
	}

	private handleSave() {
		const settings = this.state.settings;
		settings.multipleChoice = this.state.multipleChoice;
		settings.guessTime = this.state.guessTime;
		settings.postGuessTime = this.state.postGuessTime;
		saveSettings(this.state.settings);
		this.handleClose();
	}

	private handleClose() {
		this.props.onClose?.call(this);
	}

	private multipleChoiceSwitched(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ multipleChoice: event.target.checked });
	}

	private onAnimeTitleChange(event: { target: { name: string; value: string } }) {
		this.setState({ animeTitleInput: event.target.value });
	}

	private onAnimeUrlChange(event: { target: { name: string; value: string } }) {
		this.setState({ animeUrlInput: event.target.value });
	}

	private handleAddClick() {
		if (!this.state.animeTitleInput || !this.state.animeUrlInput) return;

		const newAnime = {
			title: this.state.animeTitleInput,
			url: this.state.animeUrlInput,
		};

		const settings = this.state.settings;
		settings.animes.push(newAnime);

		this.setState({
			settings: settings,
			animeTitleInput: '',
			animeUrlInput: '',
		});
	}

	private handleDeleteClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const deleteClickedTitle =
			event.currentTarget?.parentElement?.parentElement?.firstElementChild?.firstElementChild?.firstElementChild
				?.innerHTML;
		const settings = this.state.settings;
		settings.animes = settings.animes.filter((x) => x.title !== deleteClickedTitle);

		this.setState({ settings: settings });
	}

	private handleGuessTimeSliderChange(event: any, newValue: number | number[]) {
		this.setState({ guessTime: newValue as number });
	}

	private handleGuessTimeInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ guessTime: parseInt(event.target.value) });
	}

	private handlePostGuessTimeSliderChange(event: any, newValue: number | number[]) {
		this.setState({ postGuessTime: newValue as number });
	}

	private handlePostGuessTimeInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ postGuessTime: parseInt(event.target.value) });
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
				<DialogTitle id='form-dialog-title'>Settings</DialogTitle>
				<DialogContent>
					<DialogContentText>Settings will be saved to your browser</DialogContentText>
					<List>
						<ListItem>
							<ListItemText primary='Multiple choice' />
							<ListItemSecondaryAction>
								<Switch
									edge='end'
									onChange={this.multipleChoiceSwitched}
									checked={this.state.multipleChoice}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem>
							<Typography id='input-slider' gutterBottom>
								Guess Time
							</Typography>
							<Grid container spacing={2} alignItems='center'>
								<Grid item xs>
									<Slider
										value={this.state.guessTime}
										onChange={this.handleGuessTimeSliderChange}
										aria-labelledby='input-slider'
									/>
								</Grid>
								<Grid item>
									<Input
										value={this.state.guessTime}
										margin='dense'
										onChange={this.handleGuessTimeInputChange}
										//onBlur={handleBlur}
										inputProps={{
											step: 1,
											min: 0,
											max: 100,
											type: 'number',
											'aria-labelledby': 'input-slider',
										}}
									/>
								</Grid>
							</Grid>
						</ListItem>
						<ListItem>
							<Typography id='input-slider' gutterBottom>
								Postguess Time
							</Typography>
							<Grid container spacing={2} alignItems='center'>
								<Grid item xs>
									<Slider
										value={this.state.postGuessTime}
										onChange={this.handlePostGuessTimeSliderChange}
										aria-labelledby='input-slider'
									/>
								</Grid>
								<Grid item>
									<Input
										value={this.state.postGuessTime}
										margin='dense'
										onChange={this.handlePostGuessTimeInputChange}
										//onBlur={handleBlur}
										inputProps={{
											step: 1,
											min: 0,
											max: 100,
											type: 'number',
											'aria-labelledby': 'input-slider',
										}}
									/>
								</Grid>
							</Grid>
						</ListItem>
						<form style={{ padding: '8px 16px' }}>
							<TextField
								value={this.state.animeTitleInput}
								label='Anime Title'
								onChange={this.onAnimeTitleChange}
							/>
							<TextField
								value={this.state.animeUrlInput}
								label='Video url'
								onChange={this.onAnimeUrlChange}
							/>
							<IconButton edge='end' aria-label='delete' onClick={this.handleAddClick}>
								<AddIcon />
							</IconButton>
						</form>
						{this.state.settings &&
							this.state.settings.animes.map((anime) => {
								return (
									<ListItem key={anime.title}>
										<ListItemText primary={anime.title} secondary={anime.url} />
										<ListItemSecondaryAction>
											<IconButton edge='end' aria-label='delete' onClick={this.handleDeleteClick}>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								);
							})}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} color='primary'>
						Cancel
					</Button>
					<Button onClick={this.handleSave} color='primary'>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default SettingsDialog;
