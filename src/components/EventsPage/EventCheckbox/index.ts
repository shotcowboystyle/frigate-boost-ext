import { checkboxDefaultProps } from '@components/Checkbox/Checkbox';
import { customElement } from 'solid-element';
import EventCheckbox from './EventCheckbox';

customElement(
  'fb-events-page-event-checkbox',
  checkboxDefaultProps,
  EventCheckbox,
);
