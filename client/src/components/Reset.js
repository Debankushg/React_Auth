import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styles from '../styles/Username.module.css'
import toast,{ Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { resetPasswordValidation } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store'
import useFetch from '../hooks/fetch.hook'


const Reset = () => {

  const navigate = useNavigate()
  const[{isLoading,apiData,serverError,status}] =useFetch('createResetSession')

 const {username}= useAuthStore(state => state.auth)

 useEffect(() =>{
  console.log(apiData);
 },[])

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd:''
    },
    validate : resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      console.log(values)
      let resetPromise = resetPassword({username , password:values.password})

      toast.promise(resetPromise,{
        loading:'Updating...',
        success:<b>Reset Successfully..</b>,
        error:<b>Could not Reset</b>
      })
      resetPromise.then(function(){navigate('/password')})

    }

  })

  if(isLoading) return <h1 className='text-2xl font-bold'>Is Loading</h1>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  if(status && status!== 201) return <Navigate to={'/password'} replace={true}></Navigate>


  const handleReset = () => {

  }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
             Enter new password
            </span>
          </div>

          <form className='pt-20' onSubmit={formik.handleSubmit}>
           

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='password' />
              <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type="text" placeholder='confirm password' />
              <button className={styles.btn} type='submit' onClick={handleReset}>Reset</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Forgot password? <button className='text-red-500' to="/recovery">Recover Now</button></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Reset