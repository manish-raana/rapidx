 We are building a decentralized version of paypal. Paypal charges very high fees (4-10%) for cross border payments, limiting the ability of the ecommerce merchants to comptete internationally especially with big players.


 We have created a "Pay with RapidX" functionality for cross border payments use case. It reduces the transaction fee by 100X and is transparent compared to opaque and closed nature of paypal. rapidX is community driven as liquidity is crowsourced in the form of single local currency pools. Anyone with idle cash can provide liquidity and enjoy sustainable real yield.

 The project involves on-ramp and off-ramp of FIAT. It is acheived through the Open Banking Tools as it will drastically reduce the costs. Project involves tokenization of FIAT, swapping and de-tokenizing and off-ramp. 


## Live demo Links (we deployed it to mainnet :D ):

https://rapidx.live/shop
Merchant Currency: euro
Buyer Currency: INR

### steps:

1. On the checkout page, click on Pay with RapidX
2. You will see the total amount to pay in your local currency. For demo we put this as INR. Chainlink is used for forex exchange rate feed.
3. Either pay with your tINR (tokenized INR) balance or choose a local payment method (UPI)
4. If you choose UPI, scan the QR code using any local payment app and make the payment.
5. Once the payment is confirmed, rapidX will initiate the transfer of tINR, automatically swap to destination currency (Euros) and send it to Merchant
6. Merchant dashboard at https://rapidx.live/shop
7. Merchant can click on Withdraw to withdraw funds to bank account. (Disabled after recording the democurrently due to security reasons)


## steps to provide Liquidity:

- LP user can login at https://rapidx.live/liquidity
- Moralis is used for user authentication
- LP dashboard is shown with LP positions, fees earned and shares.
- LP dashboard also shows APR and utilization
- User can Add funds (FIAT). Currently dummy transaction for security purpose.
- User can add /withdraw liquidity


## Steps for Merchant:
- https://rapidx.live/merchant
- Merchant dashboard
- Option to withdraw funds to bank account


## Deployment details: (MAINNET)

- Rapid Protocal deployed to: 0xE9Afc044917Ee2CbAF33Cb191284e170ad07B403 (https://polygonscan.com/address/0xE9Afc044917Ee2CbAF33Cb191284e170ad07B403)
- euro Fiat Token deployed to: 0x62656Be046e02f3eE9B899d5a6b0be02da375A91 (https://polygonscan.com/address/0x62656Be046e02f3eE9B899d5a6b0be02da375A91)
- rupee Fiat Token deployed to: 0x0eCc96Cb7DaCEcC04a53B91Ac102b51D5585C925 (https://polygonscan.com/address/0x0eCc96Cb7DaCEcC04a53B91Ac102b51D5585C925)
- usd Fiat Token deployed to: 0xc42158cB1bd79732beD475d2C29A500E35e9dD5E (https://polygonscan.com/address/0xc42158cB1bd79732beD475d2C29A500E35e9dD5E)
- euro LP Token deployed to: 0x18707b2b4857220A72F0392Fca5D5A6510D8966A (https://polygonscan.com/address/0x18707b2b4857220A72F0392Fca5D5A6510D8966A)
- rupee LP Token deployed to: 0xf201DC6389AB9d0f82baAFf20b080466ab7346Ec (https://polygonscan.com/address/0xf201DC6389AB9d0f82baAFf20b080466ab7346Ec)
- usd LP Token deployed to: 0x02C7C267131e94Cd3acC71B75817BCc897129a62 (https://polygonscan.com/address/0x02C7C267131e94Cd3acC71B75817BCc897129a62)


## Blockchain Tech Stack

- ERC20 Token standard for Fiat tokens
- LP Tokens and Governance Tokens
- Rapid Smart Contract to add liquidity
- withdraw liquidity and transfer function to do cross border Transactions.


## Sponsors used:

- Moralis - Metamask authentication on frontend
- ChainLink - Live price feed in smart contract
- Sequence wallet for Web3 in User CheckOut page


## Front end tech stack

- NextJs
- Tailwind.css
- Ethers.js

