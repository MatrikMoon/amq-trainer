import React, { Component } from 'react';
import '../style/Homepage.scss';
import { FButton } from './components/FButton';
import { AnimeListEntry, GameState, QuizAnswer } from '..';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import 'typeface-roboto';
import { tempList } from './utils/mock-constants';
import Quiz from './Quiz/Quiz';
import ProgressMoon from './components/progressmoon/ProgressMoon';

interface HomepageState {
	//Data
	animeList: Array<AnimeListEntry>;

	//UI State
	gameState: GameState;

	//Material UI requires an element for popover location
	//It's dumb, but necessary
	anchorEl?: HTMLElement;
}

class Homepage extends Component<{}, HomepageState> {
	constructor(props: any) {
		super(props);

		this.state = {
			gameState: 'pregame',
			animeList: tempList,
		};

        this.startQuiz = this.startQuiz.bind(this);
        this.onQuizEnd = this.onQuizEnd.bind(this);
		this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
	}

	private startQuiz() {
		this.setState({ gameState: 'ingame' });
    }
    
    private onQuizEnd(answerHistory?: Array<QuizAnswer>) {
        this.setState({ gameState: 'postgame' });
    }

	private handleMenu(event: React.MouseEvent<HTMLElement>) {
		this.setState({ anchorEl: event.currentTarget });
	}

    private handleMenuItemClick(event: React.MouseEvent<HTMLElement>) {
        this.handleClose();

        console.log(event.currentTarget.innerText);
    }

	private handleClose() {
		this.setState({ anchorEl: undefined });
	}

	render() {
		return (
			<>
				<AppBar position='fixed'>
					<Toolbar>
						<IconButton
							edge='start'
							color='inherit'
							aria-label='menu'
						>
							<MenuIcon />
						</IconButton>
						<Typography
							className={'header-typography'}
							variant='h6'
						>
							Menu
						</Typography>
						<div>
							<IconButton
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={this.handleMenu}
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
								onClose={this.handleClose}
							>
								<MenuItem onClick={this.handleMenuItemClick}>Profile</MenuItem>
								<MenuItem onClick={this.handleMenuItemClick}>My account</MenuItem>
							</Menu>
						</div>
					</Toolbar>
				</AppBar>
				<header className='header'>
					{
						//Pregame render
						(this.state.gameState === 'pregame' ||
							this.state.gameState === 'loading') && (
							<>
								AMQ Trainer
								<ProgressMoon />
								This is still beta-as-hell so just work with me
								a little here
								<br />
								<br />
								{this.state.gameState === 'pregame' && (
									<FButton
										onClick={this.startQuiz}
										text={'START QUIZ'}
									/>
								)}
							</>
						)
					}
					{
						//Render if we're currently playing the game
						this.state.gameState === 'ingame' && (
							<Quiz
								animeList={this.state.animeList}
                                selectorType={'autocomplete'}
                                
                                onQuizEnd={this.onQuizEnd}
							/>
						)
					}
					{
						//Render if we're done with the game
						this.state.gameState === 'postgame' && (
							<FButton
								onClick={this.startQuiz}
								text={'RESTART QUIZ'}
							/>
						)
					}
				</header>
			</>
		);
	}
}

export default Homepage;
