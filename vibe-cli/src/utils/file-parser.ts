export function parseMarkdownResponse(response: string, userInput: string): {
  projectName: string;
  folders: string[];
  files: Array<{path: string, content: string, executable?: boolean}>;
  shellCommands: string[];
} {
  const result = {
    projectName: '',
    folders: [] as string[],
    files: [] as Array<{path: string, content: string, executable?: boolean}>,
    shellCommands: [] as string[]
  };

  // Extract project name - ONLY from explicit "called X" or "named X" patterns
  const RESERVED_WORDS = new Set([
    'a', 'an', 'the', 'my', 'new', 'simple', 'basic', 'advanced', 'complex',
    'web', 'app', 'api', 'node', 'react', 'vue', 'angular', 'python', 'html',
    'css', 'javascript', 'typescript', 'project', 'application', 'game',
    'website', 'frontend', 'backend', 'full', 'stack', 'fullstack'
  ]);

  // Only match explicit naming: "called X" or "named X" or quoted names
  const explicitNameMatch = userInput.match(/(?:called|named)\s+["']?([a-zA-Z][a-zA-Z0-9_-]{2,})["']?/i);
  const quotedNameMatch = userInput.match(/["']([a-zA-Z][a-zA-Z0-9_-]{2,})["']/);
  
  if (explicitNameMatch && !RESERVED_WORDS.has(explicitNameMatch[1].toLowerCase())) {
    result.projectName = explicitNameMatch[1];
  } else if (quotedNameMatch && !RESERVED_WORDS.has(quotedNameMatch[1].toLowerCase())) {
    result.projectName = quotedNameMatch[1];
  } else {
    // Fallback: extract from AI response
    const nameMatch = response.match(/(?:project|app|game)\s+(?:name|called)\s*[:\-]?\s*["']?([a-zA-Z][a-zA-Z0-9_-]{2,})["']?/i);
    if (nameMatch && !RESERVED_WORDS.has(nameMatch[1].toLowerCase())) {
      result.projectName = nameMatch[1];
    } else {
      result.projectName = 'generated-project';
    }
  }

  // Parse code blocks with filenames
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(response)) !== null) {
    const lang = match[1] || 'txt';
    const content = match[2].trim();

    if (!content) continue;

    // Skip shell/bash blocks for now (handle separately)
    if (['bash', 'shell', 'sh', 'cmd', 'powershell'].includes(lang.toLowerCase())) {
      // Extract shell commands
      const commands = content.split('\n').map(cmd => cmd.trim()).filter(cmd => cmd && !cmd.startsWith('#'));
      result.shellCommands.push(...commands);
      continue;
    }

    // Extract filename from comment above the code block
    const beforeBlock = response.substring(0, match.index);
    const lines = beforeBlock.split('\n').slice(-5); // Look at last 5 lines
    const context = lines.join(' ');

    let filename = '';

    // Look for filename patterns
    const filenamePatterns = [
      /filename:\s*["']?([^"'\s]+)["']?/i,
      /(?:file|path):\s*["']?([^"'\s]+)["']?/i,
      /([a-zA-Z0-9_\-./]+\.(?:html|css|js|py|ts|jsx|tsx|json|md|txt))/i
    ];

    for (const pattern of filenamePatterns) {
      const match = context.match(pattern);
      if (match) {
        filename = match[1];
        break;
      }
    }

    // Infer filename from language if not found
    if (!filename) {
      const langMap: Record<string, string> = {
        'html': 'index.html',
        'css': 'style.css',
        'javascript': 'script.js',
        'js': 'script.js',
        'json': 'package.json',
        'markdown': 'README.md',
        'md': 'README.md',
        'python': 'main.py',
        'py': 'main.py',
        'typescript': 'main.ts',
        'ts': 'main.ts'
      };

      filename = langMap[lang.toLowerCase()] || `file.${lang}`;
    }

    // Clean up filename
    filename = filename.replace(/^[\/\\]+/, ''); // Remove leading slashes

    // Extract folders from filename (only if it's a valid path)
    const pathParts = filename.split('/');
    if (pathParts.length > 1 && filename.includes('.')) {
      const folderPath = pathParts.slice(0, -1).join('/');
      // Only add if it looks like a valid folder path (not random words)
      if (folderPath.length > 0 && !folderPath.match(/\s/) && !result.folders.includes(folderPath)) {
        result.folders.push(folderPath);
      }
    }

    // Check if executable
    const executable = /\.(py|sh|js|ts|exe|bin)$/i.test(filename) && content.includes('#!/');

    result.files.push({
      path: filename,
      content: content,
      executable: executable
    });
  }

  // Extract shell commands from other patterns
  const shellPatterns = [
    /```\s*bash\s*\n([\s\S]*?)```/gi,
    /```\s*shell\s*\n([\s\S]*?)```/gi,
    /```\s*sh\s*\n([\s\S]*?)```/gi,
    /run:\s*([^\n]+)/gi,
    /command:\s*([^\n]+)/gi,
    /\$ ([^\n]+)/gi
  ];

  for (const pattern of shellPatterns) {
    let match;
    while ((match = pattern.exec(response)) !== null) {
      const commands = match[1].split('\n').map(cmd => cmd.trim()).filter(cmd => cmd && !cmd.startsWith('#'));
      result.shellCommands.push(...commands);
    }
  }

  // Remove duplicates
  result.folders = [...new Set(result.folders)];
  result.shellCommands = [...new Set(result.shellCommands)];
  result.files = result.files.filter((file, index, self) =>
    index === self.findIndex(f => f.path === file.path)
  );

  return result;
}

// REMOVED: Old markdown parsing - replaced with AI-ONLY structured generation
