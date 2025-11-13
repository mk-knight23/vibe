#!/usr/bin/env node
const inquirerModule = require('inquirer');
const inquirer = inquirerModule.default || inquirerModule;
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');
const oraModule = require('ora');
const ora = oraModule.default || oraModule;
const { exec } = require('child_process');
const { webSearch } = require('./tools.cjs');
const fg = require('fast-glob');

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const TRANSCRIPTS_DIR = path.join(process.cwd(), 'transcripts');

// Defaults requested by user
const DEFAULT_MODEL_ID = 'z-ai/glm-4.5-air:free';
const DEFAULT_SYSTEM_PROMPT = 'You are an assistant software engineer with broad knowledge. Provide clear, accurate, and practical guidance.';

async function getApiKey() {
  const envKey = process.env.OPENROUTER_API_KEY;
  if (envKey) return String(envKey).trim();
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your OpenRouter API key:',
      mask: '*',
      validate: (v) => (v && v.trim().length > 0) || 'API key is required',
    },
  ]);
  return (apiKey || '').trim();
}

function isFreeModel(model) {
  try {
    if (model?.is_free) return true;
    const pricing = model?.pricing || model?.top_provider?.pricing;
    if (!pricing) return false;
    const nums = [];
    const pushNum = (val) => {
      if (val === undefined || val === null) return;
      if (typeof val === 'string') {
        const n = Number(val.replace(/[^0-9.]/g, ''));
        if (!isNaN(n)) nums.push(n);
      } else if (typeof val === 'number') {
        nums.push(val);
      }
    };
    pushNum(pricing.prompt);
    pushNum(pricing.completion);
    pushNum(pricing.input);
    pushNum(pricing.output);
    return nums.length > 0 && nums.every((n) => n === 0);
  } catch (_) {
    return false;
  }
}

