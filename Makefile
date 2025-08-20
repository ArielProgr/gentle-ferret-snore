# Makefile for Marketplace Intelligence

# Variables
DOCKER_COMPOSE = docker-compose
PYTHON = python3
PIP = pip3

# Default target
.PHONY: help
help:
	@echo "Marketplace Intelligence - Development Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make setup              Install dependencies"
	@echo "  make run                Start development environment"
	@echo "  make stop               Stop development environment"
	@echo "  make test               Run backend tests"
	@echo "  make scrape-ph          Scrape Product Hunt sample data"
	@echo "  make populate-sample    Populate database with sample data"
	@echo "  make clean              Remove docker containers and volumes"
	@echo "  make reset              Reset database and repopulate"
	@echo "  make logs               View container logs"
	@echo "  make shell-backend      Open shell in backend container"
	@echo "  make shell-frontend     Open shell in frontend container"
	@echo "  make shell-db           Open shell in database container"

# Setup
.PHONY: setup
setup:
	@echo "Installing backend dependencies..."
	cd backend && $(PIP) install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Setup complete!"

# Run development environment
.PHONY: run
run:
	@echo "Starting development environment..."
	$(DOCKER_COMPOSE) up --build

# Stop development environment
.PHONY: stop
stop:
	@echo "Stopping development environment..."
	$(DOCKER_COMPOSE) down

# Run backend tests
.PHONY: test
test:
	@echo "Running backend tests..."
	$(DOCKER_COMPOSE) exec backend pytest

# Scrape Product Hunt sample data
.PHONY: scrape-ph
scrape-ph:
	@echo "Scraping Product Hunt sample data..."
	$(DOCKER_COMPOSE) exec backend python scripts/scrape_producthunt.py --sample 50

# Populate database with sample data
.PHONY: populate-sample
populate-sample:
	@echo "Populating database with sample data..."
	$(DOCKER_COMPOSE) exec backend python scripts/populate_sample_data.py

# Clean docker containers and volumes
.PHONY: clean
clean:
	@echo "Cleaning docker containers and volumes..."
	$(DOCKER_COMPOSE) down -v --remove-orphans

# Reset database and repopulate
.PHONY: reset
reset:
	@echo "Resetting database..."
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d db
	@echo "Waiting for database to be ready..."
	sleep 10
	$(DOCKER_COMPOSE) up -d backend
	@echo "Populating with sample data..."
	sleep 5
	$(DOCKER_COMPOSE) exec backend python scripts/populate_sample_data.py

# View container logs
.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Open shell in backend container
.PHONY: shell-backend
shell-backend:
	$(DOCKER_COMPOSE) exec backend sh

# Open shell in frontend container
.PHONY: shell-frontend
shell-frontend:
	$(DOCKER_COMPOSE) exec frontend sh

# Open shell in database container
.PHONY: shell-db
shell-db:
	$(DOCKER_COMPOSE) exec db sh