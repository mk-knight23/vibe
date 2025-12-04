# VIBE CLI Tools Reference

## Overview
28 tools across 8 categories for complete development workflow.

---

## 📁 File Operations (12 tools)

### list_directory
List files and directories in a path.
- **Params**: `path`, optional: `ignore`, `respect_git_ignore`
- **Confirmation**: No
- **Example**: `list_directory({ path: 'src' })`

### read_file
Read file contents (text, images, PDFs).
- **Params**: `path`, optional: `offset`, `limit`
- **Confirmation**: No
- **Example**: `read_file({ path: 'package.json' })`

### write_file
Create or overwrite a file.
- **Params**: `file_path`, `content`
- **Confirmation**: Yes
- **Example**: `write_file({ file_path: 'src/App.jsx', content: '...' })`

### append_to_file
Append content to existing file.
- **Params**: `file_path`, `content`
- **Confirmation**: Yes
- **Use Case**: Add to logs, append to config
- **Example**: `append_to_file({ file_path: 'debug.log', content: '\n[INFO] New entry' })`

### glob
Find files matching glob patterns.
- **Params**: `pattern`, optional: `path`, `case_sensitive`, `respect_git_ignore`
- **Confirmation**: No
- **Example**: `glob({ pattern: '**/*.ts', path: 'src' })`

### search_file_content
Search for text patterns in files.
- **Params**: `pattern`, optional: `path`, `include`
- **Confirmation**: No
- **Example**: `search_file_content({ pattern: 'authentication', path: 'src' })`

### replace
Replace text in a file.
- **Params**: `file_path`, `old_string`, `new_string`, optional: `expected_replacements`
- **Confirmation**: Yes
- **Example**: `replace({ file_path: 'config.js', old_string: 'dev', new_string: 'prod' })`

### get_file_info
Get detailed file metadata.
- **Params**: `file_path`
- **Confirmation**: No
- **Returns**: path, name, directory, extension, size, permissions, timestamps
- **Example**: `get_file_info({ file_path: 'package.json' })`

### create_directory
Create directory recursively.
- **Params**: `dir_path`, optional: `recursive` (default: true)
- **Confirmation**: Yes
- **Example**: `create_directory({ dir_path: 'src/components/auth' })`

### delete_file
Delete a file.
- **Params**: `file_path`
- **Confirmation**: Yes
- **Safety**: Requires explicit confirmation
- **Example**: `delete_file({ file_path: 'old-file.js' })`

### move_file
Move or rename file.
- **Params**: `source`, `destination`
- **Confirmation**: Yes
- **Example**: `move_file({ source: 'old.js', destination: 'new.js' })`

### copy_file
Copy a file.
- **Params**: `source`, `destination`
- **Confirmation**: Yes
- **Example**: `copy_file({ source: '.env.example', destination: '.env' })`

---

## 🔍 Git Operations (4 tools)

All git tools use `--no-pager` for non-paginated output.

### git_status
Check git status.
- **Params**: None
- **Confirmation**: No
- **Command**: `git --no-pager status --short`
- **Example**: `git_status()`

### git_diff
Show git diff.
- **Params**: optional: `file`
- **Confirmation**: No
- **Command**: `git --no-pager diff HEAD` or `git --no-pager diff <file>`
- **Example**: `git_diff({ file: 'src/auth.ts' })`

### git_log
Show git log.
- **Params**: optional: `count` (default: 5)
- **Confirmation**: No
- **Command**: `git --no-pager log -n <count> --oneline`
- **Example**: `git_log({ count: 10 })`

### git_blame
Show git blame for file.
- **Params**: `file`, optional: `lineStart`, `lineEnd`
- **Confirmation**: No
- **Command**: `git --no-pager blame <file>`
- **Example**: `git_blame({ file: 'src/auth.ts', lineStart: 45, lineEnd: 60 })`

---

## 🔎 Search Operations (3 tools)

### search_file_content
Standard text search in files.
- **Params**: `pattern`, optional: `path`, `include`
- **Confirmation**: No
- **Performance**: Standard
- **Example**: `search_file_content({ pattern: 'TODO', path: 'src' })`

### rg_search
Fast search with ripgrep (10-100x faster).
- **Params**: `pattern`, optional: `path`, `options`
- **Options**: `fileType`, `ignoreCase`, `contextLines`
- **Confirmation**: No
- **Fallback**: Uses grep if rg not available
- **Example**: `rg_search({ pattern: 'auth', path: 'src', options: { fileType: 'ts', contextLines: 2 } })`

### list_files_rg
List all files using rg --files.
- **Params**: optional: `path`
- **Confirmation**: No
- **Fallback**: Uses find if rg not available
- **Example**: `list_files_rg({ path: 'src' })`

---

## 📊 Project Analysis (2 tools)

