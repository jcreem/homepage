# Homepage Dashboard - TheCreems

This is a gethomepage.dev dashboard for TheCreems services.

## Services Configured

### Custom Apps (with status and lunch buttons)
- **FactsEngine**: https://factsenginer.thecreems.com
- **SonarQube**: https://sonarqube.thecreems.com
- **StateDB Mirror**: https://statedbmirror.thecreems.com
- **FPE Admin**: https://fpeadmin.thecreems.com

### Hosted Third-Party Apps
- **Keycloak** (Auth): https://auth.thecreems.com
- **Infisical**: https://infisical.thecreems.com
- **MetaMCP**: https://mcp.thecreems.com
- **OpenWebUI**: https://openwebui.thecreems.com

### Cloud
- **RunPod**: https://www.runpod.io (with balance widget)
- **OpenAI**: https://platform.openai.com (with balance widget)
- **Grok**: https://x.ai (with balance widget)
- **Venice**: https://venice.ai (with balance widget)

## Usage

Start the dashboard:
```bash
docker-compose up -d
```

The dashboard will be available at http://localhost:8099 (localhost only)

## Balance Proxy Service

The balance proxy service securely fetches balances from AI and cloud services:
- **Proxy service**: `balance-proxy` (Node.js/Express)
- **API keys**: Stored as environment variables (Infisical-ready)
- **Widget base URL**: `BALANCE_PROXY_URL`
- **Endpoint pattern**: `${BALANCE_PROXY_URL}/balance/{service}`

### Supported Services

- **RunPod** (`/balance/runpod`) - Fully functional
- **OpenAI** (`/balance/openai`) - Fully functional
- **Grok** (`/balance/grok`) - Fully functional
- **Venice** (`/balance/venice`) - Fully functional

### Setting up API Keys with Infisical (via Varlock)

This project uses **Varlock** to securely inject secrets from Infisical into containers using the `.env.schema` decorator pattern.

1. Create API keys for each service:
   - RunPod: https://www.runpod.io/console/user/settings
   - OpenAI: https://platform.openai.com/api-keys
   - Grok (xAI): https://console.x.ai/
   - Venice: https://venice.ai/api-keys (requires Admin key)
2. Add them to your Infisical project in the `external_services` folder with names:
   - `RUNPOD_API_KEY`
   - `OPENAI_API_KEY`
   - `GROK_API_KEY`
   - `VENICE_API_ADMIN_KEY`
   - `BALANCE_PROXY_URL` (optional, defaults to https://homepagehelper.thecreems.com)
3. Create an Infisical Machine Identity (Universal Auth) and get your Client ID and Client Secret
4. Set the following in your `.env` file:
   - `INFISICAL_PROJECT_ID` - Your Infisical project ID (numeric)
   - `INFISICAL_ENVIRONMENT` - Environment name (default: production)
   - `INFISICAL_API_URL` - Infisical API URL (default: https://api.infisical.com)
   - `INFISICAL_UNIVERSAL_AUTH_CLIENT_ID` - Machine identity client ID
   - `INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET` - Machine identity client secret
5. Varlock will automatically fetch and inject secrets from Infisical at container startup

For manual testing without Infisical, set keys directly in `.env` file:
```
RUNPOD_API_KEY=your_actual_runpod_key
OPENAI_API_KEY=your_actual_openai_key
GROK_API_KEY=your_actual_grok_key
VENICE_API_ADMIN_KEY=your_actual_venice_admin_key
BALANCE_PROXY_URL=https://homepagehelper.thecreems.com
```

**Note:** Venice requires an **Admin API key** (not an inference-only key) to access the billing balance endpoint.

`BALANCE_PROXY_URL` should be set to `https://homepagehelper.thecreems.com` to use the nginx reverse proxy, which allows the widgets to be accessed from remote browsers.

### Adding New Services

See `proxy/ADD_SERVICE.md` for detailed instructions on adding new cloud providers or services to the balance proxy.

## Configuration

- `config/services.yaml` - Service definitions
- `config/docker.yaml` - Docker integration settings
- `config/settings.yaml` - General dashboard settings
- `config/bookmarks.yaml` - Quick links
- `config/widgets.yaml` - System monitoring widgets
- `config/widgets/balance-widget.html` - RunPod balance widget
- `config/widgets/openai-balance.html` - OpenAI balance widget
- `config/widgets/grok-balance.html` - Grok balance widget
- `config/widgets/venice-balance.html` - Venice balance widget
- `proxy/` - Balance proxy service
  - `server.js` - Main proxy server with service configurations
  - `Dockerfile` - Container build configuration
  - `ADD_SERVICE.md` - Guide for adding new services

## Customization

To add custom icons, place PNG files in the `config/icons/` directory and reference them in `services.yaml`.

To customize the lunch button commands, edit the `widgets` section in `services.yaml` for each service.
