import '@components/Button';
import { noShadowDOM } from 'solid-element';
import { Component } from 'solid-js';

export interface EventsPageToolbarActionsProps {
  handleDeleteEvents: (type: string) => any;
  isDeletingSelected: boolean;
  isDeletingAll: boolean;
}

export const eventsPageToolbarActionsPropsDefaultProps: EventsPageToolbarActionsProps =
  {
    handleDeleteEvents: () => {},
    isDeletingSelected: false,
    isDeletingAll: false,
  };

const ToolbarActions: Component<EventsPageToolbarActionsProps> = (
  props: EventsPageToolbarActionsProps,
) => {
  noShadowDOM();

  return (
    <div class="flex gap-2">
      <fb-button
        is-loading={props.isDeletingSelected}
        handle-on-click={() => props.handleDeleteEvents('selected')}
        label="Delete Selected"></fb-button>
      <fb-button
        is-loading={props.isDeletingAll}
        handle-on-click={() => props.handleDeleteEvents('all')}
        label="Delete All"></fb-button>
    </div>
  );
};

export default ToolbarActions;
