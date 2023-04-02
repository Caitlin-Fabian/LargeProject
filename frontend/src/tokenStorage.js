exports.storeToken = function (tok) {
    try {
        localStorage.setItem('token_data', tok.accessToken);
        console.log('hello' + tok.accessToken);
    } catch (e) {
        console.log(e.message);
    }
};
exports.retrieveToken = function () {
    var ud;
    try {
        ud = localStorage.getItem('token_data');
        console.log(ud);
    } catch (e) {
        console.log(e.message);
    }
    return ud;
};
