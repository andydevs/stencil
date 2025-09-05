import { Config, readConfigFile } from './config'
import { assertDefined, assertUri } from './helper'
import { Uri, workspace } from 'vscode'

const STENCIL_DIR = '.stencil'

interface Stencil {
    stencilDir: Uri
    workspace: Uri
    config: Config
}

/**
 * Get current stencil instance from workspace
 *
 * @returns Stencil instance from workspace
 */
export async function getStencil(): Promise<Stencil> {
    // Get workspace directory (error if no workspace is open)
    console.log('Assert workspace defined')
    let workspaceDirs = assertDefined(workspace.workspaceFolders, 'No Workspace open!')
    console.log('Found workspaces', workspaceDirs)
    console.log('Get first workspace')
    let workspaceDir = workspaceDirs[0]
    console.log('Workspace:', workspaceDir)

    // Verify stencil directory
    console.log(`Get setncil directory in workspace ${workspaceDir.uri} directory ${STENCIL_DIR}`)
    let stencilDir = Uri.joinPath(workspaceDir.uri, STENCIL_DIR)
    await assertUri(stencilDir, `${STENCIL_DIR} directory not found in workspace!`)
    console.log('Stencil directory defined!')

    // Decode config file
    let config = await readConfigFile(stencilDir)

    // Return stencil
    return {
        stencilDir,
        workspace: workspaceDir.uri,
        config,
    }
}
