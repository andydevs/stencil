import { Uri, workspace } from 'vscode'
import { assertUri } from './helper'

const CONFIG_FILE = 'config.json'

/**
 * Possible values for input specs
 */
export type ConfigInputType = 'string' | string[]

/**
 * Config specification for template file
 */
export interface TemplateConfig {
    id: string
    name: string
    template: string
    output: string
    input: {
        [key: string]: ConfigInputType
    }
}

/**
 * Specification for config file
 */
export interface Config {
    files: {
        [key: string]: TemplateConfig
    }
}

/**
 * Read stencil config from file
 *
 * @param {Uri} stencilDir stencil directory uri
 *
 * @returns {Config} stencil config file
 */
export async function readConfigFile(stencilDir: Uri): Promise<Config> {
    // Verify config file
    console.log(`Looking for config file in stencil directory ${stencilDir} path ${CONFIG_FILE}`)
    let configFile = Uri.joinPath(stencilDir, CONFIG_FILE)
    await assertUri(configFile, `${CONFIG_FILE} not found in stencil directory!`)
    console.log('Found config file!')

    // Decode config file
    console.log('Decoding config file')
    let decoder = new TextDecoder('utf-8')
    let data = await workspace.fs.readFile(configFile)
    let text = decoder.decode(data)
    console.log('Decoded text from file', text)
    let config = JSON.parse(text)
    console.log('Parsed JSON data', config)

    // Return config data
    return config
}

/**
 * Get file options from stencil config
 *
 * @param config stencil config options
 *
 * @returns {{label: string, key: string}[]} list of file options for showQuickPick
 */
export function getFileOptions(config: Config): { label: string; key: string }[] {
    let options = Object.entries(config.files).map(([key, file]: [string, TemplateConfig]) => ({
        label: file.name,
        key,
    }))
    console.log('Read file options from config:', options)
    return options
}
