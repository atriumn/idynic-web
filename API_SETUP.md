# Idynic Web API Configuration

## Updated Backend Endpoints

The frontend has been updated to connect to the new infrastructure:

### Dev Environment
- **Idynic Backend**: `https://ilh5b401yd.execute-api.us-east-1.amazonaws.com/`
- **Atriumn Auth**: `https://3jx8blvm4a.execute-api.us-east-1.amazonaws.com/`
- **Account**: 240966655244 (idynic-dev)
- **Environment file**: `.env.local`

### Prod Environment  
- **Idynic Backend**: `https://cbh5793yv3.execute-api.us-east-1.amazonaws.com/`
- **Atriumn Auth**: `https://3jx8blvm4a.execute-api.us-east-1.amazonaws.com/`
- **Account**: 387367331046 (idynic-prod)
- **Environment file**: `.env.production`

## API Authentication

Both environments require:
- **Public routes**: `/healthz` - No authentication needed
- **Protected routes**: `/v1/{proxy+}` - Requires `x-api-key` header

## Setup Instructions

1. **Update environment variables**:
   - Dev: Update `NEXT_PUBLIC_IDYNIC_API_KEY` in `.env.local`
   - Prod: Update `NEXT_PUBLIC_IDYNIC_API_KEY` in `.env.production`

2. **Obtain API keys**: Contact the backend team to get valid API keys for dev/prod

3. **Test the setup**:
   ```bash
   npm run dev  # For local development
   npm run build && npm start  # For production testing
   ```

## Changes Made

1. **Environment files updated** with new API endpoints
2. **API client modified** to include `x-api-key` header in requests
3. **Auth interceptor enhanced** to handle API key authentication
4. **Debug logging added** to track authentication status

## Health Check Status

✅ Dev environment: `https://ilh5b401yd.execute-api.us-east-1.amazonaws.com/healthz` - OK
✅ Prod environment: `https://cbh5793yv3.execute-api.us-east-1.amazonaws.com/healthz` - OK

## Next Steps

- [ ] Obtain valid API keys from backend team
- [ ] Set up CI/CD pipeline for automated deployments
- [ ] Configure proper monitoring and alerting