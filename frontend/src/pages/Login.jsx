import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthContext from '../context/authContextValue';
import '../styles/auth.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Invalid credentials. Please verify and try again.');
        return;
      }
      login(data);
      navigate('/');
    } catch {
      setError('Unable to reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">Welcome Back</span>
          <h2>Sign in to YBags</h2>
          <p>Access your saved wishlist, cart items, and order tracking history.</p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="input-field-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input 
                id="login-email" 
                type="email" 
                autoComplete="email" 
                placeholder="name@example.com"
                value={email} 
                onChange={(event) => setEmail(event.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input-field-group">
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input 
                id="login-password" 
                type={showPassword ? 'text' : 'password'} 
                autoComplete="current-password" 
                placeholder="••••••••"
                value={password} 
                onChange={(event) => setPassword(event.target.value)} 
                required 
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
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-footer-prompt">
          <p>New to YBags? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
