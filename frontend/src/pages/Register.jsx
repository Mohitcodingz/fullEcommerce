import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthContext from '../context/authContextValue';
import '../styles/auth.css';

export default function Register() {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(location.state?.email ? 'Your account needs email verification. Enter your details to resend the OTP.' : '');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('register'); // 'register' or 'verify-otp'
  const [otp, setOtp] = useState('');
  const [userData, setUserData] = useState(location.state?.email ? { email: location.state.email } : null);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setUserData({ email: location.state.email });
    }
  }, [location.state]);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        // Backend only returns user info here (no token until OTP verified)
        setUserData({ name: data.name || name, email: data.email || email });
        setInfo(data.message || 'OTP sent. Please check your inbox.');
        setStep('verify-otp');
      }
      else {
        setError(data.message || 'Registration failed. Please check details and try again.');
      }
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData?.email || email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        // OTP verified successfully - log user in with token
        login(data);
        navigate('/');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify-otp') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-kicker">Verify Your Email</span>
            <h2>Enter Verification Code</h2>
            <p>We've sent a 6-digit OTP to {userData?.email || email}</p>
          </div>

          {info && (
            <div className="auth-error-banner" role="status" style={{ background: '#e7f6ec', color: '#1c7c3e', borderColor: '#bfe6cc' }}>
              <span>{info}</span>
            </div>
          )}

          {error && (
            <div className="auth-error-banner" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleOtpSubmit} className="auth-form-body">
            <div className="input-field-group">
              <label htmlFor="otp">One-Time Password</label>
              <div className="input-with-icon">
                <input 
                  id="otp"
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  required 
                  maxLength="6"
                />
              </div>
              <small>Check your email for the verification code. Valid for 10 minutes.</small>
            </div>

            <button type="submit" className="btn btn-auth-submit" disabled={loading || otp.length !== 6}>
              <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-footer-prompt">
            <p>Didn't receive code? <button onClick={() => setStep('register')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">Start Your Journey</span>
          <h2>Create Your Account</h2>
          <p>Join the YBags community for bespoke offers and priority dispatch.</p>
        </div>

        {info && (
          <div className="auth-error-banner" role="status" style={{ background: '#e7f6ec', color: '#1c7c3e', borderColor: '#bfe6cc' }}>
            <span>{info}</span>
          </div>
        )}

        {error && (
          <div className="auth-error-banner" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="auth-form-body">
          <div className="input-field-group">
            <label htmlFor="reg-name">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input 
                id="reg-name"
                type="text" 
                placeholder="e.g. John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input-field-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input 
                id="reg-email"
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input-field-group">
            <label htmlFor="reg-password">Create Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input 
                id="reg-password"
                type={showPassword ? 'text' : 'password'} 
                placeholder="At least 6 characters" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
              />
              <button 
                type="button" 
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-auth-submit" disabled={loading}>
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-footer-prompt">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
