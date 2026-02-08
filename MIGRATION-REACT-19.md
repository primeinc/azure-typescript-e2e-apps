# Migration Guide: React 19 and Azure SDK Updates

## Overview

This document describes the migration from React 18 to React 19, along with updates to the latest Azure SDK versions and related dependencies.

## Summary of Changes

### React and UI Libraries

#### React Applications Updated
- **app-react-vite**: React 18.2.0 → 19.2.4
- **azure-upload-file-to-storage/app**: React 18.2.0 → 19.2.4

#### Key Dependency Updates

**React Core:**
- `react`: ^18.2.0 → ^19.2.4
- `react-dom`: ^18.2.0 → ^19.2.4
- `@types/react`: ^18.x → ^19.2.13
- `@types/react-dom`: ^18.x → ^19.2.3

**Build Tools:**
- `vite`: 4.x → 7.3.1
- `@vitejs/plugin-react`: 3.x-4.x → 5.1.3
- `typescript`: 4.9.3-5.0.2 → 5.7.3

**UI Frameworks:**
- `styled-components`: 5.3.9 → 6.3.8 (app-react-vite)
- `@mui/material`: 5.14.2 → 7.3.7 (azure-upload-file-to-storage/app)
- `@emotion/react`: 11.11.1 → 11.14.0
- `@emotion/styled`: 11.11.0 → 11.14.0

### Azure SDKs

All Azure SDK packages have been updated to their latest versions:

**Core SDKs:**
- `@azure/identity`: 3.x-4.6.0 → 4.13.0
- `@azure/functions`: 4.0.0-alpha → 4.11.2
- `@azure/storage-blob`: 12.14.0-12.26.0 → 12.30.0

**Service-Specific SDKs:**
- `@azure/openai`: 2.0.0-beta.2 → 2.0.0
- `@azure/keyvault-certificates`: 4.8.0 → 4.10.0
- `@azure/keyvault-keys`: 4.8.0 → 4.10.0
- `@azure/keyvault-secrets`: 4.8.0 → 4.10.0
- `@azure/search-documents`: 12.1.0 → 12.2.0
- `@azure/ai-projects`: 1.0.0-beta.2 → 1.0.1
- `@azure/arm-resources`: 5.2.0 → 7.0.0
- `@azure/service-bus`: 7.9.5 (already latest)

## Breaking Changes

### Material-UI v7 Grid API Changes

Material-UI v7 introduced breaking changes to the Grid component API. The `item` and responsive props syntax has changed:

**Before (MUI v5):**
```tsx
<Grid container spacing={2}>
  <Grid item xs={6} sm={4} md={3}>
    {/* content */}
  </Grid>
</Grid>
```

**After (MUI v7):**
```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
    {/* content */}
  </Grid>
</Grid>
```

**What changed:**
- Removed: `item` prop (Grid items are now automatically detected within containers)
- Changed: `xs`, `sm`, `md`, `lg`, `xl` props → consolidated into a single `size` prop with an object

### React 19 Changes

React 19 is largely backward compatible, but here are the key changes:

1. **No need to import React for JSX**: React 19 automatically handles JSX transformation. However, existing imports remain valid.
   
2. **Improved ref handling**: `ref` is now a regular prop and no longer requires `forwardRef` in many cases (backward compatible).

3. **Automatic batching**: Enhanced automatic batching of state updates (improvement, not breaking).

4. **Error handling**: Improved error boundaries and error reporting.

## Migration Steps

### Automated Migration Tools

This upgrade used the following automated migration tools to ensure correctness:

1. **types-react-codemod**: Automated React 19 type migrations
   ```bash
   npx types-react-codemod@latest preset-19 src/ --yes
   ```

2. **@mui/codemod**: Automated Material-UI v7 Grid API updates
   ```bash
   npx @mui/codemod@latest v7.0.0/grid-props src/
   ```

3. **npm-check-updates**: Automated dependency version updates
   ```bash
   npx npm-check-updates -u
   npm install
   ```

These tools were run on all React applications and verified that the code is compatible with React 19 and MUI v7.

### For New Projects

If you're creating a new project based on this repository:

1. Clone the repository
2. Run `npm install` in the relevant project directories
3. Build and test as usual

### For Existing Projects

If you have an existing project based on this repository, use these automated tools:

1. **Update package.json with npm-check-updates**:
   ```bash
   npx npm-check-updates -u
   npm install
   ```

2. **Run React 19 type migrations**:
   ```bash
   npx types-react-codemod@latest preset-19 src/ --yes
   ```

3. **Run MUI v7 Grid migrations** (if using Material-UI):
   ```bash
   npx @mui/codemod@latest v7.0.0/grid-props src/
   ```

4. **Manual updates** (if needed):
   - Review any Grid components that weren't automatically migrated
   - Check for deprecated React patterns
   - Update Azure SDK usage if APIs have changed

5. **Build and test**:
   ```bash
   npm run build
   npm run test
   ```

## Testing

All React applications have been built successfully:
- ✅ app-react-vite builds without errors
- ✅ azure-upload-file-to-storage/app builds without errors
- ✅ Azure Functions APIs build without errors

## Known Issues

- None at this time

## Security

All dependencies have been updated to address known vulnerabilities. A minimal number of low-severity vulnerabilities remain in transitive dependencies, which are being tracked and will be addressed as upstream packages are updated.

## Additional Resources

- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Material-UI v7 Migration Guide](https://mui.com/material-ui/migration/migration-v6/)
- [Vite 5 Migration Guide](https://vitejs.dev/guide/migration)
- [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js)

## Support

For issues or questions:
1. Check the [React 19 documentation](https://react.dev)
2. Review [Azure SDK documentation](https://learn.microsoft.com/azure/developer/javascript/)
3. Open an issue in this repository

---

**Migration Date**: February 2026  
**React Version**: 19.2.4  
**Azure SDK Versions**: Latest as of February 2026
