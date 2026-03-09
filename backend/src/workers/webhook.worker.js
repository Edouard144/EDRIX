// Webhook delivery worker
// Picks up pending deliveries and POSTs them to the target URL
// Retries with exponential backoff on failure

import '../config/env.js';
import * as queries from '../modules/webhooks/webhooks.queries.js';
import { signPayload, getNextRetryAt } from '../utils/webhook.js';

const deliverWebhook = async (delivery) => {
  const body = JSON.stringify(delivery.payload);
  const signature = signPayload(delivery.payload, delivery.secret);

  try {
    const response = await fetch(delivery.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-EDRIX-Signature': signature,   // receiver verifies this
        'X-EDRIX-Event': delivery.event,
        'X-EDRIX-Delivery': delivery.id,
      },
      body,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const responseBody = await response.text();
    const success = response.status >= 200 && response.status < 300;

    await queries.updateDelivery(delivery.id, {
      status: success ? 'success' : 'pending',
      response_status: response.status,
      response_body: responseBody.substring(0, 500), // cap at 500 chars
      next_retry_at: success ? null : getNextRetryAt(delivery.attempts),
      delivered_at: success ? new Date() : null,
    });

    console.log(`${success ? '✅' : '🔄'} Webhook ${delivery.event} → ${delivery.url} [${response.status}]`);

  } catch (err) {
    // Network error, timeout, DNS failure etc.
    await queries.updateDelivery(delivery.id, {
      status: delivery.attempts + 1 >= 5 ? 'failed' : 'pending',
      response_status: null,
      response_body: err.message,
      next_retry_at: getNextRetryAt(delivery.attempts),
      delivered_at: null,
    });

    console.log(`❌ Webhook delivery failed: ${err.message}`);
  }
};

const startWorker = async () => {
  console.log('🔄 Webhook worker started — polling every 3s');

  setInterval(async () => {
    try {
      const deliveries = await queries.getPendingDeliveries();
      for (const delivery of deliveries) {
        await deliverWebhook(delivery);
      }
    } catch (err) {
      console.error('Webhook worker error:', err.message);
    }
  }, 3000);
};

startWorker();