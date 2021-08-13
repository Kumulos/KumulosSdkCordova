### Description of Changes

(briefly outline the reason for changes, and describe what's been done)

### Breaking Changes

-   None

### Release Checklist

Prepare:

-   [ ] `npm run dist` to produce minified artifacts
-   [ ] Detail any breaking changes. Breaking changes require a new major version number
-   [ ] Update type declarations in index.d.ts

Bump versions in:

-   [ ] package.json
-   [ ] plugin.xml
-   [ ] src/ios/KumulosSDKPlugin.m
-   [ ] src/android/.../KumulosInitProvider.java

Release:

-   [ ] Squash and merge to master
-   [ ] Delete branch once merged
-   [ ] Create tag from master matching chosen version
-   [ ] Fill out release notes
-   [ ] Run `npm publish`

Update changelog:

- [ ] https://docs.kumulos.com/developer-guide/sdk-reference/cordova/#changelog

