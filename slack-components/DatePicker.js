import { Child } from './SlackBase';
import { Text } from './Text';

export class Datepicker extends Child {
  constructor(props, root) {
    super(props, root, "DATEPICKER");

    this.onChange = null;
    this.value = props.value || undefined;
    this.placeholder = props.placeholder;
    this.initialDate = props.initialDate || undefined;
  }

  render() {
    const { value, placeholder, initialDate, __actionId } = this;

    return {
      type: "datepicker",
      placeholder: placeholder ? new Text(this.placeholder).render() : undefined,
      action_id: this.__actionId,
      initial_date: value ? value : initialDate ? initialDate : undefined
    };
  }
}
