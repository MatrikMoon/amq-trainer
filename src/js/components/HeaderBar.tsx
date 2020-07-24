import React, { Component } from 'react';
import '../../style/components/HeaderBar.scss';
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@material-ui/core';
import { getCurrentUser, loadSettings, logout, saveSettings, isLoggedIn } from '../utils/storage';
import SettingsDialog from './SettingsDialog';
import LoginDialog from './LoginDialog';
import AccountCircle from '@material-ui/icons/AccountCircle';


interface HeaderBarProps {}

interface HeaderBarState {
    //UI state
    settingsDialogOpen: boolean;
	loginDialogOpen: boolean;
	infoDialogOpen: boolean;

	//Material UI requires an element for popover location
	//It's dumb, but necessary
	anchorEl?: HTMLElement;
}

class HeaderBar extends Component<HeaderBarProps, HeaderBarState> {
	constructor(props: any) {
		super(props);

        this.state = {
            settingsDialogOpen: false,
			loginDialogOpen: !isLoggedIn(),
			infoDialogOpen: false,
        };
        
        this.handleMenuClick = this.handleMenuClick.bind(this);
		this.handleMenuClose = this.handleMenuClose.bind(this);
		this.handleSettingsClick = this.handleSettingsClick.bind(this);
		this.onSettingsDialogClose = this.onSettingsDialogClose.bind(this);
		this.handleLogoutClick = this.handleLogoutClick.bind(this);
		this.onLoginDialogClose = this.onLoginDialogClose.bind(this);
		this.onInfoDialogClose = this.onInfoDialogClose.bind(this);
    }
    
    private handleMenuClick(event: React.MouseEvent<HTMLElement>) {
		this.setState({ anchorEl: event.currentTarget });
	}

	private handleMenuClose() {
		this.setState({ anchorEl: undefined });
	}

	private handleSettingsClick() {
		this.handleMenuClose();
		this.setState({ settingsDialogOpen: true });
	}

	private onSettingsDialogClose() {
		this.setState({ settingsDialogOpen: false });
	}

	private onLoginDialogClose() {
		this.setState({
			loginDialogOpen: false,
			infoDialogOpen: loadSettings().firstLogin,
		});
	}

	private handleLogoutClick() {
		this.handleMenuClose();
		logout();
		this.setState({
            loginDialogOpen: true,
			settingsDialogOpen: false,
		});
	}

	private onInfoDialogClose() {
		this.setState({ infoDialogOpen: false });
		const settings = loadSettings();
		settings.firstLogin = false;
		saveSettings(settings);
	}

	render() {
		return (
			<>
				<AppBar position='fixed'>
					<Toolbar>
						<Typography className={'header-typography'} variant='h6'>
							{getCurrentUser()}
						</Typography>
						<div>
							<IconButton
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={this.handleMenuClick}
								color='inherit'
							>
								<AccountCircle />
							</IconButton>
							<Menu
								id='menu-appbar'
								anchorEl={this.state.anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={this.state.anchorEl !== undefined}
								onClose={this.handleMenuClose}
							>
								<MenuItem onClick={this.handleSettingsClick}>Settings</MenuItem>
								<MenuItem onClick={this.handleLogoutClick}>Log out</MenuItem>
							</Menu>
						</div>
					</Toolbar>
				</AppBar>
				{this.state.settingsDialogOpen && (
					<SettingsDialog open={this.state.settingsDialogOpen} onClose={this.onSettingsDialogClose} />
				)}
				{this.state.loginDialogOpen && ( //We must wrap the login dialog like this because we want it to remount every time it's opened
					<LoginDialog open={this.state.loginDialogOpen} onClose={this.onLoginDialogClose} />
				)}
				{this.state.infoDialogOpen && (
					<Dialog
						open={this.state.infoDialogOpen}
						onClose={this.onInfoDialogClose}
						aria-labelledby='alert-dialog-title'
						aria-describedby='alert-dialog-description'
					>
						<DialogTitle id='alert-dialog-title'>To Add Anime:</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-description'>
								Add anime to your list by going to the settings menu and entering an anime title and
								corresponding video url
							</DialogContentText>
							<DialogContentText>
								WARNING: Youtube links are *not* recommended. Youtube's player is unreliable and will
								sporadically not support seek/skip, so it often starts at the beginning of the song. I
								recommend looking up your favorite anime on openings.moe and using links from there.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.onInfoDialogClose} color='primary'>
								Ok
							</Button>
						</DialogActions>
					</Dialog>
				)}
			</>
		);
	}
}

export default HeaderBar;
