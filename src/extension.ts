import * as vscode from 'vscode'
import ejs from 'ejs'

async function getStencil() {
    // Get workspace directory
    let workspaceDirs = vscode.workspace.workspaceFolders
    if (workspaceDirs === undefined) {
        throw new Error('No workspace open!')
    }
    let workspaceDir = workspaceDirs[0]

    // Get stencil directory
    let stencilDir = vscode.Uri.joinPath(workspaceDir.uri, '.stencil')
    try {
        await vscode.workspace.fs.stat(stencilDir)
    } catch {
        throw new Error('.stencil directory not found in workspace!')
    }

    // Get config file
    let configFile = vscode.Uri.joinPath(stencilDir, 'config.json')
    try {
        await vscode.workspace.fs.stat(configFile)
    } catch {
        throw new Error('config.json not found in stencil directory!')
    }

    // Decode config file
    let decoder = new TextDecoder('utf-8')
    let configData = await vscode.workspace.fs.readFile(configFile)
    let config = JSON.parse(decoder.decode(configData))

    // Return stencil
    return {
        uri: stencilDir,
        workspace: workspaceDir.uri,
        config,
    }
}

async function createStencilFile() {
    let stencil = await getStencil()

    // Get file from user
    let files = Object.entries(stencil.config.files).map(([key, file]: [string, any]) => ({ label: file.name, key }))
    let fileItem = await vscode.window.showQuickPick(files)
    if (fileItem === undefined) {
        throw new Error(`File input is undefined!`)
    }
    let file = stencil.config.files[fileItem.key]

    // Get inputs
    let inputs = Object.entries(file.input)
    let values: { [k: string]: any } = {}
    for (let [key, input] of inputs) {
        let value = undefined
        if (input === 'string') {
            value = await vscode.window.showInputBox({ placeHolder: `Value for ${key}` })
        } else if (Array.isArray(input)) {
            value = await vscode.window.showQuickPick(input, { placeHolder: `Value for ${key}` })
        }
        values[key] = value
    }

    // Read file template
    let decoder = new TextDecoder('utf-8')
    let fileUri = vscode.Uri.joinPath(stencil.uri, 'templates', file.template)
    let fileData = await vscode.workspace.fs.readFile(fileUri)
    let template = ejs.compile(decoder.decode(fileData))

    // Get output
    let output = template(values)

    // Write file to workspace
    let encoder = new TextEncoder()
    let outputUri = vscode.Uri.joinPath(stencil.workspace, file.output)
    let outputData = encoder.encode(output)
    await vscode.workspace.fs.writeFile(outputUri, outputData)
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "stencil" is now active!')

    const createFile = vscode.commands.registerCommand('stencil.createFile', async () => {
        try {
            await createStencilFile()
        } catch (error) {
            vscode.window.showErrorMessage(`${error}`)
        }
    })

    context.subscriptions.push(createFile)
}

export function deactivate() {}
