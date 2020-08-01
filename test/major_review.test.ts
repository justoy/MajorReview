import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as MajorReview from '../lib/major_review-stack';
import {BETA} from "../lib/env";

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MajorReview.MajorReviewStack(app, 'MyTestStack', BETA);
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
