#!/bin/bash

# =============================================================================
# Complete Deployment Script for Moringa Application with Monitoring Stack
# Author: Automated Deployment Script
# Description: Deploys application with Prometheus, Grafana, and ELK Stack
# =============================================================================

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/abuzarkhan1/Moringa.git"
PROJECT_NAME="moringa"
PUBLIC_IP="3.85.36.223"
DOMAIN="${PUBLIC_IP}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Docker
install_docker() {
    if command_exists docker; then
        print_status "Docker is already installed"
    else
        print_status "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        print_status "Docker installed successfully"
    fi
}

# Function to install Docker Compose
install_docker_compose() {
    if command_exists docker-compose; then
        print_status "Docker Compose is already installed"
    else
        print_status "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        print_status "Docker Compose installed successfully"
    fi
}

# Function to create monitoring directories
create_directories() {
    print_status "Creating monitoring directories..."
    
    # Create all necessary directories
    mkdir -p monitoring/prometheus
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/provisioning/dashboards
    mkdir -p monitoring/grafana/provisioning/datasources
    mkdir -p monitoring/elasticsearch
    mkdir -p monitoring/logstash
    mkdir -p monitoring/kibana
    mkdir -p monitoring/filebeat
    mkdir -p monitoring/nginx
    mkdir -p logs
    mkdir -p server/logs
    
    print_status "All directories created successfully"
}

# Function to clone repository
clone_repository() {
    print_status "Cloning repository..."
    if [ -d "${PROJECT_NAME}" ]; then
        print_warning "Project directory exists, updating..."
        cd ${PROJECT_NAME}
        git pull origin main || git pull origin master
    else
        git clone ${REPO_URL} ${PROJECT_NAME}
        cd ${PROJECT_NAME}
    fi
}

# Function to create comprehensive docker-compose.yml
create_docker_compose() {
    print_status "Creating comprehensive docker-compose.yml..."
    cat > docker-compose.yml << 'EOF'
version: '3.8'

networks:
  moringa-network:
    driver: bridge
  monitoring:
    driver: bridge

volumes:
  mongodb_data:
  elasticsearch_data:
  grafana_data:
  prometheus_data:

services:
  # ===============================
  # APPLICATION SERVICES
  # ===============================
  
  mongodb:
    image: mongo:6.0
    container_name: moringa_mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: creamneww
    volumes:
      - mongodb_data:/data/db
    networks:
      - moringa-network
    ports:
      - "27017:27017"

  backend:
    build: 
      context: ./server
      dockerfile: Dockerfile
    container_name: moringa_backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/creamneww
      - PORT=5000
      - CLIENT_URL=http://3.85.36.223:5173
      - EMAIL_USER=abuzarkhan1242@gmail.com
      - EMAIL_PASS=qqby rsec hgwh rxfw
      - EMAIL_HOST=smtp.gmail.com
      - EMAIL_PORT=587
      - JWT_SECRET=your_jwt_secret_key
      - CLOUDINARY_CLOUD_NAME=diwerulix
      - CLOUDINARY_API_KEY=778313557844215
      - CLOUDINARY_API_SECRET=b-vpL9g-DJwUx9mhggl6v_kF6z4
    volumes:
      - ./logs:/app/logs
      - ./server/uploads:/app/uploads
    depends_on:
      - mongodb
    networks:
      - moringa-network
      - monitoring
    ports:
      - "5000:5000"

  frontend:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: moringa_frontend
    restart: unless-stopped
    environment:
      - VITE_API_BASE_URL=http://3.85.36.223:5000
    depends_on:
      - backend
    networks:
      - moringa-network
    ports:
      - "5173:5173"

  # ===============================
  # MONITORING SERVICES
  # ===============================

  prometheus:
    image: prom/prometheus:latest
    container_name: moringa_prometheus
    restart: unless-stopped
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
      - '--web.external-url=http://3.85.36.223:9090'
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - monitoring
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    container_name: moringa_grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=http://3.85.36.223:3000
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
    networks:
      - monitoring
    ports:
      - "3000:3000"

  # ===============================
  # ELK STACK SERVICES
  # ===============================

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: moringa_elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - monitoring
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: moringa_logstash
    restart: unless-stopped
    volumes:
      - ./monitoring/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
      - ./logs:/usr/share/logstash/logs
      - ./server/logs:/usr/share/logstash/server-logs
    environment:
      - "LS_JAVA_OPTS=-Xmx256m -Xms256m"
    networks:
      - monitoring
    depends_on:
      - elasticsearch
    ports:
      - "5044:5044"
      - "9600:9600"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: moringa_kibana
    restart: unless-stopped
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - SERVER_HOST=0.0.0.0
      - SERVER_PUBLICBASEURL=http://3.85.36.223:5601
    networks:
      - monitoring
    depends_on:
      - elasticsearch
    ports:
      - "5601:5601"

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.11.0
    container_name: moringa_filebeat
    restart: unless-stopped
    user: root
    volumes:
      - ./monitoring/filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - ./logs:/usr/share/filebeat/logs:ro
      - ./server/logs:/usr/share/filebeat/server-logs:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - strict.perms=false
    networks:
      - monitoring
    depends_on:
      - elasticsearch
      - logstash

  # ===============================
  # NGINX REVERSE PROXY
  # ===============================

  nginx:
    image: nginx:alpine
    container_name: moringa_nginx
    restart: unless-stopped
    volumes:
      - ./monitoring/nginx/nginx.conf:/etc/nginx/nginx.conf
    networks:
      - moringa-network
      - monitoring
    ports:
      - "80:80"
    depends_on:
      - frontend
      - backend
      - grafana
      - kibana
      - prometheus
EOF
}

