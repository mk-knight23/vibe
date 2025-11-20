import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { command, args = [] } = body;

    // Path to the vibe-cli executable
    const cliPath = join(process.cwd(), '../vibe-cli/bin/vibe.cjs');

    // Validate command
    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Command is required and must be a string' },
        { status: 400 }
      );
    }

    // Spawn vibe-cli as a subprocess
    return new Promise((resolve) => {
      const child = spawn('node', [cliPath, command, ...args], {
        stdio: 'pipe',
        cwd: process.cwd(),
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          resolve(
            NextResponse.json(
              { error: 'CLI execution failed', stderr, stdout },
              { status: 500 }
            )
          );
        } else {
          resolve(
            NextResponse.json({ success: true, stdout, stderr }, { status: 200 })
          );
        }
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}