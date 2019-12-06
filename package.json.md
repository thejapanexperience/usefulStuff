# Scripts - run with yarn

## Development
`develop` - Watch mode script to work with `partnerize` repo running in docker

## Testing

`test` - Run coverage for old and new test suites. Fails on failing test and if coverage requirements are not met.

`mocha` - Run old test suite. Picks up any `.spec.js` or `.test.js` files.
| `mocha:watch` - Run old test suite in watch mode
| `mocha:coverage` - Generate coverage for old test suite
| `mocha:coverage-view` - Open lcov report in browser for old test suite

`jest` - Run new test suite. Picks up any `.jest.js` files.
| `jest:watch` - Run new test suite in watch mode
| `jest:coverage` - Generate coverage for new test suite
| `jest:coverage-view` - Open lcov report in browser for new test suite

`coverage:combined` - Generate and view combined coverage report of old and new test suites

# Packages

## Testing

### jest - test runner for new tests
### mocha - test runner for old tests
### chai - assertion library for mocha
### @testing-libary/react - React testing utilities
- We have added some custom render methods to the library to allow us to import components with themes and with redux. Import from this folder instead of `import { render } from '@testing-library/react'`.

- `renderConnected` was pulled out into its own file as importing `import makeStore from 'app/state/store'` adds too much time to tests that aren't actually using the `renderConnected` method.
```
import { render, renderThemed, cleanup, fireEvent } from 'app/utils/@testing-library/react';
import { renderConnected } from 'app/utils/@testing-library/react-redux';
```


### enzyme - Javascript testing utilities
### istanbul - creates test coverage reports
### nyc - istanbul command line interface
### istanbul-combine-updated - create combined coverage reports
