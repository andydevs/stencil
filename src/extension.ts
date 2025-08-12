import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "stencil" is now active!')

    const createFile = vscode.commands.registerCommand(
        'stencil.createFile',
        () => {
            vscode.window.showInformationMessage("We're gonna create a file")
        }
    )

    context.subscriptions.push(createFile)
}

export function deactivate() {}
