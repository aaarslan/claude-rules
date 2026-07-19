/**
 * widget-client 2.4.1
 *
 * The package exposes a single entry point: `createClient(options)`. There is
 * no class to construct and no default export.
 */

const DEFAULT_ENDPOINT = 'https://widgets.example.com/v2';
const DEFAULT_TIMEOUT_MS = 5000;

export function createClient(options = {}) {
  const {
    apiKey,
    endpoint = DEFAULT_ENDPOINT,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    transport
  } = options;

  if (!apiKey) {
    throw new Error('widget-client: apiKey is required');
  }

  const send = transport ?? defaultTransport;

  return {
    endpoint,
    timeoutMs,

    async deliver(message) {
      if (!message || typeof message.channel !== 'string') {
        throw new Error('widget-client: message.channel is required');
      }

      return send({
        url: `${endpoint}/deliver`,
        apiKey,
        timeoutMs,
        body: {
          channel: message.channel,
          text: message.text ?? '',
          tags: message.tags ?? []
        }
      });
    },

    async status() {
      return send({ url: `${endpoint}/status`, apiKey, timeoutMs, body: null });
    }
  };
}

async function defaultTransport() {
  throw new Error(
    'widget-client: no transport configured; pass options.transport'
  );
}
