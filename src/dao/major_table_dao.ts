import * as AWS from 'aws-sdk';

const db_client = new AWS.DynamoDB.DocumentClient();

const MAJOR_TABLE_NAME = process.env.MAJOR_TABLE_NAME || '';
const MAJOR_TABLE_PARTITION_KEY = process.env.MAJOR_TABLE_PARTITION_KEY || '';
const MAJOR_TABLE_SORT_KEY = process.env.MAJOR_TABLE_SORT_KEY || '';

const REVIEWS = 'reviews' // a list of review IDs

/**
 *
 * return {"school":"hit","major":"welding","reviews":["f52ce81f-f66f-4307-a2aa-fe3da3c09af0"]}
 */
export async function getReviewIds(school: string, major: string) {
    const response = await db_client.get({
        Key: key(school, major),
        TableName: MAJOR_TABLE_NAME,
    }).promise();

    return response['Item'];
}

export async function appendReview(school: string, major: string, reviewId: string) {
    return await db_client.update({
        TableName: MAJOR_TABLE_NAME,
        Key: key(school, major),
        UpdateExpression: 'SET #ri = list_append(if_not_exists(#ri, :empty_list), :val)',
        ExpressionAttributeNames: {"#ri": REVIEWS},
        ExpressionAttributeValues: {
            ":val": [reviewId],
            ":empty_list": [],
        },
    }).promise();
}

function key(school: string, major: string) {
    return {
        [MAJOR_TABLE_PARTITION_KEY]: school,
        [MAJOR_TABLE_SORT_KEY]: major,
    }
}