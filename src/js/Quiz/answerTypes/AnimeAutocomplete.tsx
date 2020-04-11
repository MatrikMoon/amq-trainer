import React, { Component } from 'react';
import { FSearchBar } from '../../components/FSearchBar';

const inputDefaultColor: string = '#444b58';
const inputDefaultShadowColor: string = '#00000099';
const inputCorrectColor: string = '#44584b';
const inputCorrectShadowColor: string = '#00000000';
const inputIncorrectColor: string = '#932d2db3';
const inputIncorrectShadowColor: string = '#00000000';

interface AutocompleteProps {
	autocompletable: boolean;
	showCorrectness: boolean;
	autocompleteList: Array<string>;
	correctAnswer: string;

	text: string;

	onTextChanged: (value: string) => void;
	onComplete?: (anime: string) => void;
}

class AnimeAutocomplete extends Component<AutocompleteProps> {
	render() {
		return (
			<>
				{(() => {
					let backgroundColor = inputDefaultColor;
					let shadowColor = inputDefaultShadowColor;

					if (this.props.showCorrectness) {
						let correct = this.props.text === this.props.correctAnswer;

						backgroundColor = correct
							? inputCorrectColor
							: inputIncorrectColor;
						shadowColor = correct
							? inputCorrectShadowColor
							: inputIncorrectShadowColor;
					}

					return (
						<FSearchBar
							text={this.props.text}
							autoCompletable={this.props.autocompletable}
							autoCompleteSet={this.props.autocompleteList}
							onComplete={this.props.onComplete}
							onTextChanged={this.props.onTextChanged}
							backgroundColor={backgroundColor}
							shadowColor={shadowColor}
						/>
					);
				}).call(this)}
			</>
		);
	}
}

export default AnimeAutocomplete;
