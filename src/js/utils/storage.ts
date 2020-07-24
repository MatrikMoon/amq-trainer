import { Anime, QuizAnswer } from "../..";
import * as bcrypt from 'bcryptjs';
import { tempList } from "./mock-constants";

const saltRounds = 10;
let currentUser: string;
let currentSettings: Settings;

export type Settings = {
    username: string; //Pretty sure this is pointless but I'm keeping it here anyway
    hashedPassword: string;
    salt: string;

    animes: Array<Anime>;
    masterHistory: Array<QuizAnswer>;

    guessTime: number;
    postGuessTime: number;

    multipleChoice: boolean;
    firstLogin: boolean;
}

function setCurrentUser(username: string) {
    currentUser = username;
    window.localStorage.setItem('currentUser', username);
}

async function hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
}

function getPrefixedKey(username: string, key: string): string {
    return `${username}-${key}`;
}

export async function login(username: string, password: string): Promise<boolean> {
    setCurrentUser(username);
    const currentSettings = loadSettings();

    //If the user doesn't exist, that's a nope
    const success = userExists(username) && ((await hashPassword(password, currentSettings.salt)) === currentSettings.hashedPassword);
    if (!success) logout();
    return success;
}

export async function register(username: string, password: string): Promise<boolean> {
    //Can't register as a user that already exists
    if (userExists(username)) return false;
    
    const salt = await bcrypt.genSalt(saltRounds);
    let hashedPassword = await hashPassword(password, salt);
    
    //currentSettings could have been changed by hashPassword
    setCurrentUser(username);
    currentSettings = loadSettings();
    currentSettings.username = username;
    currentSettings.hashedPassword = hashedPassword;
    currentSettings.salt = salt;
    currentSettings.animes = tempList;
    currentSettings.masterHistory = [];
    currentSettings.guessTime = 20;
    currentSettings.postGuessTime = 10;
    currentSettings.multipleChoice = false;
    currentSettings.firstLogin = true;

    saveSettings(currentSettings);

    return true;
}

export function logout() {
    setCurrentUser('');
}

export function isLoggedIn(): boolean {
    const user = getCurrentUser();
    return user !== undefined && user !== null && user.length > 0;
}

export function getCurrentUser(): string | undefined {
    return currentUser ?? window.localStorage.getItem('currentUser') ?? undefined;
}

export function userExists(username: string): boolean {
    return window.localStorage.getItem(getPrefixedKey(username, 'username')) !== null;
}

export function loadSettings(): Settings {
    return currentSettings ?? {
        username: window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'username')) as string,
        hashedPassword: window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'hashedPassword')) as string,
        salt: window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'salt')) as string,

        animes: JSON.parse(window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'animes')) as string) as Array<Anime>,
        masterHistory: JSON.parse(window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'masterHistory')) as string) as Array<QuizAnswer>,

        guessTime: parseInt(window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'guessTime')) ?? '0'),
        postGuessTime: parseInt(window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'postGuessTime')) ?? '10'),

        multipleChoice: window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'multipleChoice')) as string === 'true',
        firstLogin: window.localStorage.getItem(getPrefixedKey(getCurrentUser() as string, 'firstLogin')) as string === 'true',
    };
}

export function saveSettings(settings: Settings) {
    currentSettings = settings;

    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'username'), settings.username);
    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'hashedPassword'), settings.hashedPassword);
    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'salt'), settings.salt);

    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'animes'), JSON.stringify(settings.animes));
    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'masterHistory'), JSON.stringify(settings.masterHistory));

    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'guessTime'), settings.guessTime.toString());
    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'postGuessTime'), settings.postGuessTime.toString());
    
    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'multipleChoice'), settings.multipleChoice ? 'true' : 'false');
    window.localStorage.setItem(getPrefixedKey(getCurrentUser() as string, 'firstLogin'), settings.firstLogin ? 'true' : 'false');
}