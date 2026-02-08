# Release Notes - React 19 and Azure SDK Upgrade

**Release Date**: February 8, 2026  
**Version**: Major Update

## 🎉 What's New

### React 19 Upgrade

We've successfully upgraded all React applications to **React 19.2.4**, bringing the latest features and improvements from the React team:

- **Enhanced Performance**: React 19 includes performance optimizations and better automatic batching
- **Improved Developer Experience**: Better error messages and debugging capabilities
- **Modern JSX Transform**: No need to import React for JSX (backward compatible)
- **Ref Improvements**: Simplified ref handling (backward compatible)

### Updated Build Stack

- **Vite 7.3.1**: Faster builds and improved hot module replacement
- **TypeScript 5.7.3**: Latest TypeScript with improved type checking and IDE support
- **Modern Tooling**: Updated ESLint, Prettier, and other development tools

### Azure SDK Updates

All Azure SDK packages have been updated to their latest stable versions, ensuring:
- **Latest Features**: Access to newest Azure service capabilities
- **Security Patches**: Latest security updates and vulnerability fixes
- **Better Performance**: Improved SDK performance and reliability
- **Enhanced Compatibility**: Better integration with modern Azure services

## 📦 Applications Updated

### React Applications

1. **app-react-vite**
   - React 19.2.4
   - Vite 7.3.1
   - styled-components 6.3.8
   - TypeScript 5.7.3

2. **azure-upload-file-to-storage/app**
   - React 19.2.4
   - Vite 7.3.1
   - Material-UI 7.3.7
   - TypeScript 5.7.3
   - Azure Storage Blob SDK 12.30.0

### API Projects

1. **azure-upload-file-to-storage/api**
   - Azure Functions 4.11.2
   - Azure Storage Blob 12.30.0

2. **api-inmemory**
   - Azure Functions 4.11.2

3. **api-functions-v4-azure-resource-management**
   - Azure Functions 4.11.2
   - Azure Identity 4.13.0
   - Azure ARM Resources 7.0.0

### Quickstart Projects

All quickstart samples have been updated with the latest Azure SDKs:
- ✅ Storage
- ✅ Key Vault
- ✅ OpenAI
- ✅ AI Search
- ✅ Service Bus
- ✅ AI Agents
- ✅ Azure OpenAI Assistants

## 🔧 Key Changes

### Material-UI v7

The Azure file upload application now uses Material-UI v7, which includes:
- New Grid API with simplified responsive layout syntax
- Improved performance and bundle size
- Better accessibility features

**Code Change Example:**
```tsx
// Old (MUI v5)
<Grid item xs={6} sm={4} md={3}>

// New (MUI v7)
<Grid size={{ xs: 6, sm: 4, md: 3 }}>
```

### Azure SDK Improvements

- **@azure/identity 4.13.0**: Enhanced authentication capabilities
- **@azure/storage-blob 12.30.0**: Latest blob storage features
- **@azure/functions 4.11.2**: Stable Azure Functions v4 programming model
- **@azure/openai 2.0.0**: Production-ready (no longer beta)
- **@azure/ai-projects 1.0.1**: Stable AI projects SDK

## ✅ Validation

All applications have been:
- ✅ Built successfully
- ✅ Dependencies installed without errors
- ✅ Security vulnerabilities addressed
- ✅ Code updated for breaking changes

## 📚 Documentation

New documentation added:
- **MIGRATION-REACT-19.md**: Comprehensive migration guide with step-by-step instructions
- Updated dependency versions across all `package.json` files

## 🔐 Security

- Updated all dependencies to latest versions
- Addressed known vulnerabilities in Azure SDKs
- Updated build tools to secure versions
- Minimal residual low-severity vulnerabilities in transitive dependencies (tracked for upstream fixes)

## 🚀 Getting Started

For new users:
```bash
# Clone the repository
git clone https://github.com/primeinc/azure-typescript-e2e-apps.git

# Navigate to a project
cd azure-typescript-e2e-apps/app-react-vite

# Install dependencies
npm install

# Build
npm run build

# Start development
npm run dev
```

For existing users:
```bash
# Pull latest changes
git pull

# Update dependencies
npm install

# Rebuild
npm run build
```

## 📖 Migration Guide

If you have projects based on this repository, please refer to **MIGRATION-REACT-19.md** for detailed migration instructions.

## 🔗 Resources

- [React 19 Release Blog](https://react.dev/blog/2024/12/05/react-19)
- [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js)
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🐛 Known Issues

None at this time.

## 🙏 Credits

This upgrade includes contributions from the React team, Azure SDK team, and the broader open-source community.

## 📝 Changelog

### Added
- React 19.2.4 support across all React applications
- Updated Azure SDK packages to latest versions
- Migration guide (MIGRATION-REACT-19.md)
- Release notes (this document)

### Changed
- Upgraded Vite from 4.x to 7.3.1
- Upgraded TypeScript from 4.9.x/5.0.x to 5.7.3
- Upgraded Material-UI from 5.14.2 to 7.3.7
- Upgraded styled-components from 5.3.9 to 6.3.8
- Updated all Azure SDK packages to latest stable versions

### Fixed
- Material-UI v7 Grid API compatibility
- Security vulnerabilities in dependencies
- TypeScript compilation with latest versions

### Removed
- None (all changes are backward compatible where possible)

---

**Questions or Issues?** Please open an issue in the repository.
