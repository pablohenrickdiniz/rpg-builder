app.constant('USER_ROLES',{
    all:'*',
    admin:'admin',
    editor:'editor'
});

app.constant('AUTH_EVENTS',{
    loginSuccess:'auth-login-success',
    loginFailed:'auth-login-failed',
    logoutSuccess:'auth-logout-success',
    sessionTimeout:'auth-session-timeout',
    notAuthenticated:'auth-not-authenticated',
    notAuthorized:'auth-not-authorized'
});

app.constant('URLS',{
    HOST:'http://localhost',
    PORT:8080,
    BASE_URL:'http://localhost:8080/'
});
