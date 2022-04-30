import * as vscode from 'vscode';

export type CommandPayload = (string | { command: string; args: object });

export type CommandFactory<T = any> = () => Thenable<T>;

export interface TypeCommand {
    command: string;
    args: {
        text: string;
    };
}

export interface QuickpickSetting {
	title: string;
	default?: string;
	items: QuickpickCommandItem[]
}

export interface QuickpickCommandItem extends vscode.QuickPickItem {
	label: string;
	command: string;
	args?: any;
}
