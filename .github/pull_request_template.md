### Description of Changes

(briefly outline the reason for changes, and describe what's been done)

### Breaking Changes

-   None

### Release Checklist

Prepare:

-   [ ] Detail any breaking changes. Breaking changes require a new major version number

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
