import * as vsc from 'vscode';
import { LibraryApi as Library } from './library';

declare global {
    namespace NodeJS {
        interface Global {
            vscode: typeof vsc;
            lib: Library;
        }
    }
}