# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

### To Deploy Beta:
export DEPLOY_STAGE=beta && npm run build && cdk synth && cdk deploy

### To Deploy Prod:
export DEPLOY_STAGE=prod && npm run build && cdk synth && cdk deploy


## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
