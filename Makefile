# CashFlow Game - Development Makefile
# =====================================

# Default target
.DEFAULT_GOAL := help

# Variables
PROJECT_DIR := cashflow-svelte
NODE_MODULES := $(PROJECT_DIR)/node_modules
NPM := npm --prefix $(PROJECT_DIR)
DEV_SERVER_PID := .dev-server.pid

# Colors for output
BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# =====================================
# Development Targets
# =====================================

## Install dependencies
install: ## Install all npm dependencies
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	$(NPM) install
	@echo "$(GREEN)✓ Dependencies installed$(RESET)"

## Start development server
dev: ## Start the development server
	@echo "$(BLUE)Starting development server...$(RESET)"
	$(NPM) run dev

## Start development server in background
dev-bg: ## Start development server in background
	@echo "$(BLUE)Starting development server in background...$(RESET)"
	@$(NPM) run dev & echo $$! > $(DEV_SERVER_PID)
	@echo "$(GREEN)✓ Development server started (PID: $$(cat $(DEV_SERVER_PID)))$(RESET)"

## Stop background development server
dev-stop: ## Stop background development server
	@if [ -f $(DEV_SERVER_PID) ]; then \
		echo "$(YELLOW)Stopping development server...$(RESET)"; \
		kill $$(cat $(DEV_SERVER_PID)) 2>/dev/null || true; \
		rm -f $(DEV_SERVER_PID); \
		echo "$(GREEN)✓ Development server stopped$(RESET)"; \
	else \
		echo "$(YELLOW)No development server running$(RESET)"; \
	fi

## Open development server in browser
open: ## Open development server in browser
	@echo "$(BLUE)Opening browser...$(RESET)"
	@if command -v xdg-open >/dev/null 2>&1; then \
		xdg-open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5174 2>/dev/null; \
	elif command -v open >/dev/null 2>&1; then \
		open http://localhost:5173 2>/dev/null || open http://localhost:5174 2>/dev/null; \
	else \
		echo "$(YELLOW)Please open http://localhost:5173 or http://localhost:5174 in your browser$(RESET)"; \
	fi

# =====================================
# Build Targets
# =====================================

## Build for production
build: ## Build the application for production
	@echo "$(BLUE)Building for production...$(RESET)"
	$(NPM) run build
	@echo "$(GREEN)✓ Build complete$(RESET)"

## Preview production build
preview: build ## Build and preview production build
	@echo "$(BLUE)Starting preview server...$(RESET)"
	$(NPM) run preview

## Clean build artifacts
clean: ## Remove build artifacts and cache
	@echo "$(YELLOW)Cleaning build artifacts...$(RESET)"
	@rm -rf $(PROJECT_DIR)/.svelte-kit
	@rm -rf $(PROJECT_DIR)/dist
	@rm -rf $(PROJECT_DIR)/build
	@rm -rf $(PROJECT_DIR)/.vercel
	@rm -rf $(PROJECT_DIR)/node_modules/.vite
	@echo "$(GREEN)✓ Clean complete$(RESET)"

## Clean all (including node_modules)
clean-all: clean ## Remove all generated files including node_modules
	@echo "$(YELLOW)Removing node_modules...$(RESET)"
	@rm -rf $(PROJECT_DIR)/node_modules
	@rm -f $(PROJECT_DIR)/package-lock.json
	@echo "$(GREEN)✓ Full clean complete$(RESET)"

# =====================================
# Testing Targets
# =====================================

## Run all tests
test: ## Run all tests
	@echo "$(BLUE)Running tests...$(RESET)"
	$(NPM) run test

## Run unit tests
test-unit: ## Run unit tests only
	@echo "$(BLUE)Running unit tests...$(RESET)"
	$(NPM) run test:unit

## Run e2e tests
test-e2e: ## Run end-to-end tests
	@echo "$(BLUE)Running e2e tests...$(RESET)"
	$(NPM) run test:e2e

## Run tests with coverage
test-coverage: ## Run tests with coverage report
	@echo "$(BLUE)Running tests with coverage...$(RESET)"
	$(NPM) run test:unit -- --coverage

## Run tests in watch mode
test-watch: ## Run tests in watch mode
	@echo "$(BLUE)Running tests in watch mode...$(RESET)"
	$(NPM) run test:unit -- --watch

# =====================================
# Code Quality Targets
# =====================================

## Run linter
lint: ## Run ESLint
	@echo "$(BLUE)Running linter...$(RESET)"
	$(NPM) run lint

## Fix linting issues
lint-fix: ## Fix ESLint issues automatically
	@echo "$(BLUE)Fixing linting issues...$(RESET)"
	$(NPM) run lint -- --fix

## Format code
format: ## Format code with Prettier
	@echo "$(BLUE)Formatting code...$(RESET)"
	$(NPM) run format

## Check code formatting
format-check: ## Check code formatting
	@echo "$(BLUE)Checking code formatting...$(RESET)"
	$(NPM) run lint

