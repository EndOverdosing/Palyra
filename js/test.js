const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const filePath = path.join(__dirname, 'js', 'index.js');

console.log(`[START] Removing ALL console calls from: ${filePath}`);

if (!fs.existsSync(filePath)) {
    console.error('[ERROR] File does not exist.');
    process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf8');

const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
});

let removedCount = 0;

traverse(ast, {
    CallExpression(path) {
        const callee = path.node.callee;

        if (
            t.isMemberExpression(callee) &&
            t.isIdentifier(callee.object, { name: 'console' }) &&
            t.isIdentifier(callee.property) &&
            ['log', 'error', 'warn', 'info', 'debug'].includes(callee.property.name)
        ) {
            removedCount++;

            if (path.parentPath.isExpressionStatement()) {
                path.parentPath.remove();
            } else {
                path.replaceWith(t.unaryExpression('void', t.numericLiteral(0)));
            }
        }
    }
});

const output = generate(ast, { comments: false }).code;

fs.writeFileSync(filePath, output, 'utf8');

console.log(`[DONE] Removed ${removedCount} console call(s).`);