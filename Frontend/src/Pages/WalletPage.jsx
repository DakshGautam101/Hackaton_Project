import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { walletService } from '../api/services';
import TransactionList from '../components/features/wallet/TransactionList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [addingFunds, setAddingFunds] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions()
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;

    try {
      setAddingFunds(true);
      await walletService.addFunds(Number(amount));
      await fetchWalletData();
      setAmount('');
    } catch (err) {
      setError('Failed to add funds');
    } finally {
      setAddingFunds(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ece7] px-10 py-3">
          <div className="flex items-center gap-4 text-[#1b130e]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <Link to="/">
              <h2 className="text-[#1b130e] text-lg font-bold leading-tight tracking-[-0.015em] hover:text-[#e87d30] cursor-pointer">Street Eats</h2>
            </Link>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link to="/" className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]">Home</Link>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Savings</a>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Wallet</a>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Profile</a>
            </div>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f3ece7] text-[#1b130e] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div className="text-[#1b130e]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkJm9QxFWexesiRO2AwlsfygfLXZhhZFsozf7BBX-ud2HaueawDjdpbdRxgw2obHHxSi7hH1tVmc-xwEWaHgzMmKHuukjo-YLeZu9kgkYJ10MS7sVJ422M6mXwhz1ygF75prFpJwNH79ol1HdBYjUsogx7VVn-igECcGzDwigY3i-GFddJs7XWC3p5Wa3ICQm2-3SPRp3Ribiu6EEozACgJk7HuupfSKTppO1eTb_2_A5nsDQKVmjlMkmaQipvZAevNZTlpQm5Bf30")'
              }}
            />
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#1b130e] tracking-light text-[32px] font-bold leading-tight min-w-72">Wallet</p>
            </div>

            {/* Wallet Balance Card */}
            <div className="p-4 @container">
              <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNNiU9_Ivkf6QkdoR5pmfLaHE78Fo7UhjgAUhlsEvj_BoD2hlvUokwtAY_U1De3GD0kn8i_-e8KjyMcEY0_r_efW0q13Xw4FKWSpsQS2hB0Lhc5TLAbvJEX3uBd4mKpbNxUcsoM7-0v4iz_6AHDdX1ymOPZM6-N3ofizvcbci6hGxbNirmOKJi1BMV3gZenLMQTBTEMYodDGog5_OmkCKap3rcWcppb-iAq0XtCCi89ec5AVoiQQ9magLxQFJZV7y38O4mDgH6HAFb")'
                  }}
                />
                <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                  <p className="text-[#1b130e] text-lg font-bold leading-tight tracking-[-0.015em]">Current Balance</p>
                  <div className="flex items-end gap-3 justify-between">
                    <p className="text-[#976d4e] text-base font-normal leading-normal">₹ {balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Funds Form */}
            <div className="p-4">
              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
                <h3 className="text-[#1b130e] text-[22px] font-bold leading-tight tracking-[-0.015em]">Add Funds</h3>
                <form onSubmit={handleAddFunds} className="flex gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="p-2 border rounded focus:ring-2 focus:ring-orange-500"
                    min="100"
                    required
                  />
                  <button
                    type="submit"
                    disabled={addingFunds}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
                  >
                    {addingFunds ? 'Adding...' : 'Add Funds'}
                  </button>
                </form>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Transaction History */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h3>
              <TransactionList transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
