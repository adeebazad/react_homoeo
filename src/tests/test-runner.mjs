// test-runner.mjs
import('./api.test.js').catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
