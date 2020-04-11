import React, { Component } from 'react';
import '../../style/Homepage.scss';
import ReactPlayer from 'react-player';
import 'typeface-roboto';
import { GuessingState, AnimeListEntry, QuizAnswer } from '../..';
import AnimeAutocomplete from './answerTypes/AnimeAutocomplete';
import ButtonPicker from './answerTypes/ButtonPicker';
import ProgressMoon from '../components/progressmoon/ProgressMoon';

interface QuizProps {
	animeList: Array<AnimeListEntry>;
	selectorType: 'autocomplete' | 'buttons';

	onQuizEnd?: (answerHistory?: Array<QuizAnswer>) => void;
}

interface QuizState {
	guessingState: GuessingState;

	correctAnime?: AnimeListEntry;
	guessedAnime?: AnimeListEntry;
	answerHistory?: Array<QuizAnswer>;
	videoPlaying?: boolean;

	//Input options
	buttonOptions?: Array<AnimeListEntry>;
	autocompleteText?: string;
}

class Quiz extends Component<QuizProps, QuizState> {
	constructor(props: any) {
		super(props);

		this.state = {
			guessingState: 'none',
		};

		this.switchSong = this.switchSong.bind(this);
		this.startQuiz = this.startQuiz.bind(this);
		this.onVideoEnded = this.onVideoEnded.bind(this);
		this.optionButtonClicked = this.optionButtonClicked.bind(this);
		this.autocompleteTextChanged = this.autocompleteTextChanged.bind(this);
		this.onAutocompleteCompleted = this.onAutocompleteCompleted.bind(this);
	}

	componentDidMount() {
		this.startQuiz();
	}

	private switchSong() {
		//Select an unasked song
		let unasked: Array<AnimeListEntry> = this.props.animeList.filter(
			(listItem) =>
				!this.state.answerHistory?.find(
					(x) => x.item === listItem && x.correct
				)
		);

		//If we have options to show, we're not done with the list yet
		if (unasked.length > 0) {
			let newSong = unasked[Math.floor(Math.random() * unasked.length)];

			//If we're using buttons, we need to populate some options
			if (this.props.selectorType === 'buttons') {
				let numberOfOptions = unasked.length >= 4 ? 4 : unasked.length;
				let options = this.shuffle(
					unasked.filter((x) => x !== newSong)
				).slice(0, numberOfOptions - 1);
				options.push(newSong);
				options = this.shuffle(options);

				this.setState({ buttonOptions: options });
			}

			//Set new song/state info
			this.setState({
				guessingState: 'guessing',
				correctAnime: newSong,
				videoPlaying: true,

				autocompleteText: '',
			});
		}

		//If we don't have options to show, move to the postgame state
		else this.props.onQuizEnd?.call(this, this.state.answerHistory);
	}

	private startQuiz() {
		this.setState({
			guessingState: 'none',

			correctAnime: undefined,
			answerHistory: undefined,
		});

		//Initate song switch and start play
		this.switchSong();
	}

	private onVideoEnded() {
		//If the player has selected a song, then they got it wrong and have been sitting there watching the video the whole time
		//Let's go ahead and switch that for them
		if (this.state.guessedAnime) this.switchSong();

		//If they haven't picked an option yet, just set the playing state to false and let the other logic handle everything else
		else this.setState({ videoPlaying: false });
	}

	private shuffle(a: Array<any>) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	private optionButtonClicked(anime: AnimeListEntry) {
		this.onGuessed(anime);
	}

	private autocompleteTextChanged(value: string) {
		this.setState({ autocompleteText: value });
	}

	private onAutocompleteCompleted(value: string) {
		const anime = this.props.animeList.find(
			(x) => x.title === value
		) as AnimeListEntry;

		this.onGuessed(anime ?? { title: value });
	}

	private onGuessed(anime: AnimeListEntry) {
		//Add it to the answer history
		let answerHistory = this.state.answerHistory ?? [];
		answerHistory.push({
			item: anime,
			correct: anime.title === this.state.correctAnime?.title,
			answer: this.state.correctAnime,
		});

		this.setState({
			guessingState: 'postguess',
			guessedAnime: anime,
			answerHistory: answerHistory,
		});

		//Switch to the next video if the player got it right
		if (
			anime?.title === this.state.correctAnime?.title ||
			!this.state.videoPlaying
		)
			setTimeout(this.switchSong, 2000);
	}

	render() {
		return (
			<>
				<ReactPlayer
					url={this.state.correctAnime?.url}
					onEnded={this.onVideoEnded}
					playing
					style={{
						display: `${
							this.state.guessingState === 'guessing'
								? 'none'
								: 'block'
						}`,
					}}
				/>
				{this.state.guessingState === 'guessing' && <ProgressMoon />}
				<br />
				{this.props.selectorType === 'autocomplete'
					? this.state.correctAnime && (
							<AnimeAutocomplete
								autocompletable={
									this.state.guessingState === 'guessing'
								}
								showCorrectness={
									this.state.guessingState === 'postguess'
								}
								autocompleteList={this.props.animeList.map(
									(x) => x.title
								)}
								correctAnswer={this.state.correctAnime.title}
								text={this.state.autocompleteText ?? ''}
								onTextChanged={this.autocompleteTextChanged}
								onComplete={this.onAutocompleteCompleted}
							/>
					  )
					: this.state.buttonOptions &&
					  this.state.correctAnime && (
							<ButtonPicker
								optionList={this.state.buttonOptions}
								optionClicked={this.optionButtonClicked}
								correctAnime={this.state.correctAnime}
								displayCorrectAnswers={
									this.state.guessingState === 'postguess'
								}
							/>
					  )}
			</>
		);
	}
}

export default Quiz;
