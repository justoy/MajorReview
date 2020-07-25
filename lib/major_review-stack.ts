import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'
import {Duration} from "@aws-cdk/core";

const MAJOR_TABLE_NAME = "major_table";
const MAJOR_TABLE_PARTITION_KEY = "school";
const MAJOR_TABLE_SORT_KEY = "major";


export class MajorReviewStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // DDB
        const majorTableName = MAJOR_TABLE_NAME
        const majorTable = new dynamodb.Table(this, majorTableName, {
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

        // Lambda
        const addReview = new lambda.Function(this, 'AddReviewFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'add_review.handler',
            runtime: lambda.Runtime.NODEJS_12_X,
            timeout: Duration.seconds(10),
            environment: majorLambdaEnv(),
        });

        const getReviews = new lambda.Function(this, 'GetReviewsFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'get_reviews.handler',
            runtime: lambda.Runtime.NODEJS_12_X,
            timeout: Duration.seconds(10),
            environment: majorLambdaEnv(),
        });

        majorTable.grantFullAccess(addReview);
        majorTable.grantFullAccess(getReviews);

        // API gateway
        const api = new apigateway.RestApi(this, 'majorReviewApi', {
            restApiName: 'MajorReview Service',
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: ['GET', 'POST', 'OPTION']
            },
        });

        const review = api.root.addResource('review');

        const addReviewIntegration = new apigateway.LambdaIntegration(addReview);
        const post_method = review.addMethod('POST', addReviewIntegration, {
            requestParameters: {
                'method.request.querystring.school': true,
                'method.request.querystring.major': true,
            }
        });

        const getReviewsIntegration = new apigateway.LambdaIntegration(getReviews);
        const get_method = review.addMethod('GET', getReviewsIntegration, {
            requestParameters: {
                'method.request.querystring.school': true,
                'method.request.querystring.major': true,
            }
        });
    }
}

function majorLambdaEnv() {
    return {
        MAJOR_TABLE_NAME: MAJOR_TABLE_NAME,
        MAJOR_TABLE_PARTITION_KEY: MAJOR_TABLE_PARTITION_KEY,
        MAJOR_TABLE_SORT_KEY: MAJOR_TABLE_SORT_KEY,
    }
}
