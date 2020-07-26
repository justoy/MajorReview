import {getReviewIds} from "./dao/major_table_dao";
import {getReviews} from "./dao/review_table_dao";
import {add_header} from "./common";

export const handler = async (event: any = {}): Promise<any> => {
    console.log(`event is ${JSON.stringify(event)}`);

    if (!event.queryStringParameters) {
        return add_header({statusCode: 400, body: 'invalid request, you are missing the parameters'});
    }

    const queryStringParameters = event.queryStringParameters;

    const reviewIds: any = await getReviewIds(queryStringParameters.school, queryStringParameters.major);

    if (!reviewIds) {
        return add_header({statusCode: 200, body: JSON.stringify([])});
    }
    const reviews = await getReviews(reviewIds['reviews']);

    return add_header({statusCode: 200, body: JSON.stringify(reviews)});
}