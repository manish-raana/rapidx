import React,{useState} from 'react'
import { Circles } from "react-loading-icons";
import { Web3Storage } from "web3.storage";
import Link from 'next/link';

const AddOfferModal = ({ ShowAddOffers, setShowAddOffers, IsSending, setIsSending, handleSendNotification }) => {
  const [Title, setTitle] = useState("");

  const [FileLink, setFileLink] = useState("");
  const [files, setFiles] = useState([]);
  const [Description, setDescription] = useState("");

  const handleAddOffer = async () => {
    //console.log(event.target.files[0])
    setIsSending(true);
    const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
    const client = new Web3Storage({ token });
    console.log("chunking and hashing the files (in your browser!) to calculate the Content ID");
    console.log(files);

    const cid = await client.put(
      files,
      { name: files[0].name },
      {
        onRootCidReady: (localCid) => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
          console.log("> 📡 sending files to web3.storage ");
        },
        onStoredChunk: (bytes) => console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`),
      }
    );

    const fileUrl = `https://${cid}.ipfs.dweb.link/${files[0].name}`;
    setFileLink(fileUrl);

    handleSendNotification(Title, Description, fileUrl);
    setIsSending(false);
    /* console.log('> 📡 fetching the list of all unique uploads on this account')
    let totalBytes = 0
    for await (const upload of client.list())
    {
      console.log('>uploads:  ',upload);
      console.log(`> 📄 ${upload.cid}  ${upload.name}`)
      totalBytes += upload.dagSize || 0
    }
    console.log(`> ⁂ ${totalBytes.toLocaleString()} bytes stored!`)
   
  */
    setDescription("");
    setTitle("");
  };

  return (
    <div>
      {ShowAddOffers ? (
        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-[50%] mx-auto">
            {/*content*/}

            <div className=" rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
              {/*header*/}
              <div className="text-white flex items-end pb-1 px-2 justify-between rounded-t bg-purple-900">
                <span className="text-xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">RapidX</span>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-white  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowAddOffers(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-2 flex-auto text-gray-400 font-semibold text-lg">
                <p className="text-center mb-5">Send offers to buyers</p>

                <div className="mb-2 flex justify-between mx-5">
                  <p>Title</p>
                  <input
                    className="rounded-lg bg-gray-900 focus-visible-none text-end px-5 py-2 w-[55%] text-white"
                    type="text"
                    name="title"
                    defaultValue=""
                    placeholder="title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="mb-2 flex justify-between mx-5">
                  <p>Description </p>
                  <input
                    className="rounded-lg bg-gray-900 focus-visible-none text-end px-5 py-2 w-[55%] text-white"
                    type="text"
                    name="description"
                    defaultValue=""
                    placeholder="description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-2 flex justify-between mx-5">
                  <p> </p>
                  <div className="flex items-center justify-center bg-grey-lighter">
                    <input type="file" onChange={(e) => setFiles(e.target.files)} className="bg-gray-900 text-xs" />
                  </div>
                </div>
              </div>
              {/*footer*/}

              <div className="flex items-center justify-center rounded-b my-5">
                <button
                  className="text-white mx-3 bg-green-500 border-2 border-green-500 rounded-lg hover:text-green-500 hover:bg-slate-900 font-bold uppercase px-10 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleAddOffer()}
                >
                  {IsSending ? (
                    <span className="flex text-white items-center justify-center">
                      Publishing <Circles className="w-8 h-8 p-0 m-0 mx-5" />
                    </span>
                  ) : (
                    "Publish Offer"
                  )}
                </button>
                <button
                  className="text-white mx-3 bg-rose-500 border-2 border-rose-500 rounded-lg hover:text-rose-500 hover:bg-slate-900 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowAddOffers(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AddOfferModal