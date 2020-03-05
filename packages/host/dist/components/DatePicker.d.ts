import { Child, Root } from './SlackBase';
export declare type DatePickerProps = {
    value?: string;
    placeholder?: string;
    initialDate?: string;
    actionId?: string;
    onChange?: (e: Object) => void;
};
export declare class Datepicker extends Child {
    onChange?: (e: Object) => void;
    value?: string;
    placeholder?: string;
    initialDate?: string;
    __actionId?: string;
    constructor(props: DatePickerProps, root: Root);
    setActionId(actionId: string): void;
    render(): {
        type: string;
        placeholder: {
            type: string;
            text: string;
        } | undefined;
        action_id: string | undefined;
        initial_date: string | undefined;
    };
}
