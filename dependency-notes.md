# Notable Dependency Issues

This document outlines the current issues, vulnerabilities, or items of note, regarding the dependencies for the Specials app. Please review this document before proceeding with any updates to the NPM dependencies.

Remember that the app contains two separate Node projects. The first is an Express project in the root directory. The second is a React project in the `client` directory. This document addresses each individually.

## Express Project Dependencies

_Specific Dependency Notes_

None.

_Vulnerabilities_

- `connect-mongodb-session`/`archetype`/`lodash.set`:

  - **Details**: These vulnerabilities are all associated with the `archetype` package, which is a dependency of the `connect-mongodb-session` top-level dependency. An open issue has been reported in the `connect-mongodb-session` repository to resolve this: [connect-mongodb-session Issue #113](https://github.com/mongodb-js/connect-mongodb-session/issues/113).
  - **Current Risk Assessment**: While this is a high severity vulnerability in the session management layer, it currently poses no practical risk to the application because:
    1. The app does not yet implement login functionality.
    2. There are no protected routes or content that could be accessed through session manipulation.
    3. No authenticated sessions exist to be compromised.
    4. User data remains protected by database security.
  - **Action Required**: This vulnerability can be resolved by running `npm audit fix`. This will replace the vulnerable `lodash.set` and `lodash.clonedeep` packages with the full `lodash` package, which is the recommended approach. While this fix should be applied before implementing login functionality, it is not blocking current development work.

## React Project Dependencies (`client` Folder)

None.

_Vulnerabilities_

None.
