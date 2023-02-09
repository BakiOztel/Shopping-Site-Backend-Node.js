const userModel = require("../Model/userModel.js");
const jwt = require("jsonwebtoken");

exports.refreshTokenHandler = async (req, res) => {
    const cookies = req.cookies;

    //if the cookie is not found
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    const foundUser = await userModel.findOne({ refreshToken }).exec();
    if (!foundUser) {

        jwt.verify(refreshToken, process.env.JWT_KEY_REFRESH_TOKEN,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);
                //Delete Refresh token
                const stolenAccount = await userModel.findOne({ _id: decoded._id }).exec();
                stolenAccount.refreshToken = "";
                const result = await stolenAccount.save();
            }
        )
        return res.sendStatus(403);
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    jwt.verify(refreshToken, process.env.JWT_KEY_REFRESH_TOKEN, async (err, decoded) => {

        if (err) {
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await foundUser.save();

        }
        // reject if id in refreshToken is not equal to real user's id
        if (err || String(foundUser._id) !== decoded.userInfo._id) return res.sendStatus(403);

        const userx = { _id: foundUser._id, email: foundUser.email }
        const accessToken = jwt.sign({ userInfo: userx }, process.env.JWT_KEY);
        const newRefreshToken = jwt.sign({ userInfo: userx }, process.env.JWT_KEY_REFRESH_TOKEN);

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken, user: foundUser });
    });
};