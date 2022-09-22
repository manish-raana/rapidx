import React from "react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="px-5">
      /* hero section starts */
      <section className="section-one">
        <div className="w-full bg-black p-2 md:p-10 md:flex justify-between">
          <div className="items-center w-full">
            <Image priority src="/hero.svg" width={600} height={600} alt="hero" />
          </div>
          <div className="order-first md:p-10 w-full md:flex flex-col justify-center text-center md:text-start md:items-start">
            <h1 className="my-5  tranform text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Revolutionizing Cross Border Payments with Web3.0
            </h1>

            <span className="text-purple-500 md:mt-5 text-start text-md md:text-2xl font-bold">
              Upgrade from <b>Web2.0</b> to <b>Web3.0</b> payment rails <br /> Experience 100x faster and cheaper transactions
              <br /> Easy to integrate and get started in no time
            </span>
            <div className="mt-10">
              <button className="px-16 py-2 rounded-lg border border-gray-700 bg-sky-500 m-3 hover:cursor-pointer hover:bg-purple-600 hover:text-white font-bold">
                <Link href="/liquidity">Add Liquidity</Link>
              </button>
              <button className="px-10 py-2 rounded-lg border border-gray-700 bg-orange-500 m-3 hover:cursor-pointer hover:bg-purple-600 hover:text-white font-bold">
                <Link href="/">Connect to RapidX</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
      /* hero section ends */
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
            <h1 className="sm:text-4xl text-2xl font-bold title-font mb-2 text-purple-500">Advantages Of Using Decentralised Payment Rails</h1>
            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
              RapidX rails are built on top of the most secure Ethereum blockchain(Polygon L2), inheriting blockchain grade security. Decentralized
              Automated Market Maker of RapidX powers the instant cross currency swaps of digital currencies. Have idle cash? Add Liquidity and
              generate sustainable real yields.
            </p>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full  text-indigo-500 mb-4">
                  <Image src="/time.png" width={36} height={36} alt="real-time" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Real Time Payments</h2>
                <p className="leading-relaxed text-base">
                  waiting for days to receive global payments is history. Cross border payments are now as fast as the domestic payments.
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full  text-indigo-500 mb-4">
                  <Image src="/fees.png" width={48} height={48} alt="low-fees" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Low Fees</h2>
                <p className="leading-relaxed text-base">
                  Fees as low as 0.2%, compared to 3-8% by Tadfi. You can now be more competitive in your pricing strategy
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full text-indigo-500 mb-4">
                  <Image src="/instant.png" width={48} height={48} alt="instant" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Instant Settlement</h2>
                <p className="leading-relaxed text-base">
                  All transactions are settled instantly in a fully transparent manner, removing any forex exposure risk.
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full text-indigo-500 mb-4">
                  <Image src="/program.png" width={48} height={48} alt="programmable" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Programable</h2>
                <p className="leading-relaxed text-base">
                  Enhance your operational efficiency and free up your resources as all transactions get reconciled instantly.
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full text-indigo-500 mb-4">
                  <Image src="/efficiency.png" width={48} height={48} alt="recon" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Auto Recon</h2>
                <p className="leading-relaxed text-base">
                  Enhance your operational efficiency and free up your resources as all transactions get reconciled instantly.
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full text-indigo-500 mb-4">
                  <Image src="/plugplay.png" width={48} height={48} alt="plug-and-play" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Plug and Play</h2>
                <p className="leading-relaxed text-base">
                  Our plug and play powerful integration tools make onboarding simple and hardly takes minutes.
                </p>
              </div>
            </div>

            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full text-indigo-500 mb-4">
                  <Image src="/security.png" width={48} height={48} alt="security" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Security</h2>
                <p className="leading-relaxed text-base">
                  Our plug and play powerful integration tools make onboarding simple and hardly takes minutes.
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-900 p-6 rounded-lg shadow hover:shadow-purple-800">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full text-indigo-500 mb-4">
                  <Image src="/incentives.png" width={48} height={48} alt="incentives" />
                </div>
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2">Incentives</h2>
                <p className="leading-relaxed text-base">Help the protocol grow to receive automated incentives from the protocol</p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className=" p-12 rounded-lg shadow hover:shadow-purple-800">
                <h2 className="text-lg text-gray-300 font-medium title-font mb-2 text-center">Let's get started</h2>

                <p className="leading-relaxed text-base flex justify-center">
                  <button className="px-10 text-black py-2 rounded-lg border border-gray-700 bg-orange-500 m-2 hover:cursor-pointer hover:bg-purple-600 hover:text-white font-bold">
                    <Link href="/">Connect to RapidX</Link>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 2 ends */}
      <section className="text-gray-600 body-font">
        <div>
          <p className="text-purple-500 text-3xl font-bold text-center">Usecases of RapidX Payment Solution</p>
        </div>
        <div class="flex mt-6 justify-center ">
          <div class="w-16 h-1 rounded-full bg-purple-500 inline-flex"></div>
        </div>
        <div className="container px-5 py-12 mx-auto">
          <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
            <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full text-purple-500 flex-shrink-0">
              <Image priority src="/remittance.png" width={600} height={600} alt="hero" />
            </div>
            <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
              <h2 className="text-gray-300 text-lg title-font font-bold mb-2">Remittances</h2>
              <p className="leading-relaxed text-base">
                Authorized money transfer operators can connect to rapidX protocol to become more competitive
              </p>
            </div>
          </div>
          <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
            <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
              <h2 className="text-gray-300 text-lg title-font font-bold mb-2">E-Commerce</h2>
              <p className="leading-relaxed text-base">
                Merchants accepting international payments can connect their checkout page to rapidX and accept payments from multiple currencies
              </p>
            </div>
            <div className="sm:w-32 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full  text-purple-500 flex-shrink-0">
              <Image priority src="/ecommerce.png" width={600} height={600} alt="hero" />
            </div>
          </div>
          <div className="flex items-center border-b border-gray-800 pb-10 mb-10 lg:w-3/5 mx-auto sm:flex-row flex-col">
            <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full text-purple-500 flex-shrink-0">
              <Image priority src="/trade.png" width={600} height={600} alt="hero" />
            </div>
            <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
              <h2 className="text-gray-300 text-lg title-font font-bold mb-2">Trade Finance</h2>
              <p className="leading-relaxed text-base">Apps facilitating international trade can integrate their payments to rapidX</p>
            </div>
          </div>
          <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
            <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
              <h2 className="text-gray-300 text-lg title-font font-bold mb-2">FinTechs / Neo banks</h2>
              <p className="leading-relaxed text-base">
                Provide cross border payment services at a significantly lower price. Easily connect with our APIs
              </p>
            </div>
            <div className="sm:w-32 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full text-purple-500 flex-shrink-0">
              <Image priority src="/fintech.png" width={600} height={600} alt="hero" />
            </div>
          </div>
          <div className="flex items-center border-b border-gray-800 pb-10 mb-10 lg:w-3/5 mx-auto sm:flex-row flex-col">
            <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full text-purple-500 flex-shrink-0">
              <Image priority src="/paymentapps.png" width={600} height={600} alt="hero" />
            </div>
            <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
              <h2 className="text-gray-300 text-lg title-font font-bold mb-2">Web2.0 Payment Apps and aggregators</h2>
              <p className="leading-relaxed text-base">PSPs can utilize web3.0 payment rails for cross border transactions</p>
            </div>
          </div>
          <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
            <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
              <h2 className="text-gray-300 text-lg title-font font-bold mb-2">DAPPS</h2>
              <p className="leading-relaxed text-base">DAPPS requiring fx liquidity or swaps can integrate with rapidX smart contracts and use AMM</p>
            </div>
            <div className="sm:w-32 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full text-purple-500 flex-shrink-0">
              <Image priority src="/dapps.png" width={600} height={600} alt="hero" />
            </div>
          </div>
        </div>
      </section>
      {/* section 3 ends */}
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-12 mx-auto">
          <div class="flex flex-col text-center w-full ">
            <h1 class="sm:text-3xl text-3xl font-bold title-font  text-purple-500">Protocol Participants</h1>
          </div>
          <div class="flex mt-6 justify-center mb-20">
            <div class="w-16 h-1 rounded-full bg-purple-500 inline-flex"></div>
          </div>
          <div class="flex flex-wrap justify-center">
            <div class="xl:w-1/5 lg:w-1/2 w-full flex flex-col items-center text-center px-8 py-6 rounded-lg m-1 border border-dotted border-gray-800 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-300 font-bold title-font mb-2">Liquidity Providers</h2>
              <p class="leading-relaxed text-base mb-4">
                Anyone with idle cash can add liquidity and earn the rewards for the contribution. Liquidity can be withdrawn at any time with the
                rewards.
              </p>
            </div>
            <div class="xl:w-1/5 lg:w-1/2 w-full flex flex-col items-center text-center px-8 py-6 rounded-lg m-1 border border-dotted border-gray-800 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-300 font-bold title-font mb-2">FIAT tokenizers</h2>
              <p class="leading-relaxed text-base mb-4">Stablecoin issuers, e-money issuers/custodians, stablecoin custodians</p>
            </div>
            <div class="xl:w-1/4 lg:w-1/2 w-full flex flex-col items-center text-center px-8 py-6 rounded-lg m-1 border border-dotted border-gray-800 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-300 font-bold title-font mb-2">Integrators</h2>
              <p class="leading-relaxed text-base mb-4">
                Any Frontend with cross currency swap use case. Authorized Money Transfer Operators, Web2 Payment Apps, eCommerce Websites, Fx
                Liquidity Seekers, even FinTech and Neo banks
              </p>
            </div>
            <div class="xl:w-1/5 lg:w-1/2 w-full flex flex-col items-center text-center px-8 py-6 rounded-lg m-1 border border-dotted border-gray-800 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-300 font-medium title-font mb-2">Pool creators</h2>
              <p class="leading-relaxed text-base mb-4">Anyone with use case.</p>
            </div>
          </div>
        </div>
      </section>
      {/* section 4 ends */}
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-12 mx-auto">
          <div class="text-center mb-20">
            <h1 class="sm:text-3xl text-2xl font-medium title-font text-purple-500 mb-4">RapidX Protocol</h1>
            <p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">
              Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug.
            </p>
            <div class="flex mt-6 justify-center">
              <div class="w-16 h-1 rounded-full bg-purple-500 inline-flex"></div>
            </div>
          </div>
          <div class="flex flex-wrap justify-center ">
            <div class="p-4 md:w-1/4 flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Automated Market Maker</h2>
                <p class="leading-relaxed text-base px-12">
                  Highly capital efficient AMM for cross currency swaps with dynamic fees and secure transactions.
                </p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Single Sided Liquidity Pools</h2>
                <p class="leading-relaxed text-base px-12">
                  Powered by single sided liquidity pools , reducing the fx exposure risk to multiple currencies. Helps generate real Yield for LPs
                </p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">OnChain Risk Management</h2>
                <p class="leading-relaxed text-base px-12">
                  Onchain Asset Liability management through automated pool rebalancing through dynamic fees and cashbacks
                </p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Get Connected with few clicks</h2>
                <p class="leading-relaxed text-base px-12">Our powerful integration tools make onboarding simple and hardly takes minutes</p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Tokenization</h2>
                <p class="leading-relaxed text-base px-12">
                  RapidX protocol can be used to tokenize the currencies (e-money, stablecoins, CBDCs etc.)
                </p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Decentralized Governance</h2>
                <p class="leading-relaxed text-base px-12">
                  Onchain Asset Liability management through automated pool rebalancing through dynamic fees and cashbacks
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 5 ends */}
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-12 mx-auto">
          <div class="text-center mb-20">
            <h1 class="sm:text-3xl text-2xl font-medium title-font text-purple-500 mb-4">Liquidity Provider Benefits</h1>
            <p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">
              Put your idle cash to work, Add liquidity to the pool of your choice and start earning reawards.
            </p>
            <div class="flex mt-6 justify-center">
              <div class="w-16 h-1 rounded-full bg-purple-500 inline-flex"></div>
            </div>
          </div>
          <div class="flex flex-wrap justify-center ">
            <div class="p-4 md:w-[40%] flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Single Currency Exposure</h2>
                <p class="leading-relaxed text-base px-12">
                  Provide liquidity in a single currency pool and avoid the exposure to multiple currencies
                </p>
              </div>
            </div>
            <div class="p-4 md:w-[40%] flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Earn Real and sustainable Yields</h2>
                <p class="leading-relaxed text-base px-12">
                  Protocol generates sustainable real yields in the currency in which the liquidity is provided
                </p>
              </div>
            </div>
            <div class="p-4 md:w-[40%] flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Real Time Dashboard</h2>
                <p class="leading-relaxed text-base px-12">To visualize and track the performance of your LP position</p>
              </div>
            </div>
            <div class="p-4 md:w-[40%] flex flex-col text-center items-center border-2 border-gray-800 border-dotted rounded-lg m-1">
              <div class="flex-grow">
                <h2 class="text-gray-300 text-lg title-font font-bold mb-3">Contribute to Social Good</h2>
                <p class="leading-relaxed text-base px-12">
                  As per world bank, exorbitant transaction fees for remittances is one of the contributing factors for global poverty. Become part of
                  the ecosystem to enable 100X cheaper transactions for better world
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-center items-center mb-10">
        <button className="px-5 py-2 rounded-lg bg-purple-500 font-bold text-xl border-2 border-purple-500 text-black hover:text-purple-500 hover:bg-black">Join The Waitlist</button>
      </div>
    </div>
  );
};

export default Home;
