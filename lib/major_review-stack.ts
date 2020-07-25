import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway'
import {constructMajorResources} from "./backend_resources";


export class MajorReviewStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // ddb and lambda
        const [addReview, getReviews] = constructMajorResources(this);

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
