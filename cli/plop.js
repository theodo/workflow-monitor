
const nodePlop = require('node-plop');
// load an instance of plop from a plopfile
const plopfile = nodePlop(`./plopfile.js`);


const plop = (generatorName, options) => {
  const basicAdd = plopfile.getGenerator('component');

  const tempOptions = {
    type: 'Component',
    name: 'Supercomponent',
    connectedComponent:false,
    relativePath: '.',
  }

  // run all the generator actions using the data specified
  return basicAdd.runActions(tempOptions);
}

module.exports.plop = plop
