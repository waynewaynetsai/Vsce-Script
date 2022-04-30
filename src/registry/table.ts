import * as vscode from 'vscode';
import { switchToInsertModeSelection } from '../editor';
import { addBracket, commandQuickpick, createProject, insertDeclaration, openScriptProject, rerunLastCommand, showAllCommands, surroundWith, visualModeYank, copyRegisteredCommandId, selectAnotherScriptProject, upgradeLibraryToLatestVersion } from './handler';

export class CommandTable {
    private scriptCommands: string[] = [];

    private userFacingCommands = {
        openProject: openScriptProject,
        createProject,
        upgradeLibrary: upgradeLibraryToLatestVersion,
        selectAnotherScriptProject,
        rerunLastCommand,
        showAllCommands: showAllCommands(this),
    };

    private vimCommands = {
        visualModeYank,
        switchToInsertModeSelection
    };

    private customCommands = {
        insertDeclaration,
        addBracket,
        surroundWith,
        visualModeYank,
        commandQuickpick,
        switchToInsertModeSelection
    };

    public getAll() {
        const userfacingCommandTable = this.createCommandTable(this.userFacingCommands, (id) => `vsce-script.${id}`);
        const customCommandsTable = this.createCommandTable(this.customCommands, (id) => `${this.prefix}.${id}`);
        const vimCommandsTable = this.createCommandTable(this.vimCommands, (id) => `${this.prefix}.vim.${id}`);
        const scriptCommandTable = this.scriptCommands.map(id => ({
            commandId: id, handler: (...args: any[]) => vscode.commands.executeCommand(id, ...args)
        })).reduce((table, { commandId, handler }) => {
            table[commandId] = handler;
            return table;
        }, {});
        return {
            ...userfacingCommandTable,
            ...customCommandsTable,
            ...vimCommandsTable,
            ...scriptCommandTable
        };
    }

    public createCommandTable(config: { [key: string]: (...args: any[]) => any}, commandIdMapper: Function) {
        return Object.entries(config).map(([id, handler]) => {
            return { commandId: commandIdMapper(id), handler };
        }).reduce((table, { commandId, handler }) => {
            table[commandId] = handler;
            return table;
        }, {});
    }

    private _internal: { [key: string]: (...args: any[]) => any } | undefined = undefined;

    /**
     * Internal Command Table
     */
    public get internal() {
        if (this._internal) {
            return this._internal;
        } else {
            const userfacingCommandTable = this.createCommandTable(this.userFacingCommands, (id) => `vsce-script.${id}`);
            const customCommandsTable = this.createCommandTable(this.customCommands, (id) => `${this.prefix}.${id}`);
            this._internal = {
                ...userfacingCommandTable,
                ...customCommandsTable
            };
            return this._internal;
        }
    }

    public registerScriptCommand(commandId: string) {
        this.scriptCommands.push(commandId);
    }

    constructor(private prefix: string) { }
}
