# Contributing to WebToMobile

WebToMobile is a plan-first plugin for website-to-mobile migration work.
Contributions should preserve that scope and keep claims tied to evidence.

## Development

Use Node.js 22 or 24 LTS.

```bash
npm install --ignore-scripts
npm run check
```

The validation suite checks manifests, skill wiring, packaged resources,
scanner fixtures, plan gates, and repository hygiene. Add or update a fixture
whenever scanner behavior changes.

## Pull requests

- Keep each pull request focused on one behavior.
- Explain the user-visible effect and the validation evidence.
- Update `CHANGELOG.md` for behavior or packaging changes.
- Do not commit credentials, generated audit output, `graphify-out/`, or local
  editor files.
- Preserve the approval gate: audit, plan, user approval, implementation, and
  verification remain distinct phases.

By contributing, you agree that your contribution is licensed under the MIT
License.
