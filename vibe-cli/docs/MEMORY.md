# VIBE CLI Persistent Memory System

## Overview
3-layer persistent memory system that enables VIBE to remember previous tasks, files, operations, errors, and ongoing project context across sessions.

---

## Architecture

### Layer 1: Workspace Memory
Tracks current project state in real-time.

**Stores**:
- List of files (up to 100)
- Directory structure
- File summaries (first 200 chars)
- Last updated file
- Recent changes (last 20)

**Updates on**:
- File write
- File read
- Directory scan
- Project analysis

### Layer 2: Task Memory
Tracks individual tasks and their outcomes.

**Stores per task**:
- Task description
- Files created
- Files modified
- Errors encountered
- Suggestions made
- Timestamp

**Keeps**: Last 10 tasks

### Layer 3: Conversation State
Long-term memory of project decisions and context.

**Stores**:
- Key points (important facts)
- Decisions made
- Current architecture
- Project type (React, Node.js, etc.)
- Pending tasks

---

## Storage

### Location
`.vibe/memory.json` in project root

### Format
```json
{
  "keyPoints": ["Using TypeScript", "TailwindCSS for styling"],
  "decisions": ["Chose React Router for routing"],
  "currentArchitecture": {},
  "projectType": "React",
  "pendingTasks": ["Add authentication", "Deploy to Vercel"],
  "workspaceMemory": {
    "files": ["src/App.tsx", "src/index.tsx"],
    "structure": "src/\n  App.tsx\n  index.tsx",
    "fileSummaries": {
      "src/App.tsx": "import React from 'react'..."
    },
    "lastUpdated": "src/App.tsx",
    "recentChanges": [
      "Created/Updated: src/App.tsx",
      "Shell: npm install"
    ]
  },
  "taskHistory": [
    {
      "description": "Create React app",
      "filesCreated": ["src/App.tsx"],
      "filesModified": [],
      "errors": [],
      "suggestions": [],
      "timestamp": 1733337000000
    }
  ]
}
```

---

## Integration

### Automatic Memory Injection
Before every AI request, memory context is injected:

```typescript
messages.splice(1, 0, {
  role: 'system',
  content: `# Persistent Memory
${memory.getMemoryContext()}

Use this memory to maintain context. Never ask for information already known.`
});
```

### Memory Context Format
```
# Project Context
Type: React
Files: 15 tracked
Last updated: src/App.tsx

# Recent Changes (last 5)
- Created/Updated: src/App.tsx
- Created/Updated: src/index.tsx
- Shell: npm install
- Created/Updated: package.json
- Created/Updated: README.md

# Key Points
- Using TypeScript for type safety
- TailwindCSS for styling
- React Router for navigation

# Decisions Made
- Chose functional components over class components
- Using hooks for state management

# Pending Tasks
- Add authentication
- Deploy to Vercel

# Recent Tasks
- Create React app with routing
  Created: src/App.tsx, src/index.tsx, package.json
  Errors: 0
```

---

## API

### MemoryManager Class

#### Constructor
```typescript
const memory = new MemoryManager(workspaceDir?: string)
```

#### Methods

**updateWorkspaceMemory()**
Scans project and updates workspace memory.
```typescript
memory.updateWorkspaceMemory();
```

**onFileWrite(filePath, content)**
Called when file is created/updated.
```typescript
memory.onFileWrite('src/App.tsx', content);
```

**onFileRead(filePath, content)**
Called when file is read.
```typescript
memory.onFileRead('src/App.tsx', content);
```

**onShellCommand(command, result)**
Called when shell command executes.
```typescript
memory.onShellCommand('npm install', 'success');
```

**onError(error)**
Called when error occurs.
```typescript
memory.onError('Failed to create file');
```

**startTask(description)**
Starts tracking a new task.
```typescript
memory.startTask('Create React app');
```

**addKeyPoint(point)**
Adds important fact to memory.
```typescript
memory.addKeyPoint('Using TypeScript');
```

**addDecision(decision)**
Records a decision made.
```typescript
memory.addDecision('Chose React Router');
```

**addPendingTask(task)**
Adds task to pending list.
```typescript
memory.addPendingTask('Add authentication');
```

**removePendingTask(task)**
Removes completed task.
```typescript
memory.removePendingTask('Add authentication');
```

**getMemoryContext()**
Returns formatted memory context.
```typescript
const context = memory.getMemoryContext();
```

**summarizeOldMessages(messages)**
Summarizes old messages when conversation gets long.
```typescript
const summarized = memory.summarizeOldMessages(messages);
```

**clear()**
Clears all memory.
```typescript
memory.clear();
```

**getState()**
Returns current memory state.
```typescript
const state = memory.getState();
```

