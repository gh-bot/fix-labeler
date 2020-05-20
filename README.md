# How it works

GitHub encourages use of [Issues](https://guides.github.com/features/issues) to keep track of problems and new features. Basically any type of work could be tracked by these issues.

When work is done issues [could be closed](https://help.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords) inside commit messages. But many workflows utilize complex branching strategies, for example branches to fixes or work on features. And while issue could be fixed in one of these branches, it will not be closed until the change is merged into default branch.
It is also impossible to see where if it was merged into the branch without looking at the git history.

This action helps to keep track of these fixes.

During build, it checks what branch it is executed on and searches labels in repository. If label with the same name exists, it will apply it to all issues marked as fixed in commit messages. So when these are merged from branch to branch, labels will accumulate and even cursory look at these issues will immediately tell you if something is amiss.

![Annotated Issues](https://raw.githubusercontent.com/gh-bot/fix-labeler/master/pics/screenshot.png "Annotated Issues")

## Usage

```yaml
- name: Fixed Issues Labeler
  uses: gh-bot/fix-labeler@master
  with:
    # Personal access token (PAT) used to fetch the repository. The PAT is configured
    # with the local git config, which enables your scripts to run authenticated git
    # commands. The post-job step removes the PAT.
    #
    # We recommend using a service account with the least permissions necessary. Also
    # when generating a new PAT, select the least scopes necessary.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    #
    # Default: ${{ github.token }}
    token: ''

    # Name of the label to apply to fixed issues. When parameter is 
    # not present, issues will be annotated with a label named as current branch, 
    # "master" or "develop" for example. If requested label is not found in the 
    # repository, nothing is annotated
    # Default: Current branch name
    label: ''

    # Relative path under $GITHUB_WORKSPACE to place the repository
    path: ''
```
