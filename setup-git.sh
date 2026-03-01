#!/bin/bash

# Campus Pay - Git Repository Setup Script
# This script initializes the git repository and prepares it for GitHub

echo "🎓 Campus Pay - Git Setup"
echo "========================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository
echo "📦 Initializing Git repository..."
git init

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Campus Pay - Smart Wallet for Student Payments

- Full-stack TypeScript application
- React + Vite frontend
- Express backend with JWT authentication
- Stripe payment integration
- Role-based access control (Student/Admin)
- In-memory database for development
- Complete API endpoints for charges, payments, and users"

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a new repository on GitHub"
echo "2. Copy the repository URL"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin <your-github-repo-url>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Example:"
echo "   git remote add origin https://github.com/yourusername/campus-pay.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎉 Happy coding!"
