import * as cdk from '@aws-cdk/core';
import {constructMajorResources} from "./backend_resources";
import {construct_s3} from "./s3_resources";
import {EnvInterface, PROD} from "./env";
import {construct_apigateway} from "./apigateway_resources";


export class MajorReviewStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env: EnvInterface, props?: cdk.StackProps) {
        super(scope, id, props);

        // ddb and lambda
        const [addReview, getReviews] = constructMajorResources(this);

        // s3
        if (env === PROD) {
            construct_s3(this);
        }

        // API gateway
        construct_apigateway(this, addReview, getReviews, env)
    }
}
