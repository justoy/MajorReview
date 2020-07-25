import * as AWS from 'aws-sdk';
import {ReviewInterface, ReviewItem} from "../data/ReviewInterface";

const db_client = new AWS.DynamoDB.DocumentClient();

const REVIEW_TABLE_NAME = process.env.REVIEW_TABLE_NAME || '';
const REVIEW_TABLE_PRIMARY_KEY = process.env.REVIEW_TABLE_PRIMARY_KEY || '';

export async function getReviews(reviewIds: [string]) {

    const keys = reviewIds.map(id => {
        return {[REVIEW_TABLE_PRIMARY_KEY]: id}
    });
    const response = await db_client.batchGet({
        RequestItems: {
            [REVIEW_TABLE_NAME]: {
                Keys: keys,
            }
        }
    }).promise();

    if (response.Responses) {
        return response.Responses[REVIEW_TABLE_NAME];
    } else {
        return [];
    }
}

export async function putReview(review: ReviewInterface, reviewId: string) {
    const reviewItem: ReviewItem = {...review, ...{id: reviewId, ts: Date.now()}};
    return await db_client.put({
        TableName: REVIEW_TABLE_NAME,
        Item: reviewItem,
    }).promise();
}