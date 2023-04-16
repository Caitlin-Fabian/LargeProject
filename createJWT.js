const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.createToken = function (id, Name, score, isVerified) {
    return _createToken(id, Name, score, isVerified);
};
_createToken = function (id, Name, score, isVerified) {
    try {
        const expiration = new Date();
        const user = { userID: id, Name: Name, Score: score, isVerified: isVerified };
        console.log(user);
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        // In order to exoire with a value other than the default, use the
        // following
        /*
const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,
{ expiresIn: '30m'} );
'24h'
'365d'
*/
        var ret = { accessToken: accessToken };
    } catch (e) {
        var ret = { error: e.message };
    }
    return ret;
};
exports.isExpired = function (token) {
    var isError = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, verifiedJwt) => {
            if (err) {
                return true;
            } else {
                return false;
            }
        }
    );
    return isError;
};
exports.refresh = function (token) {
    var ud = jwt.decode(token, { complete: true });
    var id = ud.payload.id;
    var Name = ud.payload.Name;
    var score = ud.payload.score;
    var isVerified = ud.payload.isVerified;
    return _createToken(Name, score, id,isVerified);
};
