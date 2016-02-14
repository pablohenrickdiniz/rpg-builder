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
    PORT:9090,
    BASE_URL:'http://localhost:9090/'
});

app.constant('TASK',{
    RESTART_TIME:30000
});