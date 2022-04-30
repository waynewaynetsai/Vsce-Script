import * as vsc from 'vscode';
import { LibraryApi as Library } from './library';

declare global {
    const vscode: typeof vsc;
    const lib: Library;
}