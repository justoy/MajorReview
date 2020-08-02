import * as AWS from 'aws-sdk';
import {ReviewInterface, ReviewItem} from "../data/ReviewInterface";

const db_client = new AWS.DynamoDB.DocumentClient();

const REVIEW_TABLE_NAME = process.env.REVIEW_TABLE_NAME || '';
const REVIEW_TABLE_PRIMARY_KEY = process.env.REVIEW_TABLE_PRIMARY_KEY || '';

const MAJOR_TABLE_NAME = process.env.MAJOR_TABLE_NAME || '';
const MAJOR_TABLE_PARTITION_KEY = process.env.MAJOR_TABLE_PARTITION_KEY || '';
const MAJOR_TABLE_SORT_KEY = process.env.MAJOR_TABLE_SORT_KEY || '';

const REVIEWS = 'reviews' // a list of review IDs

export async function getReviews(reviewIds: [string]) {
    if (!reviewIds || reviewIds.length < 1) {
        return [];
    }

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

export async function writeReview(review: ReviewInterface, reviewId: string, school: string, major: string) {
    const reviewItem: ReviewItem = {...review, ...{id: reviewId, ts: Date.now()}};
    const params = {
        TransactItems: [
            {
                Put: {
                    TableName: REVIEW_TABLE_NAME,
                    Item: reviewItem,
                }
            },
            {
                Update: {
                    TableName: MAJOR_TABLE_NAME,
                    Key: key(school, major),
                    UpdateExpression: 'SET #ri = list_append(if_not_exists(#ri, :empty_list), :val)',
                    ExpressionAttributeNames: {"#ri": REVIEWS},
                    ExpressionAttributeValues: {
                        ":val": [reviewId],
                        ":empty_list": [],
                    },
                }
            }]
    }

    await db_client.transactWrite(params).promise();
}

/**
 *
 * return {"school":"hit","major":"welding","reviews":["f52ce81f-f66f-4307-a2aa-fe3da3c09af0"]}
 */
export async function getReviewIds(school: string, major: string) {
    if (school.toLowerCase() === 'all') {
        return getReviewIdsByMajor(major);
    } else {
        return getReviewIdsByMajorSchool(school, major);
    }
}

async function getReviewIdsByMajor(major: string) {
    const query_params = {
        TableName: MAJOR_TABLE_NAME,
        KeyConditionExpression: MAJOR_TABLE_PARTITION_KEY + " = :major",
        ExpressionAttributeValues: {
            ":major": major
        }
    }
    const response = await db_client.query(query_params).promise();
    const items = response['Items'];
    const reviews = !items ? [] : items.reduce((accReviews: any, item: any) => accReviews.concat(item.reviews), []);

    return {"school": "all", "major": "welding", "reviews": reviews}
}

async function getReviewIdsByMajorSchool(school: string, major: string) {
    const response = await db_client.get({
        Key: key(school, major),
        TableName: MAJOR_TABLE_NAME,
    }).promise();

    return response['Item'];
}

function key(school: string, major: string) {
    return {
        [MAJOR_TABLE_PARTITION_KEY]: major,
        [MAJOR_TABLE_SORT_KEY]: school,
    }
}