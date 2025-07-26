import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const supplierData = {
    name: 'Rajesh Kumar',
    title: 'Supplier of Fresh Produce',
    rating: 4.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDihS4meCwLvwLKNos38N8l8Wm__v4IC_dw3lzWv-QVk7nQYht1wj32AmO8cuMthFDdeFXXcHsBc9RNs1sse07NqOkhturbE65amBYIeM8OCYGtdr-lGNjXYR6JK1iF5_X95vwGDDWW0L_OibUzGFuQ5gXSVBfXW9XiRal9DM-ROB1NKRO0Y4DPDczRPHPXfAdBitZ63kAmbmFAcPLw4VbrB16IdzIb7Ftp1hrBOts1ZyYQTYQRfr1NHd7hHns3xJCm3Pqvoga9imsd'
  };

  const itemsOffered = ['Tomatoes', 'Onions', 'Potatoes', 'Cilantro', 'Green Chilies'];

  const reviews = [
    {
      id: 1,
      userName: 'Priya Sharma',
      userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg7HDORXpKJ1ug4ySyKGug4oZ8ss38pV3eRfQBX-kKfjPiV1EmnS00OctPVo9BbFerUJgQRsQlKQHXP_KzCmoRZnJwzNCNChlzj1BK8hu9eQxM4Yr63Osju9vaZSmg7J1nh5wn01SeN-23qlgkj5jdNBSz28bx_m29g_u641ekSspyiLW9QeH8YEGGD-T-4YcZx8MOkPMvLRk678eaURK4ukf5cg973R73j2c1IPWYFuPhPSRPvRz0VP1Y6cBLSmK4WkJ-OueT2j8J',
      rating: 5,
      date: '2 weeks ago',
      comment: "Rajesh's produce is always fresh and of the highest quality. I've been buying from him for years and have never been disappointed.",
      likes: 15,
      dislikes: 2
    },
    {
      id: 2,
      userName: 'Arjun Singh',
      userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCod7OBWj8f3769JyCBdyLvxZmPV-VikH7OOJzv68SN8Z5Nr_qgBRFJjU3SiqmCfJ0iLfLCZSYw1rM-LPzgh71K7GqJBBXTQLF96HwphDjfbS04cXtZZkHXgzNhquswUWv53bkxBcMDfoobUFbyEA906PdEsHYeqQePM8vNb54c2MKFwDf5tfFr96YSl5kbCgMz3agOKuGpTP2wlrcURxbjLZHCo9v_B8mpXuV8OE50hW5KoPsZWNvMvvIXDKkOF3Xcz3SCer2yfTX',
      rating: 4,
      date: '1 month ago',
      comment: 'Good quality produce, but sometimes the prices are a bit higher than other suppliers. Overall, a reliable source.',
      likes: 8,
      dislikes: 1
    }
  ];

  const renderStars = (rating, size = "18px") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <div key={i} className="text-[#e87d30]">
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
              <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
            </svg>
          </div>
        );
      } else {
        stars.push(
          <div key={i} className="text-[#d5bfae]">
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
              <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z" />
            </svg>
          </div>
        );
      }
    }
    return stars;
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ece7] px-10 py-3">
          <div className="flex items-center gap-4 text-[#1b130e]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <Link to="/">
              <h2 className="text-[#1b130e] text-lg font-bold leading-tight tracking-[-0.015em] hover:text-[#e87d30] cursor-pointer">Saving for Street Food</h2>
            </Link>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link to="/" className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]">Home</Link>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Suppliers</a>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Savings</a>
              <a className="text-[#1b130e] text-sm font-medium leading-normal hover:text-[#e87d30]" href="#">Profile</a>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNtt5GPkY7g_pUGNwkNlxGogoZE2wVsNrnh-2o05NP26mKPcwc1RLNm6yfphNgqiUHB7OPjy5x2Pdn300RBEgzy_PvNf7OpO4AGIEX46BbFrJhcMma9Rx4_SPUVWfwN4U6I9VH-9uxtIvjsfGdFZZzz4qPzo7MqSb7IDCo7hmQNWiQmLh15sBsP06bVZ1yPPuLBdvrCOyzTbYxj9xv444O2plBw4LizUOdkjCsoBFVOVQDeNNlpKyV8wuZzkIxSsCrDL4_aJP25gbS")'
              }}
            />
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#1b130e] tracking-light text-[32px] font-bold leading-tight">Supplier Profile</p>
                <p className="text-[#976d4e] text-sm font-normal leading-normal">View details about your supplier</p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex p-4 @container">
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    style={{ backgroundImage: `url("${supplierData.image}")` }}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-[#1b130e] text-[22px] font-bold leading-tight tracking-[-0.015em]">{supplierData.name}</p>
                    <p className="text-[#976d4e] text-base font-normal leading-normal">{supplierData.title}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Offered Section */}
            <h2 className="text-[#1b130e] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Items Offered</h2>
            {itemsOffered.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-[#fcfaf8] px-4 min-h-14">
                <p className="text-[#1b130e] text-base font-normal leading-normal flex-1 truncate">{item}</p>
              </div>
            ))}

            {/* Ratings & Badges Section */}
            <h2 className="text-[#1b130e] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Ratings & Badges</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-6 p-4">
              <div className="flex flex-col gap-2">
                <p className="text-[#1b130e] text-4xl font-black leading-tight tracking-[-0.033em]">{supplierData.rating}</p>
                <div className="flex gap-0.5">
                  {renderStars(supplierData.rating)}
                </div>
              </div>
            </div>

            {/* Top Rated Badge */}
            <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 min-h-14">
              <div className="text-[#1b130e] flex items-center justify-center rounded-lg bg-[#f3ece7] shrink-0 size-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z" />
                </svg>
              </div>
              <p className="text-[#1b130e] text-base font-normal leading-normal flex-1 truncate">Top Rated</p>
            </div>

            {/* Reviews Section */}
            <h2 className="text-[#1b130e] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Reviews</h2>
            <div className="flex flex-col gap-8 overflow-x-hidden bg-[#fcfaf8] p-4">
              {reviews.map((review) => (
                <div key={review.id} className="flex flex-col gap-3 bg-[#fcfaf8]">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                      style={{ backgroundImage: `url("${review.userImage}")` }}
                    />
                    <div className="flex-1">
                      <p className="text-[#1b130e] text-base font-medium leading-normal">{review.userName}</p>
                      <p className="text-[#976d4e] text-sm font-normal leading-normal">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {renderStars(review.rating, "20px")}
                  </div>
                  <p className="text-[#1b130e] text-base font-normal leading-normal">
                    {review.comment}
                  </p>
                  <div className="flex gap-9 text-[#976d4e]">
                    <button className="flex items-center gap-2 hover:text-[#e87d30] transition-colors">
                      <div className="text-inherit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
                        </svg>
                      </div>
                      <p className="text-inherit">{review.likes}</p>
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#e87d30] transition-colors">
                      <div className="text-inherit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
                        </svg>
                      </div>
                      <p className="text-inherit">{review.dislikes}</p>
                    </button>
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

export default ProfilePage;
