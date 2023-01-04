import { MESSAGING_DELETE_EVENTS } from '@src/constants';
import type { ProtocolWithReturn } from 'webext-bridge';

// type DeleteEventFetchResponse = {
//   message?: string;
//   success: boolean;
// };

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    [MESSAGING_DELETE_EVENTS]: ProtocolWithReturn<
      { eventId: string },
      {
        message?: string;
        success: boolean;
      }
    >;
    'sync-previous-filename': { filename: string };
    'sync-previous-line-number': { lineNumber: number };
    'highlight-input': { tabId: number };
    'tab-prev': { title: string | undefined };
    'highlight-to-textbox': { text: string; url: string | null };
    'get-current-tab': ProtocolWithReturn<
      { tabId: number },
      { title?: string }
    >;
  }
}
