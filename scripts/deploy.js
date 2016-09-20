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

  // Split the current repo into a new branch consisting only of the
  // `build` directory, and immediately force-push it to gh-pages branch.
  exec(`git push origin \`git subtree split --prefix build ${deployBranch}\`:${deployBranch} -f`);

  console.info(`
    Successfully deployed!
    Check it out: http://keyandpad.com/
  `);
}

// `git.branch` takes a callback which is applied w/ the current branch name.
git.branch(deploy);
