# Homepage Dashboard - TheCreems

This is a gethomepage.dev dashboard for TheCreems services.

## Services Configured

### Custom Apps (with status and lunch buttons)
- **FactsEngine**: https://factsenginer.thecreems.com
- **SonarQube**: https://sonarqube.thecreems.com
- **StateDB Mirror**: https://statedbmirror.thecreems.com
- **FPE Admin**: https://fpeadmin.thecreems.com

### Open Source Apps
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

### Setting up API Keys with Infisical

To securely inject API keys using Infisical:

1. Create API keys for each service:
   - RunPod: https://www.runpod.io/console/user/settings
   - OpenAI: https://platform.openai.com/api-keys
   - Grok (xAI): https://console.x.ai/
   - Venice: https://venice.ai/api-keys
2. Add them to your Infisical project with names:
   - `RUNPOD_API_KEY`
   - `OPENAI_API_KEY`
   - `GROK_API_KEY`
   - `VENICE_API_ADMIN_KEY`
3. Configure Infisical to inject these into the `balance-proxy` container

For manual testing, set keys in `.env` file:
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
