# Session Localization

Shared TypeScript localization library for Session projects.

Do not edit any files in the [generated/](./generated/) directory. All user-facing
strings are localized and managed via our [Localization Platform](https://getsession.org/translate).

## Structure

- `localeTools.ts` - Main localization logic
- `generated/` - Auto-generated translation files (updated by external codegen)
- `index.ts` - Main export

## Usage as Git Submodule

### Add to your project

```bash
git submodule add <repo-url> ts/localization
```

### Import and use

```typescript
import { setLocaleInUse, tr } from './ts/localization';

setLocaleInUse('es');
const text = tr('your.token', { arg: 'value' });
```

## Type Checking

```bash
./scripts/compile.sh
```

Automatically downloads TypeScript and runs type checking.

## Updating

```bash
cd ts/localization
git pull origin main
```

