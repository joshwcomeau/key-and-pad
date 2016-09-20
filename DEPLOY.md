## Deployment

This project is deployed to GitHub Pages. The current deploy process is a bit funky.

The `gh-pages` branch holds the production code, BUT we don't push the entirety of the contents to GitHub. This is because, AFAIK, there is no way to specify that GitHub Pages should read from a subdirectory, and the compiled application lives in /build.

#### Instructions

- checkout `gh-pages`. If on a new machine, create the local branch, don't try and pull the remote.
- rebase master, so that it's up to date.
- run `npm run build`.
- run `git add . && git commit --amend --no-edit`
- run `npm run deploy`.
- In GitHub, re-add the custom domain 'keyandpad.com' in the repo settings.
  No idea why, but deploying unsets the custom domain :(
