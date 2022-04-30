import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function isTsProject() {
    const existProjectPath = vscode.workspace.getConfiguration('vsce-script').get<string>('projectPath');
    if (!existProjectPath || existProjectPath === '') return false;
    const tsConfigPath = path.join(existProjectPath, 'tsconfig.json');
    return fs.existsSync(tsConfigPath);
}