# Function to create Prometheus configuration
create_prometheus_config() {
    print_status "Creating Prometheus configuration..."
    cat > monitoring/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'moringa-backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb:27017']
    scrape_interval: 10s
EOF
}

# Function to create Grafana datasource configuration
create_grafana_datasource() {
    print_status "Creating Grafana datasource configuration..."
    cat > monitoring/grafana/provisioning/datasources/datasource.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF
}

# Function to create Grafana dashboard provisioning
create_grafana_dashboard_provisioning() {
    print_status "Creating Grafana dashboard provisioning..."
    cat > monitoring/grafana/provisioning/dashboards/dashboard.yml << 'EOF'
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
EOF
}

# Function to create application dashboard
create_application_dashboard() {
    print_status "Creating application dashboard..."
    cat > monitoring/grafana/dashboards/moringa-dashboard.json << 'EOF'
{
  "dashboard": {
    "id": null,
    "title": "Moringa Application Dashboard",
    "tags": ["moringa", "nodejs", "mongodb"],
    "style": "dark",
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "HTTP Requests Total",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m]))",
            "legendFormat": "Requests/sec"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "palette-classic"
            },
            "custom": {
              "displayMode": "basic"
            }
          }
        },
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      },
      {
        "id": 3,
        "title": "Orders by Status",
        "type": "piechart",
        "targets": [
          {
            "expr": "orders_total",
            "legendFormat": "{{status}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8}
      },
      {
        "id": 4,
        "title": "Product Views",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(product_views_total[5m])",
            "legendFormat": "Views/sec"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8}
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "30s"
  }
}
EOF
}

