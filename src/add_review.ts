import {uuid} from 'uuidv4';
import {add_review} from "./major_table_dao";

export const handler = async (event: any = {}): Promise<any> => {
    console.debug(`event is ${JSON.stringify(event)}`);

    // if (!event.body) {
    //     return {statusCode: 400, body: 'invalid request, you are missing the parameter body'};
    // }

    if (!event.queryStringParameters) {
        return {statusCode: 400, body: 'invalid request, you are missing the parameters'};
    }

    const query = event.queryStringParameters;
    await add_review(query['school'], query['major'], uuid());
    return {statusCode: 200, body: JSON.stringify("Success!")};
}