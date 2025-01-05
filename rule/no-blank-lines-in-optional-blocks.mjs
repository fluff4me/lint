import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import rule from '../util/rule.mjs'

/** @import {TSESLint, TSESTree} from "@typescript-eslint/utils" */

export default rule(
	{
		blankLineDetected: 'Avoid blank lines between a conditional or loop statement and its single non-block statement.',
	},
	() => {
		return {
			defaultOptions: [],
			meta: {
				type: 'layout',
				docs: {
					description: 'Warn about blank lines between a conditional/loop statement and its single non-block statement.',
					category: 'Stylistic Issues',
					recommended: false,
				},
				fixable: 'whitespace',
				schema: [], // No options for this rule
			},
			create (context) {
				return {
					IfStatement (node) {
						checkStatement(node, node.consequent)
					},

					WhileStatement (node) {
						checkStatement(node, node.body)
					},

					ForStatement (node) {
						checkStatement(node, node.body)
					},

					ForInStatement (node) {
						checkStatement(node, node.body)
					},

					ForOfStatement (node) {
						checkStatement(node, node.body)
					},

					DoWhileStatement (node) {
						checkStatement(node, node.body)
					},
				}

				/**
				 * Checks for blank lines between a parent statement and its single statement body.
				 * @param {TSESTree.Node} parentNode The parent node (conditional or loop statement).
				 * @param {TSESTree.Node} childNode The single non-block statement.
				 */
				function checkStatement (parentNode, childNode) {
					if (childNode.type === AST_NODE_TYPES.BlockStatement)
						return

					const lastToken = context.sourceCode.getTokenBefore(childNode)
					if (!lastToken)
						return

					if (lastToken.loc.end.line + 1 >= childNode.loc.start.line)
						return

					const sourceCode = context.sourceCode
					const commentsInRange = sourceCode.getCommentsBefore(childNode)
					if (commentsInRange.length)
						return

					const rangeStart = { line: lastToken.loc.end.line + 1, column: 0 }
					const rangeEnd = { line: childNode.loc.start.line, column: 0 }

					context.report({
						loc: { start: rangeStart, end: rangeEnd },
						messageId: 'blankLineDetected',
						fix (fixer) {
							return fixer.removeRange([
								sourceCode.getIndexFromLoc(rangeStart),
								sourceCode.getIndexFromLoc(rangeEnd),
							])
						},
					})
				}
			},
		}
	}
)
