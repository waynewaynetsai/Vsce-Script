import { execCmd, invokeCommands, runMacro, spawnShell } from "../command";
import { copyFileOrFolder, getCurrentLine, getCurrentWorkspaceFolder, openProject, switchToInsertModeSelection } from "../editor";
import { confirm, dropdown, input } from "../interactive";
import { logger } from "../logger";
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { QuickpickCommandItem, QuickpickSetting } from "../models";
import { Instantiator } from "../instantiator";
import { CommandRegistry } from "./registry";
import { CommandTable } from "./table";
import { Library } from "../library";
import editJsonFile from "edit-json-file";
import { ScriptLoader } from "../loader";

// Dirty code here, take it easy!
export async function createProject() {
    // STEP0: if there is defined project or given path, check whether override original project path config or not?
    const existProjectPath = vscode.workspace.getConfiguration('vsce-script').get<string>('projectPath');
    console.log('existProjectPath', existProjectPath);
    if (existProjectPath && existProjectPath !== '') {
        const projectName = path.basename(existProjectPath);
        const ok = await confirm(`You have an exist script project (${projectName}), Open this project?`);
        if (ok) {
            const newWindow = await confirm('Open project in new window?');
            await openProject(existProjectPath, { newWindow });
            return;
        }
    }
    // STEP1: ask typescript or javascript
    const projectType: string | undefined = await dropdown('Create typescript or javascript project?', [
        'javascript',
        'typescript'
    ], { placeHolder: `Select your project's language` });
    if (!projectType)
        return;
    // STEP2: select folder
    const projectUris = await vscode.window.showOpenDialog({
        title: 'Select a folder to create extension project',
        openLabel: 'Create Project',
        canSelectFolders: true,
        canSelectFiles: false,
        defaultUri: vscode.workspace.workspaceFolders?.[0].uri
    });
    if (!projectUris)
        return;
    if (!projectUris?.[0])
        return;
    const projectName = await input('Input your project name', { placeHolder: 'Your project name' });
    if (!projectName || projectName === '') return;
    console.log('projectName', projectName);
    const projectPath = path.join(projectUris?.[0].fsPath, projectName);
    console.log('projectPath', projectPath);
    const isProjectExist = fs.existsSync(projectPath);
    if (isProjectExist) {
        const reuseProject = await confirm('Project is exist, Open this project?');
        if (reuseProject) {
            await invokeCommands([openProject(projectPath)]);
            return;
        }
    } else {
        vscode.workspace.getConfiguration('vsce-script')
            .update('projectPath', path.resolve(projectPath));
    }
    console.log('Step3', projectPath);
    // STEP3: generate project template/copy file or folder
    try {
        const lib = await Instantiator.container.getAsync<Library>(Library);
        const projectTemplatePath = path.join(__dirname, `template`, `version-${lib.version}`, `${projectType}`);
        console.log('projectTemplatePath', projectTemplatePath);
        await copyFileOrFolder(projectTemplatePath, projectPath, { overwrite: false });
    } catch (err) {
        logger.error(`Fail to create script project: ${JSON.stringify(err)}`);
        vscode.window.showErrorMessage(`Fail to create script project: ${JSON.stringify(err)}`);
        return;
    }
    const useNpm = await dropdown('Use yarn or npm ?', ['yarn', 'npm'], { placeHolder: 'npm' }) === 'npm';
    const newWindow = await confirm('Open project at new window?');
    invokeCommands([
        // STEP4: install project deps
        useNpm ? spawnShell(`npm`, ['install'], { cwd: projectPath }) : spawnShell(`yarn`, [], { cwd: projectPath }),
        // STEP5: open project folder
        openProject(projectPath, { newWindow })
    ]);
}

export async function selectAnotherScriptProject() {
    const projectUris = await vscode.window.showOpenDialog({
        title: 'Select another Vsce Script project',
        openLabel: 'Select Vsce Script project folder',
        canSelectFolders: true,
        canSelectFiles: false,
        defaultUri: vscode.workspace.workspaceFolders?.[0].uri
    });
    if (!projectUris)
        return;
    if (!projectUris?.[0])
        return;
    const projectPath = path.join(projectUris?.[0].fsPath);
    await vscode.workspace.getConfiguration('vsce-script')
        .update('projectPath', path.resolve(projectPath));
    await openScriptProject();
    const scriptLoader = await Instantiator.container.getAsync<ScriptLoader>(ScriptLoader);
    await scriptLoader.load();
}

