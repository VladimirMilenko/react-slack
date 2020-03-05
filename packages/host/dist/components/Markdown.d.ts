import { Child, Root } from './SlackBase';
import { Text } from './Text';
declare type MarkdownChildren = Text;
export declare class Markdown extends Child {
    children: Array<MarkdownChildren>;
    constructor(props: Object, root: Root);
    appendChild(child: MarkdownChildren): void;
    removeChild(child: MarkdownChildren): void;
    insertBefore(child: MarkdownChildren, beforeChild: MarkdownChildren): void;
    render(): {
        type: string;
        text: string;
    };
}
export {};
