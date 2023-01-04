import optionsStorage from './options-storage.js';

type FETCH_METHOD = 'GET' | 'POST' | 'DELETE';

let FRIGATE_DOMAIN: string | null = null;

export const makeRequest = async ({
  apiEndpointPath = '',
  method = 'GET',
  body = null,
}: {
  apiEndpointPath: string;
  method: FETCH_METHOD;
  body?: any;
}) => {
  if (!FRIGATE_DOMAIN) {
    const storedOptions = await optionsStorage.getAll();
    FRIGATE_DOMAIN = storedOptions.frigate_instance_domain;
  }

  const res = await fetch(`${FRIGATE_DOMAIN}${apiEndpointPath}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    referrer: 'no-referrer',
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const { errors, ...response } = await res.json();

  if (errors) {
    throw new Error(errors.message ?? 'Custom Error');
  }

  return response;
};
