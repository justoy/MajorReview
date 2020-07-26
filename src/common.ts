const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
}

export function add_header(response: any, header = DEFAULT_HEADERS) {
    response['headers'] = header;
    return response
}