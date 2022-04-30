import * as vscode from 'vscode';
import { commandRegisterFactory, execShell, spawnShell } from '../command';
import { Instantiator } from '../instantiator';
import { confirm } from '../interactive';
import { ScriptLoader } from '../loader';
import { CommandRegistry } from './registry';
import { isTsProject } from './utils';

export function registerReloadCommand(context: vscode.ExtensionContext) {
	const reloadEmitter = new vscode.EventEmitter();
	const [registerCommand] = commandRegisterFactory(context);
	registerCommand('vsce-script.reloadScript', async () => {
		const isTypescript = isTsProject();
		if (isTypescript) {
			const compileProject = await confirm('Compile Typescript Project ?');
			const existProjectPath = vscode.workspace.getConfiguration('vsce-script').get<string>('projectPath');
			if (compileProject) {
				await execShell('npm run compile', { cwd: existProjectPath })();
			}
		}
		context.subscriptions.forEach(d => d.dispose());
		const userScript = await Instantiator.container.getAsync<ScriptLoader>(ScriptLoader);
		const registry = await Instantiator.container.getAsync<CommandRegistry>(CommandRegistry);
		registry.registerBuiltInCommand();
		userScript.load();
		reloadEmitter.fire(null);
	});
	reloadEmitter.event(_ => registerReloadCommand(context));
}
