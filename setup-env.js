#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyDK5cHbOa8L97fEvdASBrul3x8X2Sp3BnQ

# Note: This file contains sensitive information and should not be committed to version control
# The .env.local file is already in .gitignore to prevent accidental commits
`;

const envPath = path.join(__dirname, '.env.local');

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Skipping creation to avoid overwriting existing configuration.');
    console.log('If you need to update your API key, please edit .env.local manually.');
  } else {
    // Create .env.local file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created successfully!');
    console.log('📝 Your Gemini API key has been added to the environment file.');
    console.log('🔒 This file is already in .gitignore and will not be committed to version control.');
  }
  
  console.log('\n🚀 You can now start your development server:');
  console.log('   npm run dev');
  
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('\n📝 Please create .env.local manually with the following content:');
  console.log(envContent);
} 