async function fetchModels(apiKey) {
  const res = await axios.get(`${OPENROUTER_BASE}/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    timeout: 30000,
  });
  const models = res.data?.data || res.data || [];
  const freeModels = models.filter(isFreeModel);
  if (!freeModels.length) {
    throw new Error('No free models available from OpenRouter at this time.');
  }
  return freeModels;
}

async function selectModel(models) {
  if (!models || models.length === 0) throw new Error('No models available.');
  const choices = models.map((m) => ({
    name: `${m.name || m.id} ${isFreeModel(m) ? '(free)' : ''}`.trim(),
    value: m.id || m.slug || m.name,
  }));
  const { modelId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'modelId',
      pageSize: 15,
      message: 'Select a model to chat with:',
      choices,
    },
  ]);
  return modelId;
}

function setupToolAccess() {
  return {
    async search(query) {
      return await webSearch(query);
    },
  };
}

function ensureDir(dir) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function saveTranscript(filename, messages) {
  ensureDir(TRANSCRIPTS_DIR);
  const safe = filename || `chat_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  const file = path.join(TRANSCRIPTS_DIR, safe);
  const lines = messages.map((m) => `[${m.role}] ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`);
  fs.writeFileSync(file, lines.join('\n\n'), 'utf8');
  return file;
}

function printHelp() {
  console.log(pc.cyan('\nCommands (Claude Code-like):'));
  console.log('  ' + pc.yellow('/help') + '                 Show this help');
  console.log('  ' + pc.yellow('/models') + '               List and select from free models');
  console.log('  ' + pc.yellow('/model') + '                Change the current model (opens picker)');
  console.log('  ' + pc.yellow('/system') + '               Edit system prompt');
  console.log('  ' + pc.yellow('/clear') + '                Clear chat context');
  console.log('  ' + pc.yellow('/save [name]') + '         Save transcript to transcripts/');
  console.log('  ' + pc.yellow('/search <q>') + '          Web search and inject context');
  console.log('  ' + pc.yellow('/run <cmd>') + '            Execute a shell command and inject output');
  console.log('  ' + pc.yellow('/open <glob>') + '          Read files by glob and inject their contents');
  console.log('  ' + pc.yellow('/files') + '                Show project files');
  console.log('  ' + pc.yellow('/multiline') + '           Toggle multiline editor mode');
  console.log('  ' + pc.yellow('/exit') + '                 Quit');
}

async function startChat(apiKey, initialModel) {
  let model = initialModel || DEFAULT_MODEL_ID;
  console.log(pc.green(`\nStarting chat with model: ${model}`));
  console.log('Type ' + pc.yellow('"/help"') + ' for available commands.');

  const tools = setupToolAccess();
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
  ];
  let systemIndex = 0;
  // Optional system prompt (defaults to user-specified default)
  let sysPrompt = '';
  try {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'sysPrompt',
        message: 'Optional: Provide a system prompt (or leave blank):',
        default: DEFAULT_SYSTEM_PROMPT,
      },
    ]);
    sysPrompt = ans.sysPrompt;
  } catch {}
  if ((sysPrompt && sysPrompt.trim()) || DEFAULT_SYSTEM_PROMPT) {
    const val = (sysPrompt && sysPrompt.trim()) || DEFAULT_SYSTEM_PROMPT;
    messages.push({ role: 'system', content: val });
    systemIndex = messages.length - 1;
  }

  let multiline = false;

  const ask = async () => {
    if (!multiline) {
      const { userInput } = await inquirer.prompt([
        { type: 'input', name: 'userInput', message: pc.cyan('You:') },
      ]);
      return userInput;
    } else {
      const { lines } = await inquirer.prompt([
        { type: 'editor', name: 'lines', message: 'Multiline input (save & close):' },
      ]);
      return lines;
    }
  };

  while (true) {
    const raw = await ask();
    const trimmed = (raw || '').trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();

    if (lower === '/help') {
      printHelp();
      continue;
    }

    if (lower === '/exit') {
      console.log(pc.gray('Goodbye!'));
      break;
    }

    if (lower === '/tools') {
      console.log(pc.cyan('Available tools:'));
      console.log('- search(query): quick web search (DuckDuckGo Instant Answer)');
      console.log('- run(cmd): execute a shell command and inject output');
      console.log('- open(glob): inject contents of matching files');
      continue;
    }

    if (lower === '/clear') {
      messages.length = 0;
      messages.push({ role: 'system', content: 'You are a helpful assistant.' });
      systemIndex = 0;
      console.log(pc.gray('Context cleared.'));
      continue;
    }

    if (lower.startsWith('/save')) {
      const name = trimmed.split(' ').slice(1).join(' ').trim();
      const file = saveTranscript(name || undefined, messages);
      console.log(pc.green(`Saved transcript to ${file}`));
      continue;
    }

    if (lower === '/system') {
      const { newSystem } = await inquirer.prompt([
        { type: 'editor', name: 'newSystem', message: 'Edit system prompt:' },
      ]);
      const val = (newSystem || '').trim();
      if (val) {
        if (typeof systemIndex === 'number' && messages[systemIndex]?.role === 'system') {
          messages[systemIndex].content = val;
        } else {
          messages.unshift({ role: 'system', content: val });
          systemIndex = 0;
        }
        console.log(pc.green('System prompt updated.'));
      }
      continue;
    }

    if (lower === '/multiline') {
      multiline = !multiline;
      console.log(pc.gray(`Multiline mode: ${multiline ? 'ON' : 'OFF'}`));
      continue;
    }

    if (lower === '/models' || lower === '/model') {
      try {
        const listSpinner = ora('Fetching free models...').start();
        const models = await fetchModels(apiKey);
        listSpinner.succeed('Free models loaded');
        const selectedModel = await selectModel(models);
        model = selectedModel;
        console.log(pc.green(`Switched to model: ${model}`));
      } catch (e) {
        console.error('Failed to switch model:', e?.message || e);
      }
      continue;
    }

    if (lower.startsWith('/search ')) {
      const query = trimmed.slice(8).trim();
      if (!query) {
        console.log('Please provide a search query after /search');
        continue;
      }
      console.log(pc.gray(`Searching the web for: ${query}`));
      try {
        const result = await tools.search(query);
        const injected = `Web search results for "${query}":\n${result}`;
        messages.push({ role: 'system', content: injected });
        console.log(pc.gray('(Search results injected into context)'));
      } catch (e) {
        console.error('Search failed:', e?.message || e);
      }
      continue;
    }

    // Execute commands like Claude Code CLI
    if (lower.startsWith('/run ')) {
      const cmd = trimmed.slice(5);
      console.log(pc.gray(`Executing: ${cmd}`));
      const out = await new Promise((resolve) => {
        exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
          if (err) resolve(`Command error: ${err.message}\n${stderr}`);
          else resolve(stdout || stderr || '(no output)');
        });
      });
      const injected = `Shell command output for "${cmd}":\n${out}`;
      messages.push({ role: 'system', content: injected });
      console.log(pc.gray('(Command output injected into context)'));
      continue;
    }

    if (lower.startsWith('/open ')) {
      const pattern = trimmed.slice(6).trim() || '**/*';
      const spinner = ora(`Reading files matching ${pattern}...`).start();
      const files = await fg(pattern, { onlyFiles: true, dot: false });
      spinner.stop();
      if (!files.length) {
        console.log(pc.gray('No files matched.'));
        continue;
      }
      const maxBytes = 150_000; // prevent huge injections
      let injectedText = '';
      for (const f of files.slice(0, 20)) { // cap number of files
        try {
          const text = fs.readFileSync(f, 'utf8');
          if (injectedText.length + text.length > maxBytes) break;
          injectedText += `\n\n===== File: ${f} =====\n${text}`;
        } catch (_) {}
      }
      if (!injectedText) {
        console.log(pc.gray('Files too large to inject or empty.'));
        continue;
      }
      messages.push({ role: 'system', content: `Injected file contents:${injectedText}` });
      console.log(pc.gray('(File contents injected into context)'));
      continue;
    }

    if (lower === '/files') {
      const files = await fg('**/*', { onlyFiles: true, dot: false });
      console.log(files.join('\n'));
      continue;
    }

    // Regular user message
    messages.push({ role: 'user', content: trimmed });

    // Spinner for model call
    const spinner = ora('Thinking...').start();
    try {
      const completion = await axios.post(
        `${OPENROUTER_BASE}/chat/completions`,
        { model, messages },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost',
            'X-Title': 'vibe-cli',
          },
          timeout: 60000,
        }
      );
      spinner.stop();

      const content = completion.data?.choices?.[0]?.message?.content || '';
      if (!content) {
        console.log(pc.gray('(No content returned)'));
      } else {
        console.log('\n' + pc.bold('Assistant:') + ' ' + content + '\n');
        messages.push({ role: 'assistant', content });
      }
    } catch (err) {
      spinner.stop();
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error('Error calling OpenRouter:', status || '', data || err.message || err);
      if (status === 401) {
        console.error('Authentication failed. Check your API key.');
      }
    }
  }
}

async function main() {
  try {
    const apiKey = await getApiKey();
    let selectedModel = DEFAULT_MODEL_ID;
    try {
      const models = await fetchModels(apiKey);
      selectedModel = (models.find(m => (m.id||m.slug||m.name) === DEFAULT_MODEL_ID)?.id) || (await selectModel(models));
    } catch (e) {
      // If fetching free models fails, continue with default model
      selectedModel = DEFAULT_MODEL_ID;
    }
    await startChat(apiKey, selectedModel);
  } catch (e) {
    console.error('Fatal:', e?.message || e);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { getApiKey, fetchModels, selectModel, startChat, setupToolAccess };
