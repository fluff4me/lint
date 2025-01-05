import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import tseslint from 'typescript-eslint'
import rule from '../util/rule.mjs'

/** @import {TSESLint, TSESTree} from "@typescript-eslint/utils" */

export default rule(() => {
	const baseRule = /** @type {Exclude<TSESLint.LooseRuleDefinition, Function>} */(tseslint.plugin.rules?.['no-unused-expressions'])
	return {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		defaultOptions: /** @type {any} */ (baseRule)?.defaultOptions,
		meta: {
			.../** @type {TSESLint.RuleMetaData<string>} */(baseRule?.meta),
			docs: {
				description: 'Disallow unused expressions',
				extendsBaseRule: true,
				recommended: false,
			},
		},
		/**
		 * @param {TSESLint.RuleContext<string, any>} context
		 * @returns {TSESLint.RuleListener}
		 */
		create (context) {
			const listeners = /** @type {(...args: any[]) => TSESLint.RuleListener} */ (baseRule.create)(context)

			return {
				...listeners,
				ExpressionStatement (node) {
					if (node.expression?.type === AST_NODE_TYPES.SequenceExpression) {
						const expressions = node.expression.expressions
						const last = expressions[expressions.length - 1]

						return listeners.ExpressionStatement?.({
							...node,
							expression: last,
						})
					}

					return listeners.ExpressionStatement?.(node)
				},
			}
		},
	}
})
