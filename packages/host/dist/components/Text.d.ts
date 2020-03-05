import { Child, Root } from './SlackBase';
export declare class Text extends Child {
    text: string;
    constructor(text: string, root: Root);
    setText(text: string): void;
    render(): {
        type: string;
        text: string;
    };
}
