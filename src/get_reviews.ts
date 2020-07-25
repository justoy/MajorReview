import {get_reviews} from "./major_table_dao";

/**
 *
 * @param event event.queryStringParameters: {school=hit&major=welding}
 *
 * return {"school":"hit","major":"welding","reviews":["f52ce81f-f66f-4307-a2aa-fe3da3c09af0"]}
 */
export const handler = async (event: any = {}): Promise<any> => {
    console.log(`event is ${JSON.stringify(event)}`);

    if (!event.queryStringParameters) {
        return {statusCode: 400, body: 'invalid request, you are missing the parameters'};
    }

    const queryStringParameters = event.queryStringParameters;

    const reviews = await get_reviews(queryStringParameters.school, queryStringParameters.major);
    return {statusCode: 200, body: JSON.stringify(reviews)};
}