# School Major review

学校专业评价网 https://www.schoolmajorreview.xyz 欢迎贡献对各自专业的评价

也欢迎提供建议和代码

本repo包含网站所有后端和infra代码，用AWS Serverless 工具写成

* Database - DynamoDb
* Server - Lambda + ApiGateway
* Infra as Code - CDK
* Website Conten Hosting - S3



前端repo：https://github.com/justoy/MajorReview-ng

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
