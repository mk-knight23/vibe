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

async function runAutonomous({ yolo=false }={}) {
  const pc = require('picocolors');
  const simpleGit = require('simple-git');
  const { spawnSync } = require('child_process');
  const git = simpleGit();
  console.log(pc.cyan('Planning changes...'));
  const planText = await plan('Run tests, identify failures, and propose minimal diffs to fix.');
  console.log(planText);
  if (!yolo) {
    const inquirer = require('inquirer');
    const { cont } = await inquirer.prompt([{ type:'confirm', name:'cont', message:'Proceed with attempted fixes?', default:false }]);
    if (!cont) return { status:'aborted' };
  }
  // Attempt to run tests
  console.log(pc.cyan('Running tests...'));
  const hasNpmTest = !!(require('../package.json')?.scripts?.test);
  const testCmd = hasNpmTest ? ['npm',['test']] : ['node',['-e','console.log("No test script; skipping")']];
  const r = spawnSync(testCmd[0], testCmd[1], { stdio: 'inherit' });
  // Commit whatever has changed (if any)
  try {
    await git.add('./*');
    const st = await git.status();
    if (st.staged.length) {
      await git.commit('chore: autonomous run via Vibe CLI');
      console.log(pc.green('Committed autonomous changes.'));
    } else {
      console.log(pc.gray('No changes to commit.'));
    }
  } catch (e) {
    console.log(pc.yellow('Git commit skipped: ' + (e.message||e)));
  }
  return { status:'done', testExitCode: r.status };
}

module.exports = {
  saveSession,
  loadLatestSession,
  plan,
  fix,
  startWatcher,
  runAutonomous,
};