import 'reflect-metadata';

import * as vscode from 'vscode';
import { logger } from './logger';
import { Library } from './library';
import { Instantiator } from './instantiator';
import { registerReloadCommand, registerWorkspaceChangeEvent } from './registry';

export async function activate(context: vscode.ExtensionContext) {
	try {
		await Instantiator.startup(context);
		registerWorkspaceChangeEvent(context);
		registerReloadCommand(context);
		const library = await Instantiator.container.getAsync<Library>(Library);
		return { 
			version: library.version,
			getLatestLib: async () => await library.getLatestLib(),
			getLib: async (version: string) => await library.getLib(version)
		};
	} catch (error: any) {
		const msg = 'Vsce-Script Unexpected Error';
		logger.error(`[${msg}] ${error.message}`);
		vscode.window.showErrorMessage(`${msg}: ${JSON.stringify(error)}`);
	}
}

export function deactivate() { }
