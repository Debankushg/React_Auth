import React, { useEffect, useState } from 'react'
import styles from '../styles/Username.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom'


const Recovery = () => {

  const navigate = useNavigate()

  const { username } = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState()

  useEffect(() => {
    generateOTP(username).then((OTP) => {

      console.log(OTP);

      if (OTP) return toast.success('OTP has been successfully send to your email..')
      return toast.error('Problem while generating OTP')
    })
  }, [username])

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      let { status } = await verifyOTP({ username, code: OTP })

      if (status === 201) {
        toast.success('Verify Successfully..!')
        return navigate('/reset')
      }

    } catch (error) {
      return toast.error('Wrong OTP! Check the email again..!!')
    }

  }


  let resendOTP = () => {
    let sendPromise = generateOTP(username)
    toast.promise(sendPromise, {
      loading: "Sending..",
      success: <b>OTP send in your Email</b>,
      error: <b>Could not Send it</b>
    })
    sendPromise.then(OTP => {
      console.log(OTP);
    })
  }


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to Recover Password.
            </span>
          </div>

          <form className='pt-20' onSubmit={onSubmit}>


            <div className="textbox flex flex-col items-center gap-6">
              <div className='input text-center'>

                <span className='py-4 text-sm text-left text-gray-500 '>Enter 6 digit OTP sent to your email adress</span>
                <input className={styles.textbox} type="text" placeholder='OTP' onChange={(e) => setOTP(e.target.value)} />
              </div>

              <button className={styles.btn} type='submit'>Recover</button>
            </div>


          </form>
          <div className="text-center py-4">
            <span className='text-gray-500'>Cant get OTP? <button className='text-red-500' onClick={resendOTP}>Resend</button></span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Recovery