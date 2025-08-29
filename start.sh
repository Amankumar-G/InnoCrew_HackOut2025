#!/bin/bash

# HACK_OUT Docker Service Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if docker-compose is available
check_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed. Please install it and try again."
        exit 1
    fi
    print_success "docker-compose is available"
}

# Function to check environment file
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success ".env file created from template"
            print_warning "Please edit .env file with your actual configuration before starting services"
        else
            print_error ".env.example not found. Please create .env file manually."
            exit 1
        fi
    else
        print_success ".env file found"
    fi
}

# Function to start services
start_services() {
    print_status "Starting HACK_OUT services..."
    docker-compose up -d --build
    print_success "Services started successfully"
}

# Function to stop services
stop_services() {
    print_status "Stopping HACK_OUT services..."
    docker-compose down
    print_success "Services stopped successfully"
}

# Function to restart services
restart_services() {
    print_status "Restarting HACK_OUT services..."
    docker-compose restart
    print_success "Services restarted successfully"
}

# Function to show service status
show_status() {
    print_status "Service status:"
    docker-compose ps
}

# Function to show logs
show_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services (Ctrl+C to exit):"
        docker-compose logs -f
    else
        print_status "Showing logs for $service service (Ctrl+C to exit):"
        docker-compose logs -f "$service"
    fi
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "HACK_OUT Docker Service Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start all services"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  status    Show service status"
    echo "  logs      Show logs (all services or specific service)"
    echo "  cleanup   Clean up Docker resources"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Start all services"
    echo "  $0 logs                     # Show logs for all services"
    echo "  $0 logs client              # Show logs for client service"
    echo "  $0 cleanup                  # Clean up Docker resources"
}

# Main script logic
main() {
    case "${1:-start}" in
        start)
            check_docker
            check_compose
            check_env
            start_services
            show_status
            ;;
        stop)
            check_docker
            check_compose
            stop_services
            ;;
        restart)
            check_docker
            check_compose
            restart_services
            show_status
            ;;
        status)
            check_docker
            check_compose
            show_status
            ;;
        logs)
            check_docker
            check_compose
            show_logs "$2"
            ;;
        cleanup)
            check_docker
            check_compose
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"