<h2 align="center"><img src="https://i.imgur.com/3wYl1EU.png" height="128"><br>Vsce Script</h2>
<p align="center"><strong>Extension runtime with automation api for VS Code and Vim extension</strong></p>

Vsce Script is a VS Code extension runtime with automation api for [VS Code](https://code.visualstudio.com/) and [Vim](https://github.com/VSCodeVim/Vim) extension.

Vsce Script provide VS Code API and Library for creating smoothly operation at VS Code. You can simply create or open an Vsce Script project, then load it immediately at VS Code.

A Vsce Script project is a typescript or javascript project which can be dynamic loaded by Vsce-Script extension.

Since Vsce Script extension inject VS Code api and it's library at global, you can write some script for control your VS Code, extend your vim command or doing something then executing it immediately.

With those API, user can do many of automating operations more than traditional Vim Macro.

## Main Feature

Here are some of the features that Vsce Script provides

1. Open, create, and execute your extension project with javascript and typescript at vscode immediately.
* We inject VS Code API at global for vsce-script extension project.
* You can also install third-party npm package at extension project then execute it at vscode immediately.
2. Commands for search registered command at script project, you can execute or copied their command ID easily.
3. Custom library api for automating your VS Code command and shell command.
4. Custom library api for creating readable, editable and reusable macro for vim's operation.


### Make Open Source Community Better!

Since vsce-script can use as an extension playground, you can fulfill your idea with it quickly. If your some of functionality that can be extract to a standalone extension. you can migrate it to a new extension package and publish it quickly. If you found some idea that can be implement for exist extensions, welcome to submit your pull request for them.

### Requirements

You need to install [nodejs](https://nodejs.org/en/) and npm on your computer. If you want to use [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) to manage your project's package, please install it first.


## Get Started

1. Create your project

We provide a `vsce-script.createProject` command for creating vsce-script template project.

You can find and execute this command at command palette (Command Palette Shortcut - MacOS: `cmd+shift+p`, Windows/Linux: ctrl+shift+p).

![](https://i.imgur.com/DXdWapL.png)

After executing this command, you need to select your project languages first, we recommend you to select **typescript**.

![](https://i.imgur.com/N7fo0fY.png)

After selecting project's language, select a location of your project's directory, then click **Create Project** button.

![](https://i.imgur.com/9GqLxnM.png)

At last step, please provide your custom project name.

![](https://i.imgur.com/ylK0y43.png)

After providing your project name (please don't provide empty string), we will creating a project at background.

You can choose use `npm` or `yarn` package for installing your packages.

Finally, you can open your script project at a new VS Code window or open it at current editor.

![](https://i.imgur.com/r15iUXR.png)

After you creating a project, you can use `vsce-script.openProject` command for opening it.

2. Write, compile and load your vsce-script-project!

A Vsce Script project is a nodejs project which exports activate and deactivate function on their entry point file (extension.js).

![](https://i.imgur.com/9b7qJgO.png)

Since Vsce Script Extension injects VS Code api and lib at project's global.
You can use them conveniently at Vsce Script project.

When you write down your script, just execute `Vsce Script: Load Script Project` on command palette.

If your project is written by typescript, extension will ask you whether compile typescript or not.

After compiling it, extension will load your project's `extension.js` file.

You can see registered commands by executing `Vsce Script: Show All Commands` on command palette.

3. Execute your commands 

Select and execute `vsce-script.showAllCommands` at command palette.

![](https://i.imgur.com/igTQLGr.png)

You will see all commands which are registered from library's registerCommand api.

![](https://i.imgur.com/adWxBVR.png)

You can execute those commands with selecting menu item. 

![](https://i.imgur.com/1LO3RcP.png)

And see the result immediately.

![](https://i.imgur.com/YNCpaMA.png)


If you just want to copy those command's id, you can use `vsce-script.copyRegisteredCommandId` command.

![](https://i.imgur.com/DkshJgg.png)

Then copy selected commandId from the menu.

## Showcases


### Run Automation Task

1. Execute Shell Command (execShell) and VS Code Command (execCmd) One by One

```
// Import vscode typings
import * as vsc from 'vscode';

// Injected vscode api module at global
const { window } = vscode;

const {
    commands: { registerCommand },
    automation: { execCmd, execShell, runAutomation }
} = lib;

export function activate(context: vsc.ExtensionContext) {
    ...
    registerCommand('vsce-script.startup.frontend', async () => {
        window.showInformationMessage(`Opening apps for frontend project!`);
        // VS Code's built-in commandId for execCmd function
        const createTerminal = 'workbench.action.terminal.new';
        const openPostman_MacOS = 'open -a Postman';
        const openChrome_MacOS = 'open -a "Google Chrome" https://localhost:3000';
        await runAutomation(
            execShell(openPostman_MacOS),
            execCmd(createTerminal),
            () => {
                const terminal = vscode.window.activeTerminal;
                terminal?.sendText('yarn serve');
                return Promise.resolve();
            },
            execShell(openChrome_MacOS, { hideOutput: true }),
        );
    });
    ...
}
```

2. Manage npm package and install them easily

As a frontend developer, we often install lots of npm packages at our project. 
It takes a lot of effort to reinstall it at a new project. Now with Vsce-Script, you can easily define your custom `addDeps` command for install them.

- `deps.ts`

For managing those config easily, we can extract those complex npm packages's config to `deps.ts`.

```
const tsDeps = ['typescript', 'ts-loader', 'ts-node'];

const webpack = ['webpack', 'webpack-cli'];

const webpackLoader = [
    'file-loader',
    'url-loader',
    'html-loader',
    'null-loader',
    'style-loader',
    'imports-loader',
    'url-loader',
    'svg-url-loader',
    'css-loader'
];

const webpackPlugin = [
    'copy-webpack-plugin',
    'add-asset-html-webpack-plugin',
    'circular-dependency-plugin',
    'compression-webpack-plugin',
    'offline-plugin',
    'terser-webpack-plugin'
];

const jest = ['jest@27.4.7', 'ts-jest@27.1.3'];

const reactCommonPackages = [
    'react-redux@7.0.2',
    'redux@4.0.1',
    'prop-types@15.7.2',
    'react-router-dom@5.0.0',
    'redux-saga@1.0.2',
    'style-components@4.2.0',
    'immer@9.0.6'
];

const babel = ['@babel/core', 'babel-loader', '@babel/preset-env'];

const babelProdDeps = ['@babel/polyfill'];

const babelPlugins = [
    '@babel/runtime',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-react-inline-elements',
    '@babel/preset-react',
    '@babel/register',
];

const mocha = ['mocha'];

export const devDeps = {
    tsDeps,
    webpack,
    webpackLoader,
    webpackPlugin,
    jest,
    mocha,
    reactCommonPackages,
    babel,
    babelProdDeps,
    babelPlugins,
};

export const deps = {
    babelProdDeps
};
```

- `extension.ts`

At `extension.ts`, we can define a custom command `vsce-script.yarn.addDeps` for installing packages.
Since our library provide some interactive utilities such as dropdown and confirm.
You can reduce your extension development time with those scenario.  

``` 
...
// Import vscode typings
import * as vsc from 'vscode';

import { deps, devDeps } from './deps';

const {
    commands: { registerCommand },
    promise: { execShell },
    interactive: { dropdown }
} = lib;

export function activate(context: vsc.ExtensionContext) {
    ...
    registerCommand('vsce-script.yarn.addDeps', async () => {
        const depItems = [...Object.keys(devDeps), ...Object.keys(deps)];
        const item = await dropdown('Install Deps', depItems);
        if (!item) return;
        if (deps[item]) {
            await execShell(`yarn add ${deps[item].join(' ')}`);           
        } else if (devDeps[item]){
            const depsPackages = devDeps[item].join(' ');
            await execShell(`yarn add -D ${depsPackages}`);
        }
    });
    ...
}
```

After writing this command and reload project, you can easily select and install groups of your dependencies. 

![addDeps](https://media.giphy.com/media/CdqRDx7GAkXzdOtKiC/giphy.gif)


3. Readable, editable and reusable macro for Vim's operation

Imagine there's a vim operation for selecting a function or any kinds of block.

You might create a macro to make this operation easier.

At VSCodeVim's `.vimrc`, we can define a custom keybindings `vak` for select it.

```
xmap ak <Esc>V$%$h
```

![vak](https://media.giphy.com/media/BNcffpGPQN4XeueKDG/giphy.gif)

But it's hard to read and understand.

With javascript, we can write a editable and reusable macro with below example:

```js=
...

const {
    commands: { registerCommand },
    automation: { runMacro }
} = lib;

export function activate(context: vsc.ExtensionContext) {
    ...
    registerCommand('vsce-script.vim.selectEntireBlock', async () => {
        const enterNormalMode = '<Esc>';
        const enterVisualLineMode = 'V';
        const moveCursorToLineEnd = '$';
        const selectMatchedBracket = '%';
        const adjustCursorPosition = '$h';
        await runMacro([
            enterNormalMode,
            enterVisualLineMode,
            moveCursorToLineEnd,
            selectMatchedBracket,
            adjustCursorPosition
        ]);
    });
    ...
}
```

Then you can apply this command to `.vimrc`.

```
xmap ak vsce-script.vim.selectFunctionBlock
```

> P.S. At VSCodeVim v1.23.0, we can not edit vim's macro. All recorded macro will lost after reloading VS Code.

4. Dynamic macro with vim extension

- Custom operation for VSCodeVim's Vim-surround plugin (Delete Surround)

```
...
const {
    commands: { registerCommand },
    automation: { runMacro },
    editor: { getCharUnderCursor },
} = lib;

export function activate(context: vsc.ExtensionContext) {
    ...
    registerCommand('vsce-script.vim.deleteSurround', async () => {
        const charUnderCursor = getCharUnderCursor();
        if (!charUnderCursor) return;
        await runMacro(['<plugds>', charUnderCursor]);
    });
    ...
}
```

Consider edge cases for html and xml tags:

```
const {
    ...
    interactive: { confirm }
} = lib;

export function activate(context: vsc.ExtensionContext) {
    ...
    registerCommand('vsce-script.vim.deleteSurround', async () => {
        const charUnderCursor = getCharUnderCursor();
        if (!charUnderCursor) return;
        if (['<', '>'].includes(charUnderCursor)) {
            const removeXmlTag = await confirm('Remove xml tag?');
            const typeCommand = removeXmlTag ? 't' : '>';
            await runMacro(['<plugds>', typeCommand]);
        } else {
            await runMacro(['<plugds>', charUnderCursor]);
        }
    });
    ...
}
```

After that, we can bind this command at VSCodeVim's `.vimrc`.

```
nmap da vsce-script.vim.deleteSurround
```

![da](https://media.giphy.com/media/HNqBFKuuHq3kHk6hAP/giphy.gif)

- Custom operation for VSCodeVim's Vim-surround plugin (Change Surround)

```
...
const {
    commands: { registerCommand },
    automation: { runMacro },
    editor: { getCharUnderCursor },
    interactive: { confirm }
} = lib;

export function activate(context: vsc.ExtensionContext) {
    ...
    const charUnderCursor = getCharUnderCursor();
        if (!charUnderCursor) return;
        if (['<', '>'].includes(charUnderCursor)) {
            const removeXmlTag = await confirm('Remove xml tag?');
            const typeCommand = removeXmlTag ? 't' : '>';
            await runMacro(['<plugcs>', typeCommand]);
        } else {
            await runMacro(['<plugcs>', charUnderCursor]);
        }
    ...
}
```

After that, we can bind this command at VSCodeVim's `.vimrc`.

```
nmap ca vsce-script.vim.changeSurround
```

![ca](https://media.giphy.com/media/UmJ3FyKoto9nVspAW6/giphy.gif)

5. Integrate [Surround](https://marketplace.visualstudio.com/items?itemName=yatki.vscode-surround) extension with VSCodeVim (Workaround insertSnippet problem at VSCodeVim v0.1.23)

There's an VSCodeVim's [issue](https://github.com/VSCodeVim/Vim/issues/6772) with VS Code's `insertSnippet` command. Currently we can use custom `switchToInsertModeSelection` to force VS Code switch and keep visual mode selection at insert mode. 

When we execute any commands with `insertSnippet` command at Vim's insert mode, everything works well.

Below is an example for creating custom command for Surround extension.

```
...

const {
    commands: { registerCommand },
    vim: { switchToInsertModeSelection }
} = lib;

export function activate(context: vsc.ExtensionContext) {
    ...
    registerCommand('vsce-script.vim.surroundWith', async () => {
        await switchToInsertModeSelection();
        vscode.commands.executeCommand('surround.with');
    });
    ...
}
```

After defining this command, you can easily rebind this command at VSCodeVim's visualModeKeybindings.

```
xmap <leader>s vsce-script.vim.surroundWith
```



6. Disable specific extensions at new window

Here's an VS Code's unsolved issue for enable/disable specific extension from API or commands.

See: [How to enable / disable extension from API or commands](https://github.com/microsoft/vscode/issues/15466)

Here's a scenario of disabling specific extensions.

Imagine we have a frontend project with react snippet, it will jump snippet completion at any kinds of typescript project at VS Code.

When we are developing NodeJS project, we might be bothered with unused react snippet.

Since VS Code provide an undocument options for disabling extension with `code` command for trobleshooting.

If we want to disable an extension, we can use below command for disable an extension.

```
code --disable-extension <ext-id>
```

However, disabled command only works with VS Code's window which is opened from that code command.

So we need to invoke this command for disabling a set of extensions before opening our project every time.

With Vsce Script, we can create below utility function for making this command and it's options more easier.

```
// On macOS, first time you need to run `install Code command` at vscode manually  
// Limitation: you need to reopen VS Code with this function for disabling extensions
async function reopenForDisablingExtensions(reopenWorkspacePath: string, extensions: string[]) {
    const disableExtensions = extensions.map(extId => `--disable-extension ${extId}`).join(' ');
    const codeCommand = `code ${disableExtensions} -n ${reopenWorkspacePath}`;
    const closeWindow = `workbench.action.closeWindow`;
    await runAutomation(
        execShell(codeCommand),
        execCmd(closeWindow)
    );
}
```

Then we can use this function with our custom command.

```
registerCommand('vsce-script.workspace.disableReactExtensions', async () => {
    const workspace = await getCurrentWorkspaceFolder();
    if (!workspace) return;
    const workspacePath = workspace.uri.fsPath ?? '.');
    const reactExtensions = [
        'dsznajder.es7-react-js-snippets',
        'discountry.react-redux-react-router-snippets'
    ];
    await reopenForDisablingExtensions(workspacePath, disableExtensions);
});
```



## Library API
---

### Automation

| Function            |  Type Signature                                 |
| ------------------- | -------------------------------------------     |
| type                | (typeText: string) => () => Thenable\<void\>;     |
| typeKeys            | (typeTexts: string[]) => () => Thenable\<void\>;  |
| typeCharUnderCursor | () => Thenable\<void\>;                           |
| writeText           | (text: string) => () => Thenable\<void\>;         |
| execCmd             | \<T = unknown\>( cmd: string \| { command: string; args: object }) => () => Thenable\<T\>; |  
| execShell           | (cmd: string) => () => Thenable\<void\>;          |
| spawnShell          | ( cmd: string, args?: string[], option?: SpawnOptions) => () => Thenable\<void\>; |                        
| runMacro            | (typeTexts: string[]) => Thenable\<void\>;        |
| runCommands         | (...args: any[]) => Thenable\<void\>;             |
| runAutomation       | ( ...commands: CommandPayload[]) => Thenable\<void\>;  |

### Commands

| Function            |  Type Signature                                                |
| ------------------- | -------------------------------------------------------------  |
| registerCommand     | ( commandId: string, handler: (...args: any) => any) => void;  |
| invokeCommands      | (typeTexts: string[]) => () => Thenable\<void\>;                 |

### Promise

| Function            |  Type Signature                           |
| ------------------- | ----------------------------------------- |
| type                | (typeText: string) => Thenable\<void\>;     |
| typeKeys            | (typeTexts: string[]) => Thenable\<void\>;  |
| typeCharUnderCursor | () => Thenable\<void\>;                     |
| writeText           | (text: string) => Thenable\<void\>;         |
| execCmd             | <T = unknown>( cmd: string \| { command: string; args: object }) =>  Thenable\<T\>; |  
| execShell           | (cmd: string) => Thenable\<void\>;          |
| spawnShell          | ( cmd: string, args?: string[], option?: SpawnOptions) => () => Thenable\<void\>; |                        

### Editor

| Function                      |  Type Signature                                 |
| ----------------------------- | -------------------------------------------     |
| getLine                       | (lineNumber: number) => string \| undefined;     |
| getCurrentLine                | (editor: vscode.TextEditor) => string;          |
| getSelectedText               | () => string \| undefined;                       |
| getCharUnderCursor            | () => string \| undefined;                       |
| findFirstOccurCharAtLine      | ( chars: string[], line: number, start: number) => string \| undefined;                      |
| findFirstOccurCharAboveCursor | (chars: string[]) => string \| undefined;        |
| getCursorPosition             | () => vscode.Position \| undefined;              |
| setCursorPosition             | (pos: vscode.Position) => Promise\<any\>;        |
| getFirstCharOnLine            | ( document: vscode.TextDocument, line: number) => vscode.Position;    |
| getCharAt                     | ( document: vscode.TextDocument, position: vscode.Position) => string;         |

### Vim

| Function            |  Type Signature                           |
| ------------------- | ----------------------------------------- |
| switchToInsertModeSelection  | () => Promise\<boolean\>;     |

### fs

| getCurrentWorkspaceFolder     | () => Promise\<vsc.WorkspaceFolder | undefined\>;|
| copyFileOrFolder            | (source: string, target: string, option?: { overwrite: boolean; }) => Thenable<void> | 

### Interactive

| Function            |  Type Signature                           |
| ------------------- | ----------------------------------------- |
| confirm             | ( title: string, placeHolder?: "Yes" \| "No", options?: vscode.QuickPickOptions) => Promise\<boolean\>;     |
| input               | ( prompt: string, placeHolder: string, options?: vscode.InputBoxOptions) => Promise\<string\>;  |
| dropdown            | ( title: string, items: string[], placeHolder: string, options?: vscode.QuickPickOptions) => Promise\<string | undefined>\;                     |
| commandQuickpick    | ( setting: QuickpickSetting) => Promise\<void\>;     |


## Built-In User-Facing Commands
---


| Name                       | Type    |  Command(s)                                |
| -------------------------- | ------- | ------------------------------------------ |
| Open Project               | command |  `vsce-script.openProject`                 |
| Create Script Project      | command |  `vsce-script.createProject`               |
| Select Another Script Project | command |  `vsce-script.selectAnotherScriptProject` |
| Show All Commands          | command |  `vsce-script.showAllCommands`             |
| Copy Registered Command ID | command |  `vsce-script.copyRegisteredCommandId`     |
| Rerun Last Command         | command |  `vsce-script.rerunLastCommand`            |


### Built-in Interactive Commands

| Name                            |  Command(s)                                    | Arguments        |  Description    |
| ------------------------------- | ---------------------------------------------- | ---------------- |-----------------|
| Command Quick Pick Menu         |  `vsce-script.interactive.commandQuickPick`    | QuickpickSetting |  Display a dropdown menu with commands      |

* QuickpickSettings Type Definition

```
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
```

# Contributing

Contributions are greatly appreciated. Please fork the repository and submit a pull request.
