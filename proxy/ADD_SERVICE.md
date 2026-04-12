# Adding a New Service to the Balance Proxy

To add a new AI service or cloud provider to the balance proxy:

## 1. Get the Service API Key

Obtain the API key for the new service from their dashboard.

**Important:** For Venice, you must use an **Admin API key** (not an inference-only key) to access the `/billing/balance` endpoint. Inference-only keys are only permitted to run inference and cannot access billing information.

## 2. Add Environment Variables

Add the required API key to `docker-compose.yml` under the `balance-proxy` service:

```yaml
environment:
  - NEWSERVICE_API_KEY=${NEWSERVICE_API_KEY}
```

## 3. Add Service Configuration

In `proxy/server.js`, add your service to the `services` object:

```javascript
const services = {
  // ... existing services
  newservice: {
    apiKey: process.env.NEWSERVICE_API_KEY,
    fetchBalance: async (apiKey) => {
      // Implement API call to fetch balance
      const response = await axios.get('https://api.newservice.com/balance', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return Number.parseFloat(response.data.balance || 0).toFixed(2);
    }
  }
};
```

## 3. Add Service Handler

Add a case in the switch statement in the `/balance/:service` endpoint:

```javascript
case 'newservice':
  if (!serviceConfig.apiKey) {
    return res.status(500).json({ error: 'NEWSERVICE_API_KEY not configured' });
  }
  balance = await serviceConfig.fetchBalance(serviceConfig.apiKey);
  break;
```

## 4. Create Widget File

Create a new widget file in `config/widgets/`:

```bash
cp config/widgets/balance-widget.html config/widgets/newservice-balance.html
```

Edit the new file to:
- Change the title (e.g., `<h3>NewService Balance</h3>`)
- Update the fetch URL to use the environment variable for the proxy base URL:
```html
const response = await fetch('{{HOMEPAGE_VAR_BALANCE_PROXY_URL}}/balance/newservice');
```

The `BALANCE_PROXY_URL` in `.env` should be set to `https://homepagehelper.thecreems.com` to use the nginx reverse proxy, which allows widgets to work from remote browsers.

Make sure `BALANCE_PROXY_URL` is set in `.env` and passed through to the Homepage container as `HOMEPAGE_VAR_BALANCE_PROXY_URL`.

## 5. Add Service to Dashboard

In `config/services.yaml`, add the service to the Cloud section:

```yaml
- Cloud:
    - NewService:
        href: https://newservice.com
        description: AI Platform
        icon: newservice.png
        widgets:
          - type: newservice-balance
```

## 6. Add to Infisical

Add the API key to your Infisical project as `NEWSERVICE_API_KEY` and configure injection into the `balance-proxy` container.

## Currently Implemented Services

- **RunPod**: GraphQL API with balance query
- **OpenAI**: Billing subscription endpoint
- **Grok (xAI)**: Billing endpoint
- **Venice**: User balance endpoint

## Tips for Finding Balance Endpoints

Most AI services have billing/balance endpoints in their documentation:
- Check the service's API documentation for "billing", "usage", or "account" endpoints
- Look for REST endpoints that return account balance or credit information
- Some services may require specific headers or authentication methods
