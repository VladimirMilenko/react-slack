import { Child, Root } from './SlackBase';
export declare class Divider extends Child {
    children: never[];
    constructor(props: Object, root: Root);
    appendChild(): void;
    removeChild(): void;
    render(): {
        type: string;
    };
}
