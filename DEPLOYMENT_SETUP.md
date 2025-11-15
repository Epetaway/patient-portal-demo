# 🚀 GitHub Pages Deployment Setup Guide

## Quick Setup Steps

### 1. Enable GitHub Pages
1. Go to your repository on **GitHub.com**
2. Click **"Settings"** tab (top menu)
3. Scroll to **"Pages"** in the left sidebar
4. Under **"Source"**, select **"GitHub Actions"**
5. Click **"Save"**

### 2. Verify Setup
- The workflow will automatically trigger after enabling Pages
- Your site will be available at: `https://[your-username].github.io/patient-portal-demo/`
- Allow 2-3 minutes for the first deployment

## Alternative: Manual Pages Configuration

If GitHub Actions option isn't available:

1. **Source**: Deploy from a branch
2. **Branch**: `master` or `main` 
3. **Folder**: `/ (root)`

## Troubleshooting

### Common Issues:
- **"Pages not enabled"**: Follow step 1 above
- **"404 Not Found"**: Check repository visibility (must be public for free accounts)
- **"Build failed"**: Check Actions tab for error logs

### Repository Settings Check:
- ✅ Repository is **public** (or GitHub Pro for private Pages)
- ✅ Pages source set to **"GitHub Actions"**
- ✅ Workflow file exists at `.github/workflows/deploy.yml`

## Live Demo Features

Once deployed, your demo will showcase:

### 🏥 **Healthcare Portal Features**
- **Authentication System** with demo login
- **Patient Dashboard** with overview statistics  
- **Prescription Management** with refill requests
- **Payment Processing** with multiple methods
- **Profile Management** with security settings
- **Registration Wizard** (4-step process)

### 💻 **Technical Showcase**
- **Enterprise MVC Architecture** in JavaScript
- **Bootstrap 5** responsive design
- **Real-time Form Validation**
- **localStorage Session Management**
- **Toast Notification System**
- **Multi-step Wizard Implementation**

### 🎯 **Demo Credentials**
- **Username**: `demo@asembia.com`
- **Password**: `password`

---

**Next Step**: Enable GitHub Pages in repository settings, then push any commit to trigger deployment! 🚀