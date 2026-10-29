module.exports = () => ({
  postcssPlugin: 'manager-css-compat',
  Once(root) {
    let hasTailwind = false;
    root.walkAtRules('tailwind', () => {
      hasTailwind = true;
    });

    if (!hasTailwind) {
      root.walkAtRules('layer', (atRule) => {
        if (['base', 'components', 'utilities'].includes(atRule.params)) {
          atRule.replaceWith(atRule.nodes);
        }
      });
    }

    root.walkDecls((decl) => {
      if (decl.value && decl.value.includes('theme(')) {
        decl.value = decl.value.replace(/theme\((--[a-zA-Z0-9_-]+)\)/g, 'var($1)');
      }
    });
  },
});
module.exports.postcss = true;

