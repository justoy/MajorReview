export interface EnvInterface {
    api_rate_limit: number,
    api_burst_limit: number,
    get_rate_limit: number,
    get_burst_limit: number,
    post_rate_limit: number,
    post_burst_limit: number,
}

export const PROD: EnvInterface = {
    api_rate_limit: 20,
    api_burst_limit: 5,
    get_rate_limit: 20,
    get_burst_limit: 5,
    post_rate_limit: 10,
    post_burst_limit: 5,
}

export const BETA: EnvInterface = {
    api_rate_limit: 2,
    api_burst_limit: 2,
    get_rate_limit: 2,
    get_burst_limit: 2,
    post_rate_limit: 2,
    post_burst_limit: 2,
}