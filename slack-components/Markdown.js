import { Child } from './SlackBase';

export class Markdown extends Child {
    constructor(props, root) {
        super(props, root, "MARKDOWN");

        this.children = [];
    }
    appendChild(child) {
        this.children.push(child);
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }
    insertBefore(child, beforeChild) {
        const index = this.children.indexOf(beforeChild);
        if (index === 0) {
            this.children.unshift(child);
        } else {
            this.children.splice(index - 1, 0, child);
        }
    }
    render() {
        return {
            type: "mrkdwn",
            text: this.children.map(x => x.text).join("")
        };
    }
}
