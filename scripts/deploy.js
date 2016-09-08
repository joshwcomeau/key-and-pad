// NOTE: This script handles the deployment, but NOT getting the Git branch
// up-to-date. You need to rebase master before deploying.
const git = require('git-rev');
const { exec } = require('child_process');


const deployBranch = 'gh-pages';

function deploy(currentBranch) {
  // Ensure that we're on the gh-pages branch
  if (currentBranch !== deployBranch) {
    console.error(`
      DEPLOY FAILED.
      You are currently on the '${currentBranch}' branch, and you need to be on '${deployBranch}'.

      NEXT STEPS:
      $ git checkout ${deployBranch}
      $ git rebase master
      $ npm run deploy
    `);
  }

  // exec(`git subtree push --prefix build origin ${deployBranch}`);
}

// `git.branch` takes a callback which is applied w/ the current branch name.
git.branch(deploy);
