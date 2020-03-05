import { Child, Root } from './SlackBase';
import { Text } from './Text';
import { getFakeRoot } from '../utils';

export type DatePickerProps = {
  value?: string;
  placeholder?: string;
  initialDate?: string;
  actionId?: string;
  onChange?: (e: Object) => void;
};

export class Datepicker extends Child {
  onChange?: (e: Object) => void;
  value?: string;
  placeholder?: string;
  initialDate?: string;
  __actionId?: string;

  constructor(props: DatePickerProps, root: Root) {
    super(props, root, 'DATEPICKER');

    this.onChange = props.onChange;
    this.value = props.value || undefined;
    this.placeholder = props.placeholder;
    this.initialDate = props.initialDate || undefined;
    this.__actionId = props.actionId;
  }

  setActionId(actionId: string) {
    this.__actionId = actionId;
  }

  render() {
    const { value, placeholder, initialDate, __actionId } = this;

    return {
      type: 'datepicker',
      placeholder: placeholder
        ? new Text(placeholder, getFakeRoot()).render()
        : undefined,
      action_id: __actionId,
      initial_date: value ? value : initialDate ? initialDate : undefined,
    };
  }
}
