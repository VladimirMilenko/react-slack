export declare type Root = Object & {
    onCommited: () => void;
};
export declare class Child {
    __type: string;
    __root: Root;
    props: any;
    constructor(props: any, root: Root, type: string);
    onCommit(): void;
}
