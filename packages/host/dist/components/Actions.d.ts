import { Child } from './SlackBase';
import { Datepicker } from './DatePicker';
import { Button } from './Button';
declare type ActionsChild = Datepicker | Button;
export declare class Actions extends Child {
    elements: Array<ActionsChild>;
    constructor(props: any, root: any);
    appendChild(child: ActionsChild): void;
    removeChild(child: ActionsChild): void;
    insertBefore(child: ActionsChild, beforeChild: ActionsChild): void;
    render(): {
        type: string;
        elements: ({
            type: string;
            placeholder: {
                type: string;
                text: string;
            } | undefined;
            action_id: string | undefined;
            initial_date: string | undefined;
        } | {
            type: string;
            text: {
                type: string;
                text: string;
            };
            action_id: string | undefined;
            value: string | undefined;
            style: "primary" | "danger" | undefined;
        })[];
    };
}
export {};
