import * as vscode from 'vscode';


export async function dropdown(title: string, items: string[], options: vscode.QuickPickOptions = {}) {
    return await vscode.window.showQuickPick(items, {
        canPickMany: false,
        title,
        ...options
    });
}

export async function input(prompt: string, options: vscode.InputBoxOptions = {}) {
    return (await vscode.window.showInputBox({
        prompt,
        ...options
    })) || '';
}

export async function confirm(title: string, placeHolder: 'Yes' | 'No' = 'Yes', options: vscode.QuickPickOptions = {}) {
    return await vscode.window.showQuickPick(['Yes', 'No'], {
        title,
        canPickMany: false,
        placeHolder,
        ...options
    }).then(answer => answer === 'Yes');
}