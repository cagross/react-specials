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

_Specific Dependency Notes_

- **react-transition-group**:
  - **Current Status**: Not compatible with React 19 due to the removal of `ReactDOM.findDOMNode`.
  - **Symptom**: Without the workaround, the app's front-end crashes with a runtime error because `ReactDOM.findDOMNode` is no longer available in React 19.
  - **Current Workaround**: Custom code modifications in commit e48d346 to handle transitions without using `findDOMNode`.
  - **Future Considerations**:
    1. Check [GitHub Issue #918](https://github.com/reactjs/react-transition-group/issues/918) for official React 19 compatibility updates. If a compatible version is released, implement it and remove the workaround code.
    2. If no compatible version exists and significant time has passed, evaluate replacing the package with alternatives like [react-transition-state](https://github.com/szhsin/react-transition-state). If a replacement is implemented, remove the workaround code.
    3. If neither option is viable, maintain the current workaround until a solution becomes available.

_Vulnerabilities_

None.
