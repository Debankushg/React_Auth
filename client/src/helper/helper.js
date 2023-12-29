
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN



export const authenticate = async (username) => {
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error: "Username doesn't exist..." }
    }
}


// get user details 

export const getUser = async ({ username }) => {
    try {
        const { data } = await axios.get(`/api/user/${username}`)
        return { data }
    } catch (error) {
        return { error: "password doesn't Match..." }
    }
}

// register  user

export const registerUser = async (credentials) => {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials)
        let { username, email } = credentials;
        if (status === 201) {
            await axios.post(`/api/registerMail`, { username, userEmail: email, text: msg })
        }
        return Promise.resolve(msg)

    } catch (error) {
        return Promise.reject({ error })
    }
}

// login 

export const login = async ({ username, password }) => {
    try {
        if (username) {
            const { data } = await axios.post(`/api/login`, { username, password })
            return Promise.resolve({ data })
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesnot match" })
    }
}

// update user

export const updateUser = async (response) => {
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } })

        return Promise.resolve({ data })



    } catch (error) {
        return Promise.reject({ error: "Couldn't update Profile...!!" })
    }
}


export const generateOTP = async (username) => {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } })

        if (status === 201) {
            let { data: { email } } = await getUser({ username })
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password`
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" })
        }
        return Promise.resolve(code);

    } catch (error) {
        return Promise.reject({ error })
    }
}


export const verifyOTP = async ({ username, code }) => {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } })
        return { data, status }
    } catch (error) {
        return Promise.reject({ error })
    }
}


export const resetPassword = async ({ username, password }) => {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password })

        return Promise.resolve({ data, status })

    } catch (error) {
        return Promise.reject({ error })
    }
}