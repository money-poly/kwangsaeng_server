export type TokenModel = {
    accessToken: string;
    refreshToken: string;
    accessTokenExp: Date;
    refreshTokenExp: Date;
};

export type AccessTokenModel = {
    accessToken: string;
    accessTokenExp: Date;
};
