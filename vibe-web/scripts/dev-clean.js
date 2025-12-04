#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const lockFile = path.join(__dirname, '../.next/dev/lock');

try {
  if (fs.existsSync(lockFile)) {
    fs.unlinkSync(lockFile);
    console.log('✓ Cleaned stale lock file');
  }
} catch (err) {
  // Ignore errors
}
