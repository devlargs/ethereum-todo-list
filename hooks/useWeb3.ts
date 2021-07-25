import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

const useWeb3 = () => {
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const providerOptions = {
        /* See Provider Options Section */
      };

      const web3Modal = new Web3Modal({
        // network: 'mainnet', // optional
        // cacheProvider: true, // optional
        providerOptions, // required
      });

      const init = async () => {
        const temp = await web3Modal.connect();
        const web3 = new Web3(temp);
        console.log(web3.eth);
      };

      init();
    }
  }, []);

  return {
    loading,
    provider,
  };
};

export default useWeb3;
