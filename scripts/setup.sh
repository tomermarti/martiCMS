#!/bin/bash

echo "🚀 MartiCMS Setup Script"
echo "========================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please edit it with your credentials."
    echo ""
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "For deployment to Vercel:"
echo "1. Run 'vercel' command"
echo "2. Add environment variables in Vercel dashboard"
echo ""

