import '@components/Checkbox';
import { noShadowDOM } from 'solid-element';
import { Component } from 'solid-js';

import type { CheckboxProps } from '@components/Checkbox/Checkbox';

const EventCheckbox: Component<CheckboxProps> = (props) => {
  noShadowDOM();

  return (
    <fb-checkbox
      handle-on-click={props.handleOnClick}
      handle-on-change={props.handleOnChange}
      value={props.value}
    />
  );
};

export default EventCheckbox;
