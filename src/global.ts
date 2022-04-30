import { Configuration } from "./configuration";

export const Global = new class {
    public isTesting = false;
    public mockConfiguration: Configuration | undefined = undefined;
};