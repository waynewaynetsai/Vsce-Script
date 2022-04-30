import { inject, provide } from 'injection';
import * as vscode from 'vscode';
import { Instance } from '../instance';
import { getLibs } from './versions';

@provide()
export class Library {

    @inject(Instance.ExtensionContext)
    public context: vscode.ExtensionContext;

    public get versions() {
       return [
           '1.0.0'
       ];
    }

    public get version(): string {
        return '1.0.0';
    };

    public async getLatestLib() {
        return await getLibs[this.version]();
    }

    public async getLib(version: string) {
        return await getLibs[version]();
    }
}