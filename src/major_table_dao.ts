import * as AWS from 'aws-sdk';

const db_client = new AWS.DynamoDB.DocumentClient();

export const MAJOR_TABLE_NAME = process.env.MAJOR_TABLE_NAME || '';
export const MAJOR_TABLE_PARTITION_KEY = process.env.MAJOR_TABLE_PARTITION_KEY || '';
export const MAJOR_TABLE_SORT_KEY = process.env.MAJOR_TABLE_SORT_KEY || '';

const REVIEWS = 'reviews' // a list of review IDs

export async function get_reviews(school: string, major: string) {
    const response = await db_client.get({
        Key: key(school, major),
        TableName: MAJOR_TABLE_NAME,
    }).promise();

    return response['Item'];
}

export async function add_review(school: string, major: string, reviewId: string) {
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