import React, { Component } from 'react';
import '../../style/quiz/Quiz.scss';
import ReactPlayer from 'react-player';
import 'typeface-roboto';
import { Anime, QuizAnswer } from '../..';
import ProgressMoon from '../components/progressMoon/ProgressMoon';
import AnimeAutocomplete from './answerTypes/AnimeAutocomplete';
import ButtonPicker from './answerTypes/ButtonPicker';
import { loadSettings } from '../utils/storage';
import ControlsCard from './ControlsCard';

type GuessingState = 'guessing' | 'postguess' | 'none';

interface QuizProps {
	animeList: Array<Anime>;
	selectorType: 'autocomplete' | 'buttons';

	onQuizEnd?: (answerHistory: Array<QuizAnswer>) => void;
}

interface QuizState {
	guessingState: GuessingState;
	answerHistory: Array<QuizAnswer>;

	correctAnime?: Anime;
	guessedAnime?: Anime;
	videoPlaying?: boolean;

	//Input options
	buttonOptions?: Array<Anime>;
	autocompleteText?: string;
	volume: number;
}

class Quiz extends Component<QuizProps, QuizState> {
	private player: ReactPlayer | undefined;

	constructor(props: any) {
		super(props);

		this.player = undefined;

		this.state = {
			guessingState: 'none',
			answerHistory: [],

			volume: 50,
		};

		this.switchSong = this.switchSong.bind(this);
		this.startQuiz = this.startQuiz.bind(this);
		this.onVideoEnded = this.onVideoEnded.bind(this);
		this.optionButtonClicked = this.optionButtonClicked.bind(this);
		this.autocompleteTextChanged = this.autocompleteTextChanged.bind(this);
		this.onAutocompleteCompleted = this.onAutocompleteCompleted.bind(this);
		this.onVideoReady = this.onVideoReady.bind(this);
	}

	componentDidMount() {
		this.startQuiz();
	}

	private switchSong() {
		const lastAsked =
			this.state.answerHistory.length > 0
				? this.state.answerHistory[this.state.answerHistory.length - 1]
				: undefined;

		//Select an unasked song
		let unasked: Array<Anime> = this.props.animeList.filter(
			(listItem) =>
				!this.state.answerHistory.find((x) => x.correctAnime.title === listItem.title && x.correct) &&
				listItem.title !== lastAsked?.correctAnime.title
		);

		//If we have options to show, we're not done with the list yet
		if (unasked.length > 0) {
			let newSong = unasked[Math.floor(Math.random() * unasked.length)];

			//If we're using buttons, we need to populate some options
			//We do this no matter what input type is selected just in case
			//the user decides to switch in the middle of a round
			let numberOfOptions = unasked.length >= 4 ? 4 : unasked.length;
			let options = this.shuffle(unasked.filter((x) => x !== newSong)).slice(0, numberOfOptions - 1);
			options.push(newSong);
			options = this.shuffle(options);

			this.setState({ buttonOptions: options });

			//Set new song/state info
			this.setState({
				guessingState: 'guessing',
				correctAnime: newSong,
				videoPlaying: false,

				autocompleteText: '',
			});
		}

		//If we don't have options to show, move to the postgame state
		else this.props.onQuizEnd?.call(this, this.state.answerHistory ?? []);
	}

	private startQuiz() {
		this.setState({
			guessingState: 'none',

			correctAnime: undefined,
			answerHistory: [],
		});

		//Initate song switch and start play
		this.switchSong();
	}

	private onVideoReady() {
		if (this.player && !this.state.videoPlaying) {
			const settings = loadSettings();
			const duration = this.player.getDuration();

			if (duration > settings.guessTime && settings.guessTime > 0) {
				const randomCeiling = duration - settings.guessTime;
				const randomStart = Math.floor(Math.random() * randomCeiling);
				this.player.seekTo(randomStart);
			} else this.player.seekTo(0);

			this.setState({ videoPlaying: true });
		}
	}

	private onVideoEnded() {
		//If the player has selected a song, then they got it wrong and have been sitting there watching the video the whole time
		//Let's go ahead and switch that for them
		if (this.state.guessingState === 'postguess') this.switchSong();
		//If they haven't picked an option yet, just set the playing state to false and let the other logic handle everything else
		else this.setState({ videoPlaying: false });
	}

	private optionButtonClicked(anime: Anime) {
		this.onGuessed(anime);
	}

	private autocompleteTextChanged(value: string) {
		this.setState({ autocompleteText: value });
	}

	private onAutocompleteCompleted(value: string) {
		const anime = this.props.animeList.find((x) => x.title === value) as Anime;

		this.onGuessed(anime ?? { title: value });
	}

	private onGuessed(anime: Anime) {
		//Add it to the answer history
		let answerHistory = this.state.answerHistory;
		answerHistory.push({
			guessedAnime: anime,
			correct: anime.title === this.state.correctAnime?.title,
			correctAnime: this.state.correctAnime as Anime,
		});

		this.setState({
			guessingState: 'postguess',
			guessedAnime: anime,
			answerHistory: answerHistory,
		});

		//Switch to the next video if the player got it right
		const postGuessTime = loadSettings().postGuessTime;
		if (postGuessTime > 0) {
			setTimeout(this.switchSong, postGuessTime * 1000);
		}

		//If there's no set post guess time, we switch on correct and wait on fail
		else if (anime?.title === this.state.correctAnime?.title || !this.state.videoPlaying)
			setTimeout(this.switchSong, 2000);
	}

	private shuffle(a: Array<any>) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	render() {
		return (
			<>
				{this.state.guessingState === 'postguess' && <>{this.state.correctAnime?.title}</>}
				<div className='player-container'>
					<ReactPlayer
						ref={(ref) => {
							if (ref) this.player = ref;
						}}
						volume={this.state.volume / 100}
						url={this.state.correctAnime?.url}
						onReady={this.onVideoReady}
						onEnded={this.onVideoEnded}
						playing={this.state.videoPlaying}
						style={{
							display: `${this.state.guessingState === 'guessing' ? 'none' : 'block'}`,
						}}
					/>
					<ControlsCard onVolumeChange={(volume) => this.setState({ volume: volume })} />
				</div>
				{this.state.guessingState === 'guessing' && <ProgressMoon />}
				<br />
				{this.props.selectorType === 'autocomplete'
					? this.state.correctAnime && (
							<AnimeAutocomplete
								autocompletable={this.state.guessingState === 'guessing'}
								showCorrectness={this.state.guessingState === 'postguess'}
								autocompleteList={this.props.animeList.map((x) => x.title)}
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
								displayCorrectAnswers={this.state.guessingState === 'postguess'}
							/>
					  )}
			</>
		);
	}
}

export default Quiz;
