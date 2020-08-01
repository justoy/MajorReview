import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import {EnvInterface} from "./env";

export function construct_apigateway(app: cdk.Stack, addReview: lambda.Function, getReviews: lambda.Function, env: EnvInterface) {
    const api = new apigateway.RestApi(app, app.stackName + '-' + 'majorReviewApi', {
        restApiName: app.stackName + '-' + 'MajorReview Service',
        defaultCorsPreflightOptions: {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
            allowHeaders: ['*'],
        }
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

    const plan = api.addUsagePlan("usage-plan", {
        name: 'Simple',
        throttle: {
            rateLimit: env.api_rate_limit,
            burstLimit: env.api_burst_limit,
        }
    })

    plan.addApiStage({
        stage: api.deploymentStage,
        throttle: [
            {
                method: get_method,
                throttle: {
                    rateLimit: env.get_rate_limit,
                    burstLimit: env.get_burst_limit,
                }
            },
            {
                method: post_method,
                throttle: {
                    rateLimit: env.post_rate_limit,
                    burstLimit: env.post_burst_limit,
                }
            },
        ]

    });
}