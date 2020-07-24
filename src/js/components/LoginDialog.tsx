import React, { Component } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
	Button,
	Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { userExists, login, register } from '../utils/storage';

interface LoginDialogProps {
	open: boolean;

	onClose: () => void;
}

interface LoginDialogState {
	usernameError: boolean;
	passwordError: boolean;

	usernameHelperText?: string;
	passwordHelperText?: string;

	username?: string;
	password?: string;

	snackbarOpen: boolean;
}

class LoginDialog extends Component<LoginDialogProps, LoginDialogState> {
	constructor(props: any) {
		super(props);

		this.state = {
			usernameError: false,
			passwordError: false,

			snackbarOpen: false,
		};

		this.handleLogin = this.handleLogin.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
	}

	private onUsernameChange(event: { target: { name: string; value: string } }) {
		this.setState({ username: event.target.value });
	}

	private onPasswordChange(event: { target: { name: string; value: string } }) {
		this.setState({ password: event.target.value });
	}

	private async handleLogin() {
		if (!this.state.username || this.state.username === '')
			this.setState({
				usernameError: true,
				usernameHelperText: 'Username must not be empty',
			});
		if (!this.state.password || this.state.password === '')
			this.setState({
				passwordError: true,
				passwordHelperText: 'Password must not be empty',
			});

		if (
			this.state.username &&
			this.state.username?.length > 0 &&
			this.state.password &&
			this.state.password?.length > 0
		) {
			if (await login(this.state.username, this.state.password)) {
				this.props.onClose?.call(this);
			} else if (!userExists(this.state.username)) {
				this.setState({
					usernameError: true,
					usernameHelperText: 'User does not exist',
				});
			} else
				this.setState({
					passwordError: true,
					passwordHelperText: 'Incorrect password',
				});
		}
	}

	private async handleRegister() {
		if (!this.state.username || this.state.username === '')
			this.setState({
				usernameError: true,
				usernameHelperText: 'Username must not be empty',
			});
		if (!this.state.password || this.state.password === '')
			this.setState({
				passwordError: true,
				passwordHelperText: 'Password must not be empty',
			});

		if (
			this.state.username &&
			this.state.username?.length > 0 &&
			this.state.password &&
			this.state.password?.length > 0
		) {
			if (await register(this.state.username, this.state.password)) {
				this.props.onClose?.call(this);
			} else if (userExists(this.state.username)) {
				this.setState({
					usernameError: true,
					usernameHelperText: 'User already exists',
				});
			} else
				this.setState({
					snackbarOpen: true,
				});
		}
	}

	private onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key === 'Enter') {
			this.handleLogin();
		}
	}

	private handleSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
		if (reason === 'clickaway') return;
		this.setState({ snackbarOpen: false });
	}

	render() {
		return (
			<>
				<Dialog
					open={this.props.open}
					onClose={this.props.onClose}
					disableBackdropClick
					disableEscapeKeyDown
					aria-labelledby='form-dialog-title'
				>
					<DialogTitle id='form-dialog-title'>Log in / Register</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Please enter your username and password. If you have not registered, you may do so by
							entering an unused username and password and pressing Register
						</DialogContentText>
						<TextField
							autoFocus
							error={this.state.usernameError}
							helperText={this.state.usernameHelperText}
							margin='dense'
							id='name'
							label='Username'
							type='text'
							fullWidth
							onChange={this.onUsernameChange}
							onKeyDown={this.onKeyDown}
						/>
						<TextField
							error={this.state.passwordError}
							helperText={this.state.passwordHelperText}
							margin='dense'
							id='password'
							label='Password'
							type='password'
							fullWidth
							onChange={this.onPasswordChange}
							onKeyDown={this.onKeyDown}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.setState({ snackbarOpen: true })} color='primary'>
							Error
						</Button>
						<Button onClick={this.handleRegister} color='primary'>
							Register
						</Button>
						<Button onClick={this.handleLogin} color='primary'>
							Login
						</Button>
					</DialogActions>
				</Dialog>
				<Snackbar open={this.state.snackbarOpen} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
					<MuiAlert elevation={6} variant='filled' onClose={this.handleSnackbarClose} severity='error'>
						An unknown error occurred
					</MuiAlert>
				</Snackbar>
			</>
		);
	}
}

export default LoginDialog;
