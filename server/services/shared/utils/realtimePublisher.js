const { env } = require('../config/env');

const publishRealtimeEvent = async (eventName, payload) => {
  try {
    await fetch(`${env.gatewayUrl}/internal/events`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ eventName, payload }),
    });
  } catch (err) {
    console.warn(`Unable to publish realtime event ${eventName}: ${err.message}`);
  }
};

module.exports = { publishRealtimeEvent };