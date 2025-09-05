import * as vscode from 'vscode'
import { createStencilFile } from './file'

/**
 * Try to execute the given function async. If an error occurred,
 * display it as a message to user
 *
 * @param commandFunc function being executed on the given command
 */
async function asyncTryCommandFunction(commandFunc: () => Promise<void>): Promise<void> {
    try {
        console.log('Try executing function with await call')
        await commandFunc()
    } catch (error) {
        console.error('Error occured:', error)
        let errorMessage = `${error}`
        console.log('Display message to user:', errorMessage)
        vscode.window.showErrorMessage(errorMessage)
    }
}

/**
 * Activate VSCode extension
 *
 * @param context VSCode extension context
 */
export function activate(context: vscode.ExtensionContext) {
    // Register create file command
    const createFile = vscode.commands.registerCommand('stencil.createFile', async () => {
        console.log('stencil.createFile command started')
        asyncTryCommandFunction(createStencilFile)
    })

    // Add command subscriptions
    context.subscriptions.push(createFile)
    console.log('Extension "stencil" is now active!')
}

/**
 * Deactivate VSCode extension
 */
export function deactivate() {}
