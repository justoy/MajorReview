import {uuid} from 'uuidv4';
import {ReviewInterface} from "./data/ReviewInterface";
import {add_header} from "./common";
import {writeReview} from "./dao/reviews_writer_reader";

export const handler = async (event: any = {}): Promise<any> => {
    if (!event.body) {
        return add_header({statusCode: 400, body: 'invalid request, you are missing the parameter body'});
    }

    if (!event.queryStringParameters) {
        return add_header({statusCode: 400, body: 'invalid request, you are missing the parameters'});
    }

    const query = event.queryStringParameters;
    const body: ReviewInterface = JSON.parse(event.body);

    const reviewId = uuid();

    await writeReview(body, reviewId, query['school'], query['major']);
    return add_header({statusCode: 200, body: JSON.stringify("Success!")});
}