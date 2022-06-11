import * as React from 'react'
import jsonp from 'jsonp'
import styles from '../styles/EmailForm.module.css'

interface EmailFormProps {
  actionUrl: string
  onSuccess: () => void
}

const EmailForm: React.FC<EmailFormProps> = ({ actionUrl, onSuccess }) => {
  const [showForm, setShowForm] = React.useState(true)
  const [status, setStatus] = React.useState('')
  const [email, setEmail] = React.useState('')

  const handleSubmit = () => {
    const valueString = `EMAIL=${encodeURIComponent(email)}`
    const path = `${actionUrl}&${valueString}`
    const url = path.replace('/post?', '/post-json?')
    const regex = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/
    !regex.test(email) ? setStatus('empty') : sendData(url)
  }

  const sendData = (url: string) => {
    setStatus('sending')
    jsonp(url, { param: 'c' }, (err, data) => {
      if (data.msg.includes('already subscribed')) {
        setStatus('duplicate')
        setShowForm(false)
        onSuccess()
      } else if (err) {
        setStatus('error')
      } else if (data.result !== 'success') {
        setStatus('error')
      } else {
        setStatus('success')
        setShowForm(false)
        onSuccess()
      }
    })
  }

  return (
    <div className={styles.wrapper}>
      {showForm && (
        <div className={styles.inputAndButton}>
          <input
            id='email'
            type='email'
            name='email'
            placeholder='Enter your email address'
            autoComplete='email'
            className={styles.textInput}
            aria-label='Email'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <button
            disabled={
              status === 'sending' || status === 'success' || email === ''
            }
            type='submit'
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            Submit
          </button>
        </div>
      )}

      <div className={styles.statusLabel}>
        {status === 'sending' && <p>Sending...</p>}
        {status === 'success' && <p>Thanks, you’ll hear from us soon!</p>}
        {status === 'duplicate' && (
          <p>You’re already signed up to receive updates</p>
        )}
        {status === 'empty' && <p>Please enter a valid email address</p>}
        {status === 'error' && <p>Something went wrong. Please try again.</p>}
      </div>
    </div>
  )
}

export default EmailForm
