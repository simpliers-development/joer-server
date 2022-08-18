export function dumpCreateUser(user: any) {
    return {
        email                : user.email,
        firstName            : user.firstName,
        lastName             : user.lastName,
        password             : user.password,
        passwordConfirmation : user.password,
        userName             : user.userName
    };
}
