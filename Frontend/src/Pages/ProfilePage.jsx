import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await userService.getProfile();
      setProfile(data);
      setFormData({
        username: data.username,
        phone: data.phone,
        address: data.address || '',
        description: data.description || ''
      });
    } catch (err) {
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      await fetchProfile();
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8]">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-[#f3ece7] px-10 py-3">
          <Link to="/" className="flex items-center gap-4 text-[#1b130e]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold hover:text-[#e87d30]">Street Eats</h2>
          </Link>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="max-w-[960px] flex-1 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#1b130e]">Profile</h1>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-orange-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-orange-500"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={profile.avatar || 'https://via.placeholder.com/100'}
                      alt="Profile"
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{profile.username}</h2>
                      <p className="text-gray-600">{profile.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{profile.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{profile.address || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Description</p>
                      <p>{profile.description || 'No description provided'}</p>
                    </div>
                  </div>

                  {profile.role === 'Supplier' && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Ratings & Reviews</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl text-yellow-500">★</span>
                        <span className="text-xl font-bold">{profile.rating || '0'}</span>
                        <span className="text-gray-500">({profile.reviewCount || '0'} reviews)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
