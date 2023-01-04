import { customElement } from 'solid-element';
import ToolbarActions, {
  eventsPageToolbarActionsPropsDefaultProps,
} from './ToolbarActions';

customElement(
  'fb-events-page-toolbar-actions',
  eventsPageToolbarActionsPropsDefaultProps,
  ToolbarActions,
);