export const openScriptProject = async () => {
    const existProjectPath = vscode.workspace.getConfiguration('vsce-script').get<string>('projectPath');
    if (existProjectPath) {
        const newWindow = await confirm('Open project in new window?');
        console.log('newWindow', newWindow);
        console.log('existProjectPath', existProjectPath);
        await openProject(existProjectPath, { newWindow })();
    } else {
        vscode.window.showInformationMessage('No project found! Please create a project first!');
    }
};

export const insertDeclaration: (...args: any[]) => any = (args) => {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor)
        return;
    try {
        const { inserting, replacing, type } = args;
        activeTextEditor.edit(editBuilder => {
            const replacingStart = new vscode.Position(replacing.start.line, replacing.start.character);
            const replacingEnd = new vscode.Position(replacing.end.line, replacing.end.character + type.length + 1);
            editBuilder.replace(new vscode.Range(replacingStart, replacingEnd), ';');
        }).then(_ => {
            activeTextEditor.insertSnippet(
                new vscode.SnippetString(type + " ${1:newLocal} = "),
                new vscode.Position(inserting.line, inserting.character)
            );
        });
    } catch (error) {
        console.error(error);
    }
};


export const addBracket = async (editor: vscode.TextEditor) => {
    const str = getCurrentLine(editor);
    const lastChar = str.charAt(str.length - 1);
    const hasWhitespace = lastChar === " ";
    const hasClosedParen = lastChar === ')';
    const hasOpenedParen = str.includes('(');
    if (hasWhitespace) {
        await runMacro(["{", "}", "<left>", "\n"]);
    } else if (!hasClosedParen && hasOpenedParen) {
        await runMacro([")", " ", "{", "}", "<left>", "\n"]);
    } else {
        await runMacro([" ", "{", "}", "<left>", "\n"]);
    }
};

export const surroundWith = async (cmd: string) => {
    await invokeCommands([
        switchToInsertModeSelection,
        execCmd(cmd ?? "surround.with")
    ]);
};

export const visualModeYank = async () => {
    await runMacro(['<Esc>', 'm', 'y', 'y', '`', 'y']);
};

export const rerunLastCommand = async () => {
    const commandRegistry = await Instantiator.container.getAsync<CommandRegistry>(CommandRegistry);
    const latestCommandInfos = commandRegistry.lastExecutedCommands;
    if (latestCommandInfos?.[0].command === 'vsce-script.showAllCommands' && latestCommandInfos?.[1]) {
        await vscode.commands.executeCommand(latestCommandInfos[1].command, ...latestCommandInfos[1].args);
    } else if (latestCommandInfos?.[0]) {
        await vscode.commands.executeCommand(latestCommandInfos[0].command, ...latestCommandInfos[0].args);
    } else {
        vscode.window.showErrorMessage('Has no last command!');
    }
};

export const showAllCommands = (table: CommandTable) => async (namespaces: string[] = []) => {
    const commandIds = Object.keys(table.getAll());
    const displayCommandIds = namespaces.length > 0 ? commandIds.filter(k => namespaces.some(n => k.includes(`.${n}.`))) : commandIds;
    const commandId = await dropdown('Show all commands', displayCommandIds);
    if (commandId && commandId !== '') {
        await vscode.commands.executeCommand(commandId);
    }
};

export const copyRegisteredCommandId = (table: CommandTable) => async () => {
    const commandIds = Object.keys(table.getAll());
    const commandId = await dropdown('Show all commands', commandIds);
    if (commandId && commandId !== '') {
        await vscode.env.clipboard.writeText(commandId);
        vscode.window.showInformationMessage(`Copy commandId: ${commandId}!`);
    }
};

export const commandQuickpick = async (setting: QuickpickSetting) => {
    const items: QuickpickCommandItem[] = setting.items.map(originalSetting => ({
        ...originalSetting,
        description: `$(gear)command:${originalSetting.command}`,
    }));
    const selected = await vscode.window.showQuickPick(items, {
        title: setting.title,
        matchOnDescription: true
    });
    if (!selected)
        return;
    await vscode.commands.executeCommand(selected.command!, selected.args!);
};

export const upgradeLibraryToLatestVersion = async () => {
    const projectPath = await vscode.workspace.getConfiguration('vsce-script').get<string>('projectPath');
    if (!projectPath) return;
    const library = await Instantiator.container.getAsync<Library>(Library);
    const libraryTypingsPath = path.resolve(projectPath, 'typings', 'library.d.ts');
    await copyFileOrFolder(libraryTypingsPath, `./template/version/version-${library.version}/typings/library.d.ts`, { overwrite: true });
    const file = editJsonFile(path.join(projectPath, 'package.json'));
    file.set('version', library.version);
    file.save();
};