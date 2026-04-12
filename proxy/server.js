const express = require('express');
const axios = require('axios');

const app = express();
const port = 3005;

// Service configurations
const services = {
  runpod: {
    apiKey: process.env.RUNPOD_API_KEY,
    fetchBalance: async (apiKey) => {
      const response = await axios.post('https://api.runpod.io/graphql', {
        query: `
          query {
            myself {
              balance
            }
          }
        `
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return Number.parseFloat(response.data.data.myself.balance).toFixed(2);
    }
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    fetchBalance: async (apiKey) => {
      const response = await axios.get('https://api.openai.com/v1/dashboard/billing/subscription', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return Number.parseFloat(response.data.hard_limit_usd).toFixed(2);
    }
  },
  grok: {
    apiKey: process.env.GROK_API_KEY,
    fetchBalance: async (apiKey) => {
      // xAI (Grok) API - balance/usage endpoint
      const response = await axios.get('https://api.x.ai/v1/billing', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return Number.parseFloat(response.data.balance || 0).toFixed(2);
    }
  },
  venice: {
    apiKey: process.env.VENICE_API_ADMIN_KEY,
    fetchBalance: async (apiKey) => {
      // Venice API - billing balance endpoint (requires Admin API key)
      const response = await axios.get('https://api.venice.ai/api/v1/billing/balance', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return Number.parseFloat(response.data?.balances?.usd || 0).toFixed(2);
    }
  }
};

app.get('/balance/:service', async (req, res) => {
  const service = req.params.service.toLowerCase();
  const serviceConfig = services[service];

  if (!serviceConfig) {
    return res.status(400).json({ error: `Unknown service: ${service}` });
  }

  try {
    let balance;
    switch (service) {
      case 'runpod':
        if (!serviceConfig.apiKey) {
          return res.status(500).json({ error: 'RUNPOD_API_KEY not configured' });
        }
        balance = await serviceConfig.fetchBalance(serviceConfig.apiKey);
        break;
      case 'openai':
        if (!serviceConfig.apiKey) {
          return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
        }
        balance = await serviceConfig.fetchBalance(serviceConfig.apiKey);
        break;
      case 'grok':
        if (!serviceConfig.apiKey) {
          return res.status(500).json({ error: 'GROK_API_KEY not configured' });
        }
        balance = await serviceConfig.fetchBalance(serviceConfig.apiKey);
        break;
      case 'venice':
        if (!serviceConfig.apiKey) {
          return res.status(500).json({ error: 'VENICE_API_ADMIN_KEY not configured' });
        }
        balance = await serviceConfig.fetchBalance(serviceConfig.apiKey);
        break;
      default:
        return res.status(400).json({ error: `Service ${service} not implemented` });
    }

    res.json({ service, balance, currency: 'USD' });
  } catch (error) {
    console.error(`Error fetching ${service} balance:`, error.message);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    res.status(500).json({ error: `Failed to fetch ${service} balance: ${error.message}` });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', services: Object.keys(services) });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Balance proxy server running on port ${port}`);
  console.log('Available services:', Object.keys(services).join(', '));
});
