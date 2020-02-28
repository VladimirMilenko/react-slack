import { Child } from './SlackBase';

export class Section extends Child {
    constructor(props, root) {
        super(props, root, "SECTION");

        this.fields = null;
        this.accessory = null;
        this.text = null;
    }
    appendChild(child) {
        switch (child.__type) {
            case "SECTION_TEXT":
                this.text = child;
                break;
            case "SECTION_FIELDS":
                this.fields = child;
                break;
            case "SECTION_ACCESSORY":
                this.accessory = child;
                break;
            default:
                this.fields.push(child);
        }
    }
    removeChild(child) {
        switch (child.__type) {
            case "SECTION_TEXT":
                this.text = null;
                break;
            case "SECTION_FIELDS":
                this.fields = null;
                break;
            case "SECTION_ACCESSORY":
                this.accessory = null;
                break;
            default:
                const index = this.children.indexOf(child);
                this.fields.splice(index, 1);
                break;
        }
    }
    insertBefore(child, beforeChild) {
        this.appendChild(child);
    }
    render() {
        return {
            type: "section",
            text: this.text ? this.text.render() : undefined,
            fields: this.fields ? this.fields.render() : undefined,
            accessory: this.accessory ? this.accessory.render() : undefined
        };
    }
}

export class SectionText extends Child {
    constructor(props, root) {
        super(props, root, "SECTION_TEXT");
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
    render = () => {
        return {
            type: this.children.some(x => x.__type === "MARKDOWN")
                ? "mrkdwn"
                : "plain_text",
            text: this.children
                .map(x => x.render())
                .map(x => x.text)
                .join("")
        };
    };
}

export class SectionFields extends Child {
    constructor(props, root) {
        super(props, root, "SECTION_FIELDS");
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
    render = () => {
        return this.children.map(x => x.render());
    };
}

export class SectionAccessory extends Child {
    constructor(props, root) {
        super(props, root, "SECTION_ACCESSORY");
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
    render = () => {
        if (this.children.length > 1) {
            throw new Error("Accessory only accepts one child");
        }
        if (!this.children || this.children.length === 0) {
            return null;
        }
        return this.children[0].render();
    };
}
