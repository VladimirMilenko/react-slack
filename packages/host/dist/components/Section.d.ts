import { Root, Child } from './SlackBase';
import { Button } from './Button';
import { Datepicker } from './DatePicker';
import { Markdown } from './Markdown';
import { Text } from './Text';
declare type SectionChild = SectionAccessory | SectionText | SectionFields;
export declare class Section extends Child {
    fields: SectionFields | null;
    accessory: SectionAccessory | null;
    text: SectionText | null;
    constructor(props: Object, root: Root);
    appendChild(child: SectionChild): void;
    removeChild(child: SectionChild): void;
    insertBefore(child: SectionChild): void;
    render(): {
        type: string;
        text: {
            type: string;
            text: string;
        } | undefined;
        fields: {
            type: string;
            text: string;
        }[] | undefined;
        accessory: {
            type: string;
            text: {
                type: string;
                text: string;
            };
            action_id: string | undefined;
            value: string | undefined;
            style: "primary" | "danger" | undefined;
        } | {
            type: string;
            placeholder: {
                type: string;
                text: string;
            } | undefined;
            action_id: string | undefined;
            initial_date: string | undefined;
        } | null | undefined;
    };
}
declare type TextChildren = Text | Markdown;
export declare class SectionText extends Child {
    children: Array<TextChildren>;
    constructor(props: Object, root: Root);
    appendChild(child: TextChildren): void;
    removeChild(child: TextChildren): void;
    insertBefore(child: TextChildren, beforeChild: TextChildren): void;
    render: () => {
        type: string;
        text: string;
    };
}
declare type FieldsChildren = Markdown | Text;
export declare class SectionFields extends Child {
    children: Array<FieldsChildren>;
    constructor(props: Object, root: Root);
    appendChild(child: FieldsChildren): void;
    removeChild(child: FieldsChildren): void;
    insertBefore(child: FieldsChildren, beforeChild: FieldsChildren): void;
    render: () => {
        type: string;
        text: string;
    }[];
}
declare type AccessoryChildren = Button | Datepicker;
export declare class SectionAccessory extends Child {
    children: Array<AccessoryChildren>;
    constructor(props: Object, root: Root);
    appendChild(child: AccessoryChildren): void;
    removeChild(child: AccessoryChildren): void;
    insertBefore(child: AccessoryChildren, beforeChild: AccessoryChildren): void;
    render: () => {
        type: string;
        text: {
            type: string;
            text: string;
        };
        action_id: string | undefined;
        value: string | undefined;
        style: "primary" | "danger" | undefined;
    } | {
        type: string;
        placeholder: {
            type: string;
            text: string;
        } | undefined;
        action_id: string | undefined;
        initial_date: string | undefined;
    } | null;
}
export {};
