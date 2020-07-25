#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MajorReviewStack } from '../lib/major_review-stack';

const app = new cdk.App();
new MajorReviewStack(app, 'MajorReviewStack');
