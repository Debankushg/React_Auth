import toast from 'react-hot-toast'
// validate 
import {authenticate} from './helper'

export const usernameValidate = async (values) => {
    const errors = usernameVerify({}, values);

    if(values.username){

        const {status} = await authenticate(values.username)

        if(status !== 200){
            errors.exist = toast.error("User does not exist ...")
        }
    }

    return errors
}

export const passwordValidate = async (values) => {
    const errors = passwordVerify({}, values);

    return errors
}


export const resetPasswordValidation = async (values) => {
    const errors = passwordVerify({}, values);
    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error('Password not match ...!!')
    }

    return errors
}

export const registerValidation = async(values) => {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors
}

export const profileValidation = async(values) => {
    const errors = emailVerify({}, values);
    return errors

}

// validate password 

const passwordVerify = (errors={}, values) => {
    const specialChar = /[$&+,:;=?@#|'<>.-^*()%!]/
if(!values.password){
    errors.password = toast.error('Password is Required')
}else if (values.password.includes(" ")) {
    errors.password = toast.error('Wrong Password... !')
}else if(values.password.length<4){
    errors.password = toast.error('Password must be more than 4 character... !')
}else if(!specialChar.test(values.password)){
    errors.password = toast.error('Password must have special character.. !')
}
return errors
}

const usernameVerify = (error = {}, values) => {
    if (!values.username) {
        error.username = toast.error('Username is Required')
    } else if (values.username.includes(" ")) {
        error.username = toast.error('Invalid Username... !')
    }
    return error
}


const emailVerify =(errors={}, values) => {
    if(!values.email){
        errors.email = toast.error('email is Required')
    }else if (values.email.includes(" ")) {
        errors.email = toast.error('Invalid email... !')
    }else if(/"^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"/i.test(values.email)){
        errors.email= toast.error('Invalid email address... !')
    }
    return errors
}