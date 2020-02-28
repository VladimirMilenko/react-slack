import { Child } from './SlackBase';

export class Divider extends Child {
    constructor(props, root) {
        super(props, root, "DIVIDER");

        this.children = [];
    }
    appendChild(child) { }
    removeChild(child) { }
    render() {
        return {
            type: "divider"
        };
    }
}
