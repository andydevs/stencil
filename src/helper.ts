import { Uri, workspace } from 'vscode'

/**
 * Thrown when Stencil assertions failed
 */
class StencilAssertFailed extends Error {}

/**
 * Assert that the given URI exists
 *
 * @param {Uri} uri uri to check
 * @param {string} errmsg message to throw if uri is not found
 */
export async function assertUri(uri: Uri, errmsg: string = `URI ${uri.toString()} was not found!`): Promise<void> {
    try {
        console.log(`Attempt to stat uri ${uri}`)
        let results = await workspace.fs.stat(uri)
        console.log(`Stat uri ${uri} successful!`)
        console.log('Stat results', results)
    } catch {
        console.error(`Stat URI ${uri} failed!`)
        console.log('Display error message:', errmsg)
        throw new StencilAssertFailed(errmsg)
    }
}

/**
 * Assert that the given value is not undefined
 *
 * @param {T | undefined} value the value to check
 * @param {string} errmsg message to throw if value is undefined
 *
 * @returns {T} the value if it's defined
 */
export function assertDefined<T>(value: T | undefined, errmsg: string = `Object ${value} is undefined!`): T {
    console.log('Assert defined value. Current:', value)
    if (value === undefined) {
        console.error('Value is undefined!')
        console.log('Display error message:', errmsg)
        throw new StencilAssertFailed(errmsg)
    }
    console.log('Value is defined! Returning...')
    return value
}
