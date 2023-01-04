import { noShadowDOM } from 'solid-element';
import { Component, Show } from 'solid-js';

export interface ButtonProps {
  label: string;
  handleOnClick: () => any;
  isLoading: boolean;
}

export const buttonDefaultProps: ButtonProps = {
  label: '',
  handleOnClick: () => {},
  isLoading: false,
};

const Button: Component<ButtonProps> = (props: ButtonProps) => {
  noShadowDOM();

  return (
    <button
      class="whitespace-nowrap items-center space-x-1 text-white shadow focus:shadow-xl hover:shadow-md bg-gray-500 focus:bg-gray-400 active:bg-gray-600 ring-gray-300 font-sans inline-flex font-bold uppercase text-xs px-1.5 md:px-2 py-2 rounded outline-none focus:outline-none ring-opacity-50 transition-colors focus:ring-2 cursor-pointer"
      onclick={props.handleOnClick}>
      <Show when={!props.isLoading} fallback={<div>Loading...</div>}>
        {props.label}
      </Show>
    </button>
  );
};

export default Button;
