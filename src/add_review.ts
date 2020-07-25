import {uuid} from 'uuidv4';
import {appendReview} from "./dao/major_table_dao";
import {putReview} from "./dao/review_table_dao";
import {ReviewInterface} from "./data/ReviewInterface";

export const handler = async (event: any = {}): Promise<any> => {
    console.debug(`event is ${JSON.stringify(event)}`);

    if (!event.body) {
        return {statusCode: 400, body: 'invalid request, you are missing the parameter body'};
    }

    if (!event.queryStringParameters) {
        return {statusCode: 400, body: 'invalid request, you are missing the parameters'};
    }

    const query = event.queryStringParameters;
    const body: ReviewInterface = JSON.parse(event.body);

    console.log(`body is ${body}`);

    const reviewId = uuid();


    await putReview(body, reviewId);
    await appendReview(query['school'], query['major'], reviewId);
    return {statusCode: 200, body: JSON.stringify("Success!")};
}