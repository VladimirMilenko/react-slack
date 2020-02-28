import { Child } from './SlackBase';

export class Text extends Child {
    constructor(text, root) {
        super(null, root, "TEXT");
        this.text = text;
    }
    setText(text) {
        this.text = text;
    }
    render() {
        return {
            type: "plain_text",
            text: this.text
        };
    }
}
