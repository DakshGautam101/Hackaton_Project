import { useState } from 'react';
import { Link } from 'react-router-dom';

const MarketPlace = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      id: 1,
      name: 'Onion',
      price: '$0.50/kg',
      moq: '5kg',
      supplier: 'Fresh Farms',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbJu3rOVe8joPOEo93bOhQM05axMYgQVTWPLqKVMgzHbkqOpexs4am1jkvYRCU_GknWGkcJvROtBuXXLvnMN9J3CRlre3Em7YF7jaWrGNbDBmycqFtorDZDZdIKf6uKfkJXv8u-tnjBpvXQ0OH2kOFMpHAsGu7ab4ezCXeCEJas2MyFmy-IDxKND8n1iWIyWBUnmPoP_WQctCTeTubw3FCW9vM1Bmn-vAHTtEpQ2Mr68z4NoyaRHsa-XvGg-CXDzl2f0_dV4fL3YP'
    },
    {
      id: 2,
      name: 'Potato',
      price: '$0.40/kg',
      moq: '10kg',
      supplier: 'AgriSource',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Y8ZwrIC0yrMBiGwzloKyMDNJmrVDRJcXo8Ru2zapcYX2iKuC0zhuwYLWLfi_WltCbTj6r7GcOVpdMoFAjSPv3YMA4rp0ZFkyMQJgUjFK-0OJsMyalr-rlWpWxic3_ovOnoe6nd1FZN7icG5mnrpk9wDSE9UlerNCz5IRICZ1IY8PTlhAD1DnA-Jmn3eI_Me5RoIg4yP7WLm1benV9jrCGIhObXKJK4zXMg7jS83Bz0d8Iu0fFwhDrU0o52S6EyJtgi77yRNIwyn0'
    },
    {
      id: 3,
      name: 'Tomato',
      price: '$0.60/kg',
      moq: '5kg',
      supplier: 'Red Harvest',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuEWcNVoz5llDdi8c1SPI6BGXlbn3MOfqLB9WpF5-Rr0R11q414Vzhdkm3cH9NWT4Mc4d28dylTBZWkPOGDNwS47sO9qBXMXgEyRifLVDtTemXViyGaPp2a_iIJOvoo6Wsn7KHQM9TsFGwFbxQ6N6LD24jKH4Msk0JhmaUykXq2nI-VMnOqzQrE9CFUULzCgtFVQjBBEgQTNNqvjudWl-fi_w1ggY5CbmKiwI_YKTBMVrrc1_cWpPMCii-cZUDQPHa5t6o0MyPczx-'
    },
    {
      id: 4,
      name: 'Ginger',
      price: '$1.20/kg',
      moq: '2kg',
      supplier: 'Spice Route',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKGffEMmTD-k-Lc1a5Ijd3H8GF24EYlYfrOQY30Yy_WghDuLuiUk6WpcPD4PpfkXv4tcVf0GtLyyMhETQfgaQU_qWzjHs8Xg08KJGl-2haWx5vVYdT3QdNYSSODGX6NZua52NHYQy5CiUwKylDMwqfBn8yvj31eM-_DKVToi0Z2u31bHUfOcPX3bbV0S2GpuSqrc0w3LYNDU00XvFLiiRgFk_0P-PRmPjHgFVYRozb8CNu6a6A6xDkGV9lsU-QVm3SLpqp2OQPyCht'
    },
    {
      id: 5,
      name: 'Garlic',
      price: '$1.00/kg',
      moq: '2kg',
      supplier: 'Spice Route',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnZ-VIebNdhPfsuCWdmxY0NPUWKalgVh8citQt4G8DP4TJr0HNcHDCVlqhNvmqQPKh9TrZFjVUg-cofOz9bW-mlKzWNnm6xaxWth1mJZz-fwp9-69nl44QZgW8XAtceNjJ4amTqK1vJwNQOGK2uOyh0qbcv51hsIS4SvnqsMLAV-vAc7RNviOzBmbb9hgwTL54xGl5iZJM0ANJCAJC41ojocBHV0m9WbPJbJq57o3mvpGY-EAg28_HBn43kLOiG379_LybeclIy_Ym'
    },
    {
      id: 6,
      name: 'Green Chili',
      price: '$1.50/kg',
      moq: '1kg',
      supplier: 'Green Fields',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRmdQd7EIT9IgTW2ZkD-iGlaU5CQxR6yqQo3BdBTTPAMn-NQBmG2Uhd43pkQ9zkYff1rLCHvGnpFUvnLlGjkFi_XgfviciH00RVHr4D3enhE6Qch9TUFMfm4wj7dtxIbTh-VnjpHrynJU5KgajGE61SnRknB0w9f93nq9B_H7Q9rbKdmkpHHesAqHgtf9WhaJQusrRYhjJ0E7RK5r8LFe3pMU97gxTDXvN5LfMTGvFKsYHNkVZ8RhzYxvvZdGY1IwMGHRqYwMopATc'
    },
    {
      id: 7,
      name: 'Coriander',
      price: '$2.00/kg',
      moq: '1kg',
      supplier: 'Herb Haven',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0CBMQ9ddeNrb1jNOiNYwkHjHvq_Rg2cpSVBwodfGBOUQwmmdYnbvOY61BBkxsL6ilSz4eYjt4Lo5WTtXBdHVCtb-dT0CPyy8IgFDEmE-IR7o-sTHDViQ_QaqVqZSxxpUNfftAMYQiQh8K1PFndu4wf8NzSew4jVSNNkaWP8yXb-wQpmh1WSmBxDJuJNYrShN8ZBfVrkjtl81HJaZvbG8kc8eo_GDYyfTZ2gRrl2VUulApmphD4qXfm-76C6e3CBW8UkPeTaWTeFAp'
    },
    {
      id: 8,
      name: 'Lemon',
      price: '$0.80/kg',
      moq: '1kg',
      supplier: 'Citrus Grove',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDguo_WfMtwZVLlREVB82CfH9Xqy88SuWzQYt9lxRydu3C32BfiWn7tRsk8mC6QaakG2eQ8Zm_mJqZrf27JJIeQw-CUHlAMBJ8Ss4eAKyL_0CheDjMGKcpLzf4QVpOvER8eSaNHQu9MSxzIZI6IM5IkhGjm8Vo-GIHPixWqQN1d8cHc_T6ewHoZAlm4T1PZl2rObfzawLe2Av7DuQXyAdycCR4Sf_tJH0DM93FgbJ9JPxJGfsJS2c7k7Np3eGklBqHSMqZlh-ph_-98'
    }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ece7] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#1b130e]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_535)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_535">
                      <rect width="48" height="48" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <Link to="/">
                <h2 className="text-[#1b130e] text-lg font-bold leading-tight tracking-[-0.015em] hover:text-[#e87d30] cursor-pointer">Vendor Savings</h2>
              </Link>
            </div>
            <div className="flex items-center gap-9">
              <Link to="/" className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]">Home</Link>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Savings</a>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Marketplace</a>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Community</a>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-[#976d4e] flex border-none bg-[#f3ece7] items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                  </svg>
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b130e] focus:outline-0 focus:ring-0 border-none bg-[#f3ece7] focus:border-none h-full placeholder:text-[#976d4e] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
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
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaX0NShXco7bySqjSR5N-5ZHkY9-XybsaTcVSZZ_Hw9c9oqHD_HLLKD9YAsrJpVRqg4f-4x3883pi_r_nSlYuzogMshH-7Y0WoUEfo5RSMhbJjE9ZCN8onLeUGe1OfaA9HhgHylAxCDTJ3wSo0JyiCh_RbZFrKt9ZGym2MSHyW8nahqr9ly54hIYBmxD4IzaaUhygXvYzsgcUuXfVJSYCvZhoP5ehFL9Ofoa5jhy3dDtdya99Vr44nzoeMGDrjFuX1FozW5AKldqiJ")'
              }}
            />
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#1b130e] tracking-light text-[32px] font-bold leading-tight">Marketplace</p>
                <p className="text-[#976d4e] text-sm font-normal leading-normal">Find the best quality raw materials for your street food business.</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3ece7] pl-4 pr-2 hover:bg-[#e87d30] hover:text-white transition-colors">
                <p className="text-sm font-medium leading-normal">Sort</p>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                  </svg>
                </div>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3ece7] pl-4 pr-2 hover:bg-[#e87d30] hover:text-white transition-colors">
                <p className="text-sm font-medium leading-normal">Filter</p>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                  </svg>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-3 pb-3 cursor-pointer hover:transform hover:scale-105 transition-transform">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  />
                  <div>
                    <p className="text-[#1b130e] text-base font-medium leading-normal">{product.name}</p>
                    <p className="text-[#976d4e] text-sm font-normal leading-normal">
                      {product.price}, MOQ: {product.moq}, Supplier: {product.supplier}, Trust Badge
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
