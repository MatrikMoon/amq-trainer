export interface Anime {
    title: string;
    url: string;
}

export interface QuizAnswer {
    correctAnime: Anime;
    guessedAnime?: Anime;
    correct: boolean;
}

type MoeResponseItem = {
	title: string;
	source: string;
	file: string;
	mime: Array<string>;
};