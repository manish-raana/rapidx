import React from 'react'
import { NotificationItem } from "@epnsproject/sdk-uiweb";

const EnpsNotification = ({ ShowNotifications, setShowNotifications, notifications }) => {
  return (
    <div>
      {ShowNotifications ? (
        <div>
          <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed left-1/3 top-5 z-50 outline-none focus:outline-none">
            <div className="relative w-[30%] mx-auto z-[80]">
              <div className="text-white flex items-end pb-1 px-2 justify-between rounded-t bg-purple-900">
                <span className="text-xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                  Notifications
                </span>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-white  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowNotifications(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <div className=" rounded-b-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
                <div>
                  {notifications &&
                    notifications.map((oneNotification, i) => {
                      const { cta, title, message, app, icon, image, url, blockchain, notification } = oneNotification;

                      return (
                        <div className="mb-2 mx-2">
                          <NotificationItem
                            key={`notif-${i}`} // any unique id
                            notificationTitle={title}
                            notificationBody={message}
                            cta={cta}
                            app={app}
                            icon={icon}
                            image={image}
                            url={url}
                            theme="dark"
                            chainName={blockchain}
                            // chainName={blockchain as chainNameType} // if using Typescript
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-90 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EnpsNotification;