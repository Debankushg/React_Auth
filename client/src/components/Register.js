import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import profile from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import {registerValidation} from '../helper/validate'
import convertToBase64 from '../helper/convert'

const Register = () => {

  const [file, setfile] = useState()

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' })
      console.log(values)
    }

  })

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setfile(base64)
  }


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ height: "90%", paddingTop: "3em" }}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Happy to join you!
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
                <img src={file || profile} className={styles.profile_img} alt="avatar" />
              </label>

              <input type='file' id='profile' onChange={onUpload} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*' />
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username *' />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='password*' />


              <button className={styles.btn} type='submit'>Register</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Already Register? <Link className='text-red-500' to="/login">Login Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Register