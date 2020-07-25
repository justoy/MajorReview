import {getReviewIds} from "./dao/major_table_dao";
import {getReviews} from "./dao/review_table_dao";

export const handler = async (event: any = {}): Promise<any> => {
    console.log(`event is ${JSON.stringify(event)}`);

    if (!event.queryStringParameters) {
        return {statusCode: 400, body: 'invalid request, you are missing the parameters'};
    }

    const queryStringParameters = event.queryStringParameters;

    const reviewIds: any = await getReviewIds(queryStringParameters.school, queryStringParameters.major);

    const reviews = await getReviews(reviewIds['reviews']);

    return {statusCode: 200, body: JSON.stringify(reviews)};
}