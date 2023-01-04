import { getCurrentElement, noShadowDOM } from 'solid-element';
import { Component } from 'solid-js';

export interface CheckboxProps {
  value: string;
  handleOnClick: ((event: Event) => any) | undefined;
  handleOnChange: ((event: Event) => any) | undefined;
}

export const checkboxDefaultProps: CheckboxProps = {
  value: '',
  handleOnClick: undefined,
  handleOnChange: undefined,
};

const Checkbox: Component<CheckboxProps> = (props: CheckboxProps) => {
  noShadowDOM();

  const el = getCurrentElement();
  el.addEventListener('click', function (event: Event) {
    props.handleOnClick?.(event);
  });
  el.addEventListener('change', function (this: HTMLElement, event: Event) {
    props.handleOnChange?.(event);
  });

  return <input type="checkbox" value={props.value} />;
};

export default Checkbox;
