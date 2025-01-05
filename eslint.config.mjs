import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import 'eslint-plugin-only-warn'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import noBlankLinesInOptionalBlocks from './rule/no-blank-lines-in-optional-blocks.mjs'
import noUnusedExpressions from './rule/no-unused-expressions.mjs'

/** @import {TSESLint} from "@typescript-eslint/utils" */

/** @type {TSESLint.Linter.ConfigType[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,

	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},

	stylistic.configs.customize({
		indent: 'tab',
		quotes: 'single',
		semi: false,
		jsx: false,
	}),

	{
		rules: {
			'no-constant-binary-expression': 'off',
			'no-empty': ['warn', { allowEmptyCatch: true }],
			'no-constant-condition': ['warn', { checkLoops: false }],
			'prefer-const': ['warn', { destructuring: 'all' }],
			'no-irregular-whitespace': ['warn', { skipRegExps: true }],

			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/consistent-type-imports': 'warn',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '.', varsIgnorePattern: '^[A-Z_]+$' }],
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/no-empty-object-type': ['warn', { allowInterfaces: 'always' }],

			'@stylistic/no-trailing-spaces': 'off', // removed by typescript
			'@stylistic/indent': 'off',
			'@stylistic/indent-binary-ops': 'off',
			'@stylistic/multiline-ternary': 'off',
			'@stylistic/spaced-comment': ['warn', 'always', { exceptions: ['/'], markers: ['#region', '#endregion'] }],
			'@stylistic/space-before-function-paren': ['warn', 'always'],
			'@stylistic/quotes': ['warn', 'single'],
			'@stylistic/padded-blocks': ['warn', { blocks: 'never', classes: 'always' }],
			'@stylistic/arrow-parens': ['warn', 'as-needed'],
			'@stylistic/comma-dangle': ['warn', {
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'ignore',
			}],
			'@stylistic/eol-last': ['warn', 'always'],
			'@stylistic/max-statements-per-line': ['warn', {
				ignoredNodes: [
					AST_NODE_TYPES.BreakStatement,
					AST_NODE_TYPES.ExpressionStatement,
					AST_NODE_TYPES.ReturnStatement,
				],
			}],
			'@stylistic/padding-line-between-statements': [
				'warn',
				{ blankLine: 'never', prev: 'block', next: '*' },
			],
		},
	},

	{
		plugins: {
			fluff: {
				rules: {
					...noUnusedExpressions,
					...noBlankLinesInOptionalBlocks,
				},
			},
		},
		rules: {
			'fluff/no-unused-expressions': 'warn',
			'fluff/no-blank-lines-in-optional-blocks': 'warn',
		},
	},
]
