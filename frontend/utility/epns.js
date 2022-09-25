import * as EpnsAPI from "@epnsproject/sdk-restapi";

const fetchNotifs = async (address) => {
  try {
      const notifications = await EpnsAPI.user.getFeeds({
        user: `eip155:80001:${address}`, // user address in CAIP
        env: "staging",
        spam: false,
        limit:20,
      });

    //console.log("Notifications: \n\n", notifications);
    return notifications;
  } catch (error) {
    console.log(error)
  }
};

const sendNotifs = async (title, body, fileUrl,receipient, channel, _signer) => {
  // apiResponse?.status === 204, if sent successfully!
  // apiResponse?.status === 204, if sent successfully!
  try {
    const apiResponse = await EpnsAPI.payloads.sendNotification({
      signer: _signer,
      type: 1, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: title,
        body: body,
      },
      payload: {
        title: title,
        body: body,
        cta: "",
        img: fileUrl,
      },
      recipients: `eip155:80001:${receipient}`,
      channel: `eip155:80001:${channel}`, // your channel address
      env: "staging",
    });
    return apiResponse;
  } catch (error) {
    console.log(error);
  }
};

const subscribe = async (channel, userAddress, _signer) => { 
   try {
      
      await EpnsAPI.channels.subscribe({
      signer: _signer,
      channelAddress: `eip155:80001:${channel}`, // channel address in CAIP
      userAddress: `eip155:80001:${userAddress}`, // user address in CAIP
      onSuccess: () => {
      console.log('opt in success');
      },
      onError: () => {
        console.error('opt in error');
        throw 'opt in error'
      },
      env: 'staging'
      })
     return true;
   } catch (error)
   {
     console.log(error)
     return error;
   }
}
const unSubscribe = async (channel, userAddress,_signer) => { 

    try {
     await EpnsAPI.channels.unsubscribe({
        signer: _signer,
        channelAddress: `eip155:80001:${channel}`, // channel address in CAIP
        userAddress: `eip155:80001:${userAddress}`, // user address in CAIP
        onSuccess: () => {
        console.log('opt out success');
        },
        onError: (error) => {
          console.error('opt out error');
          console.log(error)
          throw 'opt out error'
        },
        env: 'staging'
     })
      return true;
    } catch (error) {
      console.log(error)
      return error;
    }
}
const checkSubscription = async (channel, userAddress) => { 
    try {
      const subscriptions = await EpnsAPI.user.getSubscriptions({
      user: `eip155:80001:${userAddress}`, // user address in CAIP
      env: 'staging',
      });
      //console.log('status:     ',subscriptions)
      if (subscriptions.length > 0)
      {
        const isChannel = subscriptions.find(item => item.channel == channel)
        //console.log('isChannel:     ',isChannel)
        return isChannel!== undefined ? true : false
      } else
      { 
        return false;
      }
    } catch (error) {
      console.log(error)
    }
}

module.exports = {
  fetchNotifs: fetchNotifs,
  sendNotifs: sendNotifs,
  subscribe: subscribe,
  unSubscribe: unSubscribe,
  checkSubscription:checkSubscription
}
