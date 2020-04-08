export interface AnimeListEntry {
    title: string;
    url: string;
}

export interface QuizAnswer {
    item: AnimeListEntry;
    correct: boolean;
    answer?: AnimeListEntry;
}