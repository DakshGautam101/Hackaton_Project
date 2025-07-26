import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, User, Phone, ShieldCheck } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phone: '',
    role: 'Vendor'
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await login(formData);
        if (result.success) {
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(result.message || 'Login failed');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          toast.success('Account created! Please log in.');
          setIsLogin(true);
        } else {
          toast.error(data.message || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50 px-4">
      <Toaster position="top-right" />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="flex items-center border rounded px-3">
                <User className="text-orange-500 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 outline-none"
                  required
                />
              </div>
              <div className="flex items-center border rounded px-3">
                <Phone className="text-orange-500 mr-2" size={20} />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 outline-none"
                  required
                />
              </div>
              <div className="flex items-center border rounded px-3">
                <ShieldCheck className="text-orange-500 mr-2" size={20} />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 outline-none"
                >
                  <option value="Vendor">Vendor</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center border rounded px-3">
            <Mail className="text-orange-500 mr-2" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 outline-none"
              required
            />
          </div>

          <div className="flex items-center border rounded px-3">
            <Lock className="text-orange-500 mr-2" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-orange-600 hover:underline text-center"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
