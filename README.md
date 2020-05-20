# Labeler of Fixed Issues

Many workflows create branches to fix [issues](https://help.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/managing-your-work-with-issues)
and work on features. When a bug or a feature is implemented issues are closed 
with appropriate [commit messages](https://github.blog/2013-01-22-closing-issues-via-commit-messages/)
and issues are closed when merged into default branch. 
In order to keep branches in sync, developers must keep track of what issues 
were merged to which branch, for example, did the hotfix made it into the develop yet?
This action helps to keep track of these fixed issues.
During build, the action checks what branch it is executed on and searches labels in 
repository. If label with the same name exists, it will apply it to all 
issues marked as fixed in commit messages. So when these are merged from branch to branch, 
it will accumulate all the labels related to these branches. So even cursory look at these
issues will immediately tell you if the issue is missing in certain branches