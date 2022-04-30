import { init, inject, provide, scope, ScopeEnum } from 'injection';
import * as vscode from 'vscode';
import { commandRegisterFactory } from "../command";
import { Instance } from '../instance';
import { logger } from '../logger';
import { CommandTable } from './table';

@provide()
@scope(ScopeEnum.Singleton)
export class CommandRegistry {

    @inject(Instance.ExtensionContext)
    private context: vscode.ExtensionContext;

    private table = new CommandTable(this.prefix);

    public lastExecutedCommands: { command: string; args: any[] }[] = [];

    private get prefix(): string {
        return vscode.workspace.getConfiguration('vsce-script').get('commandPrefix') || 'vsce-script';
    }

    @init()
    public async init() {
        this.registerBuiltInCommand();
        await Promise.resolve();
    }

    public registerBuiltInCommand() {
        Object.entries(this.table.internal).forEach(([cmd, fn]) => {
            logger.info(`Register Built-In Command: ${cmd}`);
            return this.registerCommand(cmd, fn);
        });
    }

    public registerCommand(commandId: string, handler: (...args: any) => any) {
        const [registerCommand] = commandRegisterFactory(this.context);
        const commandHandler = async (...args: any[]) => {
            if (commandId !== 'vsce-script.rerunLastCommand') {
                const latestCommandPayloads = this.lastExecutedCommands[0] ? [this.lastExecutedCommands[0]] : [];
                this.lastExecutedCommands = [{ command: commandId, args }, ...latestCommandPayloads];
            }
            return await handler(...args);
        };
        registerCommand(commandId, commandHandler);
    }

    public registerScriptCommand(commandId: string, handler: (...args: any) => any) {
        this.table.registerScriptCommand(commandId);
        this.registerCommand(commandId, handler);
    }
}