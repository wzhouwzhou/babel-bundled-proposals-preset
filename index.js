const PROPOSAL_PLUGINS = {
  functionBind: '@babel/plugin-proposal-function-bind',

  exportDefaultFrom: '@babel/plugin-proposal-export-default-from',
  logicalAssignmentOperators: '@babel/plugin-proposal-logical-assignment-operators',
  optionalChaining: '@babel/plugin-proposal-optional-chaining',
  pipelineOperator: '@babel/plugin-proposal-pipeline-operator',
  nullishCoalescingOperator: '@babel/plugin-proposal-nullish-coalescing-operator',
  doExpressions: '@babel/plugin-proposal-do-expressions',

  decorators: '@babel/plugin-proposal-decorators',
  functionSent: '@babel/plugin-proposal-function-sent',
  exportNamespaceFrom: '@babel/plugin-proposal-export-namespace-from',
  numericSeparator: '@babel/plugin-proposal-numeric-separator',
  throwExpressions: '@babel/plugin-proposal-throw-expressions',

  dynamicImport: '@babel/plugin-syntax-dynamic-import',
  importMeta: '@babel/plugin-syntax-import-meta',
  classProperties: '@babel/plugin-proposal-class-properties',
  jsonStrings: '@babel/plugin-proposal-json-strings',
  privateMethods: '@babel/plugin-proposal-private-methods',

  transformCJSModules: '@babel/plugin-transform-modules-commonjs',
};

const DEFAULT_OPTIONS = {
  decorators: { decoratorsBeforeExport: true },
  pipelineOperator: { proposal: 'smart' },
  nullishCoalescingOperator: { loose: true },
  optionalChaining: { loose: true },
  classProperties: { loose: true },
  privateMethods: { loose: true },
};

const getPlugin = (proposal, absolutePath) => absolutePath ? require.resolve(PROPOSAL_PLUGINS[proposal]) : PROPOSAL_PLUGINS[proposal];

const getProposalOptions = options => {
  let { absolutePaths, all = false, ...proposalOptions } = options;

  if (all) {
    for (const proposal of Object.keys(PROPOSAL_PLUGINS)) {
      if (!Reflect.getOwnPropertyDescriptor(proposalOptions, proposal)) proposalOptions[proposal] = true;
    }
  }

  return proposalOptions;
};

module.exports = (api, options = {}) => {
  api.assertVersion(7);

  const { absolutePaths = false } = options;
  const proposalOptions = getProposalOptions(options);
  const plugins = [];
  for (const proposal of PROPOSAL_PLUGINS) {
    if (!Reflect.getOwnPropertyDescriptor(proposalOptions, proposal) || proposalOptions[proposal] === false) continue;

    const plugin = getPlugin(proposal, absolutePaths);

    if (proposalOptions[proposal] === true) {
      if (proposal === 'classProperties' && proposalOptions.decorators) {
        plugins.push([plugin, { loose: true }]);
      } else if (Reflect.getOwnPropertyDescriptor(DEFAULT_OPTIONS, proposal)) {
        plugins.push([plugin, DEFAULT_OPTIONS[proposal]]);
      } else {
        plugins.push(plugin);
      }
    } else {
      plugins.push([plugin, proposalOptions[proposal]]);
    }
  });
  return { plugins };
};
