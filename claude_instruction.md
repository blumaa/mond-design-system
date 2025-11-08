1. you must use TDD
2. you must reuse mds components when you can-- for example if you need to use a div, use Box. or if you need to use a button, use Button.tsx
3. components need to be simple and minimal and use design system tokens.
4. design system tokens need to be exportable so that they can be used and typescript checked in client apps.
5. components need to use design system tokens for props/styles.
6. you need to use the ui engineer when doing everything and anything in this project.
7. componenets and stories should never use style prop to style anything.
8. do not over-engineer anything
9. keep it simple-- use SOLID and DRY and KISS principles and Single Source of Truth
10. before you start coding anything you must run your file and folder architecture by me and get approval.
11. after the creation of a component you must run lint and typescript check on it
12. do not ever disable lint or typsecript
13. keep Typescript types simple, if you have questions, ask.
14. Do not guess or estimate what you need to do. Use research and facts. if you don't know, ask.
15. Only use the official docs for references-- next.js, etc. Always read them and use them for whichever feature you are implementing.
16. When you run the ci you need to use scripts in the package.json with yarn.


we need to be using space tokens instead of setting hard coded px
why use button instead of Button.tsx? always reuse components when you can.
minimize the use of className and use the used component's props before reverting to className.
all storybook stories need to be updated as well for the component migration.
