export interface EnvInterface {
    api_rate_limit: number,
    api_burst_limit: number,
}

export const PROD: EnvInterface = {
    api_rate_limit: 50,
    api_burst_limit: 25,
}

export const BETA: EnvInterface = {
    api_rate_limit: 2,
    api_burst_limit: 2,
}