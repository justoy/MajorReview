import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import {Duration} from "@aws-cdk/core";

// Major table
const MAJOR_TABLE_NAME = "major_school_table";
const MAJOR_TABLE_PARTITION_KEY = "major";
const MAJOR_TABLE_SORT_KEY = "school";

// Review table
const REVIEW_TABLE_NAME = "review_table";
const REVIEW_TABLE_PRIMARY_KEY = "id";

export function constructMajorResources(app: cdk.Stack): [lambda.Function, lambda.Function] {
    // DDB
    const majorTableName = app.stackName + '-' + MAJOR_TABLE_NAME
    const majorTable = new dynamodb.Table(app, majorTableName, {
        partitionKey: {
            name: MAJOR_TABLE_PARTITION_KEY,
            type: dynamodb.AttributeType.STRING
        },
        sortKey: {
            name: MAJOR_TABLE_SORT_KEY,
            type: dynamodb.AttributeType.STRING
        },
        tableName: majorTableName,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const reviewTableName = app.stackName + '-' + REVIEW_TABLE_NAME
    const reviewTable = new dynamodb.Table(app, reviewTableName, {
        partitionKey: {
            name: REVIEW_TABLE_PRIMARY_KEY,
            type: dynamodb.AttributeType.STRING
        },
        tableName: reviewTableName,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda
    const addReview = new lambda.Function(app, 'AddReviewFunction', {
        functionName: `${app.stackName}-addReview`,
        code: new lambda.AssetCode('src'),
        handler: 'add_review.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: Duration.seconds(10),
        environment: lambdaEnv(majorTableName, reviewTableName),
    });

    const getReviews = new lambda.Function(app, 'GetReviewsFunction', {
        functionName: `${app.stackName}-getReviews`,
        code: new lambda.AssetCode('src'),
        handler: 'get_reviews.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: Duration.seconds(10),
        environment: lambdaEnv(majorTableName, reviewTableName),
    });

    majorTable.grantWriteData(addReview);
    majorTable.grantReadData(getReviews);
    reviewTable.grantWriteData(addReview);
    reviewTable.grantReadData(getReviews);

    return [addReview, getReviews]
}

function lambdaEnv(majorTableName: string, reviewTableName: string) {
    return {
        MAJOR_TABLE_NAME: majorTableName,
        MAJOR_TABLE_PARTITION_KEY: MAJOR_TABLE_PARTITION_KEY,
        MAJOR_TABLE_SORT_KEY: MAJOR_TABLE_SORT_KEY,
        REVIEW_TABLE_NAME: reviewTableName,
        REVIEW_TABLE_PRIMARY_KEY: REVIEW_TABLE_PRIMARY_KEY,
    }
}