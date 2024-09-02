# Notable Dependency Issues

This document outlines the current issues, vulnerabilities, or items of note, regarding the dependencies for the Specials app. Please review this document before proceeding with any updates to the NPM dependencies.

Remember that the app contains two separate Node projects. The first is an Express project in the root directory. The second is a React project in the `client` directory. This document addresses each individually.

## Express Project Dependencies

_Specific Dependency Notes_

- **node-fetch**:

  - **Current Version**: 2.x
  - **Important Note**: The `node-fetch` dependency is currently at version 2.x and must remain at this version to avoid breaking imports. This is acceptable as the developers are continuing to maintain this version. There is an ongoing investigation into replacing `node-fetch` with Node's native `fetch` feature.

_Vulnerabilities_

- `connect-mongodb-session`/`archetype`/`lodash.set`:

  - **Details**: These vulnerabilities are all associated with the `archetype` package, which is a dependency of the `connect-mongodb-session` top-level dependency. An open issue has been reported in the `connect-mongodb-session` repository to resolve this: [connect-mongodb-session Issue #113](https://github.com/mongodb-js/connect-mongodb-session/issues/113).

## React Project Dependencies (`client` Folder)

_Specific Dependency Notes_

None.

_Vulnerabilities_

- `react-scripts`/`resolve-url-loader`/`postcss`:

  - **Details**: `npm audit` reports a vulnerability linked to this chain of dependencies. However, this is a known false positive, as confirmed by the [official react-scripts repository](https://github.com/facebook/create-react-app/issues/10945). This warning can be ignored. There is currently no way to suppress this warning in `npm audit` when run locally, but it can be suppressed in production by moving `react-scripts` from `dependencies` to `devDependencies` in `package.json`.

- `react-scripts`/`resolve-url-loader`/`nth-check`:
  - **Details**: Another vulnerability reported by `npm audit`, which is linked to the `nth-check` package. The [official post](https://github.com/facebook/create-react-app/issues/13062#issuecomment-1474189236) indicates that the `create-react-app` (CRA) framework, which includes `react-scripts`, is no longer actively maintained by Facebook, and security vulnerabilities are unlikely to be fixed. There are plans to remove CRA entirely and replace it with another framework.
