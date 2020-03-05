import { Button, Actions, Context, Markdown, Divider, Section, SectionText, SectionFields, SectionAccessory, Datepicker } from '../components';
import { Root } from 'components/SlackBase';

export const createElement = (type: string, props: Object, rootContainerInstance: Root) => {
  const LIB:{[key: string]: Function} = {
    'BUTTON': () => new Button(props, rootContainerInstance),
    'ACTIONS': () => new Actions(props, rootContainerInstance),
    'CONTEXT': () => new Context(props, rootContainerInstance),
    'MARKDOWN': () => new Markdown(props, rootContainerInstance),
    'DIVIDER': () => new Divider(props, rootContainerInstance),
    'SECTION': () => new Section(props, rootContainerInstance),
    'SECTION_TEXT': () => new SectionText(props, rootContainerInstance),
    'SECTION_FIELDS': () => new SectionFields(props, rootContainerInstance),
    'SECTION_ACCESSORY': () => new SectionAccessory(props, rootContainerInstance),
    'DATEPICKER': () => new Datepicker(props, rootContainerInstance)
  };

  if(typeof LIB[type] === 'function') {
      return LIB[type]();
  }
  throw new Error('Unsupported element type');
};
