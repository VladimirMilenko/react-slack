import { Child, Root } from './SlackBase';

export class Text extends Child {
  text: string;

  constructor(text: string, root: Root) {
    super({}, root, 'TEXT');
    this.text = text;
  }
  setText(text: string) {
    this.text = text;
  }
  render() {
    return {
      type: 'plain_text',
      text: this.text,
    };
  }
}
