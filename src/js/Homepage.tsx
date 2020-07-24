import React, { Component } from 'react';
import '../style/Homepage.scss';
import { FButton } from './components/FButton';
import { Anime, QuizAnswer } from '..';
import 'typeface-roboto';
import { tempList } from './utils/mock-constants';
import ProgressMoon from './components/progressMoon/ProgressMoon';
import Quiz from './quiz/Quiz';
import { isLoggedIn, loadSettings, saveSettings } from './utils/storage';
import HeaderBar from './components/HeaderBar';

type GameState = 'pregame' | 'loading' | 'ingame' | 'postgame' | 'error';

interface HomepageState {
	//UI State
	gameState: GameState;

	//Data
	animeList: Array<Anime>;
}

class Homepage extends Component<{}, HomepageState> {
	constructor(props: any) {
		super(props);

		this.state = {
			gameState: 'pregame',
			animeList: isLoggedIn() ? loadSettings().animes : tempList,
		};

		this.startQuiz = this.startQuiz.bind(this);
		this.onQuizEnd = this.onQuizEnd.bind(this);
	}

	private startQuiz() {
		this.setState({ gameState: 'ingame' });
	}

	private onQuizEnd(history: Array<QuizAnswer>) {
		this.setState({ gameState: 'postgame' });

		const settings = loadSettings();
		settings.masterHistory = settings.masterHistory.concat(history);
		saveSettings(settings);
	}

	render() {
		return (
			<>
				<HeaderBar />
				<div className='Homepage'>
					{
						//Pregame render
						(this.state.gameState === 'pregame' || this.state.gameState === 'loading') && (
							<>
								AMQ Trainer
								<ProgressMoon />
								This is still beta-as-hell so just work with me a little here
								<br />
								<br />
								{this.state.gameState === 'pregame' && (
									<FButton onClick={this.startQuiz} text={'START QUIZ'} />
								)}
							</>
						)
					}
					{
						//Render if we're currently playing the game
						this.state.gameState === 'ingame' && (
							<Quiz
								animeList={this.state.animeList}
								selectorType={loadSettings().multipleChoice ? 'buttons' : 'autocomplete'}
								onQuizEnd={this.onQuizEnd}
							/>
						)
					}
					{
						//Render if we're done with the game
						this.state.gameState === 'postgame' && (
							<FButton onClick={this.startQuiz} text={'RESTART QUIZ'} />
						)
					}
				</div>
			</>
		);
	}
}

export default Homepage;
