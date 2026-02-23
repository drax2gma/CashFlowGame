# Development Quick Start Guide

## Using the Makefile

This project includes a comprehensive Makefile for development workflow automation.

### Quick Start

```bash
# Install dependencies and setup project
make setup

# Start development server
make dev

# Or start in background
make dev-bg

# Open in browser
make open
```

### Common Development Tasks

```bash
# Run tests
make test

# Run linter
make lint

# Format code
make format

# Type check
make check

# Build for production
make build
```

### Pre-commit Checks

Run all checks before committing:

```bash
make pre-commit
```

This runs:
- Code formatting
- Linting
- Type checking
- Unit tests

### Full CI Pipeline

Run the complete CI pipeline locally:

```bash
make ci
```

### Database Operations

```bash
make db-push      # Push schema changes
make db-migrate   # Run migrations
make db-studio    # Open database studio
```

### Utility Commands

```bash
make info         # Show project info
make outdated     # Check for outdated packages
make audit        # Security audit
make clean        # Clean build artifacts
make clean-all    # Full clean including node_modules
```

### Getting Help

View all available commands:

```bash
make help
```

## Development Workflow

1. **Initial Setup**
   ```bash
   make setup
   ```

2. **Start Development**
   ```bash
   make dev
   ```

3. **Make Changes**
   - Edit files
   - Server auto-reloads

4. **Before Committing**
   ```bash
   make pre-commit
   ```

5. **Run Full Test Suite**
   ```bash
   make test
   ```

## Available Make Targets

### Development
- `dev` - Start development server
- `dev-bg` - Start dev server in background
- `dev-stop` - Stop background dev server
- `open` - Open app in browser

### Building
- `build` - Build for production
- `preview` - Preview production build
- `clean` - Clean build artifacts
- `clean-all` - Full clean

### Testing
- `test` - Run all tests
- `test-unit` - Run unit tests
- `test-e2e` - Run e2e tests
- `test-coverage` - Run with coverage
- `test-watch` - Watch mode

### Code Quality
- `lint` - Run linter
- `lint-fix` - Fix lint issues
- `format` - Format code
- `check` - Type check
- `check-watch` - Watch mode

### Database
- `db-push` - Push schema
- `db-generate` - Generate migrations
- `db-migrate` - Run migrations
- `db-studio` - Open studio

### Utilities
- `install` - Install dependencies
- `update` - Update packages
- `audit` - Security audit
- `info` - Project info

### Workflows
- `setup` - Full setup
- `start` - Quick start
- `pre-commit` - Pre-commit checks
- `ci` - Full CI pipeline

## Tips

### Parallel Tasks

Run multiple tasks in parallel:

```bash
make dev-bg && make test-watch
```

### Background Server

Start server in background for other tasks:

```bash
make dev-bg
make test-e2e
make dev-stop
```

### Clean Slate

If you encounter issues:

```bash
make clean-all
make setup
```

### Check Everything

Before pushing to remote:

```bash
make ci
```

## Troubleshooting

### Port Already in Use

If port 5173/5174 is in use:

```bash
make dev-stop
# or
lsof -ti:5173 | xargs kill -9
```

### Module Not Found

```bash
make clean-all
make install
```

### Type Errors

```bash
make check
```

### Test Failures

```bash
make test-unit -- --reporter=verbose
```

## Environment Variables

Create `.env` file for local configuration:

```env
DATABASE_URL=your_database_url
AUTH_SECRET=your_auth_secret
```

## Additional Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vitest Docs](https://vitest.dev/guide/)