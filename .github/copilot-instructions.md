# Workspace Checklist

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions *(none requested, so nothing to install)*
- [x] Compile the Project
- [x] Create and Run Task *(not required for this stack)*
- [ ] Launch the Project *(pending explicit user confirmation)*
- [x] Ensure Documentation is Complete

## Execution Guidelines

- Use available tools (todo manager, project setup helpers) before falling back to manual steps.
- Update progress immediately after completing any checklist item.
- Review current checklist/todo state before picking up new work.

## Communication Rules

- Keep responses concise and avoid pasting full command output unless necessary.
- Call out skipped steps briefly (e.g., “No extensions needed”).
- Do not describe the project structure unless the user asks.

## Development Rules

- Treat the current directory as the project root unless instructed otherwise.
- Avoid adding media or external links unless explicitly requested.
- Use placeholders only when unavoidable and label them clearly.
- Use the VS Code API tool exclusively for extension projects.
- Do not suggest commands for reopening the workspace; assume it is already open.

## Folder Creation Rules

- Stay within the existing workspace; only add new folders when explicitly required (besides `.vscode` for tasks).
- When running CLI tools, prefer using `.` to target the current working directory.
- If scaffolding commands complain about folder names, ask the user to fix the root path before proceeding.

## Extension Installation Rules

- Install only the extensions explicitly requested via `get_project_setup_info`.

## Project Content Rules

- Default to a “Hello World” starter only when requirements are unspecified.
- Skip non-essential integrations, embeds, or media assets.
- Every generated component must serve a clear purpose within the requested workflow.
- Ask for clarification before adding unconfirmed features.
- For VS Code extension work, consult the VS Code API documentation via the provided tool.

## Task Completion Rules

Consider the task complete when all of the following are true:

- The project scaffolding is finished and compiles without errors.
- `.github/copilot-instructions.md` exists (this file) and reflects the current state.
- `README.md` documents how to run and build the project.
- The user has clear instructions for debugging/launching the project.

- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.
