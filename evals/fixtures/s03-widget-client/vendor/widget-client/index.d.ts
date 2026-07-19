export interface WidgetMessage {
  channel: string;
  text?: string;
  tags?: string[];
}

export interface WidgetTransportRequest {
  url: string;
  apiKey: string;
  timeoutMs: number;
  body: unknown;
}

export interface WidgetClientOptions {
  apiKey: string;
  endpoint?: string;
  timeoutMs?: number;
  transport?: (request: WidgetTransportRequest) => Promise<unknown>;
}

export interface WidgetClient {
  readonly endpoint: string;
  readonly timeoutMs: number;
  deliver(message: WidgetMessage): Promise<unknown>;
  status(): Promise<unknown>;
}

/** The only entry point of this package. */
export function createClient(options: WidgetClientOptions): WidgetClient;
