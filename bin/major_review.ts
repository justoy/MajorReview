#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {MajorReviewStack} from '../lib/major_review-stack';
import {BETA, PROD} from "../lib/env";

const app = new cdk.App();
if (process.env.DEPLOY_STAGE === 'prod') {
    new MajorReviewStack(app, 'MajorReviewStack-prod', PROD);
} else {
    new MajorReviewStack(app, 'MajorReviewStack-dev', BETA);

}

