import React, { Component } from 'react';
import { Anime } from '../../..';
import { FButton } from '../../components/FButton';

const defaultSelectedColor: string = '#969696';
const defaultSelectedSecondaryColor: string = '#646464';
const correctSelectedColor: string = '#2ecc71';
const correctSelectedSecondaryColor: string = '#06863c';
const incorrectSelectedColor: string = '#ff6114';
const incorrectSelectedSecondaryColor: string = '#fc0254';

interface ButtonPickerProps {
	optionList: Array<Anime>;
    correctAnime: Anime;
    displayCorrectAnswers: boolean;

	optionClicked: (anime: Anime) => void;
}

interface ButtonPickerState {
	selectedAnime?: Anime;
}

class ButtonPicker extends Component<ButtonPickerProps, ButtonPickerState> {
	constructor(props: any) {
		super(props);

		this.state = {};
	}

	private handleOptionClick(animeListEntry: Anime) {
		//Don't let someone pick more than once. If they get it wrong they gotta suck it up and watch the video
		if (this.props.displayCorrectAnswers) return;

		//Add it to the answer history
		this.props.optionClicked?.call(this, animeListEntry);

		this.setState({
			selectedAnime: animeListEntry,
		});
	}

	render() {
		return (
			<>
				{this.props.optionList.map((animeListEntry) => {
					let selected =
						this.state.selectedAnime?.title ===
						animeListEntry.title;
					let selectedColor = defaultSelectedColor;
					let selectedSecondaryColor = defaultSelectedSecondaryColor;

					//If a button is selected
					if (this.props.displayCorrectAnswers) {
						//If we are the correct answer, highlight ourselves green
						if (
							this.props.correctAnime.title ===
							animeListEntry.title
						) {
							selected = true;
							selectedColor = correctSelectedColor;
							selectedSecondaryColor = correctSelectedSecondaryColor;
						}

						//Othewise, if we're selected but incorrect
						else if (selected) {
							selectedColor = incorrectSelectedColor;
							selectedSecondaryColor = incorrectSelectedSecondaryColor;
						}
					}

					return (
						<FButton
							key={animeListEntry.url}
							onClick={() =>
								this.handleOptionClick(animeListEntry)
							}
							text={animeListEntry.title}
							selected={selected && this.props.displayCorrectAnswers}
							selectedColor={selectedColor}
							selectedSecondaryColor={selectedSecondaryColor}
						/>
					);
				})}
			</>
		);
	}
}

export default ButtonPicker;
