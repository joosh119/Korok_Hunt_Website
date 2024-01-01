import { AmplifyErrorMap } from '@aws-amplify/core/internals/utils';
export declare enum RestApiValidationErrorCode {
    NoCredentials = "NoCredentials",
    InvalidApiName = "InvalidApiName"
}
export declare const validationErrorMap: AmplifyErrorMap<RestApiValidationErrorCode>;
