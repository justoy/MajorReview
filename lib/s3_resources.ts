import {get_cloudflare_policy} from "./cloudflare_policy";
import {RedirectProtocol} from "@aws-cdk/aws-s3";
import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');


export function construct_s3(app: cdk.Stack) {
    const rootDomain = "schoolmajorreview.xyz";
    const subDomain = "www." + rootDomain;
    const subDomainBucket = new s3.Bucket(app, 'subDomainBucket', {
        bucketName: subDomain,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'index.html',
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    subDomainBucket.addToResourcePolicy(get_cloudflare_policy(subDomain));

    const rootDomainBucket = new s3.Bucket(app, 'rootDomainBucket', {
        bucketName: rootDomain,
        websiteRedirect: {hostName: subDomain, protocol: RedirectProtocol.HTTPS},
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    rootDomainBucket.addToResourcePolicy(get_cloudflare_policy(rootDomain));
}