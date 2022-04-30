/** @typedef {import('vscode')} vsc */

// Entire module 'vscode' which contains the VS Code extensibility API
const { window } = vscode;
// Vsce-Script extension library
const {
    commands: {
        registerCommand,
    }
} = lib;

/**
 * @param {import('vscode').ExtensionContext} context
 */
async function activate(context) {
    window.showInformationMessage(`activate vsce-script: ${context.extension.packageJSON.version}`);
    registerCommand('vsce-script.hello world', () => {
        window.showInformationMessage('Hello Vsce-Script');
    });
}

async function deactivate() { }

modules.export = { activate, deactivate };