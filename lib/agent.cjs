// Agentic reasoning loop and utilities
const { chatCompletion, getModelDefaults } = require('./openrouter.cjs');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

function sessionDir() {
  const dir = path.join(process.cwd(), '.vibe', 'sessions');
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
  return dir;
}

function saveSession(name, data) {
  const file = path.join(sessionDir(), `${name || 'latest'}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  return file;
}

function loadLatestSession() {
  const file = path.join(sessionDir(), 'latest.json');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

async function plan(task) {
  const sys = { role: 'system', content: 'You are a senior Node.js CLI engineer and AI agent. Output a numbered action plan and rationale. Be concise.' };
  const user = { role: 'user', content: `Create a step-by-step plan for: ${task}` };
  const { defaultModel } = getModelDefaults();
  const res = await chatCompletion({ model: defaultModel, messages: [sys, user], thinking: true });
  return res.message?.content || '';
}

async function fix(repoSummary) {
  const sys = { role: 'system', content: 'You are a code repair agent. Propose minimal diffs and commands to fix failing tests or errors. Use patch format.' };
  const user = { role: 'user', content: repoSummary || 'Analyze the repository and propose fixes.' };
  const { defaultModel } = getModelDefaults();
  const res = await chatCompletion({ model: defaultModel, messages: [sys, user], thinking: true });
  return res.message?.content || '';
}

function startWatcher(paths = ['src/', 'tests/'], onEvent) {
  const watcher = chokidar.watch(paths, { ignoreInitial: true });
  watcher.on('all', (ev, p) => onEvent?.(ev, p));
  return watcher;
}

module.exports = {
  saveSession,
  loadLatestSession,
  plan,
  fix,
  startWatcher,
};