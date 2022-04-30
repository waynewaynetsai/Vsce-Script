import * as vscode from "vscode";
import { SpawnOptions } from "child_process";

export interface QuickpickSetting {
  title: string;
  default?: string;
  items: QuickpickCommandItem[];
}

export interface QuickpickCommandItem extends vscode.QuickPickItem {
  label: string;
  command: string;
  args?: any;
}

type CommandPayload = (string | { command: string; args: object });

export interface LibraryApi {
  version: string;
  automation: {
    type: (typeText: string) => () => Thenable<void>;
    typeKeys: (typeTexts: string[]) => () => Thenable<void>;
    typeCharUnderCursor: () => Thenable<void>;
    writeText: (text: string) => () => Thenable<void>;
    execCmd: <T = unknown>( cmd: string | { command: string; args: object }) => () => Thenable<T>;
    execShell: (cmd: string, options: SpawnOptions & { hideOutput?: boolean }) => () => Thenable<void>;
    spawnShell: ( cmd: string, args?: string[], option?: SpawnOptions) => () => Thenable<void>;
    runMacro: (typeTexts: string[]) => Thenable<void>;
    runAutomation: (...args: any[]) => Thenable<void>;
    runCommands: ( ...commands: CommandPayload[]) => Thenable<void>;
  };
  commands: {
    registerCommand: ( commandId: string, handler: (...args: any) => any) => void;
    invokeCommands: (...args: any[]) => Thenable<void>;
  };
  editor: {
    registerCompletionProvider: (selector: vscode.DocumentSelector, completionItemProvider: vscode.CompletionItemProvider<vscode.CompletionItem>, ...triggerCommitCharacters: string[]) => void;
    getLine: (lineNumber: number) => string | undefined;
    getCurrentLine: (editor: vscode.TextEditor) => string;
    getCharAt: ( document: vscode.TextDocument, position: vscode.Position) => string;
    getSelectedText: () => string | undefined;
    getCharUnderCursor: () => string | undefined;
    getFirstCharOnLine: ( document: vscode.TextDocument, line: number) => vscode.Position;
    findFirstOccurCharAboveCursor: (chars: string[]) => string | undefined;
    getCursorPosition: () => vscode.Position | undefined;
    setCursorPosition: (pos: vscode.Position) => Promise<any>;
  };
  vim: {
    switchToInsertModeSelection: () => Thenable<void>;
  },
  fs: {
    getCurrentWorkspaceFolder: () => vscode.WorkspaceFolder | undefined;
    copyFileOrFolder: (source: string, target: string, option?: { overwrite: boolean }) => Thenable<void>;
    createNewFile: (filename: string, content: string, fsPath?: string) => Thenable<void>;
    createNewFolder: (name: string, fsPath?: string) => Thenable<void>; 
  },
  promise: {
    execCmd: ( payload: string | { command: string; args: object }) => Thenable<unknown>;
    execShell: (cmd: string, options: SpawnOptions & { hideOutput?: boolean }) => () => Thenable<void>;
    spawnShell: ( cmd: string, args?: string[] | undefined, option?: SpawnOptions | undefined) => Thenable<void>;
    typeCharUnderCursor: () => Thenable<void>;
    type: (text: string) => Thenable<void>;
    typeKeys: (texts: string[]) => Thenable<void>;
    writeText: (text: string) => Thenable<void>;
  };
  interactive: {
    confirm: ( title: string, placeHolder?: "Yes" | "No", options?: vscode.QuickPickOptions) => Promise<boolean>;
    input: ( prompt: string, placeHolder: string, options?: vscode.InputBoxOptions) => Promise<string>;
    dropdown: (title: string, items: string[], placeHolder: string, options?: vscode.QuickPickOptions) => Promise<string | undefined>;
    commandQuickpick: ( setting: QuickpickSetting) => Promise<void>;
  };
}
