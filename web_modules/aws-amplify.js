import { c as composeTransferHandler, u as unauthenticatedHandler, g as getRetryDecider, p as parseJsonError, j as jitteredBackoff, a as getAmplifyUserAgent, A as Amplify, b as AmplifyUrl, d as getDnsSuffix, e as AmplifyError, f as AmplifyErrorCode, h as composeServiceApi, i as parseJsonBody, k as assertTokenProviderConfig, C as Category, l as decodeJWT, m as createAssertionFunction, n as isTokenExpired, H as Hub, o as AMPLIFY_SYMBOL, q as defaultStorage, r as ConsoleLogger, U as USER_AGENT_HEADER, s as urlSafeDecode, t as assertOAuthConfig, v as AuthAction, w as isBrowser, x as ADD_OAUTH_LISTENER, y as assertIdentityPoolIdConfig, z as getId, B as getCredentialsForIdentity, D as parseAWSExports, E as CookieStorage } from './common/index-4e1d64bf.js';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * The service name used to sign requests if the API requires authentication.
 */
const SERVICE_NAME = 'cognito-idp';
/**
 * The endpoint resolver function that returns the endpoint URL for a given region.
 */
const endpointResolver = ({ region }) => {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    const customURL = authConfig?.userPoolEndpoint;
    const defaultURL = new AmplifyUrl(`https://${SERVICE_NAME}.${region}.${getDnsSuffix(region)}`);
    return {
        url: customURL ? new AmplifyUrl(customURL) : defaultURL,
    };
};
/**
 * A Cognito Identity-specific middleware that disables caching for all requests.
 */
const disableCacheMiddleware = () => (next, context) => async function disableCacheMiddleware(request) {
    request.headers['cache-control'] = 'no-store';
    return next(request);
};
/**
 * A Cognito Identity-specific transfer handler that does NOT sign requests, and
 * disables caching.
 *
 * @internal
 */
const cognitoUserPoolTransferHandler = composeTransferHandler(unauthenticatedHandler, [disableCacheMiddleware]);
/**
 * @internal
 */
const defaultConfig = {
    service: SERVICE_NAME,
    endpointResolver,
    retryDecider: getRetryDecider(parseJsonError),
    computeDelay: jitteredBackoff,
    userAgentValue: getAmplifyUserAgent(),
    cache: 'no-store',
};
/**
 * @internal
 */
const getSharedHeaders = (operation) => ({
    'content-type': 'application/x-amz-json-1.1',
    'x-amz-target': `AWSCognitoIdentityProviderService.${operation}`,
});
/**
 * @internal
 */
