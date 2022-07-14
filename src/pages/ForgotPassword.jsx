import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrorRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = e => {
    setEmail(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent')
    } catch (error) {
      toast.error('Could not send password reset email')
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Pasword</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input type="email" className="emailInput" placeholder="Email" id="email" value={email} onChange={onChange} />
          <Link className="forgotPasswordLink" to='/sign-in'>Sign In</Link>

          <div className="signInBar">
            <div className="signInText">Send reset link</div>
            <button className="signInButton"><ArrorRightIcon fill='#ffffff' width='34px' height='34px' /></button>
          </div>

        </form>
      </main>
    </div>
  )
}

export default ForgotPassword
