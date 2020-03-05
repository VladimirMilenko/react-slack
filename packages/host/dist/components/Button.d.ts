import { Child, Root } from './SlackBase';
import { Text } from './Text';
declare type ButtonChildren = Text;
declare type ButtonStyle = 'primary' | 'danger' | undefined;
export interface ButtonProps {
    style?: ButtonStyle;
    onClick?: (event: Object) => void;
    value?: string;
}
export declare class Button extends Child {
    children: Array<ButtonChildren>;
    onClick?: (event: Object) => void;
    style: ButtonStyle;
    value?: string;
    __actionId?: string;
    constructor(props: ButtonProps, root: Root);
    appendChild(child: ButtonChildren): void;
    removeChild(child: ButtonChildren): void;
    setActionId(actionId: string): void;
    insertBefore(child: ButtonChildren, beforeChild: ButtonChildren): void;
    render(): {
        type: string;
        text: {
            type: string;
            text: string;
        };
        action_id: string | undefined;
        value: string | undefined;
        style: ButtonStyle;
    };
}
export {};
