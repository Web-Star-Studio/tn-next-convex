## Convex HTTP Routes

### POST /clerk-webhook

Example:
```bash
curl -X POST -H "Content-Type: application/json" -d '{}' https://<your-convex-deployment>/clerk-webhook
```

### POST /stripe/webhook

Example:
```bash
curl -X POST -H "Content-Type: application/json" -d '{}' https://<your-convex-deployment>/stripe/webhook
```

### POST /stripe/test-webhook

Example:
```bash
curl -X POST -H "Content-Type: application/json" -d '{}' https://<your-convex-deployment>/stripe/test-webhook
```

### POST /stripe/connect-webhook

Example:
```bash
curl -X POST -H "Content-Type: application/json" -d '{}' https://<your-convex-deployment>/stripe/connect-webhook
```
