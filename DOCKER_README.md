# Docker Setup for HACK_OUT Project

This document describes the production-ready Docker setup for the HACK_OUT project, which includes multiple microservices orchestrated with Docker Compose.

## Architecture Overview

The project consists of four main services:

1. **React Frontend** (`client`) - Served via Nginx on port 80
2. **Node.js Backend** (`server`) - Express API on port 8000
3. **Python ML Service** (`ml-service`) - FastAPI service on port 8001
4. **Nginx Reverse Proxy** - Routes traffic to appropriate services

## Service Ports

- **External Access**: Port 80 (via Nginx reverse proxy)
- **Internal Services**:
  - Frontend: Port 80
  - Backend API: Port 8000
  - ML Service: Port 8001

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available
- 10GB free disk space

## Quick Start

1. **Clone and navigate to the project directory**:
   ```bash
   cd /path/to/HACK_OUT
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration
   ```

3. **Build and start all services**:
   ```bash
   docker-compose up -d --build
   ```

4. **Check service status**:
   ```bash
   docker-compose ps
   ```

5. **View logs**:
   ```bash
   docker-compose logs -f
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Node.js Backend
NODE_ENV=production
PORT=8000
SESSION_SECRET=your-super-secret-session-key-here
MONGODB_URI=mongodb://localhost:27017/hackout
JWT_SECRET=your-jwt-secret-key-here

# ML Service
PYTHONPATH=/app
ML_MODEL_PATH=/app/app/model

# Security
CORS_ORIGIN=http://localhost:3000
SECURE_COOKIES=false

# Logging
LOG_LEVEL=info
LOG_PATH=/app/logs
```

## Service Details

### Frontend (React)
- **Base Image**: Node.js 18 Alpine
- **Build Process**: Multi-stage build with Vite
- **Serving**: Nginx with optimized static file serving
- **Features**: Gzip compression, caching headers, security headers

### Backend (Node.js)
- **Base Image**: Node.js 18 Alpine
- **Framework**: Express.js
- **Features**: Health checks, non-root user, optimized dependencies
- **Volumes**: Persistent uploads and logs

### ML Service (Python)
- **Base Image**: Python 3.11 Slim
- **Framework**: FastAPI with Uvicorn
- **Features**: OpenCV support, TensorFlow, WebSocket support
- **Resources**: Memory limits (1-2GB) for ML operations

### Reverse Proxy (Nginx)
- **Features**: 
  - Route-based load balancing
  - Rate limiting (API: 10 req/s, ML: 5 req/s)
  - WebSocket support
  - Gzip compression
  - Security headers
  - Health checks

## Networking

All services communicate through a custom bridge network (`hackout-network`) with subnet `172.20.0.0/16`. Services can reach each other using their service names as hostnames.

## Health Checks

Each service includes health check endpoints:
- **Frontend**: `GET /` (200 OK)
- **Backend**: `GET /health` (200 OK)
- **ML Service**: `GET /health` (200 OK)
- **Nginx**: `GET /health` (200 OK)

## Production Considerations

### Resource Limits
- **ML Service**: 1-2GB RAM (adjustable in docker-compose.yml)
- **Other Services**: Default Docker limits

### Security
- Non-root users for all services
- Security headers via Nginx
- Rate limiting on API endpoints
- Environment variable configuration

### Monitoring
- Health checks for all services
- Structured logging
- Resource usage monitoring

### Scaling
- Stateless design for easy horizontal scaling
- External volume mounts for persistent data
- Load balancer ready

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check what's using port 80
   sudo netstat -tulpn | grep :80
   ```

2. **Memory issues**:
   ```bash
   # Check Docker resource usage
   docker stats
   ```

3. **Service won't start**:
   ```bash
   # Check specific service logs
   docker-compose logs [service-name]
   ```

4. **Build failures**:
   ```bash
   # Clean build cache
   docker-compose build --no-cache
   ```

### Debug Commands

```bash
# Enter a running container
docker-compose exec [service-name] sh

# View real-time logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart [service-name]

# Check service health
docker-compose ps
```

## Development vs Production

### Development
- Use `docker-compose.override.yml` for development-specific settings
- Enable hot reloading
- Mount source code as volumes

### Production
- Use production Dockerfiles
- Environment-specific configuration
- Proper logging and monitoring
- Health checks enabled

## Performance Optimization

- **Multi-stage builds** for smaller images
- **Alpine/slim base images** for reduced size
- **Layer caching** optimization
- **Gzip compression** for static assets
- **Keep-alive connections** between services

## Backup and Recovery

### Data Volumes
- **Uploads**: `./server/uploads`
- **Logs**: `./server/logs`
- **ML Models**: `./ml-service/app/model`

### Backup Strategy
```bash
# Backup volumes
docker run --rm -v hackout_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v hackout_uploads:/data -v $(pwd):/backup alpine tar xzf /backup/uploads-backup.tar.gz -C /data
```

## Maintenance

### Regular Tasks
- Update base images monthly
- Monitor resource usage
- Review and rotate logs
- Update dependencies

### Commands
```bash
# Update all images
docker-compose pull

# Rebuild services
docker-compose up -d --build

# Clean up unused resources
docker system prune -f
```

## Support

For issues related to:
- **Docker setup**: Check this README and Docker logs
- **Application logic**: Check individual service documentation
- **Performance**: Monitor resource usage and adjust limits

## License

This Docker setup is part of the HACK_OUT project and follows the same licensing terms.
