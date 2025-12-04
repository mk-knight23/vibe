// Cloud Operations
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

export type CloudProvider = 'vercel' | 'aws' | 'supabase' | 'firebase' | 'netlify';

export class CloudOps {
  async deploy(provider: CloudProvider, options: any = {}): Promise<string> {
    const deployers: Record<CloudProvider, () => Promise<string>> = {
      vercel: () => this.deployVercel(options),
      aws: () => this.deployAWS(options),
      supabase: () => this.deploySupabase(options),
      firebase: () => this.deployFirebase(options),
      netlify: () => this.deployNetlify(options)
    };

    return await deployers[provider]();
  }

  private async deployVercel(options: any): Promise<string> {
    if (!await this.hasCommand('vercel')) {
      return 'Vercel CLI not installed. Run: npm i -g vercel';
    }

    const prod = options.production ? '--prod' : '';
    const { stdout } = await execAsync(`vercel ${prod}`, { timeout: 300000 });
    return stdout;
  }

  private async deployAWS(options: any): Promise<string> {
    if (!await this.hasCommand('aws')) {
      return 'AWS CLI not installed. Visit: https://aws.amazon.com/cli/';
    }

    // Deploy to Lambda
    if (options.lambda) {
      const { stdout } = await execAsync(
        `aws lambda update-function-code --function-name ${options.functionName} --zip-file fileb://function.zip`
      );
      return stdout;
    }

    // Deploy to S3
    if (options.s3) {
      const { stdout } = await execAsync(
        `aws s3 sync ./build s3://${options.bucket}`
      );
      return stdout;
    }

    return 'Specify deployment target: --lambda or --s3';
  }

  private async deploySupabase(options: any): Promise<string> {
    if (!await this.hasCommand('supabase')) {
      return 'Supabase CLI not installed. Run: npm i -g supabase';
    }

    const { stdout } = await execAsync('supabase db push');
    return stdout;
  }

  private async deployFirebase(options: any): Promise<string> {
    if (!await this.hasCommand('firebase')) {
      return 'Firebase CLI not installed. Run: npm i -g firebase-tools';
    }

    const { stdout } = await execAsync('firebase deploy');
    return stdout;
  }

  private async deployNetlify(options: any): Promise<string> {
    if (!await this.hasCommand('netlify')) {
      return 'Netlify CLI not installed. Run: npm i -g netlify-cli';
    }

    const prod = options.production ? '--prod' : '';
    const { stdout } = await execAsync(`netlify deploy ${prod}`);
    return stdout;
  }

  async logs(provider: CloudProvider, options: any = {}): Promise<string> {
    const loggers: Record<CloudProvider, () => Promise<string>> = {
      vercel: () => this.logsVercel(options),
      aws: () => this.logsAWS(options),
      supabase: () => this.logsSupabase(options),
      firebase: () => this.logsFirebase(options),
      netlify: () => this.logsNetlify(options)
    };

    return await loggers[provider]();
  }

  private async logsVercel(options: any): Promise<string> {
    const { stdout } = await execAsync('vercel logs');
    return stdout;
  }

  private async logsAWS(options: any): Promise<string> {
    const { stdout } = await execAsync(
      `aws logs tail /aws/lambda/${options.functionName} --follow`
    );
    return stdout;
  }

  private async logsSupabase(options: any): Promise<string> {
    return 'Supabase logs: Check dashboard';
  }

  private async logsFirebase(options: any): Promise<string> {
    const { stdout } = await execAsync('firebase functions:log');
    return stdout;
  }

  private async logsNetlify(options: any): Promise<string> {
    return 'Netlify logs: Check dashboard';
  }

  async env(provider: CloudProvider, action: 'list' | 'add' | 'remove', key?: string, value?: string): Promise<string> {
    if (action === 'add' && key && value) {
      return await this.addEnv(provider, key, value);
    }
    if (action === 'remove' && key) {
      return await this.removeEnv(provider, key);
    }
    return await this.listEnv(provider);
  }

  private async addEnv(provider: CloudProvider, key: string, value: string): Promise<string> {
    const commands: Record<CloudProvider, string> = {
      vercel: `vercel env add ${key}`,
      aws: `aws ssm put-parameter --name ${key} --value ${value} --type SecureString`,
      supabase: `supabase secrets set ${key}=${value}`,
      firebase: `firebase functions:config:set ${key}="${value}"`,
      netlify: `netlify env:set ${key} ${value}`
    };

    const { stdout } = await execAsync(commands[provider]);
    return stdout;
  }

