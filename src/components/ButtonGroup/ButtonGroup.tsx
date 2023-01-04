import { noShadowDOM } from 'solid-element';
import { Component } from 'solid-js';

const ButtonGroup: Component<{ handleOnClick: () => {} }> = (props) => {
  noShadowDOM();

  return <div></div>;
};

export default ButtonGroup;
