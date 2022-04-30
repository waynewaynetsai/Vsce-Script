import { CommandRegistry } from "../../registry";
import { getLib as getLibV100 } from "./version-1.0.0";

export const getLibs = {
    ['1.0.0']: getLibV100,
};