import 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'fb-button': any;
      'fb-button-group': any;
      'fb-checkbox': any;
      'fb-events-page-toolbar-actions': any;
      'fb-events-page-event-checkbox': any;
    }
  }
}
