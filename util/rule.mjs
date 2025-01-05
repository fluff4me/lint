/** @import {TSESLint, TSESTree} from "@typescript-eslint/utils" */

/**
 * @overload
 * @param {() => TSESLint.RuleModule<MessageIds, any[]>} provider
 * @returns {Record<string, TSESLint.RuleModule<string, any[]>> | undefined}
 */
/**
 * @template {string} MessageIds
 * @overload
 * @param {Record<MessageIds, string>} messages
 * @param {NoInfer<() => Omit<TSESLint.RuleModule<MessageIds, any[]>, "meta"> & { meta: Omit<TSESLint.RuleMetaData<MessageIds, unknown, any[]>, "messages">; }>} provider
 * @returns {Record<string, TSESLint.RuleModule<string, any[]>> | undefined}
 */
/**
 * @template {string} MessageIds
 * @param {Record<MessageIds, string> | (() => TSESLint.RuleModule<MessageIds, any[]>)} messages
 * @param {NoInfer<() => Omit<TSESLint.RuleModule<MessageIds, any[]>, "meta"> & { meta: Omit<TSESLint.RuleMetaData<MessageIds, unknown, any[]>, "messages">; }>} [provider]
 * @returns {Record<string, TSESLint.RuleModule<string, any[]>> | undefined}
 */
export default function rule (messages, provider) {
	const callsites = new Error().stack?.split('\n').slice(2)
	const firstCallsite = callsites?.[0]
	if (!firstCallsite)
		return undefined

	const callerFilename = firstCallsite.slice(firstCallsite.lastIndexOf('/') + 1, firstCallsite.lastIndexOf('.mjs'))

	if (typeof messages === "function")
		return { [callerFilename]: messages() }

	const module = /** @type {NonNullable<typeof provider>} */(provider)()
	return {
		[callerFilename]: {
			...module,
			meta: {
				...module.meta,
				messages,
			},
		},
	}
}
