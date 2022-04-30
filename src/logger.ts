import * as vscode from 'vscode';

class LoggerChannel {

    private _channel: vscode.OutputChannel | undefined;

    public get instance() {
        return this._channel;
    }

    constructor() {
        this._channel = vscode.window.createOutputChannel('Vsce Script');
    }

    public log(msg: string) {
        this._channel?.appendLine(msg);    
        return this;
    }

    public info(msg: string) {
        this._channel?.appendLine(`[Info] ${msg}`);
        return this;
    }

    public debug(msg: string) {
        this._channel?.appendLine(`[Debug] ${msg}`);
        return this;
    }

    public error(msg: string) {
        this._channel?.appendLine(`[Error] ${msg}`);
        return this;
    }

    public show() {
        this._channel?.show();
    }

    public dispose() {
        this._channel?.dispose();
    }

}

export const logger = new LoggerChannel();