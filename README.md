# How it works

GitHub encourages use of [Issues](https://guides.github.com/features/issues) to keep track of problems and new features. Basically any type of work could be tracked by these issues.

When work is done issues [could be closed](https://help.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords) inside commit messages. But many workflows utilize complex branching strategies, for example branches to fixes or work on features. And while issue could be fixed in one of these branches, it will not be closed until fix is merged into default branch. It is also immediately apparent if the fix was merged into a branch without looking at the git history.

This action helps to keep track of these fixes.

When executed, the action checks what branch it is executed on and searches labels in repository. If label with the same name exists, it will apply it to all issues marked as fixed in commit messages. So when these are merged from branch to branch, labels will accumulate and even cursory look at these issues will immediately tell you if something is amiss.

![Annotated Issues](https://raw.githubusercontent.com/gh-bot/fix-labeler/master/pics/screenshot.png "Annotated Issues")

## Usage

```yaml
- name: Label Fixed Issues
  uses: gh-bot/fix-labeler@master
  with:
    # By default the action is using Personal access token (PAT) used to fetch
    # the repository.
    #
    # Default: ${{ github.token }}
    token: ''

    # Name of the label to apply to fixed issues. When parameter is
    # not present, issues will be annotated with a label named as current branch,
    # "master" or "develop" for example. If requested label is not found in the
    # repository, nothing is annotated
    #
    # Default: Current branch name
    label: ''

    # Relative path under $GITHUB_WORKSPACE to place the repository
    #
    # Default: current directory
    path: ''
```

### Token

Unless you need to use specific token with custom access, this parameter could be left out to use default  

### Path

This parameter allows you to specify location of the target repository. The value of this parameter should be the same as the 'path' of [Checkout](https://github.com/marketplace/actions/checkout) action used to get the repository

### Label

This parameter allows to specify name of the label to annotate issues with. If no label provided the action will try to guess the label's name. It will use the following algorithm:

* Check if branch name exactly matches one of the labels in repository. For example if the branch is **"release/1.0.0"** and repository has a label with the same name **`release/1.0.0`**, that label will be used

* Next the action will try to split the name of a branch and look for these parts: A branch name will be split into **"1.0.0"** and **"release"**. The action will first look for  `1.0.0` and if not found `release`

* If no label found, the action will just terminate

# export NODE_OPTIONS=--openssl-legacy-provider
