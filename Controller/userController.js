const userModel = require("../Model/userModel.js");
const hashing = require("../Middleware/encryptionHandler.js");
const jwt = require("jsonwebtoken");

// source of help for authentication : https://github.com/gitdagray/nodejs_jwt_auth

exports.userLogin = async (req, res, next) => {
    const cookies = req.cookies;
    const foundUser = await userModel.findOne({ email: req.body.email }).exec();
    //Unauthorized 
    if (!foundUser) return res.status(401).send({ message: "Wrong mail" })

    if (foundUser) {
        // evaluate password 
        if (hashing.decryptPassword(req.body.password, foundUser.password)) {

            const userx = { _id: foundUser._id, email: foundUser.email }

            const accessToken = jwt.sign({ userInfo: userx }, process.env.JWT_KEY);
            const newRefreshToken = jwt.sign({ userInfo: userx }, process.env.JWT_KEY_REFRESH_TOKEN);
            let newRefreshTokenArray =
                !cookies?.jwt
                    ? foundUser.refreshToken
                    : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);


            if (cookies?.jwt) {
                const refreshToken = cookies.jwt;
                const foundToken = await userModel.findOne({ refreshToken }).exec();
                if (!foundToken) {
                    newRefreshTokenArray = [];
                }
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            }
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            // Send authorization roles and access token to user
            res.json({ accessToken, user: foundUser });
        } else {
            //invalid password 
            return res.status(401).send({ message: "Wrong password" });
        }
    }

}


exports.userRegister = async (req, res, next) => {

    const hashpassword = await hashing.encryptPassword(req.body.password);
    const data = await userModel.findOne({ email: req.body.email });
    if (data) {
        res.status(409).send({ error: true, message: "there is such a mail" });
    } else {
        const user = new userModel({
            email: req.body.email,
            password: hashpassword
        });
        await user.save().then(() => {
            res.status(200).send({ error: false });
        }).catch(err => {
            console.log(err);
        });
    }
}


exports.userLogOut = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = await userModel.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }


    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
    const result = await foundUser.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}