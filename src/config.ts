export enum WorkspaceConfig {
    ProjectPath = 'vsce-script.projectPath',
    CommandPrefix = 'vsce-script.commandPrefix'
}

export const defaultContributionCommands = [
    {
        "title": "Vsce Script: Reload Script",
        "command": "vsce-script.reloadScript"
    },
    {
        "title": "Vsce Script: Open Script Project",
        "command": "vsce-script.openProject"
    },
    {
        "title": "Vsce Script: Create Script Project",
        "command": "vsce-script.createProject"
    }
];