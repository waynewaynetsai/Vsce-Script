import { provide } from 'injection';
import * as vscode from 'vscode';
import { Global } from './global';

@provide()
export class Configuration {

    public commandPrefix = 'vsce-script';

    public projectPath = '';

    constructor() { }

    public load() {
        const configs: { [key: string]: any } = Global.isTesting
            ? Global.mockConfiguration!
            : vscode.workspace.getConfiguration('vsce-script');

        for (const option in this) {
            const val = configs[option];
            if (val) {
                this[option] = val;
            }
        }
        return configs;
    }
}