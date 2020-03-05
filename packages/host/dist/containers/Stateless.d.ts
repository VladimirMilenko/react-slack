export declare class ObjectSlackContainer {
    blocks: Array<Object>;
    lastCommited: Object | null;
    constructor();
    unsubscribeFromAction: () => void;
    subscribeToNewActionId: () => void;
    appendChild: (child: Object) => void;
    removeChild: (child: Object) => void;
    insertBefore: (child: Object, beforeChild: Object) => void;
    onCommited: () => void;
    render: () => any[];
}