  private async removeEnv(provider: CloudProvider, key: string): Promise<string> {
    const commands: Record<CloudProvider, string> = {
      vercel: `vercel env rm ${key}`,
      aws: `aws ssm delete-parameter --name ${key}`,
      supabase: `supabase secrets unset ${key}`,
      firebase: `firebase functions:config:unset ${key}`,
      netlify: `netlify env:unset ${key}`
    };

    const { stdout } = await execAsync(commands[provider]);
    return stdout;
  }

  private async listEnv(provider: CloudProvider): Promise<string> {
    const commands: Record<CloudProvider, string> = {
      vercel: 'vercel env ls',
      aws: 'aws ssm describe-parameters',
      supabase: 'supabase secrets list',
      firebase: 'firebase functions:config:get',
      netlify: 'netlify env:list'
    };

    const { stdout } = await execAsync(commands[provider]);
    return stdout;
  }

  private async hasCommand(cmd: string): Promise<boolean> {
    try {
      await execAsync(`which ${cmd}`);
      return true;
    } catch {
      return false;
    }
  }
}

// DevOps Operations

export class DevOps {
  // DOCKER OPERATIONS
  async dockerBuild(tag: string, dockerfile: string = 'Dockerfile'): Promise<string> {
    const { stdout } = await execAsync(`docker build -t ${tag} -f ${dockerfile} .`);
    return stdout;
  }

  async dockerRun(image: string, options: any = {}): Promise<string> {
    const port = options.port ? `-p ${options.port}:${options.port}` : '';
    const detach = options.detach ? '-d' : '';
    const name = options.name ? `--name ${options.name}` : '';
    
    const { stdout } = await execAsync(`docker run ${detach} ${port} ${name} ${image}`);
    return stdout;
  }

  async dockerCompose(action: 'up' | 'down' | 'restart' | 'logs'): Promise<string> {
    const { stdout } = await execAsync(`docker-compose ${action}`);
    return stdout;
  }

  async dockerPs(): Promise<string> {
    const { stdout } = await execAsync('docker ps');
    return stdout;
  }

  async dockerLogs(container: string): Promise<string> {
    const { stdout } = await execAsync(`docker logs ${container}`);
    return stdout;
  }

  async generateDockerfile(type: 'node' | 'python' | 'go'): Promise<string> {
    const dockerfiles: Record<string, string> = {
      node: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
      
      python: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]`,
      
      go: `FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN go build -o main .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]`
    };

    await writeFile('Dockerfile', dockerfiles[type], 'utf-8');
    return `Generated Dockerfile for ${type}`;
  }

  // KUBERNETES OPERATIONS
  async k8sApply(file: string): Promise<string> {
    const { stdout } = await execAsync(`kubectl apply -f ${file}`);
    return stdout;
  }

  async k8sGet(resource: string): Promise<string> {
    const { stdout } = await execAsync(`kubectl get ${resource}`);
    return stdout;
  }

  async k8sLogs(pod: string): Promise<string> {
    const { stdout } = await execAsync(`kubectl logs ${pod}`);
    return stdout;
  }

  async k8sScale(deployment: string, replicas: number): Promise<string> {
    const { stdout } = await execAsync(`kubectl scale deployment ${deployment} --replicas=${replicas}`);
    return stdout;
  }

  async generateK8sManifest(name: string, image: string, port: number): Promise<string> {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${name}
  template:
    metadata:
      labels:
        app: ${name}
    spec:
      containers:
      - name: ${name}
        image: ${image}
        ports:
        - containerPort: ${port}
---
apiVersion: v1
kind: Service
metadata:
  name: ${name}
spec:
  selector:
    app: ${name}
  ports:
  - port: 80
    targetPort: ${port}
  type: LoadBalancer`;

    await writeFile(`${name}-k8s.yaml`, manifest, 'utf-8');
    return `Generated ${name}-k8s.yaml`;
  }

  // CI/CD OPERATIONS
  async generateGitHubActions(type: 'node' | 'python' | 'docker'): Promise<string> {
    const workflows: Record<string, string> = {
      node: `name: Node.js CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - run: npm ci
    - run: npm test
    - run: npm run build`,

      python: `name: Python CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - run: pip install -r requirements.txt
    - run: pytest`,

      docker: `name: Docker CI

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: docker/build-push-action@v4
      with:
        push: true
        tags: user/app:latest`
    };

    await writeFile('.github/workflows/ci.yml', workflows[type], 'utf-8');
    return 'Generated .github/workflows/ci.yml';
  }

  // MONITORING
  async monitor(service: string): Promise<any> {
    const { stdout } = await execAsync(`docker stats ${service} --no-stream`);
    return this.parseDockerStats(stdout);
  }

  private parseDockerStats(output: string): any {
    const lines = output.split('\n');
    if (lines.length < 2) return {};
    
    const headers = lines[0].split(/\s+/);
    const values = lines[1].split(/\s+/);
    
    return {
      cpu: values[2],
      memory: values[3],
      network: values[7]
    };
  }

  async healthCheck(url: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`curl -f ${url}/health || echo "DOWN"`);
      return !stdout.includes('DOWN');
    } catch {
      return false;
    }
  }

  // BACKUP
  async backup(source: string, destination: string): Promise<string> {
    const { stdout } = await execAsync(`tar -czf ${destination} ${source}`);
    return `Backed up ${source} to ${destination}`;
  }

  async restore(backup: string, destination: string): Promise<string> {
    const { stdout } = await execAsync(`tar -xzf ${backup} -C ${destination}`);
    return `Restored ${backup} to ${destination}`;
  }
}
// Git Operations Suite
import simpleGit, { SimpleGit } from 'simple-git';
import { ApiClient } from '../core/api';

