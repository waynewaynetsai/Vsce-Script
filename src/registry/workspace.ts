import * as vscode from 'vscode';
import { Instantiator } from '../instantiator';
import { ScriptLoader } from '../loader';
import { CommandRegistry } from './registry';

export function registerWorkspaceChangeEvent(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(async (e) => {
			const configId = 'vsce-script.projectPath';
			if (e.affectsConfiguration(configId)) {
				vscode.window.showInformationMessage(`change workspace configuration ${JSON.stringify(vscode.workspace.getConfiguration(configId))}`);
				const userScript = await Instantiator.container.getAsync<ScriptLoader>(ScriptLoader);
				const registry = await Instantiator.container.getAsync<CommandRegistry>(CommandRegistry);
				registry.registerBuiltInCommand();
				userScript.load();
			}
		})
	);
}
