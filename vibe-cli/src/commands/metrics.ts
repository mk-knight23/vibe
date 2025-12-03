import { orchestrator } from '../core/orchestrator';

export async function metricsCommand(args: string[]): Promise<void> {
  const [action, ...params] = args;

  switch (action) {
    case 'show':
      showMetrics(params[0]);
      break;
    case 'clear':
      clearMetrics();
      break;
    case 'errors':
      showErrors();
      break;
    default:
      showAllMetrics();
  }
}

function showMetrics(name?: string): void {
  const metrics = name 
    ? orchestrator.metricsCollector.getMetrics(name)
    : orchestrator.metricsCollector.getMetrics();

  if (metrics.length === 0) {
    orchestrator.ui.info('No metrics recorded');
    return;
  }

  orchestrator.ui.section('Performance Metrics');
  
  const grouped = new Map<string, number[]>();
  metrics.forEach(m => {
    if (!grouped.has(m.name)) grouped.set(m.name, []);
    grouped.get(m.name)!.push(m.value);
  });

  for (const [name, values] of grouped.entries()) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    console.log(`\n${name}:`);
    console.log(`  Count: ${values.length}`);
    console.log(`  Average: ${avg.toFixed(2)}ms`);
    console.log(`  Min: ${min.toFixed(2)}ms`);
    console.log(`  Max: ${max.toFixed(2)}ms`);
  }
}

function showAllMetrics(): void {
  showMetrics();
}

function clearMetrics(): void {
  orchestrator.metricsCollector.clear();
  orchestrator.ui.success('Metrics cleared');
}

function showErrors(): void {
  const errors = orchestrator.errorTracker.getFrequentErrors();
  
  if (errors.length === 0) {
    orchestrator.ui.info('No errors recorded');
    return;
  }

  orchestrator.ui.section('Error Summary');
  
  errors.forEach(err => {
    console.log(`\n[${err.id}] ${err.message}`);
    console.log(`  Count: ${err.count}`);
    console.log(`  Last seen: ${new Date(err.timestamp).toLocaleString()}`);
  });
}
