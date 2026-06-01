/**
 * @deprecated Use build-validate-workflows.cjs
 */
'use strict';
require('child_process').execSync('node scripts/doi/build-validate-workflows.cjs', {
  cwd: require('path').resolve(__dirname, '../..'),
  stdio: 'inherit',
});
