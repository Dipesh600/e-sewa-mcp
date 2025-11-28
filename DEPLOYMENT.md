# eSewa MCP Server Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the eSewa MCP Server to various environments.

## Deployment Options

### 1. Local Development
```bash
# Clone and setup
git clone <your-repo-url>
cd esewa-mcp-server
npm install
cp .env.example .env

# Start development server
npm run dev
```

### 2. Production Server (Bare Metal)

#### Prerequisites
- Node.js 18+ installed
- PM2 process manager (recommended)
- Nginx (optional, for reverse proxy)

#### Setup Steps
```bash
# Install PM2 globally
npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd esewa-mcp-server

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start server.mjs --name "esewa-mcp-server"
pm2 startup
pm2 save

# Setup nginx (optional)
sudo cp nginx.conf /etc/nginx/sites-available/esewa-mcp
sudo ln -s /etc/nginx/sites-available/esewa-mcp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Docker Deployment

#### Using Docker Compose
```bash
# Clone repository
git clone <your-repo-url>
cd esewa-mcp-server

# Configure environment
cp .env.example .env
# Edit .env with production values

# Start services
docker-compose up -d

# View logs
docker-compose logs -f esewa-mcp-server

# Stop services
docker-compose down
```

#### Using Docker Only
```bash
# Build image
docker build -t esewa-mcp-server .

# Run container
docker run -d \
  --name esewa-mcp-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ESEWA_ENVIRONMENT=sandbox \
  esewa-mcp-server
```

### 4. Cloud Deployment

#### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set ESEWA_ENVIRONMENT=sandbox

# Deploy
git push heroku main
```

#### DigitalOcean App Platform
```bash
# Create app.yaml file
cat > app.yaml << EOF
name: esewa-mcp-server
services:
  - name: esewa-mcp-server
    source_dir: /
    github:
      repo: your-username/esewa-mcp-server
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    http_port: 3000
    env:
      - key: NODE_ENV
        value: production
      - key: ESEWA_ENVIRONMENT
        value: sandbox
EOF

# Deploy via doctl
doctl apps create --spec app.yaml
```

#### AWS ECS (Fargate)
```bash
# Create task definition
cat > task-definition.json << EOF
{
  "family": "esewa-mcp-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::your-account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "esewa-mcp-server",
      "image": "your-account.dkr.ecr.region.amazonaws.com/esewa-mcp-server:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "ESEWA_ENVIRONMENT", "value": "sandbox"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/esewa-mcp-server",
          "awslogs-region": "your-region",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster your-cluster \
  --service-name esewa-mcp-server \
  --task-definition esewa-mcp-server \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

## Environment Configuration

### Required Environment Variables
```env
NODE_ENV=production
PORT=3000
ESEWA_ENVIRONMENT=sandbox  # or 'production'
```

### Optional Environment Variables
```env
# Default credentials (can be overridden per session)
ESEWA_MERCHANT_CODE=your_merchant_code
ESEWA_SECRET_KEY=your_secret_key

# Security
SESSION_SECRET=your_strong_session_secret
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info  # debug, info, warn, error
```

### Production Security Checklist
- [ ] Set strong SESSION_SECRET
- [ ] Configure CORS_ORIGIN to your domain
- [ ] Use HTTPS with valid SSL certificates
- [ ] Set up rate limiting (nginx/DDoS protection)
- [ ] Configure proper firewall rules
- [ ] Enable access logs
- [ ] Set up monitoring and alerting
- [ ] Use production eSewa credentials
- [ ] Implement backup strategy

## Monitoring and Maintenance

### Health Checks
The server provides health check endpoints:
- `GET /` - Basic health status
- `GET /health` - Detailed health information

### Logs
- Application logs: Check container/PM2 logs
- Access logs: Configure nginx for access logging
- Error logs: Monitor for 4xx/5xx errors

### Performance Monitoring
Monitor these metrics:
- Response time (< 200ms target)
- Error rate (< 1% target)
- CPU usage (< 70%)
- Memory usage (< 80%)
- Active connections

### Backup Strategy
- Backup environment configuration
- Backup SSL certificates
- Document deployment process
- Test restore procedures

## Troubleshooting Deployment Issues

### Common Issues

**Port Already in Use**
```bash
# Find process using port
sudo lsof -i :3000
# Kill process
sudo kill -9 <PID>
```

**Container Won't Start**
```bash
# Check logs
docker logs esewa-mcp-server
# Check environment variables
docker inspect esewa-mcp-server | grep -A 10 Env
```

**Health Check Failing**
```bash
# Test manually
curl -f http://localhost:3000/ || echo "Health check failed"
# Check server logs
pm2 logs esewa-mcp-server
```

**SSL Certificate Issues**
```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -servername your-domain.com
# Check certificate expiry
openssl x509 -in cert.pem -noout -dates
```

### Getting Help
1. Check server logs for error details
2. Test with `npm run test:connection`
3. Verify environment configuration
4. Check network connectivity
5. Review deployment documentation

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx/ALB)
- Enable session affinity if needed
- Configure shared session storage
- Monitor load distribution

### Vertical Scaling
- Increase CPU/memory allocation
- Optimize Node.js memory settings
- Tune nginx worker processes
- Monitor resource usage

## Security Best Practices

1. **Network Security**
   - Use VPC/private networks
   - Configure security groups/firewalls
   - Enable DDoS protection
   - Use VPN for administrative access

2. **Application Security**
   - Keep dependencies updated
   - Use security headers
   - Implement input validation
   - Enable audit logging

3. **Data Security**
   - Encrypt sensitive data
   - Use secure credential storage
   - Implement data retention policies
   - Regular security audits

## Update and Rollback Procedures

### Updating
```bash
# Docker deployment
docker-compose pull
docker-compose up -d

# PM2 deployment
git pull origin main
npm install --production
pm2 restart esewa-mcp-server
```

### Rollback
```bash
# Docker deployment
docker-compose down
docker tag esewa-mcp-server:latest esewa-mcp-server:backup
docker tag esewa-mcp-server:previous esewa-mcp-server:latest
docker-compose up -d

# PM2 deployment
git checkout <previous-commit>
pm install --production
pm2 restart esewa-mcp-server
```

## Support and Maintenance

### Regular Maintenance Tasks
- [ ] Update dependencies monthly
- [ ] Review logs weekly
- [ ] Check SSL certificate expiry
- [ ] Monitor resource usage
- [ ] Test backup procedures
- [ ] Review security alerts

### Emergency Procedures
- Document rollback procedures
- Maintain contact information
- Prepare incident response plan
- Test disaster recovery

---

For additional support, refer to the main README.md or open an issue on GitHub.