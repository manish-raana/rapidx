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


## Deployment details: (Mumbai Polygon)

- Rapid Protocal deployed to: 0x351FFC593052D8D876FB0d24A18e5645b9f709ec (https://polygonscan.com/address/0x351FFC593052D8D876FB0d24A18e5645b9f709ec)
- euro Fiat Token deployed to: 0x528ccA2F508306d41c8f28A10703e275dC9aa8FF (https://polygonscan.com/address/0x528ccA2F508306d41c8f28A10703e275dC9aa8FF)
- rupee Fiat Token deployed to: 0x9732364A18Cba18E26C2dE9832ffB227b045e6Df (https://polygonscan.com/address/0x9732364A18Cba18E26C2dE9832ffB227b045e6Df)
- usd Fiat Token deployed to: 0xD5C993409a743521cD490c59a394f5f9Ae77a8d4 (https://polygonscan.com/address/0xD5C993409a743521cD490c59a394f5f9Ae77a8d4)
- euro LP Token deployed to: 0x9416B862a8244bd9f61F60aB386Da8BA9FccbFa4 (https://polygonscan.com/address/0x9416B862a8244bd9f61F60aB386Da8BA9FccbFa4)
- rupee LP Token deployed to: 0x224E3F2eB146Ed30aB0c904dB992c42aD5207592 (https://polygonscan.com/address/0x224E3F2eB146Ed30aB0c904dB992c42aD5207592)
- usd LP Token deployed to: 0xDB1bd4a9988b9240104B43F5d4471EfF64bc8ABB (https://polygonscan.com/address/0xDB1bd4a9988b9240104B43F5d4471EfF64bc8ABB)


## Blockchain Tech Stack

1.  ERC20 Token standard for Fiat tokens, LP Tokens and Governance Tokens
2.  Rapid Smart Contract to add liquidity, withdraw liquidity and transfer function to do cross border Transactions.
3.  Events emitted for add liquidity, withdraw liquidity, and transfer function.

## Sponsors used:

- Ethereum Push Notification Service (EPNS):
    a. Create A Channel for polygon-mumbai : PaymentConfirmationPM
    
    b. Developed the smart contract (Notifications.sol) to call the sendNotification function using IPUSHCommInterface for the below address.
       EPNS_COMM_ADDRESS = 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
       
    c. The above smart contract is inherited in our Rapid smart contract to send the notifications. We have added the Rapid smart address      (0x351FFC593052D8D876FB0d24A18e5645b9f709ec) as a delegate to the PaymentConfirmationPM channel
    
    d. sendNotification function is called inside transferFiat function (Rapid Smart Contract). Whenever the transferFiat function is called notification    will be sent to Merchants.
    
- Web3.Storage for string images for EPNS notifications.
- Worldcoin - Merchant Identity verification for fraud detection
  


## Front end tech stack

- NextJs
- Tailwind.css
- Ethers.js

