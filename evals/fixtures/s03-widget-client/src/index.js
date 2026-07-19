import { createNotifier } from './notifier.js';

const notifier = createNotifier({
  apiKey: process.env.WIDGET_API_KEY,
  endpoint: process.env.WIDGET_ENDPOINT,
  transport: async (request) => {
    const response = await fetch(request.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${request.apiKey}`
      },
      body: request.body === null ? undefined : JSON.stringify(request.body),
      signal: AbortSignal.timeout(request.timeoutMs)
    });

    if (!response.ok) {
      throw new Error(`widget service replied ${response.status}`);
    }

    return response.json();
  }
});

console.log(await notifier.health());
