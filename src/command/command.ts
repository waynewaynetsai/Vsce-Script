import * as vsc from 'vscode';
import * as cp from 'child_process';
import { logger } from '../logger';
import { getCurrentWorkspaceFolder } from '../editor';

export function commandRegisterFactory(context: vsc.ExtensionContext) {
	const registerCommand = (commandId: string, commandHandler: (...args: any[]) => any) => {
		const subscription = vsc.commands.registerCommand(commandId, commandHandler);
		logger.debug(`registerCommand:${commandId}`);
		context.subscriptions.push(subscription);
	};
	const registerTextEditorCommand = (commandId: string, commandHandler: (...args: any[]) => any) => {
		const subscription = vsc.commands.registerCommand(commandId, commandHandler);
		logger.debug(`registerTextEditorCommand:${commandId}`);
		context.subscriptions.push(subscription);
	};
	return [registerCommand, registerTextEditorCommand];
}

export function completionRegisterFactory(context: vsc.ExtensionContext) {
	const registerCompletionItemProvider = (selector: vsc.DocumentSelector, completionItemProvider: vsc.CompletionItemProvider, ...triggerCommitCharacters: string[]) => {
		const subscription = vsc.languages.registerCompletionItemProvider(selector, completionItemProvider, ...triggerCommitCharacters);
		context.subscriptions.push(subscription);
	};
	return registerCompletionItemProvider;
}

export function execCmd<T = unknown>(cmd: string | { command: string; args: object }): () => Thenable<T> {
	if (typeof cmd === 'string') {
		return () => {
			logger.info(`Execute VSCodeCommand: ${cmd}`);
			return vsc.commands.executeCommand(cmd);
		};
	} else if (cmd.command && typeof cmd.command === 'string') {
		return () => {
			logger.info(`Execute VSCodeCommand: ${cmd.command}, args: ${cmd.args}`);
			return vsc.commands.executeCommand(cmd.command, cmd.args);
		};
	} else {
		const msg = `Provide wrong command payload: ${cmd}`;
		vsc.window.showErrorMessage(msg);
		throw new Error(msg);
	}
}

export function insertSnippet(snippet: string) {
	return () => execCmd({
		command: "insertSnippet",
		args: { snippet }
	});
}

/**
 * Exec a shell command
 */
export function execShell(cmd: string, options: cp.SpawnOptions & { hiddenOutput?: boolean } = { hiddenOutput: false }) {
	const config = process.platform === 'win32' ? { cmd: 'cmd', arg: '/C' } : { cmd: 'sh', arg: '-c' };

	return () => vsc.window.withProgress({ location: vsc.ProgressLocation.Notification }, async (progress) => {
		progress.report({
			message: `Execute shell command: ${cmd}...`,
		});
		if (!options.hiddenOutput) {
			logger.show();
		}
		if (!options.cwd) {
			const workspace = await getCurrentWorkspaceFolder();
			options.cwd = workspace?.uri?.fsPath ?? process.cwd();
		}
		logger.info(`\n$ ${cmd}\n`);
		logger.info(`Exec shell command options: ${JSON.stringify(options)}`);
		await new Promise((resolve, reject) => {
			try {
				const proc = cp.spawn(config.cmd, [config.arg, cmd], options);
				proc.stdout?.on('data', (data) => {
					logger.log(data.toString());
				});
	
				proc.stderr?.on('data', (data) => {
					logger.log(data.toString());
				});
	
				proc.on('close', (code) => {
					logger.info(`> ${cmd} exited with code ${code?.toString()}`);
					resolve(null);
				});
	
				proc.on('error', (err) => {
					logger.error(`> ${cmd} exited with error ${err.toString()}`);
					reject(err);
				});
			} catch (err) {
				logger.error(`${err}`);
				reject(err);
			}
		});
	});
}

/**
 * Spawn a shell command with progress and logs
 */
export function spawnShell(cmd: string, args: string[] = [], option: cp.SpawnOptions = {}) {
	return () => vsc.window.withProgress({ location: vsc.ProgressLocation.Notification }, async (progress) => {
		progress.report({
			message: `Execute shell command: ${cmd}...`,
		});

		await new Promise((resolve, reject) => {
			const proc = cp.spawn(cmd, args, option);
			logger.show();
			logger.info(`\n$ ${cmd} ${args.join(' ')}\n`);
			logger.info(`Spawn option: ${JSON.stringify(option)}`);

			proc.stdout?.on('data', (data) => {
				logger.info(data.toString());
			});

			proc.stderr?.on('data', (data) => {
				logger.info(data.toString());
			});

			proc.on('close', (code) => {
				logger.info(`> ${cmd} exited with code ${code?.toString()}`);
				resolve(null);
			});

			proc.on('error', (err) => {
				logger.error(`> ${cmd} exited with error ${err.toString()}`);
				reject(err);
			});
		});
	});
}