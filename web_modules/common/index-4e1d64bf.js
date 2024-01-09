// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var LogType;
(function (LogType) {
    LogType["DEBUG"] = "DEBUG";
    LogType["ERROR"] = "ERROR";
    LogType["INFO"] = "INFO";
    LogType["WARN"] = "WARN";
    LogType["VERBOSE"] = "VERBOSE";
})(LogType || (LogType = {}));

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Logging constants
const AWS_CLOUDWATCH_CATEGORY = 'Logging';
const USER_AGENT_HEADER = 'x-amz-user-agent';
// Error exception code constants
const NO_HUBCALLBACK_PROVIDED_EXCEPTION = 'NoHubcallbackProvidedException';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const LOG_LEVELS = {
    VERBOSE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
};
/**
 * Write logs
 * @class Logger
 */
class ConsoleLogger {
    /**
     * @constructor
     * @param {string} name - Name of the logger
     */
    constructor(name, level = LogType.WARN) {
        this.name = name;
        this.level = level;
        this._pluggables = [];
    }
    _padding(n) {
        return n < 10 ? '0' + n : '' + n;
    }
    _ts() {
        const dt = new Date();
        return ([this._padding(dt.getMinutes()), this._padding(dt.getSeconds())].join(':') +
            '.' +
            dt.getMilliseconds());
    }
    configure(config) {
        if (!config)
            return this._config;
        this._config = config;
        return this._config;
    }
    /**
     * Write log
     * @method
     * @memeberof Logger
     * @param {LogType|string} type - log type, default INFO
     * @param {string|object} msg - Logging message or object
     */
    _log(type, ...msg) {
        let logger_level_name = this.level;
        if (ConsoleLogger.LOG_LEVEL) {
            logger_level_name = ConsoleLogger.LOG_LEVEL;
        }
        if (typeof window !== 'undefined' && window.LOG_LEVEL) {
            logger_level_name = window.LOG_LEVEL;
        }
        const logger_level = LOG_LEVELS[logger_level_name];
        const type_level = LOG_LEVELS[type];
        if (!(type_level >= logger_level)) {
            // Do nothing if type is not greater than or equal to logger level (handle undefined)
            return;
        }
        let log = console.log.bind(console);
        if (type === LogType.ERROR && console.error) {
            log = console.error.bind(console);
        }
        if (type === LogType.WARN && console.warn) {
            log = console.warn.bind(console);
        }
        const prefix = `[${type}] ${this._ts()} ${this.name}`;
        let message = '';
        if (msg.length === 1 && typeof msg[0] === 'string') {
            message = `${prefix} - ${msg[0]}`;
            log(message);
        }
        else if (msg.length === 1) {
            message = `${prefix} ${msg[0]}`;
            log(prefix, msg[0]);
        }
        else if (typeof msg[0] === 'string') {
            let obj = msg.slice(1);
            if (obj.length === 1) {
                obj = obj[0];
            }
            message = `${prefix} - ${msg[0]} ${obj}`;
            log(`${prefix} - ${msg[0]}`, obj);
        }
        else {
            message = `${prefix} ${msg}`;
            log(prefix, msg);
        }
        for (const plugin of this._pluggables) {
            const logEvent = { message, timestamp: Date.now() };
            plugin.pushLogs([logEvent]);
        }
    }
    /**
     * Write General log. Default to INFO
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    log(...msg) {
        this._log(LogType.INFO, ...msg);
    }
    /**
     * Write INFO log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    info(...msg) {
        this._log(LogType.INFO, ...msg);
    }
    /**
     * Write WARN log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    warn(...msg) {
        this._log(LogType.WARN, ...msg);
    }
    /**
     * Write ERROR log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    error(...msg) {
        this._log(LogType.ERROR, ...msg);
    }
    /**
     * Write DEBUG log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    debug(...msg) {
        this._log(LogType.DEBUG, ...msg);
    }
    /**
     * Write VERBOSE log
     * @method
     * @memeberof Logger
     * @param {string|object} msg - Logging message or object
     */
    verbose(...msg) {
        this._log(LogType.VERBOSE, ...msg);
    }
    addPluggable(pluggable) {
        if (pluggable && pluggable.getCategoryName() === AWS_CLOUDWATCH_CATEGORY) {
            this._pluggables.push(pluggable);
            pluggable.configure(this._config);
        }
    }
    listPluggables() {
        return this._pluggables;
    }
}
ConsoleLogger.LOG_LEVEL = null;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class AmplifyError extends Error {
    /**
     *  Constructs an AmplifyError.
     *
     * @param message text that describes the main problem.
     * @param underlyingError the underlying cause of the error.
     * @param recoverySuggestion suggestion to recover from the error.
     *
     */
    constructor({ message, name, recoverySuggestion, underlyingError, }) {
        super(message);
        this.name = name;
        this.underlyingError = underlyingError;
        this.recoverySuggestion = recoverySuggestion;
        // Hack for making the custom error class work when transpiled to es5
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = AmplifyError;
        Object.setPrototypeOf(this, AmplifyError.prototype);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var AmplifyErrorCode;
(function (AmplifyErrorCode) {
    AmplifyErrorCode["NoEndpointId"] = "NoEndpointId";
    AmplifyErrorCode["PlatformNotSupported"] = "PlatformNotSupported";
    AmplifyErrorCode["Unknown"] = "Unknown";
})(AmplifyErrorCode || (AmplifyErrorCode = {}));

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createAssertionFunction = (errorMap, AssertionError = AmplifyError) => (assertion, name, additionalContext) => {
    const { message, recoverySuggestion } = errorMap[name];
    if (!assertion) {
        throw new AssertionError({
            name,
            message: additionalContext
                ? `${message} ${additionalContext}`
                : message,
            recoverySuggestion,
        });
    }
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const AMPLIFY_SYMBOL = (typeof Symbol !== 'undefined'
    ? Symbol('amplify_default')
    : '@@amplify_default');
const logger = new ConsoleLogger('Hub');
class HubClass {
    constructor(name) {
        this.listeners = new Map();
        this.protectedChannels = [
            'core',
            'auth',
            'api',
            'analytics',
            'interactions',
            'pubsub',
            'storage',
            'ui',
            'xr',
        ];
        this.name = name;
    }
    /**
     * Used internally to remove a Hub listener.
     *
     * @remarks
     * This private method is for internal use only. Instead of calling Hub.remove, call the result of Hub.listen.
     */
    _remove(channel, listener) {
        const holder = this.listeners.get(channel);
        if (!holder) {
            logger.warn(`No listeners for ${channel}`);
            return;
        }
        this.listeners.set(channel, [
            ...holder.filter(({ callback }) => callback !== listener),
        ]);
    }
    dispatch(channel, payload, source, ampSymbol) {
        if (typeof channel === 'string' &&
            this.protectedChannels.indexOf(channel) > -1) {
            const hasAccess = ampSymbol === AMPLIFY_SYMBOL;
            if (!hasAccess) {
                logger.warn(`WARNING: ${channel} is protected and dispatching on it can have unintended consequences`);
            }
        }
        const capsule = {
            channel,
            payload: { ...payload },
            source,
            patternInfo: [],
        };
        try {
            this._toListeners(capsule);
        }
        catch (e) {
            logger.error(e);
        }
    }
    listen(channel, callback, listenerName = 'noname') {
        let cb;
        if (typeof callback !== 'function') {
            throw new AmplifyError({
                name: NO_HUBCALLBACK_PROVIDED_EXCEPTION,
                message: 'No callback supplied to Hub',
            });
        }
        else {
            // Needs to be casted as a more generic type
            cb = callback;
        }
        let holder = this.listeners.get(channel);
        if (!holder) {
            holder = [];
            this.listeners.set(channel, holder);
        }
        holder.push({
            name: listenerName,
            callback: cb,
        });
        return () => {
            this._remove(channel, cb);
        };
    }
    _toListeners(capsule) {
        const { channel, payload } = capsule;
        const holder = this.listeners.get(channel);
        if (holder) {
            holder.forEach(listener => {
                logger.debug(`Dispatching to ${channel} with `, payload);
                try {
                    listener.callback(capsule);
                }
                catch (e) {
                    logger.error(e);
                }
            });
        }
    }
}
/*We export a __default__ instance of HubClass to use it as a
pseudo Singleton for the main messaging bus, however you can still create
your own instance of HubClass() for a separate "private bus" of events.*/
const Hub = new HubClass('__default__');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var AuthConfigurationErrorCode;
(function (AuthConfigurationErrorCode) {
    AuthConfigurationErrorCode["AuthTokenConfigException"] = "AuthTokenConfigException";
    AuthConfigurationErrorCode["AuthUserPoolAndIdentityPoolException"] = "AuthUserPoolAndIdentityPoolException";
    AuthConfigurationErrorCode["AuthUserPoolException"] = "AuthUserPoolException";
    AuthConfigurationErrorCode["InvalidIdentityPoolIdException"] = "InvalidIdentityPoolIdException";
    AuthConfigurationErrorCode["OAuthNotConfigureException"] = "OAuthNotConfigureException";
})(AuthConfigurationErrorCode || (AuthConfigurationErrorCode = {}));
const authConfigurationErrorMap = {
    [AuthConfigurationErrorCode.AuthTokenConfigException]: {
        message: 'Auth Token Provider not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure in your app.',
    },
    [AuthConfigurationErrorCode.AuthUserPoolAndIdentityPoolException]: {
        message: 'Auth UserPool or IdentityPool not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure in your app with UserPoolId and IdentityPoolId.',
    },
    [AuthConfigurationErrorCode.AuthUserPoolException]: {
        message: 'Auth UserPool not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure in your app with userPoolId and userPoolClientId.',
    },
    [AuthConfigurationErrorCode.InvalidIdentityPoolIdException]: {
        message: 'Invalid identity pool id provided.',
        recoverySuggestion: 'Make sure a valid identityPoolId is given in the config.',
    },
    [AuthConfigurationErrorCode.OAuthNotConfigureException]: {
        message: 'oauth param not configured.',
        recoverySuggestion: 'Make sure to call Amplify.configure with oauth parameter in your app.',
    },
};
const assert = createAssertionFunction(authConfigurationErrorMap);

const getBtoa = () => {
    // browser
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
        return window.btoa;
    }
    // Next.js global polyfill
    if (typeof btoa === 'function') {
        return btoa;
    }
    throw new AmplifyError({
        name: 'Base64EncoderError',
        message: 'Cannot resolve the `btoa` function from the environment.',
    });
};
const getAtob = () => {
    // browser
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        return window.atob;
    }
    // Next.js global polyfill
    if (typeof atob === 'function') {
        return atob;
    }
    throw new AmplifyError({
        name: 'Base64EncoderError',
        message: 'Cannot resolve the `atob` function from the environment.',
    });
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const base64Decoder = {
    convert(input) {
        return getAtob()(input);
    },
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function assertTokenProviderConfig(cognitoConfig) {
    let assertionValid = true; // assume valid until otherwise proveed
    if (!cognitoConfig) {
        assertionValid = false;
    }
    else {
        assertionValid =
            !!cognitoConfig.userPoolId && !!cognitoConfig.userPoolClientId;
    }
    return assert(assertionValid, AuthConfigurationErrorCode.AuthUserPoolException);
}
function assertOAuthConfig(cognitoConfig) {
    const validOAuthConfig = !!cognitoConfig?.loginWith?.oauth?.domain &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignOut &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignIn &&
        !!cognitoConfig?.loginWith?.oauth?.responseType;
    return assert(validOAuthConfig, AuthConfigurationErrorCode.OAuthNotConfigureException);
}
function assertIdentityPoolIdConfig(cognitoConfig) {
    const validConfig = !!cognitoConfig?.identityPoolId;
    return assert(validConfig, AuthConfigurationErrorCode.InvalidIdentityPoolIdException);
}
function decodeJWT(token) {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        throw new Error('Invalid token');
    }
    try {
        const base64WithUrlSafe = tokenParts[1];
        const base64 = base64WithUrlSafe.replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = decodeURIComponent(base64Decoder
            .convert(base64)
            .split('')
            .map(char => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(''));
        const payload = JSON.parse(jsonStr);
        return {
            toString: () => token,
            payload,
        };
    }
    catch (err) {
        throw new Error('Invalid token payload');
    }
}

function isTokenExpired({ expiresAt, clockDrift, }) {
    const currentTime = Date.now();
    return currentTime + clockDrift > expiresAt;
}
class AuthClass {
    constructor() { }
    /**
     * Configure Auth category
     *
     * @internal
     *
     * @param authResourcesConfig - Resources configurations required by Auth providers.
     * @param authOptions - Client options used by library
     *
     * @returns void
     */
    configure(authResourcesConfig, authOptions) {
        this.authConfig = authResourcesConfig;
        this.authOptions = authOptions;
    }
    async fetchAuthSession(options = {}) {
        let tokens;
        let credentialsAndIdentityId;
        let userSub;
        // Get tokens will throw if session cannot be refreshed (network or service error) or return null if not available
        tokens = await this.getTokens(options);
        if (tokens) {
            userSub = tokens.accessToken?.payload?.sub;
            // getCredentialsAndIdentityId will throw if cannot get credentials (network or service error)
            credentialsAndIdentityId =
                await this.authOptions?.credentialsProvider?.getCredentialsAndIdentityId({
                    authConfig: this.authConfig,
                    tokens,
                    authenticated: true,
                    forceRefresh: options.forceRefresh,
                });
        }
        else {
            // getCredentialsAndIdentityId will throw if cannot get credentials (network or service error)
            credentialsAndIdentityId =
                await this.authOptions?.credentialsProvider?.getCredentialsAndIdentityId({
                    authConfig: this.authConfig,
                    authenticated: false,
                    forceRefresh: options.forceRefresh,
                });
        }
        return {
            tokens,
            credentials: credentialsAndIdentityId?.credentials,
            identityId: credentialsAndIdentityId?.identityId,
            userSub,
        };
    }
    async clearCredentials() {
        if (this.authOptions?.credentialsProvider) {
            return await this.authOptions.credentialsProvider.clearCredentialsAndIdentityId();
        }
    }
    async getTokens(options) {
        return ((await this.authOptions?.tokenProvider?.getTokens(options)) ?? undefined);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger$1 = new ConsoleLogger('parseAWSExports');
const authTypeMapping = {
    API_KEY: 'apiKey',
    AWS_IAM: 'iam',
    AMAZON_COGNITO_USER_POOLS: 'userPool',
    OPENID_CONNECT: 'oidc',
    NONE: 'none',
    LAMBDA: 'lambda',
};
/**
 * Converts the object imported from `aws-exports.js` or `amplifyconfiguration.json` files generated by
 * the Amplify CLI into an object that conforms to the {@link ResourcesConfig}.
 *
 * @param config A configuration object imported  from `aws-exports.js` or `amplifyconfiguration.json`.
 *
 * @returns An object that conforms to the {@link ResourcesConfig} .
 */
const parseAWSExports = (config = {}) => {
    if (!Object.prototype.hasOwnProperty.call(config, 'aws_project_region')) {
        throw new AmplifyError({
            name: 'InvalidParameterException',
            message: 'Invalid config parameter.',
            recoverySuggestion: 'Ensure passing the config object imported from  `amplifyconfiguration.json`.',
        });
    }
    const { aws_appsync_apiKey, aws_appsync_authenticationType, aws_appsync_graphqlEndpoint, aws_appsync_region, aws_bots_config, aws_cognito_identity_pool_id, aws_cognito_sign_up_verification_method, aws_cognito_mfa_configuration, aws_cognito_mfa_types, aws_cognito_password_protection_settings, aws_cognito_verification_mechanisms, aws_cognito_signup_attributes, aws_cognito_social_providers, aws_cognito_username_attributes, aws_mandatory_sign_in, aws_mobile_analytics_app_id, aws_mobile_analytics_app_region, aws_user_files_s3_bucket, aws_user_files_s3_bucket_region, aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing, aws_user_pools_id, aws_user_pools_web_client_id, geo, oauth, predictions, aws_cloud_logic_custom, Notifications, modelIntrospection, } = config;
    const amplifyConfig = {};
    // Analytics
    if (aws_mobile_analytics_app_id) {
        amplifyConfig.Analytics = {
            Pinpoint: {
                appId: aws_mobile_analytics_app_id,
                region: aws_mobile_analytics_app_region,
            },
        };
    }
    // Notifications
    const { InAppMessaging, Push } = Notifications ?? {};
    if (InAppMessaging?.AWSPinpoint || Push?.AWSPinpoint) {
        if (InAppMessaging?.AWSPinpoint) {
            const { appId, region } = InAppMessaging.AWSPinpoint;
            amplifyConfig.Notifications = {
                InAppMessaging: {
                    Pinpoint: {
                        appId,
                        region,
                    },
                },
            };
        }
        if (Push?.AWSPinpoint) {
            const { appId, region } = Push.AWSPinpoint;
            amplifyConfig.Notifications = {
                PushNotification: {
                    Pinpoint: {
                        appId,
                        region,
                    },
                },
            };
        }
    }
    // Interactions
    if (Array.isArray(aws_bots_config)) {
        amplifyConfig.Interactions = {
            LexV1: Object.fromEntries(aws_bots_config.map(bot => [bot.name, bot])),
        };
    }
    // API
    if (aws_appsync_graphqlEndpoint) {
        const defaultAuthMode = authTypeMapping[aws_appsync_authenticationType];
        if (!defaultAuthMode) {
            logger$1.debug(`Invalid authentication type ${aws_appsync_authenticationType}. Falling back to IAM.`);
        }
        amplifyConfig.API = {
            GraphQL: {
                endpoint: aws_appsync_graphqlEndpoint,
                apiKey: aws_appsync_apiKey,
                region: aws_appsync_region,
                defaultAuthMode: defaultAuthMode ?? 'iam',
            },
        };
        if (modelIntrospection) {
            amplifyConfig.API.GraphQL.modelIntrospection = modelIntrospection;
        }
    }
    // Auth
    const mfaConfig = aws_cognito_mfa_configuration
        ? {
            status: aws_cognito_mfa_configuration &&
                aws_cognito_mfa_configuration.toLowerCase(),
            totpEnabled: aws_cognito_mfa_types?.includes('TOTP') ?? false,
            smsEnabled: aws_cognito_mfa_types?.includes('SMS') ?? false,
        }
        : undefined;
    const passwordFormatConfig = aws_cognito_password_protection_settings
        ? {
            minLength: aws_cognito_password_protection_settings.passwordPolicyMinLength,
            requireLowercase: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_LOWERCASE') ?? false,
            requireUppercase: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_UPPERCASE') ?? false,
            requireNumbers: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_NUMBERS') ?? false,
            requireSpecialCharacters: aws_cognito_password_protection_settings.passwordPolicyCharacters?.includes('REQUIRES_SYMBOLS') ?? false,
        }
        : undefined;
    const mergedUserAttributes = Array.from(new Set([
        ...(aws_cognito_verification_mechanisms ?? []),
        ...(aws_cognito_signup_attributes ?? []),
    ]));
    const userAttributes = mergedUserAttributes.reduce((attributes, key) => ({
        ...attributes,
        // All user attributes generated by the CLI are required
        [key.toLowerCase()]: { required: true },
    }), {});
    const loginWithEmailEnabled = aws_cognito_username_attributes?.includes('EMAIL') ?? false;
    const loginWithPhoneEnabled = aws_cognito_username_attributes?.includes('PHONE_NUMBER') ?? false;
    if (aws_cognito_identity_pool_id || aws_user_pools_id) {
        amplifyConfig.Auth = {
            Cognito: {
                identityPoolId: aws_cognito_identity_pool_id,
                allowGuestAccess: aws_mandatory_sign_in !== 'enable',
                signUpVerificationMethod: aws_cognito_sign_up_verification_method,
                userAttributes,
                userPoolClientId: aws_user_pools_web_client_id,
                userPoolId: aws_user_pools_id,
                mfa: mfaConfig,
                passwordFormat: passwordFormatConfig,
                loginWith: {
                    username: loginWithEmailEnabled || loginWithPhoneEnabled ? false : true,
                    email: loginWithEmailEnabled,
                    phone: loginWithPhoneEnabled,
                },
            },
        };
    }
    const hasOAuthConfig = oauth ? Object.keys(oauth).length > 0 : false;
    const hasSocialProviderConfig = aws_cognito_social_providers
        ? aws_cognito_social_providers.length > 0
        : false;
    if (amplifyConfig.Auth && hasOAuthConfig) {
        amplifyConfig.Auth.Cognito.loginWith = {
            ...amplifyConfig.Auth.Cognito.loginWith,
            oauth: {
                ...getOAuthConfig(oauth),
                ...(hasSocialProviderConfig && {
                    providers: parseSocialProviders(aws_cognito_social_providers),
                }),
            },
        };
    }
    // Storage
    if (aws_user_files_s3_bucket) {
        amplifyConfig.Storage = {
            S3: {
                bucket: aws_user_files_s3_bucket,
                region: aws_user_files_s3_bucket_region,
                dangerouslyConnectToHttpEndpointForTesting: aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing,
            },
        };
    }
    // Geo
    if (geo) {
        const { amazon_location_service } = geo;
        amplifyConfig.Geo = amazon_location_service
            ? {
                LocationService: {
                    ...amazon_location_service,
                    searchIndices: amazon_location_service.search_indices,
                    region: amazon_location_service.region,
                },
            }
            : { ...geo };
    }
    // REST API
    if (aws_cloud_logic_custom) {
        amplifyConfig.API = {
            ...amplifyConfig.API,
            REST: aws_cloud_logic_custom.reduce((acc, api) => {
                const { name, endpoint, region, service } = api;
                return {
                    ...acc,
                    [name]: {
                        endpoint,
                        ...(service ? { service } : undefined),
                        ...(region ? { region } : undefined),
                    },
                };
            }, {}),
        };
    }
    // Predictions
    if (predictions) {
        // map VoiceId from speechGenerator defaults to voiceId
        const { VoiceId: voiceId } = predictions?.convert?.speechGenerator?.defaults ?? {};
        amplifyConfig.Predictions = voiceId
            ? {
                ...predictions,
                convert: {
                    ...predictions.convert,
                    speechGenerator: {
                        ...predictions.convert.speechGenerator,
                        defaults: { voiceId },
                    },
                },
            }
            : predictions;
    }
    return amplifyConfig;
};
const getRedirectUrl = (redirectStr) => redirectStr?.split(',') ?? [];
const getOAuthConfig = ({ domain, scope, redirectSignIn, redirectSignOut, responseType, }) => ({
    domain,
    scopes: scope,
    redirectSignIn: getRedirectUrl(redirectSignIn),
    redirectSignOut: getRedirectUrl(redirectSignOut),
    responseType,
});
const parseSocialProviders = (aws_cognito_social_providers) => {
    return aws_cognito_social_providers.map((provider) => {
        const updatedProvider = provider.toLowerCase();
        return updatedProvider.charAt(0).toUpperCase() + updatedProvider.slice(1);
    });
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const isNonRetryableError = (obj) => {
    const key = 'nonRetryable';
    return obj && obj[key];
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger$2 = new ConsoleLogger('retryUtil');
/**
 * @private
 * Internal use of Amplify only
 */
async function retry(functionToRetry, args, delayFn, onTerminate) {
    if (typeof functionToRetry !== 'function') {
        throw Error('functionToRetry must be a function');
    }
    return new Promise(async (resolve, reject) => {
        let attempt = 0;
        let terminated = false;
        let timeout;
        let wakeUp = () => { }; // will be replaced with a resolver()
        // used after the loop if terminated while waiting for a timer.
        let lastError;
        onTerminate &&
            onTerminate.then(() => {
                // signal not to try anymore.
                terminated = true;
                // stop sleeping if we're sleeping.
                clearTimeout(timeout);
                wakeUp();
            });
        while (!terminated) {
            attempt++;
            logger$2.debug(`${functionToRetry.name} attempt #${attempt} with this vars: ${JSON.stringify(args)}`);
            try {
                return resolve(await functionToRetry(...args));
            }
            catch (err) {
                lastError = err;
                logger$2.debug(`error on ${functionToRetry.name}`, err);
                if (isNonRetryableError(err)) {
                    logger$2.debug(`${functionToRetry.name} non retryable error`, err);
                    return reject(err);
                }
                const retryIn = delayFn(attempt, args, err);
                logger$2.debug(`${functionToRetry.name} retrying in ${retryIn} ms`);
                // we check `terminated` again here because it could have flipped
                // in the time it took `functionToRetry` to return.
                if (retryIn === false || terminated) {
                    return reject(err);
                }
                else {
                    await new Promise(r => {
                        wakeUp = r; // export wakeUp for onTerminate handling
                        timeout = setTimeout(wakeUp, retryIn);
                    });
                }
            }
        }
        // reached if terminated while waiting for a timer.
        reject(lastError);
    });
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const deepFreeze = (object) => {
    const propNames = Reflect.ownKeys(object);
    for (const name of propNames) {
        const value = object[name];
        if ((value && typeof value === 'object') || typeof value === 'function') {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const ADD_OAUTH_LISTENER = Symbol('oauth-listener');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class AmplifyClass {
    constructor() {
        this.oAuthListener = undefined;
        this.resourcesConfig = {};
        this.libraryOptions = {};
        this.Auth = new AuthClass();
    }
    /**
     * Configures Amplify for use with your back-end resources.
     *
     * @remarks
     * This API does not perform any merging of either `resourcesConfig` or `libraryOptions`. The most recently
     * provided values will be used after configuration.
     *
     * @remarks
     * `configure` can be used to specify additional library options where available for supported categories.
     *
     * @param resourceConfig - Back-end resource configuration. Typically provided via the `aws-exports.js` file.
     * @param libraryOptions - Additional options for customizing the behavior of the library.
     */
    configure(resourcesConfig, libraryOptions) {
        let resolvedResourceConfig;
        if (Object.keys(resourcesConfig).some(key => key.startsWith('aws_'))) {
            resolvedResourceConfig = parseAWSExports(resourcesConfig);
        }
        else {
            resolvedResourceConfig = resourcesConfig;
        }
        this.resourcesConfig = resolvedResourceConfig;
        if (libraryOptions) {
            this.libraryOptions = libraryOptions;
        }
        // Make resource config immutable
        this.resourcesConfig = deepFreeze(this.resourcesConfig);
        this.Auth.configure(this.resourcesConfig.Auth, this.libraryOptions.Auth);
        Hub.dispatch('core', {
            event: 'configure',
            data: resourcesConfig,
        }, 'Configure', AMPLIFY_SYMBOL);
        this.notifyOAuthListener();
    }
    /**
     * Provides access to the current back-end resource configuration for the Library.
     *
     * @returns Returns the immutable back-end resource configuration.
     */
    getConfig() {
        return this.resourcesConfig;
    }
    /** @internal */
    [ADD_OAUTH_LISTENER](listener) {
        if (this.resourcesConfig.Auth?.Cognito.loginWith?.oauth) {
            // when Amplify has been configured with a valid OAuth config while adding the listener, run it directly
            listener(this.resourcesConfig.Auth?.Cognito);
        }
        else {
            // otherwise register the listener and run it later when Amplify gets configured with a valid oauth config
            this.oAuthListener = listener;
        }
    }
    notifyOAuthListener() {
        if (!this.resourcesConfig.Auth?.Cognito.loginWith?.oauth ||
            !this.oAuthListener) {
            return;
        }
        this.oAuthListener(this.resourcesConfig.Auth?.Cognito);
        // the listener should only be notified once with a valid oauth config
        this.oAuthListener = undefined;
    }
}
/**
 * The `Amplify` utility is used to configure the library.
 *
 * @remarks
 * `Amplify` is responsible for orchestrating cross-category communication within the library.
 */
const Amplify = new AmplifyClass();

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fetchAuthSession = (amplify, options) => {
    return amplify.Auth.fetchAuthSession(options);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fetchAuthSession$1 = (options) => {
    return fetchAuthSession(Amplify, options);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Default partition for AWS services. This is used when the region is not provided or the region is not recognized.
 *
 * @internal
 */
const defaultPartition = {
    id: 'aws',
    outputs: {
        dnsSuffix: 'amazonaws.com',
    },
    regionRegex: '^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$',
    regions: ['aws-global'],
};
/**
 * This data is adapted from the partition file from AWS SDK shared utilities but remove some contents for bundle size
 * concern. Information removed are `dualStackDnsSuffix`, `supportDualStack`, `supportFIPS`, restricted partitions, and
 * list of regions for each partition other than global regions.
 *
 * * Ref: https://docs.aws.amazon.com/general/latest/gr/rande.html#regional-endpoints
 * * Ref: https://github.com/aws/aws-sdk-js-v3/blob/0201baef03c2379f1f6f7150b9d401d4b230d488/packages/util-endpoints/src/lib/aws/partitions.json#L1
 *
 * @internal
 */
const partitionsInfo = {
    partitions: [
        defaultPartition,
        {
            id: 'aws-cn',
            outputs: {
                dnsSuffix: 'amazonaws.com.cn',
            },
            regionRegex: '^cn\\-\\w+\\-\\d+$',
            regions: ['aws-cn-global'],
        },
    ],
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Get the AWS Services endpoint URL's DNS suffix for a given region. A typical AWS regional service endpoint URL will
 * follow this pattern: {endpointPrefix}.{region}.{dnsSuffix}. For example, the endpoint URL for Cognito Identity in
 * us-east-1 will be cognito-identity.us-east-1.amazonaws.com. Here the DnsSuffix is `amazonaws.com`.
 *
 * @param region
 * @returns The DNS suffix
 *
 * @internal
 */
const getDnsSuffix = (region) => {
    const { partitions } = partitionsInfo;
    for (const { regions, outputs, regionRegex } of partitions) {
        const regex = new RegExp(regionRegex);
        if (regions.includes(region) || regex.test(region)) {
            return outputs.dnsSuffix;
        }
    }
    return defaultPartition.outputs.dnsSuffix;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_RETRY_ATTEMPTS = 3;
/**
 * Retry middleware
 */
const retryMiddleware = ({ maxAttempts = DEFAULT_RETRY_ATTEMPTS, retryDecider, computeDelay, abortSignal, }) => {
    if (maxAttempts < 1) {
        throw new Error('maxAttempts must be greater than 0');
    }
    return (next, context) => async function retryMiddleware(request) {
        let error;
        let attemptsCount = context.attemptsCount ?? 0;
        let response;
        // When retry is not needed or max attempts is reached, either error or response will be set. This function handles either cases.
        const handleTerminalErrorOrResponse = () => {
            if (response) {
                addOrIncrementMetadataAttempts(response, attemptsCount);
                return response;
            }
            else {
                addOrIncrementMetadataAttempts(error, attemptsCount);
                throw error;
            }
        };
        while (!abortSignal?.aborted && attemptsCount < maxAttempts) {
            try {
                response = await next(request);
                error = undefined;
            }
            catch (e) {
                error = e;
                response = undefined;
            }
            // context.attemptsCount may be updated after calling next handler which may retry the request by itself.
            attemptsCount =
                (context.attemptsCount ?? 0) > attemptsCount
                    ? context.attemptsCount ?? 0
                    : attemptsCount + 1;
            context.attemptsCount = attemptsCount;
            if (await retryDecider(response, error)) {
                if (!abortSignal?.aborted && attemptsCount < maxAttempts) {
                    // prevent sleep for last attempt or cancelled request;
                    const delay = computeDelay(attemptsCount);
                    await cancellableSleep(delay, abortSignal);
                }
                continue;
            }
            else {
                return handleTerminalErrorOrResponse();
            }
        }
        if (abortSignal?.aborted) {
            throw new Error('Request aborted.');
        }
        else {
            return handleTerminalErrorOrResponse();
        }
    };
};
const cancellableSleep = (timeoutMs, abortSignal) => {
    if (abortSignal?.aborted) {
        return Promise.resolve();
    }
    let timeoutId;
    let sleepPromiseResolveFn;
    const sleepPromise = new Promise(resolve => {
        sleepPromiseResolveFn = resolve;
        timeoutId = setTimeout(resolve, timeoutMs);
    });
    abortSignal?.addEventListener('abort', function cancelSleep(event) {
        clearTimeout(timeoutId);
        abortSignal?.removeEventListener('abort', cancelSleep);
        sleepPromiseResolveFn();
    });
    return sleepPromise;
};
const addOrIncrementMetadataAttempts = (nextHandlerOutput, attempts) => {
    if (Object.prototype.toString.call(nextHandlerOutput) !== '[object Object]') {
        return;
    }
    nextHandlerOutput['$metadata'] = {
        ...(nextHandlerOutput['$metadata'] ?? {}),
        attempts,
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Middleware injects user agent string to specified header(default to 'x-amz-user-agent'),
 * if the header is not set already.
 *
 * TODO: incorporate new user agent design
 */
const userAgentMiddleware = ({ userAgentHeader = 'x-amz-user-agent', userAgentValue = '', }) => next => {
    return async function userAgentMiddleware(request) {
        if (userAgentValue.trim().length === 0) {
            const result = await next(request);
            return result;
        }
        else {
            const headerName = userAgentHeader.toLowerCase();
            request.headers[headerName] = request.headers[headerName]
                ? `${request.headers[headerName]} ${userAgentValue}`
                : userAgentValue;
            const response = await next(request);
            return response;
        }
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Compose a transfer handler with a core transfer handler and a list of middleware.
 * @param coreHandler Core transfer handler
 * @param middleware	List of middleware
 * @returns A transfer handler whose option type is the union of the core
 * 	transfer handler's option type and the middleware's option type.
 * @internal
 */
const composeTransferHandler = (coreHandler, middleware) => (request, options) => {
    const context = {};
    let composedHandler = (request) => coreHandler(request, options);
    for (let i = middleware.length - 1; i >= 0; i--) {
        const m = middleware[i];
        const resolvedMiddleware = m(options);
        composedHandler = resolvedMiddleware(composedHandler, context);
    }
    return composedHandler(request);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Cache the payload of a response body. It allows multiple calls to the body,
 * for example, when reading the body in both retry decider and error deserializer.
 * Caching body is allowed here because we call the body accessor(blob(), json(),
 * etc.) when body is small or streaming implementation is not available(RN).
 *
 * @internal
 */
const withMemoization = (payloadAccessor) => {
    let cached;
    return () => {
        if (!cached) {
            // Explicitly not awaiting. Intermediate await would add overhead and
            // introduce a possible race in the event that this wrapper is called
            // again before the first `payloadAccessor` call resolves.
            cached = payloadAccessor();
        }
        return cached;
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const shouldSendBody = (method) => !['HEAD', 'GET', 'DELETE'].includes(method.toUpperCase());
// TODO[AllanZhengYP]: we need to provide isCanceledError utility
const fetchTransferHandler = async ({ url, method, headers, body }, { abortSignal, cache, withCrossDomainCredentials }) => {
    let resp;
    try {
        resp = await fetch(url, {
            method,
            headers,
            body: shouldSendBody(method) ? body : undefined,
            signal: abortSignal,
            cache,
            credentials: withCrossDomainCredentials ? 'include' : 'same-origin',
        });
    }
    catch (e) {
        // TODO: needs to revise error handling in v6
        // For now this is a thin wrapper over original fetch error similar to cognito-identity-js package.
        // Ref: https://github.com/aws-amplify/amplify-js/blob/4fbc8c0a2be7526aab723579b4c95b552195a80b/packages/amazon-cognito-identity-js/src/Client.js#L103-L108
        if (e instanceof TypeError) {
            throw new Error('Network error');
        }
        throw e;
    }
    const responseHeaders = {};
    resp.headers?.forEach((value, key) => {
        responseHeaders[key.toLowerCase()] = value;
    });
    const httpResponse = {
        statusCode: resp.status,
        headers: responseHeaders,
        body: null,
    };
    // resp.body is a ReadableStream according to Fetch API spec, but React Native
    // does not implement it.
    const bodyWithMixin = Object.assign(resp.body ?? {}, {
        text: withMemoization(() => resp.text()),
        blob: withMemoization(() => resp.blob()),
        json: withMemoization(() => resp.json()),
    });
    return {
        ...httpResponse,
        body: bodyWithMixin,
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const unauthenticatedHandler = composeTransferHandler(fetchTransferHandler, [userAgentMiddleware, retryMiddleware]);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const MAX_DELAY_MS = 5 * 60 * 1000;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @private
 * Internal use of Amplify only
 */
function jitteredBackoff(maxDelayMs = MAX_DELAY_MS) {
    const BASE_TIME_MS = 100;
    const JITTER_FACTOR = 100;
    return attempt => {
        const delay = 2 ** attempt * BASE_TIME_MS + JITTER_FACTOR * Math.random();
        return delay > maxDelayMs ? false : delay;
    };
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// TODO: [v6] The separate retry utility is used by Data packages now and will replaced by retry middleware.
const DEFAULT_MAX_DELAY_MS = 5 * 60 * 1000;
const jitteredBackoff$1 = attempt => {
    const delayFunction = jitteredBackoff(DEFAULT_MAX_DELAY_MS);
    const delay = delayFunction(attempt);
    // The delayFunction returns false when the delay is greater than the max delay(5 mins).
    // In this case, the retry middleware will delay 5 mins instead, as a ceiling of the delay.
    return delay === false ? DEFAULT_MAX_DELAY_MS : delay;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// via https://github.com/aws/aws-sdk-js-v3/blob/ab0e7be36e7e7f8a0c04834357aaad643c7912c3/packages/service-error-classification/src/constants.ts#L8
const CLOCK_SKEW_ERROR_CODES = [
    'AuthFailure',
    'InvalidSignatureException',
    'RequestExpired',
    'RequestInTheFuture',
    'RequestTimeTooSkewed',
    'SignatureDoesNotMatch',
    'BadRequestException', // API Gateway
];
/**
 * Given an error code, returns true if it is related to a clock skew error.
 *
 * @param errorCode String representation of some error.
 * @returns True if given error is present in `CLOCK_SKEW_ERROR_CODES`, false otherwise.
 *
 * @internal
 */
const isClockSkewError = (errorCode) => !!errorCode && CLOCK_SKEW_ERROR_CODES.includes(errorCode);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Get retry decider function
 * @param errorParser Function to load JavaScript error from HTTP response
 */
const getRetryDecider = (errorParser) => async (response, error) => {
    const parsedError = error ??
        (await errorParser(response)) ??
        undefined;
    const errorCode = parsedError?.['code'];
    const statusCode = response?.statusCode;
    return (isConnectionError(error) ||
        isThrottlingError(statusCode, errorCode) ||
        isClockSkewError(errorCode) ||
        isServerSideError(statusCode, errorCode));
};
// reference: https://github.com/aws/aws-sdk-js-v3/blob/ab0e7be36e7e7f8a0c04834357aaad643c7912c3/packages/service-error-classification/src/constants.ts#L22-L37
const THROTTLING_ERROR_CODES = [
    'BandwidthLimitExceeded',
    'EC2ThrottledException',
    'LimitExceededException',
    'PriorRequestNotComplete',
    'ProvisionedThroughputExceededException',
    'RequestLimitExceeded',
    'RequestThrottled',
    'RequestThrottledException',
    'SlowDown',
    'ThrottledException',
    'Throttling',
    'ThrottlingException',
    'TooManyRequestsException',
];
const TIMEOUT_ERROR_CODES = [
    'TimeoutError',
    'RequestTimeout',
    'RequestTimeoutException',
];
const isThrottlingError = (statusCode, errorCode) => statusCode === 429 ||
    (!!errorCode && THROTTLING_ERROR_CODES.includes(errorCode));
const isConnectionError = (error) => error?.['name'] === 'Network error';
const isServerSideError = (statusCode, errorCode) => (!!statusCode && [500, 502, 503, 504].includes(statusCode)) ||
    (!!errorCode && TIMEOUT_ERROR_CODES.includes(errorCode));

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @internal
 */
var BLOCK_SIZE = 64;
/**
 * @internal
 */
var DIGEST_LENGTH = 32;
/**
 * @internal
 */
var KEY = new Uint32Array([
    0x428a2f98,
    0x71374491,
    0xb5c0fbcf,
    0xe9b5dba5,
    0x3956c25b,
    0x59f111f1,
    0x923f82a4,
    0xab1c5ed5,
    0xd807aa98,
    0x12835b01,
    0x243185be,
    0x550c7dc3,
    0x72be5d74,
    0x80deb1fe,
    0x9bdc06a7,
    0xc19bf174,
    0xe49b69c1,
    0xefbe4786,
    0x0fc19dc6,
    0x240ca1cc,
    0x2de92c6f,
    0x4a7484aa,
    0x5cb0a9dc,
    0x76f988da,
    0x983e5152,
    0xa831c66d,
    0xb00327c8,
    0xbf597fc7,
    0xc6e00bf3,
    0xd5a79147,
    0x06ca6351,
    0x14292967,
    0x27b70a85,
    0x2e1b2138,
    0x4d2c6dfc,
    0x53380d13,
    0x650a7354,
    0x766a0abb,
    0x81c2c92e,
    0x92722c85,
    0xa2bfe8a1,
    0xa81a664b,
    0xc24b8b70,
    0xc76c51a3,
    0xd192e819,
    0xd6990624,
    0xf40e3585,
    0x106aa070,
    0x19a4c116,
    0x1e376c08,
    0x2748774c,
    0x34b0bcb5,
    0x391c0cb3,
    0x4ed8aa4a,
    0x5b9cca4f,
    0x682e6ff3,
    0x748f82ee,
    0x78a5636f,
    0x84c87814,
    0x8cc70208,
    0x90befffa,
    0xa4506ceb,
    0xbef9a3f7,
    0xc67178f2
]);
/**
 * @internal
 */
var INIT = [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
];
/**
 * @internal
 */
var MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;

/**
 * @internal
 */
var RawSha256 = /** @class */ (function () {
    function RawSha256() {
        this.state = Int32Array.from(INIT);
        this.temp = new Int32Array(64);
        this.buffer = new Uint8Array(64);
        this.bufferLength = 0;
        this.bytesHashed = 0;
        /**
         * @internal
         */
        this.finished = false;
    }
    RawSha256.prototype.update = function (data) {
        if (this.finished) {
            throw new Error("Attempted to update an already finished hash.");
        }
        var position = 0;
        var byteLength = data.byteLength;
        this.bytesHashed += byteLength;
        if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH) {
            throw new Error("Cannot hash more than 2^53 - 1 bits");
        }
        while (byteLength > 0) {
            this.buffer[this.bufferLength++] = data[position++];
            byteLength--;
            if (this.bufferLength === BLOCK_SIZE) {
                this.hashBuffer();
                this.bufferLength = 0;
            }
        }
    };
    RawSha256.prototype.digest = function () {
        if (!this.finished) {
            var bitsHashed = this.bytesHashed * 8;
            var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
            var undecoratedLength = this.bufferLength;
            bufferView.setUint8(this.bufferLength++, 0x80);
            // Ensure the final block has enough room for the hashed length
            if (undecoratedLength % BLOCK_SIZE >= BLOCK_SIZE - 8) {
                for (var i = this.bufferLength; i < BLOCK_SIZE; i++) {
                    bufferView.setUint8(i, 0);
                }
                this.hashBuffer();
                this.bufferLength = 0;
            }
            for (var i = this.bufferLength; i < BLOCK_SIZE - 8; i++) {
                bufferView.setUint8(i, 0);
            }
            bufferView.setUint32(BLOCK_SIZE - 8, Math.floor(bitsHashed / 0x100000000), true);
            bufferView.setUint32(BLOCK_SIZE - 4, bitsHashed);
            this.hashBuffer();
            this.finished = true;
        }
        // The value in state is little-endian rather than big-endian, so flip
        // each word into a new Uint8Array
        var out = new Uint8Array(DIGEST_LENGTH);
        for (var i = 0; i < 8; i++) {
            out[i * 4] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>> 8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>> 0) & 0xff;
        }
        return out;
    };
    RawSha256.prototype.hashBuffer = function () {
        var _a = this, buffer = _a.buffer, state = _a.state;
        var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
        for (var i = 0; i < BLOCK_SIZE; i++) {
            if (i < 16) {
                this.temp[i] =
                    ((buffer[i * 4] & 0xff) << 24) |
                        ((buffer[i * 4 + 1] & 0xff) << 16) |
                        ((buffer[i * 4 + 2] & 0xff) << 8) |
                        (buffer[i * 4 + 3] & 0xff);
            }
            else {
                var u = this.temp[i - 2];
                var t1_1 = ((u >>> 17) | (u << 15)) ^ ((u >>> 19) | (u << 13)) ^ (u >>> 10);
                u = this.temp[i - 15];
                var t2_1 = ((u >>> 7) | (u << 25)) ^ ((u >>> 18) | (u << 14)) ^ (u >>> 3);
                this.temp[i] =
                    ((t1_1 + this.temp[i - 7]) | 0) + ((t2_1 + this.temp[i - 16]) | 0);
            }
            var t1 = ((((((state4 >>> 6) | (state4 << 26)) ^
                ((state4 >>> 11) | (state4 << 21)) ^
                ((state4 >>> 25) | (state4 << 7))) +
                ((state4 & state5) ^ (~state4 & state6))) |
                0) +
                ((state7 + ((KEY[i] + this.temp[i]) | 0)) | 0)) |
                0;
            var t2 = ((((state0 >>> 2) | (state0 << 30)) ^
                ((state0 >>> 13) | (state0 << 19)) ^
                ((state0 >>> 22) | (state0 << 10))) +
                ((state0 & state1) ^ (state0 & state2) ^ (state1 & state2))) |
                0;
            state7 = state6;
            state6 = state5;
            state5 = state4;
            state4 = (state3 + t1) | 0;
            state3 = state2;
            state2 = state1;
            state1 = state0;
            state0 = (t1 + t2) | 0;
        }
        state[0] += state0;
        state[1] += state1;
        state[2] += state2;
        state[3] += state3;
        state[4] += state4;
        state[5] += state5;
        state[6] += state6;
        state[7] += state7;
    };
    return RawSha256;
}());

const fromUtf8 = (input) => new TextEncoder().encode(input);

// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// Quick polyfill
var fromUtf8$1 = typeof Buffer !== "undefined" && Buffer.from
    ? function (input) { return Buffer.from(input, "utf8"); }
    : fromUtf8;
function convertToBuffer(data) {
    // Already a Uint8, do nothing
    if (data instanceof Uint8Array)
        return data;
    if (typeof data === "string") {
        return fromUtf8$1(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }
    return new Uint8Array(data);
}

// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isEmptyData(data) {
    if (typeof data === "string") {
        return data.length === 0;
    }
    return data.byteLength === 0;
}

var Sha256 = /** @class */ (function () {
    function Sha256(secret) {
        this.secret = secret;
        this.hash = new RawSha256();
        this.reset();
    }
    Sha256.prototype.update = function (toHash) {
        if (isEmptyData(toHash) || this.error) {
            return;
        }
        try {
            this.hash.update(convertToBuffer(toHash));
        }
        catch (e) {
            this.error = e;
        }
    };
    /* This synchronous method keeps compatibility
     * with the v2 aws-sdk.
     */
    Sha256.prototype.digestSync = function () {
        if (this.error) {
            throw this.error;
        }
        if (this.outer) {
            if (!this.outer.finished) {
                this.outer.update(this.hash.digest());
            }
            return this.outer.digest();
        }
        return this.hash.digest();
    };
    /* The underlying digest method here is synchronous.
     * To keep the same interface with the other hash functions
     * the default is to expose this as an async method.
     * However, it can sometimes be useful to have a sync method.
     */
    Sha256.prototype.digest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.digestSync()];
            });
        });
    };
    Sha256.prototype.reset = function () {
        this.hash = new RawSha256();
        if (this.secret) {
            this.outer = new RawSha256();
            var inner = bufferFromSecret(this.secret);
            var outer = new Uint8Array(BLOCK_SIZE);
            outer.set(inner);
            for (var i = 0; i < BLOCK_SIZE; i++) {
                inner[i] ^= 0x36;
                outer[i] ^= 0x5c;
            }
            this.hash.update(inner);
            this.outer.update(outer);
            // overwrite the copied key in memory
            for (var i = 0; i < inner.byteLength; i++) {
                inner[i] = 0;
            }
        }
    };
    return Sha256;
}());
function bufferFromSecret(secret) {
    var input = convertToBuffer(secret);
    if (input.byteLength > BLOCK_SIZE) {
        var bufferHash = new RawSha256();
        bufferHash.update(input);
        input = bufferHash.digest();
    }
    var buffer = new Uint8Array(BLOCK_SIZE);
    buffer.set(input);
    return buffer;
}

const SHORT_TO_HEX = {};
for (let i = 0; i < 256; i++) {
    let encodedByte = i.toString(16).toLowerCase();
    if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
    }
    SHORT_TO_HEX[i] = encodedByte;
}
function toHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
    }
    return out;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const AmplifyUrl = URL;
const AmplifyUrlSearchParams = URLSearchParams;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const parseMetadata = (response) => {
    const { headers, statusCode } = response;
    return {
        ...(isMetadataBearer(response) ? response.$metadata : {}),
        httpStatusCode: statusCode,
        requestId: headers['x-amzn-requestid'] ??
            headers['x-amzn-request-id'] ??
            headers['x-amz-request-id'],
        extendedRequestId: headers['x-amz-id-2'],
        cfId: headers['x-amz-cf-id'],
    };
};
const isMetadataBearer = (response) => typeof response?.$metadata === 'object';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Utility functions for serializing and deserializing of JSON protocol in general(including: REST-JSON, JSON-RPC, etc.)
 */
/**
 * Error parser for AWS JSON protocol.
 */
const parseJsonError = async (response) => {
    if (!response || response.statusCode < 300) {
        return;
    }
    const body = await parseJsonBody(response);
    const sanitizeErrorCode = (rawValue) => {
        const [cleanValue] = rawValue.toString().split(/[\,\:]+/);
        if (cleanValue.includes('#')) {
            return cleanValue.split('#')[1];
        }
        return cleanValue;
    };
    const code = sanitizeErrorCode(response.headers['x-amzn-errortype'] ??
        body.code ??
        body.__type ??
        'UnknownError');
    const message = body.message ?? body.Message ?? 'Unknown error';
    const error = new Error(message);
    return Object.assign(error, {
        name: code,
        $metadata: parseMetadata(response),
    });
};
/**
 * Parse JSON response body to JavaScript object.
 */
const parseJsonBody = async (response) => {
    if (!response.body) {
        throw new Error('Missing response payload');
    }
    const output = await response.body.json();
    return Object.assign(output, {
        $metadata: parseMetadata(response),
    });
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var Framework;
(function (Framework) {
    // < 100 - Web frameworks
    Framework["WebUnknown"] = "0";
    Framework["React"] = "1";
    Framework["NextJs"] = "2";
    Framework["Angular"] = "3";
    Framework["VueJs"] = "4";
    Framework["Nuxt"] = "5";
    Framework["Svelte"] = "6";
    // 100s - Server side frameworks
    Framework["ServerSideUnknown"] = "100";
    Framework["ReactSSR"] = "101";
    Framework["NextJsSSR"] = "102";
    Framework["AngularSSR"] = "103";
    Framework["VueJsSSR"] = "104";
    Framework["NuxtSSR"] = "105";
    Framework["SvelteSSR"] = "106";
    // 200s - Mobile framework
    Framework["ReactNative"] = "201";
    Framework["Expo"] = "202";
})(Framework || (Framework = {}));
var Category;
(function (Category) {
    Category["API"] = "api";
    Category["Auth"] = "auth";
    Category["Analytics"] = "analytics";
    Category["DataStore"] = "datastore";
    Category["Geo"] = "geo";
    Category["InAppMessaging"] = "inappmessaging";
    Category["Interactions"] = "interactions";
    Category["Predictions"] = "predictions";
    Category["PubSub"] = "pubsub";
    Category["PushNotification"] = "pushnotification";
    Category["Storage"] = "storage";
})(Category || (Category = {}));
var AnalyticsAction;
(function (AnalyticsAction) {
    AnalyticsAction["Record"] = "1";
    AnalyticsAction["IdentifyUser"] = "2";
})(AnalyticsAction || (AnalyticsAction = {}));
var ApiAction;
(function (ApiAction) {
    ApiAction["GraphQl"] = "1";
    ApiAction["Get"] = "2";
    ApiAction["Post"] = "3";
    ApiAction["Put"] = "4";
    ApiAction["Patch"] = "5";
    ApiAction["Del"] = "6";
    ApiAction["Head"] = "7";
})(ApiAction || (ApiAction = {}));
var AuthAction;
(function (AuthAction) {
    AuthAction["SignUp"] = "1";
    AuthAction["ConfirmSignUp"] = "2";
    AuthAction["ResendSignUpCode"] = "3";
    AuthAction["SignIn"] = "4";
    AuthAction["FetchMFAPreference"] = "6";
    AuthAction["UpdateMFAPreference"] = "7";
    AuthAction["SetUpTOTP"] = "10";
    AuthAction["VerifyTOTPSetup"] = "11";
    AuthAction["ConfirmSignIn"] = "12";
    AuthAction["DeleteUserAttributes"] = "15";
    AuthAction["DeleteUser"] = "16";
    AuthAction["UpdateUserAttributes"] = "17";
    AuthAction["FetchUserAttributes"] = "18";
    AuthAction["ConfirmUserAttribute"] = "22";
    AuthAction["SignOut"] = "26";
    AuthAction["UpdatePassword"] = "27";
    AuthAction["ResetPassword"] = "28";
    AuthAction["ConfirmResetPassword"] = "29";
    AuthAction["FederatedSignIn"] = "30";
    AuthAction["RememberDevice"] = "32";
    AuthAction["ForgetDevice"] = "33";
    AuthAction["FetchDevices"] = "34";
    AuthAction["SendUserAttributeVerificationCode"] = "35";
    AuthAction["SignInWithRedirect"] = "36";
})(AuthAction || (AuthAction = {}));
var DataStoreAction;
(function (DataStoreAction) {
    DataStoreAction["Subscribe"] = "1";
    DataStoreAction["GraphQl"] = "2";
})(DataStoreAction || (DataStoreAction = {}));
var GeoAction;
(function (GeoAction) {
    GeoAction["SearchByText"] = "0";
    GeoAction["SearchByCoordinates"] = "1";
    GeoAction["SearchForSuggestions"] = "2";
    GeoAction["SearchByPlaceId"] = "3";
    GeoAction["SaveGeofences"] = "4";
    GeoAction["GetGeofence"] = "5";
    GeoAction["ListGeofences"] = "6";
    GeoAction["DeleteGeofences"] = "7";
})(GeoAction || (GeoAction = {}));
var InAppMessagingAction;
(function (InAppMessagingAction) {
    InAppMessagingAction["SyncMessages"] = "1";
    InAppMessagingAction["IdentifyUser"] = "2";
    InAppMessagingAction["NotifyMessageInteraction"] = "3";
})(InAppMessagingAction || (InAppMessagingAction = {}));
var InteractionsAction;
(function (InteractionsAction) {
    InteractionsAction["None"] = "0";
})(InteractionsAction || (InteractionsAction = {}));
var PredictionsAction;
(function (PredictionsAction) {
    PredictionsAction["Convert"] = "1";
    PredictionsAction["Identify"] = "2";
    PredictionsAction["Interpret"] = "3";
})(PredictionsAction || (PredictionsAction = {}));
var PubSubAction;
(function (PubSubAction) {
    PubSubAction["Subscribe"] = "1";
})(PubSubAction || (PubSubAction = {}));
var PushNotificationAction;
(function (PushNotificationAction) {
    PushNotificationAction["InitializePushNotifications"] = "1";
    PushNotificationAction["IdentifyUser"] = "2";
})(PushNotificationAction || (PushNotificationAction = {}));
var StorageAction;
(function (StorageAction) {
    StorageAction["UploadData"] = "1";
    StorageAction["DownloadData"] = "2";
    StorageAction["List"] = "3";
    StorageAction["Copy"] = "4";
    StorageAction["Remove"] = "5";
    StorageAction["GetProperties"] = "6";
    StorageAction["GetUrl"] = "7";
})(StorageAction || (StorageAction = {}));

// generated by genversion
const version = '6.0.10';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const globalExists = () => {
    return typeof global !== 'undefined';
};
const windowExists = () => {
    return typeof window !== 'undefined';
};
const documentExists = () => {
    return typeof document !== 'undefined';
};
const processExists = () => {
    return typeof process !== 'undefined';
};
const keyPrefixMatch = (object, prefix) => {
    return !!Object.keys(object).find(key => key.startsWith(prefix));
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with react 18.2 - built using Vite
function reactWebDetect() {
    const elementKeyPrefixedWithReact = (key) => {
        return key.startsWith('_react') || key.startsWith('__react');
    };
    const elementIsReactEnabled = (element) => {
        return Object.keys(element).find(elementKeyPrefixedWithReact);
    };
    const allElementsWithId = () => Array.from(document.querySelectorAll('[id]'));
    return documentExists() && allElementsWithId().some(elementIsReactEnabled);
}
function reactSSRDetect() {
    return (processExists() &&
        typeof process.env !== 'undefined' &&
        !!Object.keys(process.env).find(key => key.includes('react')));
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with vue 3.3.2
function vueWebDetect() {
    return windowExists() && keyPrefixMatch(window, '__VUE');
}
function vueSSRDetect() {
    return globalExists() && keyPrefixMatch(global, '__VUE');
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with svelte 3.59
function svelteWebDetect() {
    return windowExists() && keyPrefixMatch(window, '__SVELTE');
}
function svelteSSRDetect() {
    return (processExists() &&
        typeof process.env !== 'undefined' &&
        !!Object.keys(process.env).find(key => key.includes('svelte')));
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with next 13.4 / react 18.2
function nextWebDetect() {
    // @ts-ignore
    return windowExists() && window['next'] && typeof window['next'] === 'object';
}
function nextSSRDetect() {
    return (globalExists() &&
        (keyPrefixMatch(global, '__next') || keyPrefixMatch(global, '__NEXT')));
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with nuxt 2.15 / vue 2.7
function nuxtWebDetect() {
    return (windowExists() &&
        // @ts-ignore
        (window['__NUXT__'] !== undefined || window['$nuxt'] !== undefined));
}
function nuxtSSRDetect() {
    // @ts-ignore
    return globalExists() && typeof global['__NUXT_PATHS__'] !== 'undefined';
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with @angular/core 16.0.0
function angularWebDetect() {
    const angularVersionSetInDocument = Boolean(documentExists() && document.querySelector('[ng-version]'));
    const angularContentSetInWindow = Boolean(
    // @ts-ignore
    windowExists() && typeof window['ng'] !== 'undefined');
    return angularVersionSetInDocument || angularContentSetInWindow;
}
function angularSSRDetect() {
    return ((processExists() &&
        typeof process.env === 'object' &&
        process.env['npm_lifecycle_script']?.startsWith('ng ')) ||
        false);
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with react-native 0.17.7
function reactNativeDetect() {
    return (typeof navigator !== 'undefined' &&
        typeof navigator.product !== 'undefined' &&
        navigator.product === 'ReactNative');
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Tested with expo 48 / react-native 0.71.3
function expoDetect() {
    // @ts-ignore
    return globalExists() && typeof global['expo'] !== 'undefined';
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function webDetect() {
    return windowExists();
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// These are in the order of detection where when both are detectable, the early Framework will be reported
const detectionMap = [
    // First, detect mobile
    { platform: Framework.Expo, detectionMethod: expoDetect },
    { platform: Framework.ReactNative, detectionMethod: reactNativeDetect },
    // Next, detect web frameworks
    { platform: Framework.NextJs, detectionMethod: nextWebDetect },
    { platform: Framework.Nuxt, detectionMethod: nuxtWebDetect },
    { platform: Framework.Angular, detectionMethod: angularWebDetect },
    { platform: Framework.React, detectionMethod: reactWebDetect },
    { platform: Framework.VueJs, detectionMethod: vueWebDetect },
    { platform: Framework.Svelte, detectionMethod: svelteWebDetect },
    { platform: Framework.WebUnknown, detectionMethod: webDetect },
    // Last, detect ssr frameworks
    { platform: Framework.NextJsSSR, detectionMethod: nextSSRDetect },
    { platform: Framework.NuxtSSR, detectionMethod: nuxtSSRDetect },
    { platform: Framework.ReactSSR, detectionMethod: reactSSRDetect },
    { platform: Framework.VueJsSSR, detectionMethod: vueSSRDetect },
    { platform: Framework.AngularSSR, detectionMethod: angularSSRDetect },
    { platform: Framework.SvelteSSR, detectionMethod: svelteSSRDetect },
];
function detect() {
    return (detectionMap.find(detectionEntry => detectionEntry.detectionMethod())
        ?.platform || Framework.ServerSideUnknown);
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// We want to cache detection since the framework won't change
let frameworkCache;
const frameworkChangeObservers = [];
// Setup the detection reset tracking / timeout delays
let resetTriggered = false;
const SSR_RESET_TIMEOUT = 10; // ms
const WEB_RESET_TIMEOUT = 10; // ms
const PRIME_FRAMEWORK_DELAY = 1000; // ms
const detectFramework = () => {
    if (!frameworkCache) {
        frameworkCache = detect();
        if (resetTriggered) {
            // The final run of detectFramework:
            // Starting from this point, the `frameworkCache` becomes "final".
            // So we don't need to notify the observers again so the observer
            // can be removed after the final notice.
            while (frameworkChangeObservers.length) {
                frameworkChangeObservers.pop()?.();
            }
        }
        else {
            // The first run of detectFramework:
            // Every time we update the cache, call each observer function
            frameworkChangeObservers.forEach(fcn => fcn());
        }
        // Retry once for either Unknown type after a delay (explained below)
        resetTimeout(Framework.ServerSideUnknown, SSR_RESET_TIMEOUT);
        resetTimeout(Framework.WebUnknown, WEB_RESET_TIMEOUT);
    }
    return frameworkCache;
};
/**
 * @internal Setup observer callback that will be called everytime the framework changes
 */
const observeFrameworkChanges = (fcn) => {
    // When the `frameworkCache` won't be updated again, we ignore all incoming
    // observers.
    if (resetTriggered) {
        return;
    }
    frameworkChangeObservers.push(fcn);
};
function clearCache() {
    frameworkCache = undefined;
}
// For a framework type and a delay amount, setup the event to re-detect
//   During the runtime boot, it is possible that framework detection will
//   be triggered before the framework has made modifications to the
//   global/window/etc needed for detection. When no framework is detected
//   we will reset and try again to ensure we don't use a cached
//   non-framework detection result for all requests.
function resetTimeout(framework, delay) {
    if (frameworkCache === framework && !resetTriggered) {
        setTimeout(() => {
            clearCache();
            resetTriggered = true;
            setTimeout(detectFramework, PRIME_FRAMEWORK_DELAY);
        }, delay);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Maintains custom user-agent state set by external consumers.
const customUserAgentState = {};
const getCustomUserAgent = (category, api) => customUserAgentState[category]?.[api]?.additionalDetails;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const BASE_USER_AGENT = `aws-amplify`;
const getAmplifyUserAgentObject = ({ category, action, framework, } = {}) => {
    const userAgent = [[BASE_USER_AGENT, version]];
    if (category) {
        userAgent.push([category, action]);
    }
    userAgent.push(['framework', detectFramework()]);
    if (category && action) {
        const customState = getCustomUserAgent(category, action);
        if (customState) {
            customState.forEach(state => {
                userAgent.push(state);
            });
        }
    }
    return userAgent;
};
const getAmplifyUserAgent = (customUserAgentDetails) => {
    const userAgent = getAmplifyUserAgentObject(customUserAgentDetails);
    const userAgentString = userAgent
        .map(([agentKey, agentValue]) => agentKey && agentValue ? `${agentKey}/${agentValue}` : agentKey)
        .join(' ');
    return userAgentString;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * The service name used to sign requests if the API requires authentication.
 */
const SERVICE_NAME = 'cognito-identity';
/**
 * The endpoint resolver function that returns the endpoint URL for a given region.
 */
const endpointResolver = ({ region }) => ({
    url: new AmplifyUrl(`https://cognito-identity.${region}.${getDnsSuffix(region)}`),
});
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
const cognitoIdentityTransferHandler = composeTransferHandler(unauthenticatedHandler, [disableCacheMiddleware]);
/**
 * @internal
 */
const defaultConfig = {
    service: SERVICE_NAME,
    endpointResolver,
    retryDecider: getRetryDecider(parseJsonError),
    computeDelay: jitteredBackoff$1,
    userAgentValue: getAmplifyUserAgent(),
    cache: 'no-store',
};
observeFrameworkChanges(() => {
    defaultConfig.userAgentValue = getAmplifyUserAgent();
});
/**
 * @internal
 */
const getSharedHeaders = (operation) => ({
    'content-type': 'application/x-amz-json-1.1',
    'x-amz-target': `AWSCognitoIdentityService.${operation}`,
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
const composeServiceApi = (transferHandler, serializer, deserializer, defaultConfig) => {
    return async (config, input) => {
        const resolvedConfig = {
            ...defaultConfig,
            ...config,
        };
        // We may want to allow different endpoints from given config(other than region) and input.
        // Currently S3 supports additional `useAccelerateEndpoint` option to use accelerate endpoint.
        const endpoint = await resolvedConfig.endpointResolver(resolvedConfig, input);
        // Unlike AWS SDK clients, a serializer should NOT populate the `host` or `content-length` headers.
        // Both of these headers are prohibited per Spec(https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name).
        // They will be populated automatically by browser, or node-fetch polyfill.
        const request = await serializer(input, endpoint);
        const response = await transferHandler(request, {
            ...resolvedConfig,
        });
        return await deserializer(response);
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getIdSerializer = (input, endpoint) => {
    const headers = getSharedHeaders('GetId');
    const body = JSON.stringify(input);
    return buildHttpRpcRequest(endpoint, headers, body);
};
const getIdDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = await parseJsonError(response);
        throw error;
    }
    else {
        const body = await parseJsonBody(response);
        return {
            IdentityId: body.IdentityId,
            $metadata: parseMetadata(response),
        };
    }
};
/**
 * @internal
 */
const getId = composeServiceApi(cognitoIdentityTransferHandler, getIdSerializer, getIdDeserializer, defaultConfig);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getCredentialsForIdentitySerializer = (input, endpoint) => {
    const headers = getSharedHeaders('GetCredentialsForIdentity');
    const body = JSON.stringify(input);
    return buildHttpRpcRequest(endpoint, headers, body);
};
const getCredentialsForIdentityDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = await parseJsonError(response);
        throw error;
    }
    else {
        const body = await parseJsonBody(response);
        return {
            IdentityId: body.IdentityId,
            Credentials: deserializeCredentials(body.Credentials),
            $metadata: parseMetadata(response),
        };
    }
};
const deserializeCredentials = ({ AccessKeyId, SecretKey, SessionToken, Expiration, } = {}) => {
    return {
        AccessKeyId,
        SecretKey,
        SessionToken,
        Expiration: Expiration && new Date(Expiration * 1000),
    };
};
/**
 * @internal
 */
const getCredentialsForIdentity = composeServiceApi(cognitoIdentityTransferHandler, getCredentialsForIdentitySerializer, getCredentialsForIdentityDeserializer, defaultConfig);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class PlatformNotSupportedError extends AmplifyError {
    constructor() {
        super({
            name: AmplifyErrorCode.PlatformNotSupported,
            message: 'Function not supported on current platform',
        });
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class KeyValueStorage {
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * This is used to set a specific item in storage
     * @param {string} key - the key for the item
     * @param {object} value - the value
     * @returns {string} value that was set
     */
    async setItem(key, value) {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        this.storage.setItem(key, value);
    }
    /**
     * This is used to get a specific key from storage
     * @param {string} key - the key for the item
     * This is used to clear the storage
     * @returns {string} the data item
     */
    async getItem(key) {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        return this.storage.getItem(key);
    }
    /**
     * This is used to remove an item from storage
     * @param {string} key - the key being set
     * @returns {string} value - value that was deleted
     */
    async removeItem(key) {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        this.storage.removeItem(key);
    }
    /**
     * This is used to clear the storage
     * @returns {string} nothing
     */
    async clear() {
        if (!this.storage)
            throw new PlatformNotSupportedError();
        this.storage.clear();
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class InMemoryStorage {
    constructor() {
        this.storage = new Map();
    }
    get length() {
        return this.storage.size;
    }
    key(index) {
        if (index > this.length - 1) {
            return null;
        }
        return Array.from(this.storage.keys())[index];
    }
    setItem(key, value) {
        this.storage.set(key, value);
    }
    getItem(key) {
        return this.storage.get(key) ?? null;
    }
    removeItem(key) {
        this.storage.delete(key);
    }
    clear() {
        this.storage.clear();
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 * @returns Either a reference to window.localStorage or an in-memory storage as fallback
 */
const getLocalStorageWithFallback = () => typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : new InMemoryStorage();
/**
 * @internal
 * @returns Either a reference to window.sessionStorage or an in-memory storage as fallback
 */
const getSessionStorageWithFallback = () => typeof window !== 'undefined' && window.sessionStorage
    ? window.sessionStorage
    : new InMemoryStorage();

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class DefaultStorage extends KeyValueStorage {
    constructor() {
        super(getLocalStorageWithFallback());
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class SessionStorage extends KeyValueStorage {
    constructor() {
        super(getSessionStorageWithFallback());
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var js_cookie = createCommonjsModule(function (module, exports) {
(function (global, factory) {
   module.exports = factory() ;
})(commonjsGlobal, (function () {
  /* eslint-disable no-var */
  function assign (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target
  }
  /* eslint-enable no-var */

  /* eslint-disable no-var */
  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  };
  /* eslint-enable no-var */

  /* eslint-disable no-var */

  function init (converter, defaultAttributes) {
    function set (name, value, attributes) {
      if (typeof document === 'undefined') {
        return
      }

      attributes = assign({}, defaultAttributes, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }

      name = encodeURIComponent(name)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie =
        name + '=' + converter.write(value, name) + stringifiedAttributes)
    }

    function get (name) {
      if (typeof document === 'undefined' || (arguments.length && !name)) {
        return
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');

        try {
          var found = decodeURIComponent(parts[0]);
          jar[found] = converter.read(value, found);

          if (name === found) {
            break
          }
        } catch (e) {}
      }

      return name ? jar[name] : jar
    }

    return Object.create(
      {
        set,
        get,
        remove: function (name, attributes) {
          set(
            name,
            '',
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes))
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes)
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    )
  }

  var api = init(defaultConverter, { path: '/' });
  /* eslint-enable no-var */

  return api;

}));
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class CookieStorage {
    constructor(data = {}) {
        const { path, domain, expires, sameSite, secure } = data;
        this.domain = domain;
        this.path = path ? path : '/';
        this.expires = data.hasOwnProperty('expires') ? expires : 365;
        this.secure = data.hasOwnProperty('secure') ? secure : true;
        if (data.hasOwnProperty('sameSite')) {
            if (!sameSite || !['strict', 'lax', 'none'].includes(sameSite)) {
                throw new Error('The sameSite value of cookieStorage must be "lax", "strict" or "none".');
            }
            if (sameSite === 'none' && !this.secure) {
                throw new Error('sameSite = None requires the Secure attribute in latest browser versions.');
            }
            this.sameSite = sameSite;
        }
    }
    async setItem(key, value) {
        js_cookie.set(key, value, this.getData());
    }
    async getItem(key) {
        const item = js_cookie.get(key);
        return item ?? null;
    }
    async removeItem(key) {
        js_cookie.remove(key, this.getData());
    }
    async clear() {
        const cookie = js_cookie.get();
        const promises = Object.keys(cookie).map(key => this.removeItem(key));
        await Promise.all(promises);
    }
    getData() {
        return {
            path: this.path,
            expires: this.expires,
            domain: this.domain,
            secure: this.secure,
            ...(this.sameSite && { sameSite: this.sameSite }),
        };
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const defaultStorage = new DefaultStorage();
const sessionStorage = new SessionStorage();

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const isBrowser = () => typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const amplifyUuid = v4;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns signed headers.
 *
 * @param headers `headers` from the request.
 * @returns List of headers included in canonical headers, separated by semicolons (;). This indicates which headers
 * are part of the signing process. Header names must use lowercase characters and must appear in alphabetical order.
 *
 * @internal
 */
const getSignedHeaders = (headers) => Object.keys(headers)
    .map(key => key.toLowerCase())
    .sort()
    .join(';');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
const AMZ_DATE_QUERY_PARAM = 'X-Amz-Date';
const TOKEN_QUERY_PARAM = 'X-Amz-Security-Token';
// headers
const AUTH_HEADER = 'authorization';
const HOST_HEADER = 'host';
const AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
const TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
// identifiers
const KEY_TYPE_IDENTIFIER = 'aws4_request';
const SHA256_ALGORITHM_IDENTIFIER = 'AWS4-HMAC-SHA256';
const SIGNATURE_IDENTIFIER = 'AWS4';
// preset values
const EMPTY_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const UNSIGNED_PAYLOAD = 'UNSIGNED-PAYLOAD';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns the credential scope which restricts the resulting signature to the specified region and service.
 *
 * @param date Current date in the format 'YYYYMMDD'.
 * @param region AWS region in which the service resides.
 * @param service Service to which the signed request is being sent.
 *
 * @returns  A string representing the credential scope with format 'YYYYMMDD/region/service/aws4_request'.
 *
 * @internal
 */
const getCredentialScope = (date, region, service) => `${date}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns expected date strings to be used in signing.
 *
 * @param date JavaScript `Date` object.
 * @returns `FormattedDates` object containing the following:
 * - longDate: A date string in 'YYYYMMDDThhmmssZ' format
 * - shortDate: A date string in 'YYYYMMDD' format
 *
 * @internal
 */
const getFormattedDates = (date) => {
    const longDate = date.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    return {
        longDate,
        shortDate: longDate.slice(0, 8),
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Extracts common values used for signing both requests and urls.
 *
 * @param options `SignRequestOptions` object containing values used to construct the signature.
 * @returns Common `SigningValues` used for signing.
 *
 * @internal
 */
const getSigningValues = ({ credentials, signingDate = new Date(), signingRegion, signingService, uriEscapePath = true, }) => {
    // get properties from credentials
    const { accessKeyId, secretAccessKey, sessionToken } = credentials;
    // get formatted dates for signing
    const { longDate, shortDate } = getFormattedDates(signingDate);
    // copy header and set signing properties
    const credentialScope = getCredentialScope(shortDate, signingRegion, signingService);
    return {
        accessKeyId,
        credentialScope,
        longDate,
        secretAccessKey,
        sessionToken,
        shortDate,
        signingRegion,
        signingService,
        uriEscapePath,
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// TODO: V6 update to different crypto dependency?
/**
 * Returns the hashed data a `Uint8Array`.
 *
 * @param key `SourceData` to be used as hashing key.
 * @param data Hashable `SourceData`.
 * @returns `Uint8Array` created from the data as input to a hash function.
 */
const getHashedData = (key, data) => {
    const sha256 = new Sha256(key ?? undefined);
    sha256.update(data);
    // TODO: V6 flip to async digest
    const hashedData = sha256.digestSync();
    return hashedData;
};
/**
 * Returns the hashed data as a hex string.
 *
 * @param key `SourceData` to be used as hashing key.
 * @param data Hashable `SourceData`.
 * @returns String using lowercase hexadecimal characters created from the data as input to a hash function.
 *
 * @internal
 */
const getHashedDataAsHex = (key, data) => {
    const hashedData = getHashedData(key, data);
    return toHex(hashedData);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns canonical headers.
 *
 * @param headers Headers from the request.
 * @returns Request headers that will be signed, and their values, separated by newline characters. Header names must
 * use lowercase characters, must appear in alphabetical order, and must be followed by a colon (:). For the values,
 * trim any leading or trailing spaces, convert sequential spaces to a single space, and separate the values
 * for a multi-value header using commas.
 *
 * @internal
 */
const getCanonicalHeaders = (headers) => Object.entries(headers)
    .map(([key, value]) => ({
    key: key.toLowerCase(),
    value: value?.trim().replace(/\s+/g, ' ') ?? '',
}))
    .sort((a, b) => (a.key < b.key ? -1 : 1))
    .map(entry => `${entry.key}:${entry.value}\n`)
    .join('');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns a canonical query string.
 *
 * @param searchParams `searchParams` from the request url.
 * @returns URL-encoded query string parameters, separated by ampersands (&). Percent-encode reserved characters,
 * including the space character. Encode names and values separately. If there are empty parameters, append the equals
 * sign to the parameter name before encoding. After encoding, sort the parameters alphabetically by key name. If there
 * is no query string, use an empty string ("").
 *
 * @internal
 */
const getCanonicalQueryString = (searchParams) => Array.from(searchParams)
    .sort(([keyA, valA], [keyB, valB]) => {
    if (keyA === keyB) {
        return valA < valB ? -1 : 1;
    }
    return keyA < keyB ? -1 : 1;
})
    .map(([key, val]) => `${escapeUri(key)}=${escapeUri(val)}`)
    .join('&');
const escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
const hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns a canonical uri.
 *
 * @param pathname `pathname` from request url.
 * @param uriEscapePath Whether to uri encode the path as part of canonical uri. It's used for S3 only where the
 *   pathname is already uri encoded, and the signing process is not expected to uri encode it again. Defaults to true.
 * @returns URI-encoded version of the absolute path component URL (everything between the host and the question mark
 * character (?) that starts the query string parameters). If the absolute path is empty, a forward slash character (/).
 *
 * @internal
 */
const getCanonicalUri = (pathname, uriEscapePath = true) => pathname
    ? uriEscapePath
        ? encodeURIComponent(pathname).replace(/%2F/g, '/')
        : pathname
    : '/';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns the hashed payload.
 *
 * @param body `body` (payload) from the request.
 * @returns String created using the payload in the body of the HTTP request as input to a hash function. This string
 * uses lowercase hexadecimal characters. If the payload is empty, return precalculated result of an empty hash.
 *
 * @internal
 */
const getHashedPayload = (body) => {
    // return precalculated empty hash if body is undefined or null
    if (body == null) {
        return EMPTY_HASH;
    }
    if (isSourceData(body)) {
        const hashedData = getHashedDataAsHex(null, body);
        return hashedData;
    }
    // Defined body is not signable. Return unsigned payload which may or may not be accepted by the service.
    return UNSIGNED_PAYLOAD;
};
const isSourceData = (body) => typeof body === 'string' || ArrayBuffer.isView(body) || isArrayBuffer(body);
const isArrayBuffer = (arg) => (typeof ArrayBuffer === 'function' && arg instanceof ArrayBuffer) ||
    Object.prototype.toString.call(arg) === '[object ArrayBuffer]';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns a canonical request.
 *
 * @param request `HttpRequest` from which to create the canonical request from.
 * @param uriEscapePath Whether to uri encode the path as part of canonical uri. It's used for S3 only where the
 *   pathname is already uri encoded, and the signing process is not expected to uri encode it again. Defaults to true.
 * @returns String created by by concatenating the following strings, separated by newline characters:
 * - HTTPMethod
 * - CanonicalUri
 * - CanonicalQueryString
 * - CanonicalHeaders
 * - SignedHeaders
 * - HashedPayload
 *
 * @internal
 */
const getCanonicalRequest = ({ body, headers, method, url }, uriEscapePath = true) => [
    method,
    getCanonicalUri(url.pathname, uriEscapePath),
    getCanonicalQueryString(url.searchParams),
    getCanonicalHeaders(headers),
    getSignedHeaders(headers),
    getHashedPayload(body),
].join('\n');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns a signing key to be used for signing requests.
 *
 * @param secretAccessKey AWS secret access key from credentials.
 * @param date Current date in the format 'YYYYMMDD'.
 * @param region AWS region in which the service resides.
 * @param service Service to which the signed request is being sent.
 *
 * @returns `Uint8Array` calculated from its composite parts.
 *
 * @internal
 */
const getSigningKey = (secretAccessKey, date, region, service) => {
    const key = `${SIGNATURE_IDENTIFIER}${secretAccessKey}`;
    const dateKey = getHashedData(key, date);
    const regionKey = getHashedData(dateKey, region);
    const serviceKey = getHashedData(regionKey, service);
    const signingKey = getHashedData(serviceKey, KEY_TYPE_IDENTIFIER);
    return signingKey;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns a string to be signed.
 *
 * @param date Current date in the format 'YYYYMMDDThhmmssZ'.
 * @param credentialScope String representing the credential scope with format 'YYYYMMDD/region/service/aws4_request'.
 * @param hashedRequest Hashed canonical request.
 *
 * @returns A string created by by concatenating the following strings, separated by newline characters:
 * - Algorithm
 * - RequestDateTime
 * - CredentialScope
 * - HashedCanonicalRequest
 *
 * @internal
 */
const getStringToSign = (date, credentialScope, hashedRequest) => [SHA256_ALGORITHM_IDENTIFIER, date, credentialScope, hashedRequest].join('\n');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Calculates and returns an AWS API Signature.
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html
 *
 * @param request `HttpRequest` to be signed.
 * @param signRequestOptions `SignRequestOptions` object containing values used to construct the signature.
 * @returns AWS API Signature to sign a request or url with.
 *
 * @internal
 */
const getSignature = (request, { credentialScope, longDate, secretAccessKey, shortDate, signingRegion, signingService, uriEscapePath, }) => {
    // step 1: create a canonical request
    const canonicalRequest = getCanonicalRequest(request, uriEscapePath);
    // step 2: create a hash of the canonical request
    const hashedRequest = getHashedDataAsHex(null, canonicalRequest);
    // step 3: create a string to sign
    const stringToSign = getStringToSign(longDate, credentialScope, hashedRequest);
    // step 4: calculate the signature
    const signature = getHashedDataAsHex(getSigningKey(secretAccessKey, shortDate, signingRegion, signingService), stringToSign);
    return signature;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Given a `HttpRequest`, returns a Signature Version 4 signed `HttpRequest`.
 *
 * @param request `HttpRequest` to be signed.
 * @param signRequestOptions `SignRequestOptions` object containing values used to construct the signature.
 * @returns A `HttpRequest` with authentication headers which can grant temporary access to AWS resources.
 */
const signRequest = (request, options) => {
    const signingValues = getSigningValues(options);
    const { accessKeyId, credentialScope, longDate, sessionToken } = signingValues;
    // create the request to sign
    const headers = { ...request.headers };
    headers[HOST_HEADER] = request.url.host;
    headers[AMZ_DATE_HEADER] = longDate;
    if (sessionToken) {
        headers[TOKEN_HEADER] = sessionToken;
    }
    const requestToSign = { ...request, headers };
    // calculate and add the signature to the request
    const signature = getSignature(requestToSign, signingValues);
    const credentialEntry = `Credential=${accessKeyId}/${credentialScope}`;
    const signedHeadersEntry = `SignedHeaders=${getSignedHeaders(headers)}`;
    const signatureEntry = `Signature=${signature}`;
    headers[AUTH_HEADER] =
        `${SHA256_ALGORITHM_IDENTIFIER} ${credentialEntry}, ${signedHeadersEntry}, ${signatureEntry}`;
    return requestToSign;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns a `Date` that is corrected for clock skew.
 *
 * @param systemClockOffset The offset of the system clock in milliseconds.
 *
 * @returns `Date` representing the current time adjusted by the system clock offset.
 *
 * @internal
 */
const getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// 5 mins in milliseconds. Ref: https://github.com/aws/aws-sdk-js-v3/blob/6c0f44fab30a1bb2134af47362a31332abc3666b/packages/middleware-signing/src/utils/isClockSkewed.ts#L10
const SKEW_WINDOW = 5 * 60 * 1000;
/**
 * Checks if the provided date is within the skew window of 5 minutes.
 *
 * @param clockTimeInMilliseconds Time to check for skew in milliseconds.
 * @param clockOffsetInMilliseconds Offset to check clock against in milliseconds.
 *
 * @returns True if skewed. False otherwise.
 *
 * @internal
 */
const isClockSkewed = (clockTimeInMilliseconds, clockOffsetInMilliseconds) => Math.abs(getSkewCorrectedDate(clockOffsetInMilliseconds).getTime() -
    clockTimeInMilliseconds) >= SKEW_WINDOW;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Returns the difference between clock time and the current system time if clock is skewed.
 *
 * @param clockTimeInMilliseconds Clock time in milliseconds.
 * @param currentSystemClockOffset Current system clock offset in milliseconds.
 *
 * @internal
 */
const getUpdatedSystemClockOffset = (clockTimeInMilliseconds, currentSystemClockOffset) => {
    if (isClockSkewed(clockTimeInMilliseconds, currentSystemClockOffset)) {
        return clockTimeInMilliseconds - Date.now();
    }
    return currentSystemClockOffset;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Middleware that SigV4 signs request with AWS credentials, and correct system clock offset.
 * This middleware is expected to be placed after retry middleware.
 */
const signingMiddleware = ({ credentials, region, service, uriEscapePath = true, }) => {
    let currentSystemClockOffset;
    return (next) => async function signingMiddleware(request) {
        currentSystemClockOffset = currentSystemClockOffset ?? 0;
        const signRequestOptions = {
            credentials: typeof credentials === 'function' ? await credentials() : credentials,
            signingDate: getSkewCorrectedDate(currentSystemClockOffset),
            signingRegion: region,
            signingService: service,
            uriEscapePath,
        };
        const signedRequest = await signRequest(request, signRequestOptions);
        const response = await next(signedRequest);
        // Update system clock offset if response contains date header, regardless of the status code.
        // non-2xx response will still be returned from next handler instead of thrown, because it's
        // only thrown by the retry middleware.
        const dateString = getDateHeader(response);
        if (dateString) {
            currentSystemClockOffset = getUpdatedSystemClockOffset(Date.parse(dateString), currentSystemClockOffset);
        }
        return response;
    };
};
const getDateHeader = ({ headers } = {}) => headers?.date ?? headers?.Date ?? headers?.['x-amz-date'];

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const authenticatedHandler = composeTransferHandler(fetchTransferHandler, [
    userAgentMiddleware,
    retryMiddleware,
    signingMiddleware,
]);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const isWebWorker = () => {
    if (typeof self === 'undefined') {
        return false;
    }
    const selfContext = self;
    return (typeof selfContext.WorkerGlobalScope !== 'undefined' &&
        self instanceof selfContext.WorkerGlobalScope);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class NonRetryableError extends Error {
    constructor(message) {
        super(message);
        this.nonRetryable = true;
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @private
 * Internal use of Amplify only
 */
const jitteredExponentialRetry = (functionToRetry, args, maxDelayMs = MAX_DELAY_MS, onTerminate) => retry(functionToRetry, args, jitteredBackoff(maxDelayMs), onTerminate);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function urlSafeDecode(hex) {
    const matchArr = hex.match(/.{2}/g) || [];
    return matchArr.map(char => String.fromCharCode(parseInt(char, 16))).join('');
}

function isFunction(value) {
    return typeof value === 'function';
}

function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}

var UnsubscriptionError = createErrorClass(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});

function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}

var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialFinalizer = this.initialTeardown;
            if (isFunction(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? e.errors : [e];
                }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
                this._finalizers = null;
                try {
                    for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                        var finalizer = _finalizers_1_1.value;
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof UnsubscriptionError) {
                                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _finalizers = this._finalizers;
        _finalizers && arrRemove(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}

var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};

var timeoutProvider = {
    setTimeout: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
        }
        return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};

function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function () {
        {
            throw err;
        }
    });
}

function noop() { }

function errorContext(cb) {
    {
        cb();
    }
}

var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if (isSubscription(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) ;
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(Subscription));
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
        this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    ConsumerObserver.prototype.error = function (err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    };
    ConsumerObserver.prototype.complete = function () {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    return ConsumerObserver;
}());
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if (isFunction(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            var context_1;
            if (_this && config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context_1),
                    error: observerOrNext.error && bind(observerOrNext.error, context_1),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                };
            }
            else {
                partialObserver = observerOrNext;
            }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));
function handleUnhandledError(error) {
    {
        reportUnhandledError(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
};

var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

function identity(x) {
    return x;
}

function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

var Observable = (function () {
    function Observable(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var _this = this;
        var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
        errorContext(function () {
            var _a = _this, operator = _a.operator, source = _a.source;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        _this._subscribe(subscriber)
                    :
                        _this._trySubscribe(subscriber));
        });
        return subscriber;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscriber = new SafeSubscriber({
                next: function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscriber.unsubscribe();
                    }
                },
                error: reject,
                complete: resolve,
            });
            _this.subscribe(subscriber);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return function (source) {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}

function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = (function (_super) {
    __extends(OperatorSubscriber, _super);
    function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
        var _this = _super.call(this, destination) || this;
        _this.onFinalize = onFinalize;
        _this.shouldUnsubscribe = shouldUnsubscribe;
        _this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
        _this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
        _this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
        return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
        var _a;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            var closed_1 = this.closed;
            _super.prototype.unsubscribe.call(this);
            !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
        }
    };
    return OperatorSubscriber;
}(Subscriber));

var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

function isInteropObservable(input) {
    return isFunction(input[observable]);
}

function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === 'object' ? 'an invalid object' : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}

function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
var iterator = getSymbolIterator();

function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
        var reader, _a, value, done;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reader = readableStream.getReader();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 9, 10]);
                    _b.label = 2;
                case 2:
                    return [4, __await(reader.read())];
                case 3:
                    _a = _b.sent(), value = _a.value, done = _a.done;
                    if (!done) return [3, 5];
                    return [4, __await(void 0)];
                case 4: return [2, _b.sent()];
                case 5: return [4, __await(value)];
                case 6: return [4, _b.sent()];
                case 7:
                    _b.sent();
                    return [3, 2];
                case 8: return [3, 10];
                case 9:
                    reader.releaseLock();
                    return [7];
                case 10: return [2];
            }
        });
    });
}
function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

function innerFrom(input) {
    if (input instanceof Observable) {
        return input;
    }
    if (input != null) {
        if (isInteropObservable(input)) {
            return fromInteropObservable(input);
        }
        if (isArrayLike(input)) {
            return fromArrayLike(input);
        }
        if (isPromise(input)) {
            return fromPromise(input);
        }
        if (isAsyncIterable(input)) {
            return fromAsyncIterable(input);
        }
        if (isIterable(input)) {
            return fromIterable(input);
        }
        if (isReadableStreamLike(input)) {
            return fromReadableStreamLike(input);
        }
    }
    throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
    return new Observable(function (subscriber) {
        var obs = obj[observable]();
        if (isFunction(obs.subscribe)) {
            return obs.subscribe(subscriber);
        }
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    });
}
function fromArrayLike(array) {
    return new Observable(function (subscriber) {
        for (var i = 0; i < array.length && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    });
}
function fromPromise(promise) {
    return new Observable(function (subscriber) {
        promise
            .then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) { return subscriber.error(err); })
            .then(null, reportUnhandledError);
    });
}
function fromIterable(iterable) {
    return new Observable(function (subscriber) {
        var e_1, _a;
        try {
            for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                var value = iterable_1_1.value;
                subscriber.next(value);
                if (subscriber.closed) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        subscriber.complete();
    });
}
function fromAsyncIterable(asyncIterable) {
    return new Observable(function (subscriber) {
        process$1(asyncIterable, subscriber).catch(function (err) { return subscriber.error(err); });
    });
}
function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process$1(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function () {
        var value, e_2_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 11]);
                    asyncIterable_1 = __asyncValues(asyncIterable);
                    _b.label = 1;
                case 1: return [4, asyncIterable_1.next()];
                case 2:
                    if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
                    value = asyncIterable_1_1.value;
                    subscriber.next(value);
                    if (subscriber.closed) {
                        return [2];
                    }
                    _b.label = 3;
                case 3: return [3, 1];
                case 4: return [3, 11];
                case 5:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 11];
                case 6:
                    _b.trys.push([6, , 9, 10]);
                    if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
                    return [4, _a.call(asyncIterable_1)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [3, 10];
                case 9:
                    if (e_2) throw e_2.error;
                    return [7];
                case 10: return [7];
                case 11:
                    subscriber.complete();
                    return [2];
            }
        });
    });
}

function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
    if (delay === void 0) { delay = 0; }
    if (repeat === void 0) { repeat = false; }
    var scheduleSubscription = scheduler.schedule(function () {
        work();
        if (repeat) {
            parentSubscription.add(this.schedule(null, delay));
        }
        else {
            this.unsubscribe();
        }
    }, delay);
    parentSubscription.add(scheduleSubscription);
    if (!repeat) {
        return scheduleSubscription;
    }
}

function observeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return operate(function (source, subscriber) {
        source.subscribe(createOperatorSubscriber(subscriber, function (value) { return executeSchedule(subscriber, scheduler, function () { return subscriber.next(value); }, delay); }, function () { return executeSchedule(subscriber, scheduler, function () { return subscriber.complete(); }, delay); }, function (err) { return executeSchedule(subscriber, scheduler, function () { return subscriber.error(err); }, delay); }));
    });
}

function subscribeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return operate(function (source, subscriber) {
        subscriber.add(scheduler.schedule(function () { return source.subscribe(subscriber); }, delay));
    });
}

function scheduleObservable(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function schedulePromise(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function scheduleArray(input, scheduler) {
    return new Observable(function (subscriber) {
        var i = 0;
        return scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
            }
            else {
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    this.schedule();
                }
            }
        });
    });
}

function scheduleIterable(input, scheduler) {
    return new Observable(function (subscriber) {
        var iterator$1;
        executeSchedule(subscriber, scheduler, function () {
            iterator$1 = input[iterator]();
            executeSchedule(subscriber, scheduler, function () {
                var _a;
                var value;
                var done;
                try {
                    (_a = iterator$1.next(), value = _a.value, done = _a.done);
                }
                catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(value);
                }
            }, 0, true);
        });
        return function () { return isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return(); };
    });
}

function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new Observable(function (subscriber) {
        executeSchedule(subscriber, scheduler, function () {
            var iterator = input[Symbol.asyncIterator]();
            executeSchedule(subscriber, scheduler, function () {
                iterator.next().then(function (result) {
                    if (result.done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(result.value);
                    }
                });
            }, 0, true);
        });
    });
}

function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

function scheduled(input, scheduler) {
    if (input != null) {
        if (isInteropObservable(input)) {
            return scheduleObservable(input, scheduler);
        }
        if (isArrayLike(input)) {
            return scheduleArray(input, scheduler);
        }
        if (isPromise(input)) {
            return schedulePromise(input, scheduler);
        }
        if (isAsyncIterable(input)) {
            return scheduleAsyncIterable(input, scheduler);
        }
        if (isIterable(input)) {
            return scheduleIterable(input, scheduler);
        }
        if (isReadableStreamLike(input)) {
            return scheduleReadableStreamLike(input, scheduler);
        }
    }
    throw createInvalidObservableTypeError(input);
}

function from(input, scheduler) {
    return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

function map(project, thisArg) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            subscriber.next(project.call(thisArg, value, index++));
        }));
    });
}

function filter(predicate, thisArg) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) { return predicate.call(thisArg, value, index++) && subscriber.next(value); }));
    });
}

function catchError(selector) {
    return operate(function (source, subscriber) {
        var innerSub = null;
        var syncUnsub = false;
        var handledResult;
        innerSub = source.subscribe(createOperatorSubscriber(subscriber, undefined, undefined, function (err) {
            handledResult = innerFrom(selector(err, catchError(selector)(source)));
            if (innerSub) {
                innerSub.unsubscribe();
                innerSub = null;
                handledResult.subscribe(subscriber);
            }
            else {
                syncUnsub = true;
            }
        }));
        if (syncUnsub) {
            innerSub.unsubscribe();
            innerSub = null;
            handledResult.subscribe(subscriber);
        }
    });
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class Reachability {
    networkMonitor(_) {
        const globalObj = isWebWorker()
            ? self
            : typeof window !== 'undefined' && window;
        if (!globalObj) {
            return from([{ online: true }]);
        }
        return new Observable(observer => {
            observer.next({ online: globalObj.navigator.onLine });
            const notifyOnline = () => observer.next({ online: true });
            const notifyOffline = () => observer.next({ online: false });
            globalObj.addEventListener('online', notifyOnline);
            globalObj.addEventListener('offline', notifyOffline);
            Reachability._observers.push(observer);
            return () => {
                globalObj.removeEventListener('online', notifyOnline);
                globalObj.removeEventListener('offline', notifyOffline);
                Reachability._observers = Reachability._observers.filter(_observer => _observer !== observer);
            };
        });
    }
    // expose observers to simulate offline mode for integration testing
    static _observerOverride(status) {
        for (const observer of this._observers) {
            if (observer.closed) {
                this._observers = this._observers.filter(_observer => _observer !== observer);
                continue;
            }
            observer?.next && observer.next(status);
        }
    }
}
Reachability._observers = [];

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function bytesToString(input) {
    return Array.from(input, byte => String.fromCodePoint(byte)).join('');
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const base64Encoder = {
    convert(input, { urlSafe } = { urlSafe: false }) {
        const inputStr = typeof input === 'string' ? input : bytesToString(input);
        const encodedStr = getBtoa()(inputStr);
        // see details about the char replacing at https://datatracker.ietf.org/doc/html/rfc4648#section-5
        return urlSafe
            ? encodedStr.replace(/\+/g, '-').replace(/\//g, '_')
            : encodedStr;
    },
};

export { Amplify as A, getCredentialsForIdentity as B, Category as C, parseAWSExports as D, CookieStorage as E, AmplifyUrlSearchParams as F, authenticatedHandler as G, Hub as H, map as I, filter as J, amplifyUuid as K, isNonRetryableError as L, base64Encoder as M, jitteredExponentialRetry as N, Observable as O, NonRetryableError as P, fetchAuthSession$1 as Q, Reachability as R, signRequest as S, catchError as T, USER_AGENT_HEADER as U, ApiAction as V, getAmplifyUserAgent as a, AmplifyUrl as b, composeTransferHandler as c, getDnsSuffix as d, AmplifyError as e, AmplifyErrorCode as f, getRetryDecider as g, composeServiceApi as h, parseJsonBody as i, jitteredBackoff$1 as j, assertTokenProviderConfig as k, decodeJWT as l, createAssertionFunction as m, isTokenExpired as n, AMPLIFY_SYMBOL as o, parseJsonError as p, defaultStorage as q, ConsoleLogger as r, urlSafeDecode as s, assertOAuthConfig as t, unauthenticatedHandler as u, AuthAction as v, isBrowser as w, ADD_OAUTH_LISTENER as x, assertIdentityPoolIdConfig as y, getId as z };
