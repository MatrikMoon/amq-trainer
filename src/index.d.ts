export interface Anime {
    title: string;
    url: string;
}

export interface QuizAnswer {
    askedFor: Anime;
    correct: boolean;
    answer?: Anime;
}

type MoeResponseItem = {
	title: string;
	source: string;
	file: string;
	mime: Array<string>;
};