import '@components/EventsPage/EventCheckbox';
import '@components/EventsPage/ToolbarActions';
import { Component } from 'solid-js';

import type { CheckboxProps } from '@components/Checkbox/Checkbox';
import type { EventsPageToolbarActionsProps } from './ToolbarActions/ToolbarActions';

export const EventsPageToolbarActions: Component<
  EventsPageToolbarActionsProps
> = (props: EventsPageToolbarActionsProps) => (
  <fb-events-page-toolbar-actions
    is-deleting-selected={props.isDeletingSelected}
    is-deleting-all={props.isDeletingAll}
    handle-delete-events={
      props.handleDeleteEvents
    }></fb-events-page-toolbar-actions>
);

export const EventsPageEventCheckbox: Component<CheckboxProps> = (
  props: CheckboxProps,
) => (
  <fb-events-page-event-checkbox
    value={props.value}
    handle-on-click={props.handleOnClick}
    handle-on-change={props.handleOnChange}></fb-events-page-event-checkbox>
);