# Function to create Logstash configuration
create_logstash_config() {
    print_status "Creating Logstash configuration..."
    cat > monitoring/logstash/logstash.conf << 'EOF'
input {
  file {
    path => "/usr/share/logstash/logs/combined.log"
    start_position => "beginning"
    codec => "json"
    tags => ["combined"]
  }
  
  file {
    path => "/usr/share/logstash/logs/error.log"
    start_position => "beginning"
    codec => "json"
    tags => ["error"]
  }
  
  file {
    path => "/usr/share/logstash/server-logs/combined.log"
    start_position => "beginning"
    codec => "json"
    tags => ["server-combined"]
  }
  
  file {
    path => "/usr/share/logstash/server-logs/error.log"
    start_position => "beginning"
    codec => "json"
    tags => ["server-error"]
  }
}

filter {
  if "combined" in [tags] or "server-combined" in [tags] {
    mutate {
      add_field => { "log_type" => "combined" }
    }
  }
  
  if "error" in [tags] or "server-error" in [tags] {
    mutate {
      add_field => { "log_type" => "error" }
    }
  }
  
  # Parse timestamp
  if [timestamp] {
    date {
      match => [ "timestamp", "yyyy-MM-dd HH:mm:ss" ]
    }
  }
  
  # Extract HTTP status codes for analysis
  if [status] {
    if [status] >= 400 {
      mutate {
        add_field => { "status_category" => "error" }
      }
    } else if [status] >= 300 {
      mutate {
        add_field => { "status_category" => "redirect" }
      }
    } else {
      mutate {
        add_field => { "status_category" => "success" }
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "moringa-logs-%{+YYYY.MM.dd}"
  }
}
EOF
}

# Function to create Filebeat configuration
create_filebeat_config() {
    print_status "Creating Filebeat configuration..."
    cat > monitoring/filebeat/filebeat.yml << 'EOF'
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /usr/share/filebeat/logs/combined.log
    - /usr/share/filebeat/server-logs/combined.log
  fields:
    log_type: combined
  fields_under_root: true
  json.keys_under_root: true
  json.overwrite_keys: true

- type: log
  enabled: true
  paths:
    - /usr/share/filebeat/logs/error.log
    - /usr/share/filebeat/server-logs/error.log
  fields:
    log_type: error
  fields_under_root: true
  json.keys_under_root: true
  json.overwrite_keys: true

output.logstash:
  hosts: ["logstash:5044"]

processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_docker_metadata: ~

logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
EOF
}

# Function to create Nginx configuration
create_nginx_config() {
    print_status "Creating Nginx configuration..."
    cat > monitoring/nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }
    
    upstream frontend {
        server frontend:5173;
    }
    
    upstream grafana {
        server grafana:3000;
    }
    
    upstream kibana {
        server kibana:5601;
    }
    
    upstream prometheus {
        server prometheus:9090;
    }

    server {
        listen 80;
        server_name 3.85.36.223;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Metrics endpoint
        location /metrics {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Health check
        location /health {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Grafana
        location /grafana/ {
            proxy_pass http://grafana/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Kibana
        location /kibana/ {
            proxy_pass http://kibana/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Prometheus
        location /prometheus/ {
            proxy_pass http://prometheus/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
EOF
}

# Function to create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Create server directory if it doesn't exist
    if [ ! -d "server" ]; then
        mkdir -p server
    fi
    
    # Backend .env
    cat > server/.env << 'EOF'
MONGODB_URI=mongodb://mongodb:27017/creamneww
EMAIL_USER=abuzarkhan1242@gmail.com
EMAIL_PASS=qqby rsec hgwh rxfw
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=diwerulix
CLOUDINARY_API_KEY=778313557844215
CLOUDINARY_API_SECRET=b-vpL9g-DJwUx9mhggl6v_kF6z4
PORT=5000
CLIENT_URL=http://3.85.36.223:5173
NODE_ENV=production
EOF

    # Frontend .env
    cat > .env << 'EOF'
VITE_API_BASE_URL=http://3.85.36.223:5000
EOF
}

# Function to create log files
create_log_files() {
    print_status "Creating log files..."
    
    # Add initial log entries
    echo '{"timestamp":"'$(date '+%Y-%m-%d %H:%M:%S')'","level":"info","message":"Deployment started","service":"Moringa"}' >> logs/combined.log
    echo '{"timestamp":"'$(date '+%Y-%m-%d %H:%M:%S')'","level":"info","message":"Server logs initialized","service":"Moringa"}' >> server/logs/combined.log
}

# Function to check if Dockerfiles exist
check_dockerfiles() {
    print_status "Checking for required Dockerfiles..."
    
    if [ ! -f "Dockerfile" ]; then
        print_warning "Frontend Dockerfile not found, creating basic one..."
        cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
EOF
    fi
    
    if [ ! -f "server/Dockerfile" ]; then
        print_warning "Backend Dockerfile not found, creating basic one..."
        mkdir -p server
        cat > server/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
EOF
    fi
}

# Function to deploy the application
deploy_application() {
    print_header "DEPLOYING APPLICATION"
    
    print_status "Stopping any existing services..."
    docker-compose down --remove-orphans 2>/dev/null || true
    
    print_status "Removing unused Docker resources..."
    docker system prune -f || true
    
    print_status "Building and starting all services..."
    docker-compose build --no-cache
    docker-compose up -d
    
    print_status "Waiting for services to start..."
    sleep 60
    
    print_status "Checking service health..."
    docker-compose ps
}

# Function to configure Kibana dashboards
configure_kibana() {
    print_status "Configuring Kibana dashboards..."
    sleep 90  # Wait for Elasticsearch to be ready
    
    # Create index pattern
    curl -X POST "http://localhost:5601/api/saved_objects/index-pattern/moringa-logs-*" \
        -H "kbn-xsrf: true" \
        -H "Content-Type: application/json" \
        -d '{
            "attributes": {
                "title": "moringa-logs-*",
                "timeFieldName": "@timestamp"
            }
        }' 2>/dev/null && print_status "Kibana index pattern created" || print_warning "Could not create Kibana index pattern automatically"
}

# Function to create monitoring script
create_monitoring_script() {
    print_status "Creating monitoring script..."
    cat > monitoring.sh << 'EOF'
#!/bin/bash

echo "=== Moringa Application Monitoring ==="
echo ""
echo "🚀 Application URLs:"
echo "Frontend: http://3.85.36.223:5173"
echo "Backend API: http://3.85.36.223:5000"
echo "Health Check: http://3.85.36.223:5000/health"
echo ""
echo "📊 Monitoring URLs:"
echo "Grafana: http://3.85.36.223:3000 (admin/admin123)"
echo "Prometheus: http://3.85.36.223:9090"
echo "Kibana: http://3.85.36.223:5601"
echo ""
echo "🔧 Service Status:"
docker-compose ps

echo ""
echo "💻 Resource Usage:"
docker stats --no-stream

echo ""
echo "📝 Recent Logs:"
echo "Backend logs:"
docker-compose logs --tail=5 backend
echo ""
echo "Frontend logs:"
docker-compose logs --tail=5 frontend
EOF
    chmod +x monitoring.sh
}

# Function to create health check script
create_health_check() {
    print_status "Creating health check script..."
    cat > health_check.sh << 'EOF'
#!/bin/bash

echo "🏥 Health Check Results:"
echo "========================"

# Check frontend
echo -n "Frontend (5173): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 && echo " ✅" || echo " ❌"

# Check backend
echo -n "Backend (5000): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health && echo " ✅" || echo " ❌"

# Check Grafana
echo -n "Grafana (3000): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " ✅" || echo " ❌"

# Check Prometheus
echo -n "Prometheus (9090): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090 && echo " ✅" || echo " ❌"

# Check Kibana
echo -n "Kibana (5601): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:5601 && echo " ✅" || echo " ❌"

# Check Elasticsearch
echo -n "Elasticsearch (9200): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:9200 && echo " ✅" || echo " ❌"

echo ""
echo "🐳 Docker Container Status:"
docker-compose ps
EOF
    chmod +x health_check.sh
}

# Function to create cleanup script
create_cleanup_script() {
    print_status "Creating cleanup script..."
    cat > cleanup.sh << 'EOF'
#!/bin/bash

echo "🧹 Cleaning up Moringa deployment..."

# Stop and remove containers
docker-compose down --remove-orphans

# Remove unused images
docker image prune -f

# Remove unused volumes (be careful with this)
echo "Warning: This will remove unused Docker volumes"
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume prune -f
fi

# Remove unused networks
docker network prune -f

echo "Cleanup completed!"
EOF
    chmod +x cleanup.sh
}

# Main deployment function
main() {
    print_header "MORINGA APPLICATION DEPLOYMENT WITH MONITORING"
    print_status "Starting deployment process..."
    
    # Update system
    print_status "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    
    # Install dependencies
    install_docker
    install_docker_compose
    
    # Install additional tools
    print_status "Installing additional tools..."
    sudo apt install -y git curl wget htop
    
    # Clone repository first
    clone_repository
    
    # Create project structure inside the cloned directory
    create_directories
    
    # Check and create Dockerfiles if needed
    check_dockerfiles
    
    # Create all configuration files
    create_docker_compose
    create_prometheus_config
    create_grafana_datasource
    create_grafana_dashboard_provisioning
    create_application_dashboard
    create_logstash_config
    create_filebeat_config
    create_nginx_config
    create_env_files
    create_log_files
    
    # Deploy application
    deploy_application
    
    # Configure monitoring
    configure_kibana
    
    # Create monitoring and health check scripts
    create_monitoring_script
    create_health_check
    create_cleanup_script
    
    print_header "DEPLOYMENT COMPLETED SUCCESSFULLY"
    print_status "Application is now running!"
    echo ""
    echo -e "${GREEN}🚀 ACCESS YOUR APPLICATION:${NC}"
    echo -e "${BLUE}Frontend:${NC} http://${PUBLIC_IP}:5173"
    echo -e "${BLUE}Backend API:${NC} http://${PUBLIC_IP}:5000"
    echo -e "${BLUE}Health Check:${NC} http://${PUBLIC_IP}:5000/health"
    echo ""
    echo -e "${GREEN}📊 MONITORING DASHBOARDS:${NC}"
    echo -e "${BLUE}Grafana:${NC} http://${PUBLIC_IP}:3000 (admin/admin123)"
    echo -e "${BLUE}Prometheus:${NC} http://${PUBLIC_IP}:9090"
    echo -e "${BLUE}Kibana:${NC} http://${PUBLIC_IP}:5601"
    echo ""
    echo -e "${GREEN}🔧 USEFUL COMMANDS:${NC}"
    echo "Health Check: ./health_check.sh"
    echo "Monitor: ./monitoring.sh"
    echo "View logs: docker-compose logs -f [service_name]"
    echo "Restart services: docker-compose restart"
    echo "Stop all services: docker-compose down"
    echo "Cleanup: ./cleanup.sh"
    echo ""
    print_status "Running initial health check in 30 seconds..."
    sleep 30
    ./health_check.sh
    echo ""
    print_warning "Please allow a few more minutes for all monitoring services to fully initialize"
    print_status "Deployment script completed! 🎉"
}

# Run main function
main "$@"