### check_dependency
Check if package exists in project.
- **Params**: `package_name`
- **Confirmation**: No
- **Returns**: `exists`, `version`, `type` (dependency/devDependency)
- **Use Case**: Verify library availability before using
- **Example**: `check_dependency({ package_name: 'react-router-dom' })`

### get_project_info
Get project metadata.
- **Params**: None
- **Confirmation**: No
- **Returns**: directory, name, hasGit, hasNodeModules, packageManager, framework, language
- **Detects**: React, Next.js, Vue, Express, Python, Rust, Go
- **Detects**: npm, yarn, pnpm
- **Example**: `get_project_info()`

---

## ✅ Verification Operations (3 tools)

### run_tests
Run project tests.
- **Params**: optional: `test_command`
- **Confirmation**: No
- **Auto-detects**: Reads test script from package.json
- **Max Iterations**: 3 (as per system prompt)
- **Example**: `run_tests()` or `run_tests({ test_command: 'npm test' })`

### run_lint
Run linter.
- **Params**: optional: `lint_command`
- **Confirmation**: No
- **Auto-detects**: Reads lint script from package.json
- **Max Iterations**: 3 (as per system prompt)
- **Example**: `run_lint()` or `run_lint({ lint_command: 'eslint .' })`

### run_typecheck
Run TypeScript type checking.
- **Params**: None
- **Confirmation**: No
- **Auto-detects**: Checks for tsconfig.json
- **Command**: `tsc --noEmit`
- **Max Iterations**: 3 (as per system prompt)
- **Example**: `run_typecheck()`

---

## 🔧 Shell Operations (1 tool)

### run_shell_command
Execute shell commands.
- **Params**: `command`, optional: `description`, `directory`
- **Confirmation**: Yes
- **Safety**: Blocks dangerous commands
- **Example**: `run_shell_command({ command: 'npm install', description: 'Install dependencies' })`

---

## 🌐 Web Operations (2 tools)

### web_fetch
Fetch content from URLs.
- **Params**: `url`
- **Confirmation**: No
- **Safety**: Only safe URLs
- **Example**: `web_fetch({ url: 'https://api.example.com/data' })`

### google_web_search
Search the web.
- **Params**: `query`, optional: `num_results`
- **Confirmation**: No
- **Example**: `google_web_search({ query: 'React hooks tutorial', num_results: 5 })`

---

## 💾 Memory & Task Management (2 tools)

### save_memory
Save information to memory.
- **Params**: `key`, `value`
- **Confirmation**: No
- **Example**: `save_memory({ key: 'project_name', value: 'my-app' })`

### write_todos
Manage task list.
- **Params**: `todos` (array)
- **Confirmation**: No
- **Example**: `write_todos({ todos: ['Add auth', 'Deploy', 'Write tests'] })`

---

## 🎯 Quick Reference

### By Confirmation Requirement

**No Confirmation (19 tools)**
- All read operations
- All git operations
- All search operations
- All analysis operations
- All verification operations
- Web operations
- Memory operations

**Requires Confirmation (9 tools)**
- write_file
- append_to_file
- replace
- create_directory
- delete_file
- move_file
- copy_file
- run_shell_command

### By Use Case

**Understanding Codebase**
- get_project_info
- check_dependency
- rg_search
- git_log
- git_blame

**Implementing Changes**
- read_file
- write_file
- append_to_file
- replace
- create_directory

**Verification**
- run_tests
- run_lint
- run_typecheck
- git_status
- git_diff

**Project Management**
- save_memory
- write_todos
- get_file_info
- list_directory

---

## 📈 Performance Tips

1. **Use rg_search** instead of search_file_content for 10-100x speed
2. **Use list_files_rg** for fast file discovery
3. **Combine git commands**: git_status + git_diff + git_log
4. **Check dependencies** before using libraries
5. **Get project info** to understand context
6. **Read before editing** - never blind edits
7. **Use append_to_file** for velocity (small writes)

---

## 🔒 Safety Features

### Dangerous Command Blocking
- `rm -rf /` - Blocked
- `mkfs` - Blocked
- `killall` - Blocked
- `dd if=` - Blocked
- `format` - Blocked
- Fork bombs - Blocked

### Confirmation System
- All destructive operations require confirmation
- Visual warnings for dangerous commands
- Clear error messages with fixes

---

## 🚀 Workflow Examples

### Understand → Implement → Verify

```typescript
// 1. Understand
const info = await get_project_info();
const hasDep = await check_dependency({ package_name: 'react-router-dom' });
await rg_search({ pattern: 'authentication', path: 'src' });

// 2. Implement
await create_directory({ dir_path: 'src/components/auth' });
await write_file({ file_path: 'src/components/Login.tsx', content: '...' });
await append_to_file({ file_path: 'src/index.ts', content: '\nexport * from "./auth";' });

// 3. Verify
await run_tests();
await run_lint();
await run_typecheck();
await git_status();
await git_diff();
```

---

**28 Tools | 8 Categories | Production Ready**
