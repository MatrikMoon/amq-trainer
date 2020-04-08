import React, { Component, CSSProperties } from 'react';
import '../../style/FSearchBar.scss';

type SearchBarState = {
	text: string;
};

type SearchBarProps = {
	//Mechanics
	text?: string;
	onComplete?: (text: string) => void;
	onTextChanged?: (text: string) => void;

	//Options and parameters
	autoCompletable?: boolean;
	autoCompleteSet?: Array<string>;

	//Colors
	backgroundColor?: string;
	shadowColor?: string;
};

export class FSearchBar extends Component<SearchBarProps, SearchBarState> {
	private listRef: React.RefObject<any>;
	private inputRef: React.RefObject<any>;

	constructor(props: SearchBarProps) {
		super(props);

		this.state = {
			text: this.props.text ?? ''
		};

		this.onTextChanged = this.onTextChanged.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onAutoCompleteItemClick = this.onAutoCompleteItemClick.bind(this);
		this.onAutoCompleteKeyDown = this.onAutoCompleteKeyDown.bind(this);

		this.listRef = React.createRef();
		this.inputRef = React.createRef();

		//Gets document onkeydown so we can control the autocomplete
		document.onkeydown = this.onKeyDown;
	}

	private onTextChanged(event: React.ChangeEvent<HTMLInputElement>) {
		this.props.onTextChanged?.call(this, event.target.value);
		this.setState({ text: event.target.value });
	}

	private onKeyDown(event: KeyboardEvent) {
		if (
			event.key === 'Enter' &&
			document.activeElement === this.inputRef.current
		) {
			this.props.onComplete?.call(this, this.state.text ?? '');
		} else if (
			event.key === 'ArrowUp' &&
			document.activeElement !== this.inputRef.current
		) {
			if (document.activeElement === this.listRef.current.firstChild)
				this.inputRef.current.focus();
			else {
				(document.activeElement?.previousSibling as any).focus();
			}
		} else if (
			event.key === 'ArrowDown' &&
			document.activeElement !== this.listRef.current.lastChild
		) {
			if (document.activeElement === this.inputRef.current) {
				this.listRef.current.firstElementChild.focus();
			} else {
				(document.activeElement?.nextSibling as any).focus();
			}
		}
	}

	private onAutoCompleteItemClick(
		event: React.MouseEvent<HTMLLIElement, MouseEvent>
	) {
		this.autocompleteItemSelected(event.target);
	}

	private onAutoCompleteKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
		if (event.key === 'Enter') {
			this.autocompleteItemSelected(event.target);
		}
	}

	private autocompleteItemSelected(target: any) {
		this.setState({ text: target.innerText });
		this.inputRef.current.focus();
	}

	render() {
		let style = {
			'--background-color': this.props.backgroundColor ?? '#444b58',
			'--shadow-color': this.props.shadowColor ?? '#00000099',
		} as CSSProperties;

		const listItems = this.props.autoCompleteSet?.filter(x =>
			x.toLowerCase().includes(this.state.text?.toLowerCase() as string)
		);

		return (
			<div className='bar'>
				<input
					ref={this.inputRef}
					className={
						this.state.text &&
						this.props.autoCompletable &&
						listItems && listItems.length > 0
							? 'list-open'
							: ''
					}
					value={this.state.text}
					onChange={this.onTextChanged}
					spellCheck={false}
					style={style}
				/>
				{this.state.text &&
					this.props.autoCompletable &&
					this.props.autoCompleteSet && (
						<ul ref={this.listRef}>
							{listItems?.map(x => {
								return (
									<li
										key={x}
										onClick={this.onAutoCompleteItemClick}
										onKeyDown={this.onAutoCompleteKeyDown}
										data-id={x}
										tabIndex={1}
									>
										{x}
									</li>
								);
							})}
						</ul>
					)}
			</div>
		);
	}
}
