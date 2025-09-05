import { window } from 'vscode'
import { ConfigInputType, TemplateConfig } from './config'

/**
 * Possible types of input
 */
export enum InputType {
    Text,
    Options,
}

/**
 * Options type for the "Options" input
 * List of possible choices
 */
export type OptionsOptions = string[]

/**
 * All possible input types
 */
export type InputOptions = OptionsOptions

/**
 * Input specification
 */
export interface InputSpec {
    key: string
    type: InputType
    options?: InputOptions
}

/**
 * Get input specs from template
 *
 * @param template template config to get inputs for
 *
 * @returns list of input specs
 */
export function inputSpecsFromTemplate(template: TemplateConfig): InputSpec[] {
    return Object.entries(template.input).map(([key, input]: [string, ConfigInputType]) => {
        console.log('Parsing input key', key, 'Input value', input)
        if (Array.isArray(input)) {
            console.log('Input is', InputType.Options)
            return { key, type: InputType.Options, options: input }
        } else {
            console.log('Defer to', InputType.Text)
            return { key, type: InputType.Text }
        }
    })
}

/**
 * Get input from user
 *
 * @param input input spec for the given input
 *
 * @returns input from user
 */
export async function getInputFromUser(input: InputSpec): Promise<string | undefined> {
    console.log('Parse input spec:', input)
    switch (input.type) {
        case InputType.Options:
            console.log('Showing quick pick with options', input.options)
            return window.showQuickPick(input.options as OptionsOptions, {
                placeHolder: `Value for ${input.key}`,
            })
        case InputType.Text:
            console.log('Showing text box')
            return window.showInputBox({ placeHolder: `Value for ${input.key}` })
        default:
            console.log("Undefined input spec... This shouldn't happen!")
            return Promise.resolve(undefined)
    }
}
