import * as d from '../declarations';


export async function taskTest(config: d.Config) {
  const { Testing } = require('../testing/index.js');

  const testing: d.Testing = new Testing(config);
  if (!testing.isValid) {
    process.exit(1);
  }

  await testing.runTests();

  await testing.destroy();
}
