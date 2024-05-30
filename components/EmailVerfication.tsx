import { useState } from 'react';

function EmailVerification({  }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleNext = () => {
    if (step === 1) {
      // Here you would typically send the verification code to the user's email
      // For simplicity, we'll just move to the next step
      setStep(2);
    } else if (step === 2) {
      // Here you would typically verify the code entered by the user
      // For simplicity, we'll just move to the next step
      setStep(3);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <span>What email should we send it to?</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{border: '1px solid #000', minWidth: '200px'}} />
        </div>
      )}

      {step === 2 && (
        <div>
          <span>Please enter the verification code we sent to your email</span>
          <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} style={{border: '1px solid #000', minWidth: '200px'}} />
        </div>
      )}

      {step === 3 && (
        <div>
          <span>Verification successful! Your email is {email}</span>
          <button onClick={() => setStep(1)}>Restart</button>
        </div>
      )}

      {step < 3 && <button onClick={handleNext}>Next</button>}
    </div>
  );

}

export default EmailVerification;