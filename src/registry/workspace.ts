import * as vscode from 'vscode';
import { Instantiator } from '../instance';
import { ScriptLoader } from '../loader';
import { logger } from '../logger';
import { CommandRegistry } from './registry';

export function registerWorkspaceChangeEvent(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(async (e) => {
			const configId = 'vsce-script.projectPath';
			if (e.affectsConfiguration(configId)) {
				logger.info(`change workspace configuration ${JSON.stringify(vscode.workspace.getConfiguration(configId))}`);
				const userScript = await Instantiator.container.getAsync<ScriptLoader>(ScriptLoader);
				const registry = await Instantiator.container.getAsync<CommandRegistry>(CommandRegistry);
				registry.registerBuiltInCommand();
				userScript.load();
			}
		})
	);
}
