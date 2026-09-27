import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthContext from '../context/authContextValue';
import '../styles/auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/');
      } else {
        setError(data.message || 'Registration failed. Please check details and try again.');
      }
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">Start Your Journey</span>
          <h2>Create Your Account</h2>
          <p>Join the YBags community for bespoke offers and priority dispatch.</p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
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