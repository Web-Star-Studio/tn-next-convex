## Next.js API Routes

### GET /api/download-url
File: src/app/api/download-url/route.ts

Example:
```bash
curl -G --data-urlencode "param=value" http://localhost:3000/api/download-url
```

### POST /api/upload-url
File: src/app/api/upload-url/route.ts

Example:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://localhost:3000/api/upload-url
```
