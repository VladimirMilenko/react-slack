import {ButtonProps} from '../src/components/Button';
import { DatePickerProps } from 'components/DatePicker';

type EmptyProps = {

};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "BUTTON": ButtonProps;
      "CONTEXT": EmptyProps;
      "DATE_PICKER": DatePickerProps;
    }
  }
}
