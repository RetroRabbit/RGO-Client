export interface Properties {
    id: number,
    condition: number,
    internal: boolean,
    propName: string,
    label: string,
    type: string,
    description: string | null,
    regex: string | null,
    options: string[],
    value: string | number
}