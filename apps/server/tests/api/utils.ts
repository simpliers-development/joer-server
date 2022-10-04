export function dumpCreateUser(user: any, fields = {}) {
    return {
        email                : user.email,
        firstName            : user.firstName,
        lastName             : user.lastName,
        password             : user.password,
        passwordConfirmation : user.password,
        userName             : user.userName,
        ...fields
    };
}
