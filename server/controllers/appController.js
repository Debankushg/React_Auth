import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator'





//middleware to verify user
export const verifyUser = async (req, res, next) => {
    try {

        const { username } = req.method === "GET" ? req.query : req.body;

        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();


    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" })
    }
}

//http://localhost:8080/api/register

export const register = async (req, res) => {
    try {
        const { username, password, profile, email } = req.body;


        // Check for user existence
        const existingUsername = await UserModel.findOne({ username });
        const existingEmail = await UserModel.findOne({ email });

        // If username exists, return an error
        if (existingUsername) {
            return res.status(400).json({ error: "Please use a unique username" });
        }

        // If email exists, return an error
        if (existingEmail) {
            return res.status(400).json({ error: "Please use a unique email" });
        }



        try {
            // Ensure both checks are complete before proceeding
            await Promise.all([existingUsername, existingEmail]);

            // If the code reaches here, it means both username and email are unique
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new UserModel({
                    username,
                    password: hashedPassword,
                    profile: profile || '',
                    email
                });

                await user.save();
                return res.status(201).send({ msg: "User Registered Successfully" });
            }
        } catch (error) {
            // Promise.all catch block
            return res.status(500).send({ error: "Problem in Server" });
        }
    } catch (error) {
        // Outer catch block
        return res.status(500).send(error);
    }
};


//http://localhost:8080/api/login
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username }).then(user => {
            bcrypt.compare(password, user.password)
                .then(passwordCheck => {
                    if (!passwordCheck) return res.status(400).send({ error: "Dont have Password" })


                    // create jwt token
                    const token = jwt.sign({
                        userId: user._id,
                        username: user.username
                    }, ENV.JWT_SECRET, { expiresIn: "24h" })

                    return res.status(200).send({
                        msg: "Login Successfully",
                        username: user.username,
                        token
                    })
                })
                .catch(error => {
                    return res.status(400).send({ error: "Password does not match" });
                })
        })
            .catch(error => {
                return res.status(404).send({ error: "Username not Found" });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
}

//http://localhost:8080/api/user/username
export const getUser = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) return res.status(501).send({ error: "Invalid username" });

        const getUser = await UserModel.findOne({ username })

        if (!getUser) return res.status(501).send({ error: "Couldn't find the user" });

        //remove password and make new object
        const { password, ...rest } = Object.assign({}, getUser.toJSON())

        return res.status(201).send(rest)

    } catch (error) {
        return res.status(404).send({ error: "Cannot find user Data" })
    }

}

//http://localhost:8080/api/updateuser
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // Using findByIdAndUpdate and await to make sure the update operation is complete before responding
            const result = await UserModel.findByIdAndUpdate(userId, body);

            if (result) {
                return res.status(201).send({ msg: "Record Updated...!!" });
            } else {
                return res.status(404).send({ error: "User Not Found..." });
            }
        } else {
            return res.status(401).send({ error: "User ID not provided..." });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


//http://localhost:8080/api/generateOTP
export const generateOTP = async (req, res) => {

    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    res.status(201).send({ code: req.app.locals.OTP })


}

//http://localhost:8080/api/verifyOTP
export const verifyOTP = async (req, res) => {

    const { code } = req.query

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true; // start session from reset

        return res.status(201).send({ msg: "Verify Successfully" })
    }
    return res.status(400).send({ error: "Invalid OTP" })

}

//http://localhost:8080/api/createResetSession
export const createResetSession = async (req, res) => {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        return res.status(201).send({ msg: "access granted..!!" })
    }
    return res.status(404).send({ error: "Session Expired" })
}

//http://localhost:8080/api/resetPassword
export const resetPassword = async (req, res) => {
    try {

        if (!req.app.locals.resetSession) {
            return res.status(404).send({ error: "Session Expired" })
        }
        const { username, password } = req.body

        try {

            UserModel.findOne({ username }).then(user => {
                bcrypt.hash(password, 10).then(hashedpassword => {
                    const updateRecord = UserModel.updateOne({ username: user.username }, { password: hashedpassword })

                    if (updateRecord) {
                        req.app.locals.resetSession = false;
                        return res.status(201).send({ msg: "Record Updated" })
                    }
                }).catch(e => {
                    return res.status(500).send({ error: "unable to hash password" })
                })
            }).catch(error => {
                return res.status(404).send({ error: "Username not Found" })
            })

        } catch (error) {
            res.status(500).send({ error })
        }

    } catch (error) {
        res.status(401).send({ error })
    }
}