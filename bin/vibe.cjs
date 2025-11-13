#!/usr/bin/env node
/* Vibe Code CLI v2 command router */
const { chatCompletion, getModelDefaults, loadConfig, saveConfig, encodeImageToDataUrl, TOP_FREE_MODELS } = require('../lib/openrouter.cjs');
const { plan, fix, saveSession, loadLatestSession, startWatcher } = require('../lib/agent.cjs');
const path = require('path');
const fs = require('fs');
const pc = require('picocolors');
const simpleGit = require('simple-git');

function printUsage() {
  console.log(`Vibe Code CLI v2\nCommands:\n  vibe plan "task"\n  vibe fix\n  vibe run [--yolo]\n  vibe model list | use <id>\n  vibe theme set <dark|light>\n  vibe cost\n  vibe resume\n  vibe view <image>\n  vibe test\n  vibe commit\n  vibe agent start [--watch <paths>]\n  vibe plugin install <name>\n  vibe chat  (fallback to legacy chat)`);
}

async function main(argv) {
  const cmd = argv[2];
  const args = argv.slice(3);
  const cfg = loadConfig();
  if (!cfg.openrouter) cfg.openrouter = { defaultModel: 'z-ai/glm-4.5-air:free', topFreeModels: TOP_FREE_MODELS };
  if (!cfg.core) cfg.core = { theme: 'dark', autonomous: false, rateLimitBackoff: 5000 };

  switch (cmd) {
    case 'plan': {
      const task = args.join(' ').trim().replace(/^"|"$/g, '') || 'setup task';
      const out = await plan(task);
      console.log(out);
      saveSession('latest', { type: 'plan', task, out });
      break;
    }
    case 'fix': {
      const out = await fix('Analyze repo and propose diffs for failing tests.');
      console.log(out);
      saveSession('latest', { type: 'fix', out });
      break;
    }
    case 'run': {
      const yolo = args.includes('--yolo');
      console.log(pc.gray(`Autonomous run${yolo ? ' (yolo)' : ''} - TODO implement write→test→commit loop`));
      break;
    }
    case 'model': {
      const sub = args[0];
      if (sub === 'list') {
        const { topFreeModels, defaultModel } = getModelDefaults();
        console.log('Default:', defaultModel);
        topFreeModels.forEach((m,i)=>console.log(`${i+1}. ${m}`));
      } else if (sub === 'use') {
        const id = args[1];
        if (!id) return console.log('Usage: vibe model use <modelId>');
        cfg.openrouter.defaultModel = id;
        saveConfig(cfg);
        console.log(pc.green(`Default model set to ${id}`));
      } else {
        console.log('Usage: vibe model list | use <id>');
      }
      break;
    }
    case 'theme': {
      if (args[0] === 'set' && (args[1] === 'dark' || args[1] === 'light')) {
        cfg.core.theme = args[1];
        saveConfig(cfg);
        console.log(pc.green(`Theme set to ${args[1]}`));
      } else {
        console.log('Usage: vibe theme set <dark|light>');
      }
      break;
    }
    case 'cost': {
      const sess = loadLatestSession();
      console.log('Cost (free tier): model rotations tracked in sessions. Latest:', sess ? (sess.model || 'n/a') : 'n/a');
      break;
    }
    case 'resume': {
      const sess = loadLatestSession();
      if (!sess) return console.log('No session to resume');
      console.log('Resuming session:', sess.type);
      break;
    }
    case 'view': {
      const img = args[0];
      if (!img) return console.log('Usage: vibe view <image>');
      const url = encodeImageToDataUrl(img);
      const { defaultModel } = getModelDefaults();
      const messages = [
        { role: 'user', content: [ { type: 'text', text: 'Analyze this UI and suggest fixes.' }, { type: 'image_url', image_url: { url } } ] }
      ];
      chatCompletion({ model: 'google/gemini-2.0-flash-exp:free', messages }).then(r=>{
        console.log(r.message?.content || '');
      }).catch(e=>console.error(e.message));
      break;
    }
    case 'test': {
      console.log('TODO: detect Jest/Vitest/PyTest and run tests, then propose fixes');
      break;
    }
    case 'commit': {
      const git = simpleGit();
      git.status().then(async (st) => {
        if (st.staged.length === 0 && st.modified.length === 0) {
          console.log('Nothing to commit');
          return;
        }
        const msg = 'chore: update via Vibe CLI';
        await git.add('.');
        await git.commit(msg);
        console.log(pc.green('Committed: ' + msg));
      }).catch(e => console.error('Git error:', e.message));
      break;
    }
    case 'agent': {
      if (args[0] === 'start') {
        const watchIdx = args.indexOf('--watch');
        const paths = watchIdx >= 0 ? args[watchIdx+1].split(',') : (loadConfig()?.agents?.watch || ['src/','tests/']);
        console.log('Agent watching:', paths.join(', '));
        startWatcher(paths, (ev, p) => {
          console.log(pc.gray(`Changed [${ev}]: ${p} -> TODO lint/test/auto-fix`));
        });
      } else {
        console.log('Usage: vibe agent start [--watch <paths>]');
      }
      break;
    }
    case 'plugin': {
      if (args[0] === 'install') {
        const name = args[1];
        if (!name) return console.log('Usage: vibe plugin install <name>');
        const dir = path.join(process.cwd(), 'plugins');
        try { fs.mkdirSync(dir, { recursive: true }); } catch {}
        const file = path.join(dir, `${name}.js`);
        if (!fs.existsSync(file)) fs.writeFileSync(file, `module.exports = async function ${name}(input){\n  // TODO: implement plugin\n  return input;\n};\n`, 'utf8');
        console.log(pc.green(`Installed plugin: ${file}`));
      } else {
        console.log('Usage: vibe plugin install <name>');
      }
      break;
    }
    case 'chat': {
      // Fallback to legacy cli
      require('../cli.cjs');
      break;
    }
    default:
      printUsage();
      break;
  }
}

main(process.argv).catch(e=>{ console.error(e); process.exit(1); });
