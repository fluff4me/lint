#!/usr/bin/env node

import { execFile, spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)
const dirname = path.dirname(fileURLToPath(import.meta.url))

const globs = ['*.ts', '*.tsx', '*.js', '*.mjs', '*.cjs', '*.mts', '*.cts']
const bin = process.platform === 'win32' ? 'eslint.cmd' : 'eslint'
const args = process.argv.slice(2)

async function findEslint () {
	const candidates = [
		path.resolve(dirname, 'node_modules', '.bin', bin),
		path.resolve(process.cwd(), 'node_modules', '.bin', bin),
	]

	for (const candidate of candidates) {
		if (await fs.stat(candidate).then(() => true).catch(() => false))
			return candidate
	}

	return 'eslint'
}

async function main () {
	const { stdout } = await execFileAsync('git', ['ls-files', ...globs], {
		cwd: process.cwd(),
		maxBuffer: 1024 * 1024 * 32,
	})

	const trackedFiles = stdout
		.split(/\r?\n/)
		.map(file => file.trim())
		.filter(Boolean)
	/** @type {string[]} */
	const files = []

	for (const file of trackedFiles) {
		await fs.stat(file)
			.then(() => files.push(file))
			.catch(() => { })
	}

	if (!files.length)
		return

	const eslint = await findEslint()

	await new Promise((resolve, reject) => {
		const childProcess = spawn(eslint, [...args, '--', ...files], {
			cwd: process.cwd(),
			stdio: 'inherit',
			shell: process.platform === 'win32',
		})

		childProcess.on('error', reject)
		childProcess.on('exit', code => {
			if (code)
				process.exitCode = code

			resolve()
		})
	})
}

main().catch(error => {
	console.error(error)
	process.exitCode = 1
})