## Type check
check: ## Run TypeScript type checking
	@echo "$(BLUE)Running type checker...$(RESET)"
	$(NPM) run check

## Type check in watch mode
check-watch: ## Run TypeScript type checking in watch mode
	@echo "$(BLUE)Running type checker in watch mode...$(RESET)"
	$(NPM) run check:watch

# =====================================
# Database Targets (if using database)
# =====================================

## Push database schema
db-push: ## Push database schema changes
	@echo "$(BLUE)Pushing database schema...$(RESET)"
	$(NPM) run db:push

## Generate database migrations
db-generate: ## Generate database migrations
	@echo "$(BLUE)Generating database migrations...$(RESET)"
	$(NPM) run db:generate

## Run database migrations
db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(RESET)"
	$(NPM) run db:migrate

## Open database studio
db-studio: ## Open database studio
	@echo "$(BLUE)Opening database studio...$(RESET)"
	$(NPM) run db:studio

# =====================================
# Utility Targets
# =====================================

## Update dependencies
update: ## Update npm dependencies
	@echo "$(BLUE)Updating dependencies...$(RESET)"
	$(NPM) update
	@echo "$(GREEN)✓ Dependencies updated$(RESET)"

## Audit dependencies for security issues
audit: ## Audit dependencies for security vulnerabilities
	@echo "$(BLUE)Auditing dependencies...$(RESET)"
	$(NPM) audit
	@echo "$(GREEN)✓ Audit complete$(RESET)"

## Fix audit issues
audit-fix: ## Fix security vulnerabilities
	@echo "$(BLUE)Fixing security vulnerabilities...$(RESET)"
	$(NPM) audit fix
	@echo "$(GREEN)✓ Security fixes applied$(RESET)"

## Check for outdated packages
outdated: ## Check for outdated npm packages
	@echo "$(BLUE)Checking for outdated packages...$(RESET)"
	$(NPM) outdated

## Show project info
info: ## Show project information
	@echo "$(BLUE)Project Information:$(RESET)"
	@echo "  Node version: $$(node --version)"
	@echo "  NPM version: $$(npm --version)"
	@echo "  Project: $$(node -p "require('./$(PROJECT_DIR)/package.json').name")"
	@echo "  Version: $$(node -p "require('./$(PROJECT_DIR)/package.json').version")"

## Generate auth schema
auth-schema: ## Generate authentication schema
	@echo "$(BLUE)Generating auth schema...$(RESET)"
	$(NPM) run auth:schema
	@echo "$(GREEN)✓ Auth schema generated$(RESET)"

# =====================================
# Storybook Targets
# =====================================

## Start Storybook
storybook: ## Start Storybook development server
	@echo "$(BLUE)Starting Storybook...$(RESET)"
	$(NPM) run storybook

## Build Storybook
storybook-build: ## Build Storybook for deployment
	@echo "$(BLUE)Building Storybook...$(RESET)"
	$(NPM) run build-storybook

# =====================================
# Development Workflow Targets
# =====================================

## Full development setup
setup: install ## Full development setup (install + initial build)
	@echo "$(BLUE)Running initial type check...$(RESET)"
	$(NPM) run check
	@echo "$(GREEN)✓ Setup complete! Run 'make dev' to start developing$(RESET)"

## Quick development start
start: dev ## Quick start - alias for 'make dev'

## Pre-commit checks
pre-commit: format lint check test-unit ## Run all pre-commit checks
	@echo "$(GREEN)✓ All pre-commit checks passed$(RESET)"

## Full CI pipeline
ci: clean install lint check test build ## Run full CI pipeline
	@echo "$(GREEN)✓ CI pipeline complete$(RESET)"

# =====================================
# Help Target
# =====================================

## Show help
help: ## Show this help message
	@echo ""
	@echo "$(BLUE)CashFlow Game - Development Commands$(RESET)"
	@echo "$(BLUE)=====================================$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; category = ""} \
		/^## / { \
			category = substr($$0, 4); \
			printf "\n$(YELLOW)%s$(RESET)\n", category; \
			next \
		} \
		/^[a-zA-Z_-]+:.*?##/ { \
			printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2 \
		} \
		/^##$$/ { next } \
		' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(BLUE)Examples:$(RESET)"
	@echo "  make dev          # Start development server"
	@echo "  make test         # Run all tests"
	@echo "  make build        # Build for production"
	@echo "  make lint         # Check code quality"
	@echo "  make help         # Show this help"
	@echo ""

# =====================================
# Phony Targets
# =====================================

.PHONY: install dev dev-bg dev-stop open build preview clean clean-all \
        test test-unit test-e2e test-coverage test-watch \
        lint lint-fix format format-check check check-watch \
        db-push db-generate db-migrate db-studio \
        update audit audit-fix outdated info auth-schema \
        storybook storybook-build \
        setup start pre-commit ci help