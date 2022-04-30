import * as vsc from 'vscode';
import { LibraryApi } from './library';

declare global {
    const __webpack_require__: any;
    const __non_webpack_require__: any;
    namespace NodeJS {
        interface Global {
            vscode: typeof vsc;
            lib: LibraryApi;
        }
    }
}
