import * as vscode from 'vscode'
import ejs from 'ejs'
import { getStencil } from './stencil'
import { assertDefined } from './helper'
import { getInputFromUser, inputSpecsFromTemplate } from './input'
import { getFileOptions } from './config'

/**
 * Create a single file from a stencil template
 */
export async function createStencilFile() {
    // Get stencil
    console.log('Get stencil')
    let stencil = await getStencil()

    // Get file from user
    console.log('Get file options')
    let files = getFileOptions(stencil.config)
    console.log('Get file item from user. Options:', files)
    let fileItem = await vscode.window.showQuickPick(files)
    fileItem = assertDefined(fileItem, `File input is undefined!`)
    console.log('Specified file item:', fileItem)
    let file = stencil.config.files[fileItem.key]
    console.log('Full file:', file)

    // Get inputs
    let values: { [k: string]: string | undefined } = {}
    for (let spec of inputSpecsFromTemplate(file)) {
        values[spec.key] = await getInputFromUser(spec)
    }
    console.log('Parsed values', values)

    // Read file template
    console.log('Read file template:')
    let decoder = new TextDecoder('utf-8')
    let fileUri = vscode.Uri.joinPath(stencil.stencilDir, 'templates', file.template)
    console.log(`Template file uri: ${fileUri}`)
    let fileData = await vscode.workspace.fs.readFile(fileUri)
    let fileText = decoder.decode(fileData)
    console.log('File template text:', fileText)
    let template = ejs.compile(fileText)

    // Get output
    let output = template(values)
    console.log('Output file text:', output)

    // Write file to workspace
    let outputUri = vscode.Uri.joinPath(stencil.workspace, file.output)
    console.log(`Write output to path: ${outputUri}`)
    let encoder = new TextEncoder()
    let outputData = encoder.encode(output)
    await vscode.workspace.fs.writeFile(outputUri, outputData)
    console.log('Write successful!')

    // Display message to user
    console.log('Display message to user')
    vscode.window.showInformationMessage(`File *${file.output}* was created!`)
}
