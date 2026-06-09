### Git Commands for Starting a Repository and Advanced Usage

#### Basic Commands to Start a Git Repository:
1. **Initialize a new repository:**
   ```bash
   git init
   ```
   - **Usage:** Creates a new Git repository in the current directory.

2. **Clone an existing repository:**
   ```bash
   git clone <repository_url>
   ```
   - **Usage:** Copies a remote Git repository to your local machine.

3. **Add files to staging:**
   ```bash
   git add <file_name>  # To add a specific file
   git add .  # To add all changes in the directory
   ```
   - **Usage:** Adds changes in the working directory to the staging area, preparing them to be committed.

4. **Commit changes:**
   ```bash
   git commit -m "Initial commit"
   ```
   - **Usage:** Saves the staged changes in the repository history with a descriptive message.
   
5. To add a username and email address to Git, you can use the `git config` command in the command line:

	1. Open the command line
	2. Set your username with the command `git config --global user.name "FIRST_NAME LAST_NAME"`
	3. Set your email address with the command `git config --global user.email "MY_NAME@example.com"`
	4. Verify your configuration by running the command `cat .git/config` 
    

	You can also set your username and email in Visual Studio by going to the Git menu, then Settings. From there, you can set your username and email at the global or repository level. 

	| Command                                                | Description                         |
	| ------------------------------------------------------ | ----------------------------------- |
	| `git config --global user.name "FIRST_NAME LAST_NAME"` | Sets your username globally         |
	| `git config --global user.email "MY_NAME@example.com"` | Sets your email address globally    |
	| `git config --list`                                    | Lists all the settings Git can find |
	|                                                        |                                     |
#### Advanced Commands for Professional ML Practices:
1. **Pushing to a remote branch with upstream tracking:**
   ```bash
   git push --set-upstream origin <branch_name>
   ```
   - **Usage:** Pushes the local branch to the remote branch and sets it as the default upstream. This allows you to just use `git push` in the future without specifying the remote/branch.

   **Example:**
   ```bash
   git push --set-upstream personal-portfolio master
   ```
   - Here, the command sets the remote repository `personal-portfolio`'s `master` branch as the upstream for your local branch.

2. **Creating a new branch and switching to it:**
   ```bash
   git checkout -b <branch_name>
   ```
   - **Usage:** Creates a new branch and switches to it. This is particularly useful when you are working on a feature, experiment, or model in machine learning.

3. **Fetching changes from the remote without merging:**
   ```bash
   git fetch origin
   ```
   - **Usage:** Fetches updates from the remote repository but does not merge them into the current branch. This is helpful to review changes before integrating them.
   - **Reason to Use:** This provides better control as you can inspect the incoming changes before applying them, which is important for complex models or large datasets in ML practices.

4. **Merging a branch into your current branch:**
   ```bash
   git merge <branch_name>
   ```
   - **Usage:** Integrates changes from the specified branch into your current branch. In machine learning workflows, you might want to merge a branch containing a tested model into the main or production branch after evaluation.
   - **Reason to Use:** A controlled, conflict-resolving way to integrate changes, unlike `pull`, which directly fetches and merges. Using `fetch` and `merge` separately gives you better oversight and avoids potential conflicts in code or models.

5. **Checking the difference between branches or commits:**
   ```bash
   git diff <branch_name_1>..<branch_name_2>
   ```
   - **Usage:** Shows the changes between two branches, commits, or tags, helping you track differences between versions of machine learning models or datasets.

6. **Rebasing to keep a clean commit history:**
   ```bash
   git rebase <branch_name>
   ```
   - **Usage:** Moves or replays your changes on top of another branch, keeping a linear commit history, which is crucial for maintaining clean logs in ML pipelines.
   - **Reason to Use:** Prevents the history from becoming cluttered with unnecessary merge commits.

7. **Cherry-picking a specific commit:**
   ```bash
   git cherry-pick <commit_hash>
   ```
   - **Usage:** Applies the changes from a specific commit to your current branch. This is useful for taking specific updates (like model improvements) without merging the entire branch.

8. **Stashing changes temporarily:**
   ```bash
   git stash
   ```
   - **Usage:** Stashes uncommitted changes, clearing your working directory. This is helpful when you're in the middle of work and need to switch branches temporarily without committing partial work.

9. **Viewing Git log with graph for easier visualization:**
   ```bash
   git log --oneline --graph --decorate --all
   ```
   - **Usage:** Provides a graphical view of the commit history, branches, and tags, allowing you to track the progress of different branches.

10. **Resetting to a previous commit (soft reset):**
    ```bash
    git reset --soft <commit_hash>
    ```
    - **Usage:** Resets the state of your current branch to a previous commit without changing the working directory or staging area. Ideal for rolling back changes during an experiment.

#### Working with Remotes:
1. **Adding a new remote repository:**
   ```bash
   git remote add <remote_name> <repository_url>
   ```
   - **Usage:** Adds a new remote repository. This is useful if you want to push to a remote other than the default, such as when collaborating with other data scientists or engineers.

2. **Viewing all remotes:**
   ```bash
   git remote -v
   ```
   - **Usage:** Shows all remote repositories and their URLs.

#### Git Bash Commands for Professional Use:
1. **Navigating through branches more easily:**
   ```bash
   git branch -vv
   ```
   - **Usage:** Displays all branches with their tracking information and commit details.

2. **Using alias for frequent commands:**
   ```bash
   git config --global alias.co checkout
   git config --global alias.br branch
   git config --global alias.ci commit
   git config --global alias.st status
   ```
   - **Usage:** Sets aliases for commonly used Git commands, speeding up your workflow.

3. **Squashing commits into one before pushing:**
   ```bash
   git rebase -i HEAD~n
   ```
   - **Usage:** Combines the last `n` commits into one, which is important for maintaining a clean history when working on features or models.

4. **Cleaning up branches that are no longer active:**
   ```bash
   git branch -d <branch_name>
   ```
   - **Usage:** Deletes a local branch that has been merged or is no longer required.

5. **Working with tags (important for versioning models):**
   ```bash
   git tag -a v1.0 -m "First model version"
   git push origin v1.0
   ```
   - **Usage:** Creates a tag and pushes it to the remote repository, useful for marking important checkpoints in ML projects (e.g., model releases).

### Why Use Fetch and Merge over Pull?
- **Fetch + Merge:** These two-step commands allow you to first fetch the changes and inspect them before merging. This is particularly useful in machine learning or data science projects where incoming changes might conflict with ongoing model development or data processing workflows.
  - **Benefits:** 
    - **Conflict Control:** Easier to manage merge conflicts, as you can review and decide what changes to integrate.
    - **Clean History:** Keeps the commit history organized, avoiding auto-merge commits that might clutter the log.
  
- **Pull:** Combines fetching and merging in a single command, but can lead to unintended conflicts and messy histories if you aren’t careful.

This document should help you use Git more professionally, giving you control over your machine learning project workflows!