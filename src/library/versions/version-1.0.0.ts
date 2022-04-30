import { SpawnOptions } from 'child_process';
import { commandQuickpick, CommandRegistry } from "../../registry";
import { confirm, dropdown, input } from "../../interactive";
import { execCmd, execShell, invokeCommands, runAutomation, runCommands, runMacro, spawnShell, type, typeCharUnderCursor, typeKeys, writeText } from '../../command';
import { copyFileOrFolder, createNewFile, createNewFolder, findFirstOccurCharAboveCursor, findFirstOccurCharAtLine, getCharAt, getCharUnderCursor, getCurrentLine, getCurrentWorkspaceFolder, getCursorPosition, getFirstCharOnLine, getLine, getSelectedText, setCursorPosition, switchToInsertModeSelection } from '../../editor'; 
import { Instantiator } from '../../instantiator';

export const getLib = async () => {
    const registry = await Instantiator.container.getAsync<CommandRegistry>(CommandRegistry);
    return {
        version: '1.0.0',
        automation: {
            type,
            typeKeys,
            typeCharUnderCursor,
            writeText,
            execCmd,
            execShell,
            spawnShell,
            runMacro,
            runCommands,
            runAutomation,
        },
        commands: {
            registerCommand: (commandId: string, handler: (...args: any) => any) => registry.registerScriptCommand(commandId, handler),
            invokeCommands
        },
        vim: {
            switchToInsertModeSelection
        },
        promise: {
            execCmd: (payload: string | { command: string; args: object; }) => execCmd(payload)(),
            execShell: (cmd: string, options: SpawnOptions & { hideOutput?: boolean; } = { hideOutput: false }) => execShell(cmd, options)(),
            spawnShell: (...args: [cmd: string, args?: string[] | undefined, option?: SpawnOptions | undefined]) => spawnShell.apply(null, args)(),
            typeCharUnderCursor: () => typeCharUnderCursor(),
            type: (text: string) => type(text)(),
            typeKeys: (texts: string[]) => typeKeys(texts)(),
            writeText: (text: string) => writeText(text)(),
        },
        editor: {
            getFirstCharOnLine,
            getLine,
            getCurrentLine,
            getCharAt,
            getSelectedText,
            getCharUnderCursor,
            findFirstOccurCharAboveCursor,
            getCursorPosition,
            setCursorPosition
        },
        fs: {
            getCurrentWorkspaceFolder,
            copyFileOrFolder,
            createNewFile,
            createNewFolder
        },
        interactive: {
            confirm,
            input,
            dropdown,
            commandQuickpick
        }
    };
};