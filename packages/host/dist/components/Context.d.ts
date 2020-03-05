import { Child, Root } from './SlackBase';
import { Text } from './Text';
import { Markdown } from './Markdown';
declare type ContextChildren = Text | Markdown;
export declare class Context extends Child {
    elements: Array<ContextChildren>;
    constructor(props: any, root: Root);
    appendChild(child: ContextChildren): void;
    removeChild(child: ContextChildren): void;
    insertBefore(child: ContextChildren, beforeChild: ContextChildren): void;
    render(): {
        type: string;
        elements: ({
            type: string;
            text: string;
        } | null)[];
    };
}
export {};
