import styles from '../../css/Login.module.css'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { sendAuthData } from '../../redux/auth-reducer'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { IDispatch, rootStateType } from '../../redux/store'
import React, { FC } from 'react'

type FormDataType = {
      login: string
      password: string
      captcha: string
}

// ? Component
const Login: React.FC<InjectedFormProps<FormDataType>> = (props) => {
      const captcha = useSelector((state: rootStateType) => state.auth.captcha)
      return (
            <div>
                  <h1>Login</h1>
                  <form onSubmit={props.handleSubmit} className={styles.form} action='#'>
                        <Field component='input' name='login' type='text' placeholder='Login' />
                        <Field component='input' name='password' type='password' placeholder='Password' />
                        <Field component='input' type='checkbox' name='remember' />
                        <button>Login</button>
                        {captcha && (
                              <>
                                    <img src={captcha} alt='captchaImg' />
                                    <Field component='input' name='captcha' type='text' placeholder='Enter captcha symbols' />
                              </>
                        )}
                        {props.error && <p className={styles.error}>{props.error}</p>}
                        <a className={styles.noAccount} href='https://social-network.samuraijs.com/' target='_blank'>
                              Don't have an account? Please register
                        </a>
                  </form>
            </div>
      )
}

// ? Redux Form HOC
const LoginForm = reduxForm<FormDataType>({
      form: 'login',
})(Login)

// ? Container Stuff
const LoginContainer: FC = (props) => {
      const auth = useSelector((state: rootStateType) => state.auth.isAuthorized)
      const dispatch: IDispatch = useDispatch()
      const sendAuthData = (login: string, password: string, captcha: string) => {
            dispatch(sendAuthData(login, password, captcha))
      }
      if (auth) {
            return <Navigate to={'/profile'} />
      }
      return (
            <LoginForm
                  onSubmit={(formData: FormDataType) => {
                        sendAuthData(formData.login, formData.password, formData.captcha)
                  }}
            />
      )
}

export default LoginContainer
