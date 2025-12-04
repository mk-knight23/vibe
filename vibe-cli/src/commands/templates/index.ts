import { Template } from '../workflows';

export const reactTemplate: Template = {
  id: 'react-ts',
  name: 'React TypeScript App',
  description: 'Modern React app with TypeScript and Vite',
  variables: {
    projectName: 'my-app',
    author: 'Developer'
  },
  files: [
    {
      path: 'package.json',
      content: `{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}`
    },
    {
      path: 'src/App.tsx',
      content: `export default function App() {
  return <div><h1>{{projectName}}</h1></div>;
}`
    },
    {
      path: 'tsconfig.json',
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true
  }
}`
    }
  ]
};

export const nodeApiTemplate: Template = {
  id: 'node-api',
  name: 'Node.js API',
  description: 'Express API with TypeScript',
  variables: {
    projectName: 'my-api',
    port: '3000'
  },
  files: [
    {
      path: 'package.json',
      content: `{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.19.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "typescript": "^5.5.0",
    "tsx": "^4.0.0"
  }
}`
    },
    {
      path: 'src/index.ts',
      content: `import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to {{projectName}}' });
});

app.listen({{port}}, () => {
  console.log('Server running on port {{port}}');
});`
    }
  ]
};

export const allTemplates = [reactTemplate, nodeApiTemplate];