const buildHttpRpcRequest = ({ url }, headers, body) => ({
    headers,
    url,
    body,
    method: 'POST',
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class AuthError extends AmplifyError {
    constructor(params) {
        super(params);
        // Hack for making the custom error class work when transpiled to es5
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = AuthError;
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function assertServiceError(error) {
    if (!error ||
        error.name === 'Error' ||
        error instanceof TypeError) {
        throw new AuthError({
            name: AmplifyErrorCode.Unknown,
            message: 'An unknown error has occurred.',
            underlyingError: error,
        });
    }
}

const buildUserPoolSerializer = (operation) => (input, endpoint) => {
    const headers = getSharedHeaders(operation);
    const body = JSON.stringify(input);
    return buildHttpRpcRequest(endpoint, headers, body);
};
const buildUserPoolDeserializer = () => {
    return async (response) => {
        if (response.statusCode >= 300) {
            const error = await parseJsonError(response);
            assertServiceError(error);
            throw new AuthError({ name: error.name, message: error.message });
        }
        else {
            const body = await parseJsonBody(response);
            return body;
        }
    };
};
const initiateAuth = composeServiceApi(cognitoUserPoolTransferHandler, buildUserPoolSerializer('InitiateAuth'), buildUserPoolDeserializer(), defaultConfig);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var AuthValidationErrorCode;
(function (AuthValidationErrorCode) {
    AuthValidationErrorCode["EmptySignInUsername"] = "EmptySignInUsername";
    AuthValidationErrorCode["EmptySignInPassword"] = "EmptySignInPassword";
    AuthValidationErrorCode["CustomAuthSignInPassword"] = "CustomAuthSignInPassword";
    AuthValidationErrorCode["EmptySignUpUsername"] = "EmptySignUpUsername";
    AuthValidationErrorCode["EmptySignUpPassword"] = "EmptySignUpPassword";
    AuthValidationErrorCode["EmptyConfirmSignUpUsername"] = "EmptyConfirmSignUpUsername";
    AuthValidationErrorCode["EmptyConfirmSignUpCode"] = "EmptyConfirmSignUpCode";
    AuthValidationErrorCode["EmptyResendSignUpCodeUsername"] = "EmptyresendSignUpCodeUsername";
    AuthValidationErrorCode["EmptyChallengeResponse"] = "EmptyChallengeResponse";
    AuthValidationErrorCode["EmptyConfirmResetPasswordUsername"] = "EmptyConfirmResetPasswordUsername";
    AuthValidationErrorCode["EmptyConfirmResetPasswordNewPassword"] = "EmptyConfirmResetPasswordNewPassword";
    AuthValidationErrorCode["EmptyConfirmResetPasswordConfirmationCode"] = "EmptyConfirmResetPasswordConfirmationCode";
    AuthValidationErrorCode["EmptyResetPasswordUsername"] = "EmptyResetPasswordUsername";
    AuthValidationErrorCode["EmptyVerifyTOTPSetupCode"] = "EmptyVerifyTOTPSetupCode";
    AuthValidationErrorCode["EmptyConfirmUserAttributeCode"] = "EmptyConfirmUserAttributeCode";
    AuthValidationErrorCode["IncorrectMFAMethod"] = "IncorrectMFAMethod";
    AuthValidationErrorCode["EmptyUpdatePassword"] = "EmptyUpdatePassword";
})(AuthValidationErrorCode || (AuthValidationErrorCode = {}));

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const validationErrorMap = {
    [AuthValidationErrorCode.EmptyChallengeResponse]: {
        message: 'challengeResponse is required to confirmSignIn',
    },
    [AuthValidationErrorCode.EmptyConfirmResetPasswordUsername]: {
        message: 'username is required to confirmResetPassword',
    },
    [AuthValidationErrorCode.EmptyConfirmSignUpCode]: {
        message: 'code is required to confirmSignUp',
    },
    [AuthValidationErrorCode.EmptyConfirmSignUpUsername]: {
        message: 'username is required to confirmSignUp',
    },
    [AuthValidationErrorCode.EmptyConfirmResetPasswordConfirmationCode]: {
        message: 'confirmationCode is required to confirmResetPassword',
    },
    [AuthValidationErrorCode.EmptyConfirmResetPasswordNewPassword]: {
        message: 'newPassword is required to confirmResetPassword',
    },
    [AuthValidationErrorCode.EmptyResendSignUpCodeUsername]: {
        message: 'username is required to confirmSignUp',
    },
    [AuthValidationErrorCode.EmptyResetPasswordUsername]: {
        message: 'username is required to resetPassword',
    },
    [AuthValidationErrorCode.EmptySignInPassword]: {
        message: 'password is required to signIn',
    },
    [AuthValidationErrorCode.EmptySignInUsername]: {
        message: 'username is required to signIn',
    },
    [AuthValidationErrorCode.EmptySignUpPassword]: {
        message: 'password is required to signUp',
    },
    [AuthValidationErrorCode.EmptySignUpUsername]: {
        message: 'username is required to signUp',
    },
    [AuthValidationErrorCode.CustomAuthSignInPassword]: {
        message: 'A password is not needed when signing in with CUSTOM_WITHOUT_SRP',
        recoverySuggestion: 'Do not include a password in your signIn call.',
    },
    [AuthValidationErrorCode.IncorrectMFAMethod]: {
        message: 'Incorrect MFA method was chosen. It should be either SMS or TOTP',
        recoverySuggestion: 'Try to pass TOTP or SMS as the challengeResponse',
    },
    [AuthValidationErrorCode.EmptyVerifyTOTPSetupCode]: {
        message: 'code is required to verifyTotpSetup',
    },
    [AuthValidationErrorCode.EmptyUpdatePassword]: {
        message: 'oldPassword and newPassword are required to changePassword',
    },
    [AuthValidationErrorCode.EmptyConfirmUserAttributeCode]: {
        message: 'confirmation code is required to confirmUserAttribute',
    },
};
// TODO: delete this code when the Auth class is removed.
var AuthErrorStrings;
(function (AuthErrorStrings) {
    AuthErrorStrings["DEFAULT_MSG"] = "Authentication Error";
    AuthErrorStrings["EMPTY_EMAIL"] = "Email cannot be empty";
    AuthErrorStrings["EMPTY_PHONE"] = "Phone number cannot be empty";
    AuthErrorStrings["EMPTY_USERNAME"] = "Username cannot be empty";
    AuthErrorStrings["INVALID_USERNAME"] = "The username should either be a string or one of the sign in types";
    AuthErrorStrings["EMPTY_PASSWORD"] = "Password cannot be empty";
    AuthErrorStrings["EMPTY_CODE"] = "Confirmation code cannot be empty";
    AuthErrorStrings["SIGN_UP_ERROR"] = "Error creating account";
    AuthErrorStrings["NO_MFA"] = "No valid MFA method provided";
    AuthErrorStrings["INVALID_MFA"] = "Invalid MFA type";
    AuthErrorStrings["EMPTY_CHALLENGE"] = "Challenge response cannot be empty";
    AuthErrorStrings["NO_USER_SESSION"] = "Failed to get the session because the user is empty";
    AuthErrorStrings["NETWORK_ERROR"] = "Network Error";
    AuthErrorStrings["DEVICE_CONFIG"] = "Device tracking has not been configured in this User Pool";
    AuthErrorStrings["AUTOSIGNIN_ERROR"] = "Please use your credentials to sign in";
    AuthErrorStrings["OAUTH_ERROR"] = "Couldn't finish OAuth flow, check your User Pool HostedUI settings";
})(AuthErrorStrings || (AuthErrorStrings = {}));
var AuthErrorCodes;
(function (AuthErrorCodes) {
    AuthErrorCodes["SignInException"] = "SignInException";
    AuthErrorCodes["OAuthSignInError"] = "OAuthSignInException";
})(AuthErrorCodes || (AuthErrorCodes = {}));

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function getRegion(userPoolId) {
    const region = userPoolId?.split('_')[0];
    if (!userPoolId ||
        userPoolId.indexOf('_') < 0 ||
        !region ||
        typeof region !== 'string')
        throw new AuthError({
            name: 'InvalidUserPoolId',
            message: 'Invalid user pool id provided.',
        });
    return region;
}
function getRegionFromIdentityPoolId(identityPoolId) {
    if (!identityPoolId || !identityPoolId.includes(':')) {
        throw new AuthError({
            name: 'InvalidIdentityPoolIdException',
            message: 'Invalid identity pool id provided.',
            recoverySuggestion: 'Make sure a valid identityPoolId is given in the config.',
        });
    }
    return identityPoolId.split(':')[0];
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const USER_UNAUTHENTICATED_EXCEPTION = 'UserUnAuthenticatedException';
const INVALID_REDIRECT_EXCEPTION = 'InvalidRedirectException';
const invalidRedirectException = new AuthError({
    name: INVALID_REDIRECT_EXCEPTION,
    message: 'signInRedirect or signOutRedirect had an invalid format or was not found.',
    recoverySuggestion: 'Please make sure the signIn/Out redirect in your oauth config is valid.',
});
const INVALID_ORIGIN_EXCEPTION = 'InvalidOriginException';
const invalidOriginException = new AuthError({
    name: INVALID_ORIGIN_EXCEPTION,
    message: 'redirect is coming from a different origin. The oauth flow needs to be initiated from the same origin',
    recoverySuggestion: 'Please call signInWithRedirect from the same origin.',
});

function assertAuthTokens(tokens) {
    if (!tokens || !tokens.accessToken) {
        throw new AuthError({
            name: USER_UNAUTHENTICATED_EXCEPTION,
            message: 'User needs to be authenticated to call this API.',
            recoverySuggestion: 'Sign in before calling this API again.',
        });
    }
}
function assertIdTokenInAuthTokens(tokens) {
    if (!tokens || !tokens.idToken) {
        throw new AuthError({
            name: USER_UNAUTHENTICATED_EXCEPTION,
            message: 'User needs to be authenticated to call this API.',
            recoverySuggestion: 'Sign in before calling this API again.',
        });
    }
}
function assertAuthTokensWithRefreshToken(tokens) {
    if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        throw new AuthError({
            name: USER_UNAUTHENTICATED_EXCEPTION,
            message: 'User needs to be authenticated to call this API.',
            recoverySuggestion: 'Sign in before calling this API again.',
        });
    }
}
const OAuthStorageKeys = {
    inflightOAuth: 'inflightOAuth',
    oauthSignIn: 'oauthSignIn',
    oauthPKCE: 'oauthPKCE',
    oauthState: 'oauthState',
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getCurrentUser = async (amplify) => {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const tokens = await amplify.Auth.getTokens({ forceRefresh: false });
    assertAuthTokens(tokens);
    const { 'cognito:username': username, sub } = tokens.idToken?.payload ?? {};
    const authUser = {
        username: username,
        userId: sub,
    };
    const signInDetails = getSignInDetailsFromTokens(tokens);
    if (signInDetails) {
        authUser.signInDetails = signInDetails;
    }
    return authUser;
};
function getSignInDetailsFromTokens(tokens) {
    return tokens?.signInDetails;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Gets the current user from the idToken.
 *
 * @param input -  The GetCurrentUserInput object.
 * @returns GetCurrentUserOutput
 * @throws - {@link InitiateAuthException} - Thrown when the service fails to refresh the tokens.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
const getCurrentUser$1 = async () => {
    return getCurrentUser(Amplify);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getAuthUserAgentValue = (action, customUserAgentDetails) => getAmplifyUserAgent({
    category: Category.Auth,
    action,
    ...customUserAgentDetails,
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function getUserContextData({ username, userPoolId, userPoolClientId, }) {
    if (typeof window === 'undefined') {
        return undefined;
    }
    const amazonCognitoAdvancedSecurityData = window
        .AmazonCognitoAdvancedSecurityData;
    if (typeof amazonCognitoAdvancedSecurityData === 'undefined') {
        return undefined;
    }
    const advancedSecurityData = amazonCognitoAdvancedSecurityData.getData(username, userPoolId, userPoolClientId);
    if (advancedSecurityData) {
        const userContextData = {
            EncodedData: advancedSecurityData,
        };
        return userContextData;
    }
    return {};
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const refreshAuthTokens = async ({ tokens, authConfig, username, }) => {
    assertTokenProviderConfig(authConfig?.Cognito);
    const region = getRegion(authConfig.Cognito.userPoolId);
    assertAuthTokensWithRefreshToken(tokens);
    const refreshTokenString = tokens.refreshToken;
    const AuthParameters = {
        REFRESH_TOKEN: refreshTokenString,
    };
    if (tokens.deviceMetadata?.deviceKey) {
        AuthParameters['DEVICE_KEY'] = tokens.deviceMetadata.deviceKey;
    }
    const UserContextData = getUserContextData({
        username,
        userPoolId: authConfig.Cognito.userPoolId,
        userPoolClientId: authConfig.Cognito.userPoolClientId,
    });
    const { AuthenticationResult } = await initiateAuth({ region }, {
        ClientId: authConfig?.Cognito?.userPoolClientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters,
        UserContextData,
    });
    const accessToken = decodeJWT(AuthenticationResult?.AccessToken ?? '');
    const idToken = AuthenticationResult?.IdToken
        ? decodeJWT(AuthenticationResult.IdToken)
        : undefined;
    const iat = accessToken.payload.iat;
    // This should never happen. If it does, it's a bug from the service.
    if (!iat) {
        throw new AuthError({
            name: 'iatNotFoundException',
            message: 'iat not found in access token',
        });
    }
    const clockDrift = iat * 1000 - new Date().getTime();
    return {
        accessToken,
        idToken,
        clockDrift,
        refreshToken: refreshTokenString,
        username,
    };
};

const AuthTokenStorageKeys = {
    accessToken: 'accessToken',
    idToken: 'idToken',
    oidcProvider: 'oidcProvider',
    clockDrift: 'clockDrift',
    refreshToken: 'refreshToken',
    deviceKey: 'deviceKey',
    randomPasswordKey: 'randomPasswordKey',
    deviceGroupKey: 'deviceGroupKey',
    signInDetails: 'signInDetails',
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var TokenProviderErrorCode;
(function (TokenProviderErrorCode) {
    TokenProviderErrorCode["InvalidAuthTokens"] = "InvalidAuthTokens";
})(TokenProviderErrorCode || (TokenProviderErrorCode = {}));
const tokenValidationErrorMap = {
    [TokenProviderErrorCode.InvalidAuthTokens]: {
        message: 'Invalid tokens.',
        recoverySuggestion: 'Make sure the tokens are valid.',
    },
};
const assert = createAssertionFunction(tokenValidationErrorMap);

class DefaultTokenStore {
    constructor() {
        this.name = 'CognitoIdentityServiceProvider'; // To be backwards compatible with V5, no migration needed
    }
    getKeyValueStorage() {
        if (!this.keyValueStorage) {
            throw new AuthError({
                name: 'KeyValueStorageNotFoundException',
                message: 'KeyValueStorage was not found in TokenStore',
            });
        }
        return this.keyValueStorage;
    }
    setKeyValueStorage(keyValueStorage) {
        this.keyValueStorage = keyValueStorage;
    }
    setAuthConfig(authConfig) {
        this.authConfig = authConfig;
    }
    async loadTokens() {
        // TODO(v6): migration logic should be here
        // Reading V5 tokens old format
        try {
            const authKeys = await this.getAuthKeys();
            const accessTokenString = await this.getKeyValueStorage().getItem(authKeys.accessToken);
            if (!accessTokenString) {
                throw new AuthError({
                    name: 'NoSessionFoundException',
                    message: 'Auth session was not found. Make sure to call signIn.',
                });
            }
            const accessToken = decodeJWT(accessTokenString);
            const itString = await this.getKeyValueStorage().getItem(authKeys.idToken);
            const idToken = itString ? decodeJWT(itString) : undefined;
            const refreshToken = (await this.getKeyValueStorage().getItem(authKeys.refreshToken)) ??
                undefined;
            const clockDriftString = (await this.getKeyValueStorage().getItem(authKeys.clockDrift)) ?? '0';
            const clockDrift = Number.parseInt(clockDriftString);
            const signInDetails = await this.getKeyValueStorage().getItem(authKeys.signInDetails);
            const tokens = {
                accessToken,
                idToken,
                refreshToken,
                deviceMetadata: (await this.getDeviceMetadata()) ?? undefined,
                clockDrift,
                username: await this.getLastAuthUser(),
            };
            if (signInDetails) {
                tokens.signInDetails = JSON.parse(signInDetails);
            }
            return tokens;
        }
        catch (err) {
            return null;
        }
    }
    async storeTokens(tokens) {
        assert(tokens !== undefined, TokenProviderErrorCode.InvalidAuthTokens);
        await this.clearTokens();
        const lastAuthUser = tokens.username;
        await this.getKeyValueStorage().setItem(this.getLastAuthUserKey(), lastAuthUser);
        const authKeys = await this.getAuthKeys();
        await this.getKeyValueStorage().setItem(authKeys.accessToken, tokens.accessToken.toString());
        if (!!tokens.idToken) {
            await this.getKeyValueStorage().setItem(authKeys.idToken, tokens.idToken.toString());
        }
        if (!!tokens.refreshToken) {
            await this.getKeyValueStorage().setItem(authKeys.refreshToken, tokens.refreshToken);
        }
        if (!!tokens.deviceMetadata) {
            if (tokens.deviceMetadata.deviceKey) {
                await this.getKeyValueStorage().setItem(authKeys.deviceKey, tokens.deviceMetadata.deviceKey);
            }
            if (tokens.deviceMetadata.deviceGroupKey) {
                await this.getKeyValueStorage().setItem(authKeys.deviceGroupKey, tokens.deviceMetadata.deviceGroupKey);
            }
            await this.getKeyValueStorage().setItem(authKeys.randomPasswordKey, tokens.deviceMetadata.randomPassword);
        }
        if (!!tokens.signInDetails) {
            await this.getKeyValueStorage().setItem(authKeys.signInDetails, JSON.stringify(tokens.signInDetails));
        }
        await this.getKeyValueStorage().setItem(authKeys.clockDrift, `${tokens.clockDrift}`);
    }
    async clearTokens() {
        const authKeys = await this.getAuthKeys();
        // Not calling clear because it can remove data that is not managed by AuthTokenStore
        await Promise.all([
            this.getKeyValueStorage().removeItem(authKeys.accessToken),
            this.getKeyValueStorage().removeItem(authKeys.idToken),
            this.getKeyValueStorage().removeItem(authKeys.clockDrift),
            this.getKeyValueStorage().removeItem(authKeys.refreshToken),
            this.getKeyValueStorage().removeItem(authKeys.signInDetails),
            this.getKeyValueStorage().removeItem(this.getLastAuthUserKey()),
        ]);
    }
    async getDeviceMetadata(username) {
        const authKeys = await this.getAuthKeys(username);
        const deviceKey = await this.getKeyValueStorage().getItem(authKeys.deviceKey);
        const deviceGroupKey = await this.getKeyValueStorage().getItem(authKeys.deviceGroupKey);
        const randomPassword = await this.getKeyValueStorage().getItem(authKeys.randomPasswordKey);
        return !!randomPassword
            ? {
                deviceKey: deviceKey ?? undefined,
                deviceGroupKey: deviceGroupKey ?? undefined,
                randomPassword,
            }
            : null;
    }
    async clearDeviceMetadata(username) {
        const authKeys = await this.getAuthKeys(username);
        await Promise.all([
            this.getKeyValueStorage().removeItem(authKeys.deviceKey),
            this.getKeyValueStorage().removeItem(authKeys.deviceGroupKey),
            this.getKeyValueStorage().removeItem(authKeys.randomPasswordKey),
        ]);
    }
    async getAuthKeys(username) {
        assertTokenProviderConfig(this.authConfig?.Cognito);
        const lastAuthUser = username ?? (await this.getLastAuthUser());
        return createKeysForAuthStorage(this.name, `${this.authConfig.Cognito.userPoolClientId}.${lastAuthUser}`);
    }
    getLastAuthUserKey() {
        assertTokenProviderConfig(this.authConfig?.Cognito);
        const identifier = this.authConfig.Cognito.userPoolClientId;
        return `${this.name}.${identifier}.LastAuthUser`;
    }
    async getLastAuthUser() {
        const lastAuthUser = (await this.getKeyValueStorage().getItem(this.getLastAuthUserKey())) ??
            'username';
        return lastAuthUser;
    }
}
const createKeysForAuthStorage = (provider, identifier) => {
    return getAuthStorageKeys(AuthTokenStorageKeys)(`${provider}`, identifier);
};
function getAuthStorageKeys(authKeys) {
    const keys = Object.values({ ...authKeys });
    return (prefix, identifier) => keys.reduce((acc, authKey) => ({
        ...acc,
        [authKey]: `${prefix}.${identifier}.${authKey}`,
    }), {});
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class TokenOrchestrator {
    constructor() {
        this.waitForInflightOAuth = async () => { };
    }
    setAuthConfig(authConfig) {
        this.authConfig = authConfig;
    }
    setTokenRefresher(tokenRefresher) {
        this.tokenRefresher = tokenRefresher;
    }
    setAuthTokenStore(tokenStore) {
        this.tokenStore = tokenStore;
    }
    setWaitForInflightOAuth(waitForInflightOAuth) {
        this.waitForInflightOAuth = waitForInflightOAuth;
    }
    getTokenStore() {
        if (!this.tokenStore) {
            throw new AuthError({
                name: 'EmptyTokenStoreException',
                message: 'TokenStore not set',
            });
        }
        return this.tokenStore;
    }
    getTokenRefresher() {
        if (!this.tokenRefresher) {
            throw new AuthError({
                name: 'EmptyTokenRefresherException',
                message: 'TokenRefresher not set',
            });
        }
        return this.tokenRefresher;
    }
    async getTokens(options) {
        let tokens;
        try {
            assertTokenProviderConfig(this.authConfig?.Cognito);
        }
        catch (_err) {
            // Token provider not configured
            return null;
        }
        await this.waitForInflightOAuth();
        tokens = await this.getTokenStore().loadTokens();
        const username = await this.getTokenStore().getLastAuthUser();
        if (tokens === null) {
            return null;
        }
        const idTokenExpired = !!tokens?.idToken &&
            isTokenExpired({
                expiresAt: (tokens.idToken?.payload?.exp ?? 0) * 1000,
                clockDrift: tokens.clockDrift ?? 0,
            });
        const accessTokenExpired = isTokenExpired({
            expiresAt: (tokens.accessToken?.payload?.exp ?? 0) * 1000,
            clockDrift: tokens.clockDrift ?? 0,
        });
        if (options?.forceRefresh || idTokenExpired || accessTokenExpired) {
            tokens = await this.refreshTokens({
                tokens,
                username,
            });
            if (tokens === null) {
                return null;
            }
        }
        return {
            accessToken: tokens?.accessToken,
            idToken: tokens?.idToken,
            signInDetails: tokens?.signInDetails,
        };
    }
    async refreshTokens({ tokens, username, }) {
        try {
            const newTokens = await this.getTokenRefresher()({
                tokens,
                authConfig: this.authConfig,
                username,
            });
            await this.setTokens({ tokens: newTokens });
            Hub.dispatch('auth', { event: 'tokenRefresh' }, 'Auth', AMPLIFY_SYMBOL);
            return newTokens;
        }
        catch (err) {
            return this.handleErrors(err);
        }
    }
    handleErrors(err) {
        assertServiceError(err);
        if (err.message !== 'Network error') {
            // TODO(v6): Check errors on client
            this.clearTokens();
        }
        if (err.name.startsWith('NotAuthorizedException')) {
            return null;
        }
        else {
            Hub.dispatch('auth', { event: 'tokenRefresh_failure' }, 'Auth', AMPLIFY_SYMBOL);
            throw err;
        }
    }
    async setTokens({ tokens }) {
        return this.getTokenStore().storeTokens(tokens);
    }
    async clearTokens() {
        return this.getTokenStore().clearTokens();
    }
    getDeviceMetadata(username) {
        return this.getTokenStore().getDeviceMetadata(username);
    }
    clearDeviceMetadata(username) {
        return this.getTokenStore().clearDeviceMetadata(username);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class CognitoUserPoolsTokenProvider {
    constructor() {
        this.authTokenStore = new DefaultTokenStore();
        this.authTokenStore.setKeyValueStorage(defaultStorage);
        this.tokenOrchestrator = new TokenOrchestrator();
        this.tokenOrchestrator.setAuthTokenStore(this.authTokenStore);
        this.tokenOrchestrator.setTokenRefresher(refreshAuthTokens);
    }
    getTokens({ forceRefresh } = { forceRefresh: false }) {
        return this.tokenOrchestrator.getTokens({ forceRefresh });
    }
    setKeyValueStorage(keyValueStorage) {
        this.authTokenStore.setKeyValueStorage(keyValueStorage);
    }
    setWaitForInflightOAuth(waitForInflightOAuth) {
        this.tokenOrchestrator.setWaitForInflightOAuth(waitForInflightOAuth);
    }
    setAuthConfig(authConfig) {
        this.authTokenStore.setAuthConfig(authConfig);
        this.tokenOrchestrator.setAuthConfig(authConfig);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const cognitoUserPoolsTokenProvider = new CognitoUserPoolsTokenProvider();
const tokenOrchestrator = cognitoUserPoolsTokenProvider.tokenOrchestrator;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function cacheCognitoTokens(AuthenticationResult) {
    if (AuthenticationResult.AccessToken) {
        const accessToken = decodeJWT(AuthenticationResult.AccessToken);
        const accessTokenIssuedAtInMillis = (accessToken.payload.iat || 0) * 1000;
        const currentTime = new Date().getTime();
        const clockDrift = accessTokenIssuedAtInMillis > 0
            ? accessTokenIssuedAtInMillis - currentTime
            : 0;
        let idToken;
        let refreshToken;
        let deviceMetadata;
        if (AuthenticationResult.RefreshToken) {
            refreshToken = AuthenticationResult.RefreshToken;
        }
        if (AuthenticationResult.IdToken) {
            idToken = decodeJWT(AuthenticationResult.IdToken);
        }
        if (AuthenticationResult?.NewDeviceMetadata) {
            deviceMetadata = AuthenticationResult.NewDeviceMetadata;
        }
        const tokens = {
            accessToken,
            idToken,
            refreshToken,
            clockDrift,
            deviceMetadata,
            username: AuthenticationResult.username,
        };
        if (AuthenticationResult?.signInDetails) {
            tokens.signInDetails = AuthenticationResult.signInDetails;
        }
        await tokenOrchestrator.setTokens({
            tokens,
        });
    }
    else {
        // This would be a service error
        throw new AmplifyError({
            message: 'Invalid tokens',
            name: 'InvalidTokens',
            recoverySuggestion: 'Check Cognito UserPool settings',
        });
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const V5_HOSTED_UI_KEY = 'amplify-signin-with-hostedUI';
const name = 'CognitoIdentityServiceProvider';
class DefaultOAuthStore {
    constructor(keyValueStorage) {
        this.keyValueStorage = keyValueStorage;
    }
    async clearOAuthInflightData() {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        await Promise.all([
            this.keyValueStorage.removeItem(authKeys.inflightOAuth),
            this.keyValueStorage.removeItem(authKeys.oauthPKCE),
            this.keyValueStorage.removeItem(authKeys.oauthState),
        ]);
    }
    async clearOAuthData() {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        await this.clearOAuthInflightData();
        await this.keyValueStorage.removeItem(V5_HOSTED_UI_KEY); // remove in case a customer migrated an App from v5 to v6
        return this.keyValueStorage.removeItem(authKeys.oauthSignIn);
    }
    loadOAuthState() {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.getItem(authKeys.oauthState);
    }
    storeOAuthState(state) {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.setItem(authKeys.oauthState, state);
    }
    loadPKCE() {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.getItem(authKeys.oauthPKCE);
    }
    storePKCE(pkce) {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        return this.keyValueStorage.setItem(authKeys.oauthPKCE, pkce);
    }
    setAuthConfig(authConfigParam) {
        this.cognitoConfig = authConfigParam;
    }
    async loadOAuthInFlight() {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        return ((await this.keyValueStorage.getItem(authKeys.inflightOAuth)) === 'true');
    }
    async storeOAuthInFlight(inflight) {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        return await this.keyValueStorage.setItem(authKeys.inflightOAuth, `${inflight}`);
    }
    async loadOAuthSignIn() {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        const isLegacyHostedUISignIn = await this.keyValueStorage.getItem(V5_HOSTED_UI_KEY);
        const [isOAuthSignIn, preferPrivateSession] = (await this.keyValueStorage.getItem(authKeys.oauthSignIn))?.split(',') ??
            [];
        return {
            isOAuthSignIn: isOAuthSignIn === 'true' || isLegacyHostedUISignIn === 'true',
            preferPrivateSession: preferPrivateSession === 'true',
        };
    }
    async storeOAuthSignIn(oauthSignIn, preferPrivateSession = false) {
        assertTokenProviderConfig(this.cognitoConfig);
        const authKeys = createKeysForAuthStorage$1(name, this.cognitoConfig.userPoolClientId);
        return await this.keyValueStorage.setItem(authKeys.oauthSignIn, `${oauthSignIn},${preferPrivateSession}`);
    }
}
const createKeysForAuthStorage$1 = (provider, identifier) => {
    return getAuthStorageKeys(OAuthStorageKeys)(provider, identifier);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const oAuthStore = new DefaultOAuthStore(defaultStorage);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var AuthErrorTypes;
(function (AuthErrorTypes) {
    AuthErrorTypes["NoConfig"] = "noConfig";
    AuthErrorTypes["MissingAuthConfig"] = "missingAuthConfig";
    AuthErrorTypes["EmptyUsername"] = "emptyUsername";
    AuthErrorTypes["InvalidUsername"] = "invalidUsername";
    AuthErrorTypes["EmptyPassword"] = "emptyPassword";
    AuthErrorTypes["EmptyCode"] = "emptyCode";
    AuthErrorTypes["SignUpError"] = "signUpError";
    AuthErrorTypes["NoMFA"] = "noMFA";
    AuthErrorTypes["InvalidMFA"] = "invalidMFA";
    AuthErrorTypes["EmptyChallengeResponse"] = "emptyChallengeResponse";
    AuthErrorTypes["NoUserSession"] = "noUserSession";
    AuthErrorTypes["Default"] = "default";
    AuthErrorTypes["DeviceConfig"] = "deviceConfig";
    AuthErrorTypes["NetworkError"] = "networkError";
    AuthErrorTypes["AutoSignInError"] = "autoSignInError";
    AuthErrorTypes["OAuthSignInError"] = "oauthSignInError";
})(AuthErrorTypes || (AuthErrorTypes = {}));

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const flowCancelledMessage = '`signInWithRedirect` has been canceled.';
const validationFailedMessage = 'An error occurred while validating the state.';
const validationRecoverySuggestion = 'Try to initiate an OAuth flow from Amplify';
const validateState = async (state) => {
    const savedState = await oAuthStore.loadOAuthState();
    // This is because savedState only exists if the flow was initiated by Amplify
    const validatedState = state === savedState ? savedState : undefined;
    if (!validatedState) {
        throw new AuthError({
            name: AuthErrorTypes.OAuthSignInError,
            message: state === null ? flowCancelledMessage : validationFailedMessage,
            recoverySuggestion: state === null ? undefined : validationRecoverySuggestion,
        });
    }
    return validatedState;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const inflightPromises = [];
const addInflightPromise = (resolver) => {
    inflightPromises.push(resolver);
};
const resolveAndClearInflightPromises = () => {
    while (inflightPromises.length) {
        inflightPromises.pop()?.();
    }
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger = new ConsoleLogger('AuthError');
const authErrorMessages = {
    oauthSignInError: {
        message: AuthErrorStrings.OAUTH_ERROR,
        log: 'Make sure Cognito Hosted UI has been configured correctly',
    },
    noConfig: {
        message: AuthErrorStrings.DEFAULT_MSG,
        log: `
            Error: Amplify has not been configured correctly.
            This error is typically caused by one of the following scenarios:

            1. Make sure you're passing the awsconfig object to Amplify.configure() in your app's entry point
                See https://aws-amplify.github.io/docs/js/authentication#configure-your-app for more information
            
            2. There might be multiple conflicting versions of amplify packages in your node_modules.
				Refer to our docs site for help upgrading Amplify packages (https://docs.amplify.aws/lib/troubleshooting/upgrading/q/platform/js)
        `,
    },
    missingAuthConfig: {
        message: AuthErrorStrings.DEFAULT_MSG,
        log: `
            Error: Amplify has not been configured correctly. 
            The configuration object is missing required auth properties.
            This error is typically caused by one of the following scenarios:

            1. Did you run \`amplify push\` after adding auth via \`amplify add auth\`?
                See https://aws-amplify.github.io/docs/js/authentication#amplify-project-setup for more information

            2. This could also be caused by multiple conflicting versions of amplify packages, see (https://docs.amplify.aws/lib/troubleshooting/upgrading/q/platform/js) for help upgrading Amplify packages.
        `,
    },
    emptyUsername: {
        message: AuthErrorStrings.EMPTY_USERNAME,
    },
    // TODO: should include a list of valid sign-in types
    invalidUsername: {
        message: AuthErrorStrings.INVALID_USERNAME,
    },
    emptyPassword: {
        message: AuthErrorStrings.EMPTY_PASSWORD,
    },
    emptyCode: {
        message: AuthErrorStrings.EMPTY_CODE,
    },
    signUpError: {
        message: AuthErrorStrings.SIGN_UP_ERROR,
        log: 'The first parameter should either be non-null string or object',
    },
    noMFA: {
        message: AuthErrorStrings.NO_MFA,
    },
    invalidMFA: {
        message: AuthErrorStrings.INVALID_MFA,
    },
    emptyChallengeResponse: {
        message: AuthErrorStrings.EMPTY_CHALLENGE,
    },
    noUserSession: {
        message: AuthErrorStrings.NO_USER_SESSION,
    },
    deviceConfig: {
        message: AuthErrorStrings.DEVICE_CONFIG,
    },
    networkError: {
        message: AuthErrorStrings.NETWORK_ERROR,
    },
    autoSignInError: {
        message: AuthErrorStrings.AUTOSIGNIN_ERROR,
    },
    default: {
        message: AuthErrorStrings.DEFAULT_MSG,
    },
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createOAuthError = (message, recoverySuggestion) => new AuthError({
    message: message ?? 'An error has occurred during the oauth process.',
    name: AuthErrorCodes.OAuthSignInError,
    recoverySuggestion: recoverySuggestion ?? authErrorMessages.oauthSignInError.log,
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const completeOAuthFlow = async ({ currentUrl, userAgentValue, clientId, redirectUri, responseType, domain, preferPrivateSession, }) => {
    const urlParams = new AmplifyUrl(currentUrl);
    const error = urlParams.searchParams.get('error');
    const errorMessage = urlParams.searchParams.get('error_description');
    if (error) {
        throw createOAuthError(errorMessage ?? error);
    }
    if (responseType === 'code') {
        return handleCodeFlow({
            currentUrl,
            userAgentValue,
            clientId,
            redirectUri,
            domain,
            preferPrivateSession,
        });
    }
    return handleImplicitFlow({
        currentUrl,
        redirectUri,
        preferPrivateSession,
    });
};
const handleCodeFlow = async ({ currentUrl, userAgentValue, clientId, redirectUri, domain, preferPrivateSession, }) => {
    /* Convert URL into an object with parameters as keys
{ redirect_uri: 'http://localhost:3000/', response_type: 'code', ...} */
    const url = new AmplifyUrl(currentUrl);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    // if `code` or `state` is not presented in the redirect url, most likely
    // that the end user cancelled the inflight oauth flow by:
    // 1. clicking the back button of browser
    // 2. closing the provider hosted UI page and coming back to the app
    if (!code || !state) {
        throw createOAuthError('User cancelled OAuth flow.');
    }
    // may throw error is being caught in attemptCompleteOAuthFlow.ts
    const validatedState = await validateState(state);
    const oAuthTokenEndpoint = 'https://' + domain + '/oauth2/token';
    // TODO(v6): check hub events
    // dispatchAuthEvent(
    // 	'codeFlow',
    // 	{},
    // 	`Retrieving tokens from ${oAuthTokenEndpoint}`
    // );
    const codeVerifier = await oAuthStore.loadPKCE();
    const oAuthTokenBody = {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
        ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
    };
    const body = Object.entries(oAuthTokenBody)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    const { access_token, refresh_token, id_token, error, error_message, token_type, expires_in, } = await (await fetch(oAuthTokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            [USER_AGENT_HEADER]: userAgentValue,
        },
        body,
    })).json();
    if (error) {
        // error is being caught in attemptCompleteOAuthFlow.ts
        throw createOAuthError(error_message ?? error);
    }
    const username = (access_token && decodeJWT(access_token).payload.username) ?? 'username';
    await cacheCognitoTokens({
        username,
        AccessToken: access_token,
        IdToken: id_token,
        RefreshToken: refresh_token,
        TokenType: token_type,
        ExpiresIn: expires_in,
    });
    return completeFlow({
        redirectUri,
        state: validatedState,
        preferPrivateSession,
    });
};
const handleImplicitFlow = async ({ currentUrl, redirectUri, preferPrivateSession, }) => {
    // hash is `null` if `#` doesn't exist on URL
    const url = new AmplifyUrl(currentUrl);
    const { id_token, access_token, state, token_type, expires_in, error_description, error, } = (url.hash ?? '#')
        .substring(1) // Remove # from returned code
        .split('&')
        .map(pairings => pairings.split('='))
        .reduce((accum, [k, v]) => ({ ...accum, [k]: v }), {
        id_token: undefined,
        access_token: undefined,
        state: undefined,
        token_type: undefined,
        expires_in: undefined,
        error_description: undefined,
        error: undefined,
    });
    if (error) {
        throw createOAuthError(error_description ?? error);
    }
    if (!access_token) {
        // error is being caught in attemptCompleteOAuthFlow.ts
        throw createOAuthError('No access token returned from OAuth flow.');
    }
    const validatedState = await validateState(state);
    const username = (access_token && decodeJWT(access_token).payload.username) ?? 'username';
    await cacheCognitoTokens({
        username,
        AccessToken: access_token,
        IdToken: id_token,
        TokenType: token_type,
        ExpiresIn: expires_in,
    });
    return completeFlow({
        redirectUri,
        state: validatedState,
        preferPrivateSession,
    });
};
const completeFlow = async ({ redirectUri, state, preferPrivateSession, }) => {
    await oAuthStore.clearOAuthData();
    await oAuthStore.storeOAuthSignIn(true, preferPrivateSession);
    // this should be called before any call that involves `fetchAuthSession`
    // e.g. `getCurrentUser()` below, so it allows every inflight async calls to
    //  `fetchAuthSession` can be resolved
    resolveAndClearInflightPromises();
    // when the oauth flow is completed, there should be nothing to block the async calls
    // that involves fetchAuthSession in the `TokenOrchestrator`
    cognitoUserPoolsTokenProvider.setWaitForInflightOAuth(async () => { });
    if (isCustomState(state)) {
        Hub.dispatch('auth', {
            event: 'customOAuthState',
            data: urlSafeDecode(getCustomState(state)),
        }, 'Auth', AMPLIFY_SYMBOL);
    }
    Hub.dispatch('auth', { event: 'signInWithRedirect' }, 'Auth', AMPLIFY_SYMBOL);
    Hub.dispatch('auth', { event: 'signedIn', data: await getCurrentUser$1() }, 'Auth', AMPLIFY_SYMBOL);
    clearHistory(redirectUri);
};
const isCustomState = (state) => {
    return /-/.test(state);
};
const getCustomState = (state) => {
    return state.split('-').splice(1).join('-');
};
const clearHistory = (redirectUri) => {
    if (typeof window !== 'undefined' && typeof window.history !== 'undefined') {
        window.history.replaceState(window.history.state, '', redirectUri);
    }
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/** @internal */
function getRedirectUrl(redirects) {
    const redirectUrlFromTheSameOrigin = redirects?.find(isSameOriginAndPathName) ??
        redirects?.find(isTheSameDomain);
    const redirectUrlFromDifferentOrigin = redirects?.find(isHttps) ?? redirects?.find(isHttp);
    if (redirectUrlFromTheSameOrigin) {
        return redirectUrlFromTheSameOrigin;
    }
    else if (redirectUrlFromDifferentOrigin) {
        throw invalidOriginException;
    }
    throw invalidRedirectException;
}
// origin + pathname => https://example.com/app
const isSameOriginAndPathName = (redirect) => redirect.startsWith(String(window.location.origin + window.location.pathname ?? '/'));
// domain => outlook.live.com, github.com
const isTheSameDomain = (redirect) => redirect.includes(String(window.location.hostname));
const isHttp = (redirect) => redirect.startsWith('http://');
const isHttps = (redirect) => redirect.startsWith('https://');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const handleFailure = async (error) => {
    resolveAndClearInflightPromises();
    await oAuthStore.clearOAuthInflightData();
    Hub.dispatch('auth', { event: 'signInWithRedirect_failure', data: { error } }, 'Auth', AMPLIFY_SYMBOL);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const attemptCompleteOAuthFlow = async (authConfig) => {
    try {
        assertTokenProviderConfig(authConfig);
        assertOAuthConfig(authConfig);
        oAuthStore.setAuthConfig(authConfig);
    }
    catch (_) {
        // no-op
        // This should not happen as Amplify singleton checks the oauth config key
        // unless the oauth config object doesn't contain required properties
        return;
    }
    // No inflight OAuth
    if (!(await oAuthStore.loadOAuthInFlight())) {
        return;
    }
    // when there is valid oauth config and there is an inflight oauth flow, try
    // to block async calls that require fetching tokens before the oauth flow completes
    // e.g. getCurrentUser, fetchAuthSession etc.
    cognitoUserPoolsTokenProvider.setWaitForInflightOAuth(() => new Promise(async (res, _rej) => {
        addInflightPromise(res);
    }));
    try {
        const currentUrl = window.location.href;
        const { loginWith, userPoolClientId } = authConfig;
        const { domain, redirectSignIn, responseType } = loginWith.oauth;
        const redirectUri = getRedirectUrl(redirectSignIn);
        await completeOAuthFlow({
            currentUrl,
            clientId: userPoolClientId,
            domain,
            redirectUri,
            responseType,
            userAgentValue: getAuthUserAgentValue(AuthAction.SignInWithRedirect),
        });
    }
    catch (err) {
        await handleFailure(err);
    }
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// attach the side effect for handling the completion of an inflight oauth flow
// this side effect works only on Web
isBrowser() &&
    (() => {
        // add the listener to the singleton for triggering
        Amplify[ADD_OAUTH_LISTENER](attemptCompleteOAuthFlow);
    })();

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const IdentityIdStorageKeys = {
    identityId: 'identityId',
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger$1 = new ConsoleLogger('DefaultIdentityIdStore');
class DefaultIdentityIdStore {
    setAuthConfig(authConfigParam) {
        assertIdentityPoolIdConfig(authConfigParam.Cognito);
        this.authConfig = authConfigParam;
        this._authKeys = createKeysForAuthStorage$2('Cognito', authConfigParam.Cognito.identityPoolId);
        return;
    }
    constructor(keyValueStorage) {
        this._authKeys = {};
        this.keyValueStorage = keyValueStorage;
    }
    async loadIdentityId() {
        assertIdentityPoolIdConfig(this.authConfig?.Cognito);
        try {
            if (!!this._primaryIdentityId) {
                return {
                    id: this._primaryIdentityId,
                    type: 'primary',
                };
            }
            else {
                const storedIdentityId = await this.keyValueStorage.getItem(this._authKeys.identityId);
                if (!!storedIdentityId) {
                    return {
                        id: storedIdentityId,
                        type: 'guest',
                    };
                }
                return null;
            }
        }
        catch (err) {
            logger$1.log('Error getting stored IdentityId.', err);
            return null;
        }
    }
    async storeIdentityId(identity) {
        assertIdentityPoolIdConfig(this.authConfig?.Cognito);
        if (identity.type === 'guest') {
            this.keyValueStorage.setItem(this._authKeys.identityId, identity.id);
            // Clear in-memory storage of primary identityId
            this._primaryIdentityId = undefined;
        }
        else {
            this._primaryIdentityId = identity.id;
            // Clear locally stored guest id
            this.keyValueStorage.removeItem(this._authKeys.identityId);
        }
    }
    async clearIdentityId() {
        this._primaryIdentityId = undefined;
        await this.keyValueStorage.removeItem(this._authKeys.identityId);
    }
}
const createKeysForAuthStorage$2 = (provider, identifier) => {
    return getAuthStorageKeys(IdentityIdStorageKeys)(`com.amplify.${provider}`, identifier);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function formLoginsMap(idToken) {
    const issuer = decodeJWT(idToken).payload.iss;
    const res = {};
    if (!issuer) {
        throw new AuthError({
            name: 'InvalidIdTokenException',
            message: 'Invalid Idtoken.',
        });
    }
    let domainName = issuer.replace(/(^\w+:|^)\/\//, '');
    res[domainName] = idToken;
    return res;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger$2 = new ConsoleLogger('CognitoIdentityIdProvider');
/**
 * Provides a Cognito identityId
 *
 * @param tokens - The AuthTokens received after SignIn
 * @returns string
 * @throws configuration excpetions: {@link InvalidIdentityPoolIdException }
 *  - Auth errors that may arise from misconfiguration.
 * @throws service excpetions: {@link GetIdException }
 */
async function cognitoIdentityIdProvider({ tokens, authConfig, identityIdStore, }) {
    identityIdStore.setAuthConfig({ Cognito: authConfig });
    // will return null only if there is no identityId cached or if there is an error retrieving it
    let identityId = await identityIdStore.loadIdentityId();
    // Tokens are available so return primary identityId
    if (tokens) {
        // If there is existing primary identityId in-memory return that
        if (identityId && identityId.type === 'primary') {
            return identityId.id;
        }
        else {
            const logins = tokens.idToken
                ? formLoginsMap(tokens.idToken.toString())
                : {};
            const generatedIdentityId = await generateIdentityId(logins, authConfig);
            if (identityId && identityId.id === generatedIdentityId) {
                logger$2.debug(`The guest identity ${identityId.id} has become the primary identity.`);
            }
            identityId = {
                id: generatedIdentityId,
                type: 'primary',
            };
        }
    }
    else {
        // If there is existing guest identityId cached return that
        if (identityId && identityId.type === 'guest') {
            return identityId.id;
        }
        else {
            identityId = {
                id: await generateIdentityId({}, authConfig),
                type: 'guest',
            };
        }
    }
    // Store in-memory or local storage depending on guest or primary identityId
    identityIdStore.storeIdentityId(identityId);
    return identityId.id;
}
async function generateIdentityId(logins, authConfig) {
    const identityPoolId = authConfig?.identityPoolId;
    const region = getRegionFromIdentityPoolId(identityPoolId);
    // IdentityId is absent so get it using IdentityPoolId with Cognito's GetId API
    const idResult = 
    // for a first-time user, this will return a brand new identity
    // for a returning user, this will retrieve the previous identity assocaited with the logins
    (await getId({
        region,
    }, {
        IdentityPoolId: identityPoolId,
        Logins: logins,
    })).IdentityId;
    if (!idResult) {
        throw new AuthError({
            name: 'GetIdResponseException',
            message: 'Received undefined response from getId operation',
            recoverySuggestion: 'Make sure to pass a valid identityPoolId in the configuration.',
        });
    }
    return idResult;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger$3 = new ConsoleLogger('CognitoCredentialsProvider');
const CREDENTIALS_TTL = 50 * 60 * 1000; // 50 min, can be modified on config if required in the future
class CognitoAWSCredentialsAndIdentityIdProvider {
    constructor(identityIdStore) {
        this._nextCredentialsRefresh = 0;
        this._identityIdStore = identityIdStore;
    }
    async clearCredentialsAndIdentityId() {
        logger$3.debug('Clearing out credentials and identityId');
        this._credentialsAndIdentityId = undefined;
        await this._identityIdStore.clearIdentityId();
    }
    async clearCredentials() {
        logger$3.debug('Clearing out in-memory credentials');
        this._credentialsAndIdentityId = undefined;
    }
    async getCredentialsAndIdentityId(getCredentialsOptions) {
        const isAuthenticated = getCredentialsOptions.authenticated;
        const tokens = getCredentialsOptions.tokens;
        const authConfig = getCredentialsOptions.authConfig;
        try {
            assertIdentityPoolIdConfig(authConfig?.Cognito);
        }
        catch {
            // No identity pool configured, skipping
            return;
        }
        if (!isAuthenticated && !authConfig.Cognito.allowGuestAccess) {
            // TODO(V6): return partial result like Native platforms
            return;
        }
        const forceRefresh = getCredentialsOptions.forceRefresh;
        const tokenHasChanged = this.hasTokenChanged(tokens);
        const identityId = await cognitoIdentityIdProvider({
            tokens,
            authConfig: authConfig.Cognito,
            identityIdStore: this._identityIdStore,
        });
        // Clear cached credentials when forceRefresh is true OR the cache token has changed
        if (forceRefresh || tokenHasChanged) {
            this.clearCredentials();
        }
        if (!isAuthenticated) {
            return this.getGuestCredentials(identityId, authConfig.Cognito);
        }
        else {
            assertIdTokenInAuthTokens(tokens);
            return this.credsForOIDCTokens(authConfig.Cognito, tokens, identityId);
        }
    }
    async getGuestCredentials(identityId, authConfig) {
        // Return existing in-memory cached credentials only if it exists, is not past it's lifetime and is unauthenticated credentials
        if (this._credentialsAndIdentityId &&
            !this.isPastTTL() &&
            this._credentialsAndIdentityId.isAuthenticatedCreds === false) {
            logger$3.info('returning stored credentials as they neither past TTL nor expired.');
            return this._credentialsAndIdentityId;
        }
        // Clear to discard if any authenticated credentials are set and start with a clean slate
        this.clearCredentials();
        const region = getRegionFromIdentityPoolId(authConfig.identityPoolId);
        // use identityId to obtain guest credentials
        // save credentials in-memory
        // No logins params should be passed for guest creds:
        // https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetCredentialsForIdentity.html
        const clientResult = await getCredentialsForIdentity({ region }, {
            IdentityId: identityId,
        });
        if (clientResult.Credentials &&
            clientResult.Credentials.AccessKeyId &&
            clientResult.Credentials.SecretKey) {
            this._nextCredentialsRefresh = new Date().getTime() + CREDENTIALS_TTL;
            const res = {
                credentials: {
                    accessKeyId: clientResult.Credentials.AccessKeyId,
                    secretAccessKey: clientResult.Credentials.SecretKey,
                    sessionToken: clientResult.Credentials.SessionToken,
                    expiration: clientResult.Credentials.Expiration,
                },
                identityId,
            };
            const identityIdRes = clientResult.IdentityId;
            if (identityIdRes) {
                res.identityId = identityIdRes;
                this._identityIdStore.storeIdentityId({
                    id: identityIdRes,
                    type: 'guest',
                });
            }
            this._credentialsAndIdentityId = {
                ...res,
                isAuthenticatedCreds: false,
            };
            return res;
        }
        else {
            throw new AuthError({
                name: 'CredentialsNotFoundException',
                message: `Cognito did not respond with either Credentials, AccessKeyId or SecretKey.`,
            });
        }
    }
    async credsForOIDCTokens(authConfig, authTokens, identityId) {
        if (this._credentialsAndIdentityId &&
            !this.isPastTTL() &&
            this._credentialsAndIdentityId.isAuthenticatedCreds === true) {
            logger$3.debug('returning stored credentials as they neither past TTL nor expired.');
            return this._credentialsAndIdentityId;
        }
        // Clear to discard if any unauthenticated credentials are set and start with a clean slate
        this.clearCredentials();
        const logins = authTokens.idToken
            ? formLoginsMap(authTokens.idToken.toString())
            : {};
        const region = getRegionFromIdentityPoolId(authConfig.identityPoolId);
        const clientResult = await getCredentialsForIdentity({ region }, {
            IdentityId: identityId,
            Logins: logins,
        });
        if (clientResult.Credentials &&
            clientResult.Credentials.AccessKeyId &&
            clientResult.Credentials.SecretKey) {
            const res = {
                credentials: {
                    accessKeyId: clientResult.Credentials.AccessKeyId,
                    secretAccessKey: clientResult.Credentials.SecretKey,
                    sessionToken: clientResult.Credentials.SessionToken,
                    expiration: clientResult.Credentials.Expiration,
                },
                identityId,
            };
            // Store the credentials in-memory along with the expiration
            this._credentialsAndIdentityId = {
                ...res,
                isAuthenticatedCreds: true,
                associatedIdToken: authTokens.idToken?.toString(),
            };
            this._nextCredentialsRefresh = new Date().getTime() + CREDENTIALS_TTL;
            const identityIdRes = clientResult.IdentityId;
            if (identityIdRes) {
                res.identityId = identityIdRes;
                this._identityIdStore.storeIdentityId({
                    id: identityIdRes,
                    type: 'primary',
                });
            }
            return res;
        }
        else {
            throw new AuthError({
                name: 'CredentialsException',
                message: `Cognito did not respond with either Credentials, AccessKeyId or SecretKey.`,
            });
        }
    }
    isPastTTL() {
        return this._nextCredentialsRefresh === undefined
            ? true
            : this._nextCredentialsRefresh <= Date.now();
    }
    hasTokenChanged(tokens) {
        return (!!tokens &&
            !!this._credentialsAndIdentityId?.associatedIdToken &&
            tokens.idToken?.toString() !==
                this._credentialsAndIdentityId.associatedIdToken);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Cognito specific implmentation of the CredentialsProvider interface
 * that manages setting and getting of AWS Credentials.
 *
 * @throws configuration expections: {@link InvalidIdentityPoolIdException }
 *  - Auth errors that may arise from misconfiguration.
 * @throws service expections: {@link GetCredentialsForIdentityException}, {@link GetIdException}
 *
 */
const cognitoCredentialsProvider = new CognitoAWSCredentialsAndIdentityIdProvider(new DefaultIdentityIdStore(defaultStorage));

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DefaultAmplify = {
    /**
     * Configures Amplify with the {@link resourceConfig} and {@link libraryOptions}.
     *
     * @param resourceConfig The {@link ResourcesConfig} object that is typically imported from the
     * `amplifyconfiguration.json` file. It can also be an object literal created inline when calling `Amplify.configure`.
     * @param libraryOptions The {@link LibraryOptions} additional options for the library.
     *
     * @example
     * import config from './amplifyconfiguration.json';
     *
     * Amplify.configure(config);
     */
    configure(resourceConfig, libraryOptions) {
        let resolvedResourceConfig;
        if (Object.keys(resourceConfig).some(key => key.startsWith('aws_'))) {
            resolvedResourceConfig = parseAWSExports(resourceConfig);
        }
        else {
            resolvedResourceConfig = resourceConfig;
        }
        // If no Auth config is provided, no special handling will be required, configure as is.
        // Otherwise, we can assume an Auth config is provided from here on.
        if (!resolvedResourceConfig.Auth) {
            return Amplify.configure(resolvedResourceConfig, libraryOptions);
        }
        // If Auth options are provided, always just configure as is.
        // Otherwise, we can assume no Auth libraryOptions were provided from here on.
        if (libraryOptions?.Auth) {
            return Amplify.configure(resolvedResourceConfig, libraryOptions);
        }
        // If no Auth libraryOptions were previously configured, then always add default providers.
        if (!Amplify.libraryOptions.Auth) {
            cognitoUserPoolsTokenProvider.setAuthConfig(resolvedResourceConfig.Auth);
            cognitoUserPoolsTokenProvider.setKeyValueStorage(
            // TODO: allow configure with a public interface
            libraryOptions?.ssr
                ? new CookieStorage({ sameSite: 'lax' })
                : defaultStorage);
            return Amplify.configure(resolvedResourceConfig, {
                ...libraryOptions,
                Auth: {
                    tokenProvider: cognitoUserPoolsTokenProvider,
                    credentialsProvider: cognitoCredentialsProvider,
                },
            });
        }
        // At this point, Auth libraryOptions would have been previously configured and no overriding
        // Auth options were given, so we should preserve the currently configured Auth libraryOptions.
        if (libraryOptions) {
            // If ssr is provided through libraryOptions, we should respect the intentional reconfiguration.
            if (libraryOptions.ssr !== undefined) {
                cognitoUserPoolsTokenProvider.setKeyValueStorage(
                // TODO: allow configure with a public interface
                libraryOptions.ssr
                    ? new CookieStorage({ sameSite: 'lax' })
                    : defaultStorage);
            }
            return Amplify.configure(resolvedResourceConfig, {
                Auth: Amplify.libraryOptions.Auth,
                ...libraryOptions,
            });
        }
        // Finally, if there were no libraryOptions given at all, we should simply not touch the currently
        // configured libraryOptions.
        Amplify.configure(resolvedResourceConfig);
    },
    /**
     * Returns the {@link ResourcesConfig} object passed in as the `resourceConfig` parameter when calling
     * `Amplify.configure`.
     *
     * @returns An {@link ResourcesConfig} object.
     */
    getConfig() {
        return Amplify.getConfig();
    },
};

export { DefaultAmplify as Amplify };
