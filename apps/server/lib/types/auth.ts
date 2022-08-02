export interface IRegistrationBody {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstname: string;
    lastname: string;
}

export interface ILoginBody {
    emailOrUsername: string;
    password: string;
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}
