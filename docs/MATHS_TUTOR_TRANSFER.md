# Maths Tutor

Maths Tutor is a standalone copy of the existing maths classroom, prepared for a separate GitHub repository named `ramanayanala99/maths-tutor` and a new Netlify project. The original project and its settings remain unchanged.

The copy includes the Next.js home page, curriculum library, guided lessons, interactive visual teaching, browser voice controls, AI tutor functions, and the database migration for learning progress and usage limits. Its home-page branding, classroom title, and package name use Maths Tutor. The legacy women's-health backend, Git history, existing Netlify project linkage, environment files, installed dependencies, and build outputs are not included. Student data and account credentials are not transferred.

## Preparing a separate copy

From the original repository, run:

```sh
node scripts/export-maths-tutor.mjs ../maths-tutor
```

Choose an unused destination outside the existing repository. The exporter refuses to overwrite an existing directory. It creates a separate source project; it does not create a GitHub repository, upload files, or deploy a site.

## GitHub upload

Sign in to GitHub as the intended repository owner and create a new repository named `maths-tutor`. Choose public or private visibility before uploading: visibility was not specified in the request. Upload the contents of the exported directory, with its `package.json` at the repository root. Include the generated `.gitignore`, `netlify.toml`, and `netlify/database/migrations` files. Do not upload environment files, credentials, `node_modules`, or build outputs.

GitHub Desktop can publish the exported folder as a new repository without changing the original repository. GitHub's web uploader is another option; verify that hidden files such as `.gitignore` are included. This copy does not contain the original repository's Git history.

## New Netlify project

In Netlify, add a new project by importing the new GitHub repository. Do not rename or relink the existing project. Set the display name to Maths Tutor and choose an available site slug such as `maths-tutor`.

The included `netlify.toml` specifies `npm run build`, the `.next` publish directory, and `netlify/functions`. Netlify handles the Next.js integration. The included `@netlify/database` dependency enables the new project's own database; the migration in `netlify/database/migrations` creates the tutor tables during deployment. Do not manually apply that migration or reuse the original project's database connection.

Enable Netlify AI Gateway for the new project and verify its AI credit allowance. The copied modern tutor function uses the existing supported model and obtains its provider configuration from the gateway. Do not copy API keys from the original project. Prepared lessons remain available when AI is unavailable.

After deployment, check the home page, `/tutor/index.html`, guided lessons, saved progress, and one-to-one AI conversation. Browser speech support and microphone permission are required for voice input; typed replies remain available.

## Local validation

In the exported directory, install its locked dependencies with `npm ci`, then run `npm test` for the included service, conversation, classroom-integration, and visual-teaching checks. Use `netlify dev --port 8889` for local testing of platform features after linking this exported directory to the new project.
