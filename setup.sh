#!/bin/bash

# Smart City Dashboard Setup Script
# This script sets up and runs the Smart City Dashboard application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ and try again."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) detected"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_success "npm $(npm -v) detected"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed successfully"
    else
        print_error "package.json not found. Make sure you're in the project directory."
        exit 1
    fi
}

# Create environment file
create_env_file() {
    if [ ! -f ".env" ]; then
        print_status "Creating environment configuration file..."
        cat > .env << EOF
# Smart City Dashboard Configuration
VITE_APP_NAME="Smart City Dashboard"
VITE_API_URL=http://localhost:8000
VITE_POLLING_INTERVAL=5000
EOF
        print_success "Environment file created (.env)"
        print_warning "Please update the VITE_API_URL in .env to match your backend server"
    else
        print_status "Environment file already exists"
    fi
}

# Start development server
start_dev_server() {
    print_status "Starting development server..."
    print_status "The application will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    echo ""
    npm run dev
}

# Build for production
build_production() {
    print_status "Building for production..."
    npm run build
    print_success "Production build completed in 'dist' directory"
}

# Preview production build
preview_build() {
    print_status "Starting production preview server..."
    print_status "The application will be available at: http://localhost:4173"
    npm run preview
}

# Show help
show_help() {
    echo "Smart City Dashboard Setup Script"
    echo ""
    echo "Usage: ./setup.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install    Install dependencies and setup environment"
    echo "  dev        Start development server (default)"
    echo "  build      Build for production"
    echo "  preview    Preview production build"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./setup.sh          # Install dependencies and start dev server"
    echo "  ./setup.sh install  # Only install dependencies"
    echo "  ./setup.sh build    # Build for production"
    echo ""
    echo "Environment Variables:"
    echo "  VITE_API_URL        Backend API URL (default: http://localhost:8000)"
    echo "  VITE_POLLING_INTERVAL  Data polling interval in ms (default: 5000)"
    echo ""
    echo "Requirements:"
    echo "  - Node.js 16+"
    echo "  - npm"
    echo ""
    echo "Backend API Routes Expected:"
    echo "  GET  /weather/latest     - Weather data"
    echo "  GET  /traffic/latest     - Traffic data"
    echo "  POST /scenario-bulk      - AI predictions"
    echo "  GET  /automation-rules   - List rules"
    echo "  POST /automation-rules   - Create rule"
    echo "  PUT  /automation-rules/:id - Update rule"
    echo "  DELETE /automation-rules/:id - Delete rule"
}

# Main execution
main() {
    echo "🏙️  Smart City Dashboard Setup"
    echo "================================"
    echo ""
    
    # Parse command line arguments
    COMMAND=${1:-"dev"}
    
    case $COMMAND in
        "install")
            check_node
            check_npm
            install_dependencies
            create_env_file
            print_success "Setup completed! Run './setup.sh dev' to start the development server."
            ;;
        "dev")
            check_node
            check_npm
            if [ ! -d "node_modules" ]; then
                install_dependencies
            fi
            create_env_file
            start_dev_server
            ;;
        "build")
            check_node
            check_npm
            if [ ! -d "node_modules" ]; then
                install_dependencies
            fi
            build_production
            ;;
        "preview")
            check_node
            check_npm
            if [ ! -d "dist" ]; then
                print_warning "No production build found. Building first..."
                build_production
            fi
            preview_build
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $COMMAND"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"