export class GitOps {
  private git: SimpleGit;
  private client?: ApiClient;
  private model?: string;

  constructor(client?: ApiClient, model?: string) {
    this.git = simpleGit();
    this.client = client;
    this.model = model;
  }

  async smartCommit(message?: string): Promise<string> {
    const status = await this.git.status();
    
    if (status.files.length === 0) {
      return 'No changes to commit';
    }

    // Generate AI commit message if not provided
    if (!message && this.client && this.model) {
      message = await this.generateCommitMessage(status.files);
    }

    await this.git.add('.');
    await this.git.commit(message || 'Update files');
    
    return `Committed: ${message}`;
  }

  private async generateCommitMessage(files: any[]): Promise<string> {
    if (!this.client || !this.model) return 'Update files';

    const fileList = files.map(f => `${f.path} (${f.working_dir})`).join('\n');
    const prompt = `Generate a conventional commit message for these changes:\n${fileList}`;

    try {
      const response = await this.client.chat([
        { role: 'user', content: prompt }
      ], this.model, { maxTokens: 100 });

      return response.choices?.[0]?.message?.content?.trim() || 'Update files';
    } catch {
      return 'Update files';
    }
  }

  async createPR(title?: string, description?: string): Promise<string> {
    const branch = await this.git.revparse(['--abbrev-ref', 'HEAD']);
    
    if (!title && this.client && this.model) {
      const commits = await this.git.log({ maxCount: 10 });
      const commitArray = Array.from(commits.all);
      title = await this.generatePRTitle(commitArray);
      description = await this.generatePRDescription(commitArray);
    }

    return `PR: ${title}\n\n${description}\n\nBranch: ${branch}`;
  }

  private async generatePRTitle(commits: any[]): Promise<string> {
    if (!this.client || !this.model) return 'Update';

    const commitMsgs = Array.from(commits).map((c: any) => c.message).join('\n');
    const prompt = `Generate a PR title for these commits:\n${commitMsgs}`;

    try {
      const response = await this.client.chat([
        { role: 'user', content: prompt }
      ], this.model, { maxTokens: 50 });

      return response.choices?.[0]?.message?.content?.trim() || 'Update';
    } catch {
      return 'Update';
    }
  }

  private async generatePRDescription(commits: any[]): Promise<string> {
    if (!this.client || !this.model) return 'Changes made';

    const commitMsgs = Array.from(commits).map((c: any) => c.message).join('\n');
    const prompt = `Generate a PR description for these commits:\n${commitMsgs}`;

    try {
      const response = await this.client.chat([
        { role: 'user', content: prompt }
      ], this.model, { maxTokens: 200 });

      return response.choices?.[0]?.message?.content?.trim() || 'Changes made';
    } catch {
      return 'Changes made';
    }
  }

  async branch(name: string, checkout: boolean = true): Promise<string> {
    await this.git.checkoutLocalBranch(name);
    return `Created branch: ${name}`;
  }

  async merge(branch: string): Promise<string> {
    try {
      await this.git.merge([branch]);
      return `Merged ${branch}`;
    } catch (err: any) {
      return `Merge conflict: ${err.message}`;
    }
  }

  async resolveConflicts(): Promise<string> {
    const status = await this.git.status();
    const conflicts = status.conflicted;

    if (conflicts.length === 0) {
      return 'No conflicts';
    }

    return `Conflicts in: ${conflicts.join(', ')}`;
  }

  async sync(): Promise<string> {
    await this.git.pull();
    await this.git.push();
    return 'Synced with remote';
  }

  async status(): Promise<any> {
    return await this.git.status();
  }

  async diff(file?: string): Promise<string> {
    return await this.git.diff(file ? [file] : []);
  }

  async log(count: number = 10): Promise<any> {
    return await this.git.log({ maxCount: count });
  }
}