---

## Automatic Updates

### File Operations
```typescript
// write_file tool
memory.onFileWrite(filePath, content);
// Updates: lastUpdated, recentChanges, fileSummaries

// read_file tool
memory.onFileRead(filePath, content);
// Updates: fileSummaries (if not exists)

// Any file operation
memory.updateWorkspaceMemory();
// Rescans project structure
```

### Shell Commands
```typescript
// run_shell_command tool
memory.onShellCommand(command, result);
// Updates: recentChanges
```

### Errors
```typescript
// Any error
memory.onError(errorMessage);
// Updates: current task's error list
```

### Tasks
```typescript
// New user input
memory.startTask(userInput);
// Creates new task entry
```

---

## Message Summarization

When conversation exceeds 15 messages:

**Before**:
```
[system, user1, assistant1, user2, assistant2, ..., user10, assistant10]
```

**After**:
```
[system, summary, user8, assistant8, user9, assistant9, user10, assistant10]
```

**Summary Format**:
```
# Previous Conversation Summary
8 messages summarized:
- User made 4 requests
- AI provided 4 responses
- 2 tool executions

Continue from recent context below.
```

---

## Benefits

### 1. Context Continuity
AI remembers previous work and continues logically.

**Without Memory**:
```
User: Add routing
AI: What framework are you using?
```

**With Memory**:
```
User: Add routing
AI: Adding React Router to your React app...
```

### 2. No Redundant Questions
AI uses stored information instead of asking again.

**Without Memory**:
```
User: Add a new component
AI: What's your project structure?
```

**With Memory**:
```
User: Add a new component
AI: Creating component in src/components/...
```

### 3. Error Recovery
AI learns from previous errors.

**Memory Stores**:
```
errors: ["Permission denied creating /etc/config"]
```

**AI Adapts**:
```
AI: Creating config in ./config instead of /etc/config
```

### 4. Task Completion
AI tracks and completes pending tasks.

**Memory Shows**:
```
pendingTasks: ["Add authentication", "Deploy"]
```

**AI Suggests**:
```
AI: Ready to work on authentication next?
```

---

## Usage Examples

### Example 1: Multi-Session Project

**Session 1**:
```
User: Create a React app
AI: [creates files]
Memory: projectType=React, files=[App.tsx, index.tsx]
```

**Session 2** (next day):
```
User: Add routing
AI: Adding React Router to your React app...
[Uses memory to know it's React, no questions asked]
```

### Example 2: Error Learning

**First Attempt**:
```
User: Create config file
AI: [tries /etc/config]
Error: Permission denied
Memory: stores error
```

**Second Attempt**:
```
User: Create another config
AI: Creating in ./config (learned from previous error)
```

### Example 3: Task Tracking

**User**:
```
Create app with auth and deployment
```

**AI**:
```
[Creates app]
Memory: pendingTasks=["Add auth", "Deploy"]
```

**Later**:
```
User: What's next?
AI: You have pending tasks: Add auth, Deploy
```

---

## Configuration

### Disable Memory
Delete `.vibe/memory.json`

### Clear Memory
```bash
/clear
```
Or:
```typescript
memory.clear();
```

### Memory Limits
- **Task History**: 10 tasks
- **Recent Changes**: 20 changes
- **File List**: 100 files
- **File Summary**: 200 chars
- **Message Threshold**: 15 messages

---

## Performance

### Memory Overhead
- **Storage**: ~10-50KB per project
- **Load Time**: <10ms
- **Save Time**: <5ms
- **Context Injection**: <1ms

### Optimization
- Summaries instead of full content
- Limited history (10 tasks)
- Lazy loading
- Efficient JSON storage

---

## Best Practices

### For Users
1. Let AI use memory naturally
2. Don't repeat information
3. Trust context continuity
4. Clear memory when switching projects

### For Developers
1. Update memory on every tool call
2. Store summaries, not full content
3. Limit history size
4. Handle load/save errors gracefully

---

## Troubleshooting

### Memory Not Persisting
- Check `.vibe/` folder exists
- Verify write permissions
- Check disk space

### Memory Too Large
- Clear old tasks: `memory.clear()`
- Reduce file summaries
- Limit recent changes

### Context Not Used
- Verify memory injection
- Check message format
- Ensure system prompt includes memory instructions

---

## Future Enhancements

### Phase 2
- Vector embeddings for semantic search
- Cross-project memory
- Team shared memory
- Cloud sync

### Phase 3
- AI-powered summarization
- Automatic key point extraction
- Smart task prioritization
- Memory analytics

---

**Version**: 7.0.5  
**Status**: Production Ready  
**Built with ❤️ by KAZI**
