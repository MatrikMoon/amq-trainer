type GameState = 'pregame' | 'loading' | 'ingame' | 'postgame' | 'error';
type GuessingState = 'guessing' | 'postguess' | 'none';

export interface AnimeListEntry {
    title: string;
    url: string;
}

export interface QuizAnswer {
    item: AnimeListEntry;
    correct: boolean;
    answer?: AnimeListEntry;
}

type MoeResponseItem = {
	title: string;
	source: string;
	file: string;
	mime: Array<string>;
};