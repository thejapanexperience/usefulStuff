# Frontend Merge Request
## Description
- {description here including ticket number}

## Labels
- Set `WIP` label if checkboxes not all checked or work is incomplete
- Set `readyForReview` label when MR Checklist is complete
- Set `passedReview` label if approved in code review

## MR Checklist - [Code Standards](https://performancehorizongroup.atlassian.net/wiki/spaces/FRONT/pages/64028681/Frontend+code+standards)
Check all that apply and have been completed.
## readyForReview
- [ ] I have provided enough context for reviewers to review this MR
- [ ] I have manually tested this code in Chrome
- [ ] I have manually tested this code in one of Firefox, Safari, Edge or IE11
- [ ] I have a current green pipeline on this branch

## Code Style
- [ ] Variable names in `camelCase`
- [ ] File and directory names in `camelCase`, React component file names in `CamelCase`
- [ ] Functions are single responsibility
- [ ] Flow coverage on all files
- [ ] Correctly formatted exports: <br/>`export { entryFn as default, entryFn, blahReducer, anotherVar }`

## Testing
- [ ] Jest unit tests written for new code (`*.jest.js`)
- [ ] updated `jest.config.json` to make sure jest tests are included in coverage
- [ ] Integration tests written using @testing-library/react
- [ ] Mocha unit tests written for legacy code (`*.test.js | *.spec.js`)

## New Dependencies - Include name of package and reason for inclusion
- {name - reason for inclusion}
- [ ] updated `package.json.md`


# Code Review
"In general, reviewers should favor approving an MR once it is in a state where it definitely improves the overall code health of the system being worked on, even if the MR isn't perfect."

## Review Checklist
- [ ] Functionality: The MR made it clear what is trying to be accomplished
- [ ] Functionality: The code achieves the desired functionality
- [ ] Functionality: I'm happy there aren't edge cases that haven't been tested
<br/><br/>
- [ ] Design: The code is well designed and located appropriately
- [ ] Style: The code conforms to the style guide (see MR Checklist above)
- [ ] Naming: Names are easy to read but long enough to communicate what the item is or does
<br/><br/>
- [ ] Complexity: The code can be quickly understood by human beings
- [ ] Complexity: I'm happy the code can be modified in future with a low risk of introducing bugs
- [ ] Complexity: I'm happy that functions are single responsibility
<br/><br/>
- [ ] Tests: I'm happy that correct, sensible and useful tests have been written for this MR
- [ ] Tests: I'm happy that the tests are readable and will be simple to maintain
- [ ] Tests: I'm confident that the tests will fail if the code becomes broken
<br/><br/>
- [ ] Comments: I feel that comments in the code are useful as they explain `why` code exists, not `what` it is doing
- [ ] Documentation: Docs updated if changes to how we build, test, interact with or release code
<br/><br/>
- [ ] Every Line: I have looked at every line of human generated code in the MR
- [ ] Context: I have looked at the code in a wider context if necessary
- [ ] Good Things: I have left positive feedback where possible. Everyone loves a pat on the head...

If response to all of the above is satisfactory the code can be approved - Set `passedReview` label

## Principles
- Do not approve an MR that will reduce the overall health of the codebase
- Leave respectful comments that are actionable
- Facts and data overrule personal preference
- If the author can demonstrate through engineering principles or data that their approach is valid, the reviewer should accept the preference of the author.
- Unless the style guide is explicit, style is a matter of personal preference.
- If no other rules apply, the reviewer may ask the author maintain consistency with the current codebase, as long as the overall health of the system is not compromised.
- Include positive comments where you get the opportunity
- If a review comment is purely educational and not to be acted upon, prefix comment with `NIT: `

## Resolving Conflicts
1) Try to come to a consensus between the author and the reviewer
2) Arrange a face-to-face meeting to further discuss the conflict
3) Escalate to a Senior or Lead Developer

## Further Reading
- [The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)
- [What to Look for in a Code Review](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
