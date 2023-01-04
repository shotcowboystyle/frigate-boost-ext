import { MESSAGING_DELETE_EVENTS } from '@src/constants';
import '@webcomponents/custom-elements';
import select from 'select-dom';
import { render } from 'solid-js/web';
import { sendMessage } from 'webext-bridge';

import {
  EventsPageEventCheckbox,
  EventsPageToolbarActions,
} from '@components/EventsPage';
import { EVENT_ID_REGEX } from '@src/constants';

let eventIds = new Set();
let selectedEvents = new Set();

let lastChecked: HTMLInputElement;
let checkboxes: NodeListOf<Element> | undefined = undefined;

let isDeletingSelected: boolean = false;
let isDeletingAll: boolean = false;

function handleCheckMultiple(this: HTMLInputElement, event: Event) {
  event.stopPropagation();

  if (!checkboxes?.length) {
    checkboxes = document.querySelectorAll('input[type="checkbox"]');
  }

  let inBetween = false;

  if (
    (event as PointerEvent).shiftKey &&
    (event.target as HTMLInputElement)?.checked
  ) {
    checkboxes.forEach((checkbox) => {
      if (
        (checkbox as HTMLInputElement).value === this.value ||
        (checkbox as HTMLInputElement).value === lastChecked.value
      ) {
        inBetween = !inBetween;
      }

      if (inBetween) {
        (checkbox as HTMLInputElement).checked = true;
        selectedEvents.add((checkbox as HTMLInputElement).value);
      }
    });
  }

  lastChecked = this;
}

const handleDeleteEvents = async (type: string) => {
  let deleteEventIds: string[] = [];
  if (type === 'selected') {
    deleteEventIds = Array.from(selectedEvents) as string[];
    isDeletingSelected = true;
    selectedEvents = new Set();
  } else if (type === 'all') {
    deleteEventIds = Array.from(eventIds) as string[];
    isDeletingAll = true;
    eventIds = new Set();
  }

  for await (const eventId of deleteEventIds) {
    const res = await sendMessage(MESSAGING_DELETE_EVENTS, {
      eventId,
    });

    if (res?.success) {
      selectedEvents.delete(eventId);
      eventIds.delete(eventId);
    }
  }

  isDeletingSelected = false;
  isDeletingAll = false;
};

const handleSelectEvent = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target?.checked) {
    selectedEvents.add(target.value);
  } else if (selectedEvents.has(target?.value)) {
    selectedEvents.delete(target?.value);
  }
};

const targetNode = document.getElementById('app');

const config = {
  attributes: false,
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationList: MutationRecord[]) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList' && mutation.addedNodes?.length) {
      const addedNodes: NodeList = mutation.addedNodes;
      const firstAddedNode = addedNodes[0] as HTMLElement;

      if (firstAddedNode.firstChild?.nodeName === 'H1') {
        const toolbarTarget: HTMLElement | undefined = select(
          'h1 + div svg',
          firstAddedNode,
        );
        if (toolbarTarget) {
          const eventsToolbarMountPoint = document.createElement('div');
          eventsToolbarMountPoint.classList.add(
            'ml-auto',
            'mr-2',
            'flex',
            'justify-end',
            'grow',
          );
          render(
            () => (
              <EventsPageToolbarActions
                handleDeleteEvents={handleDeleteEvents}
                isDeletingSelected={isDeletingSelected}
                isDeletingAll={isDeletingAll}
              />
            ),
            eventsToolbarMountPoint,
          );
          toolbarTarget.parentNode?.parentNode?.insertBefore(
            eventsToolbarMountPoint,
            toolbarTarget.parentNode,
          );
        }
      }

      const eventId = firstAddedNode.innerHTML?.match(EVENT_ID_REGEX)?.[0];
      if (eventId && !eventIds.has(eventId)) {
        eventIds.add(eventId);

        const checkboxMountPoint = document.createElement('div');
        checkboxMountPoint.classList.add(
          'ml-2',
          'mr-2',
          'flex',
          'justify-end',
          'self-center',
        );
        checkboxMountPoint.onclick = (e) => e.preventDefault();

        render(
          () => (
            <EventsPageEventCheckbox
              value={eventId}
              handleOnClick={handleCheckMultiple}
              handleOnChange={handleSelectEvent}
            />
          ),
          checkboxMountPoint,
        );
        firstAddedNode.appendChild(checkboxMountPoint);
      }
    }
  }
});

if (targetNode) {
  observer.observe(targetNode, config);
}
