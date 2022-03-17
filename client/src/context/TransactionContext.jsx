import React,{useEffect,useState} from "react";
import {ethers} from 'ethers';
import {contractABI,contractAddress}from '../utils/constants';
export const TransactionContext = React.createContext();
const {ethereum}= window;

const getEthereumContract = ()=>{
  const provider= new ethers.providers.Web3Provider(ethereum);
  const signer= provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  return transactionsContract;
}

export const TransactionProvider = ({children }) =>{

  const [currentAccount, setCurrentAccount] = useState("");
  const [formData,setFormData] = useState({addressTo:"",ammount:"",keyword:"",message:""});
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transacitonCount'));
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const [isLoading, setisLoading] = useState(faclse);
  
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet= async ()=> {
    try {
      if(!ethereum)return alert("Please install web3.0 wallet");
      const accounts = await ethereum.request({method:'eth_requestAccounts'});
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error ("No ETH object.");
    }
  }

const  sendTransaction = async ()=>{
  try {
    if(!ethereum)return alert("Please install web3.0 wallet");

    const{addressTo,amount,keyword,message}=formData;
    const transactionsContract = getEthereumContract();
    const parsedAmount = ethers.utils.parseEther(amount);
    await ethereum.request({
      method:'eth_sendTransacion',
      params:[{
        from: currentAccount,
        to: addressTo,
        gas: '0x5208',
        value: parsedAmount._hex,//0.0001+
      }]
    });
    const transactionHash = await transactionsContract.addToBlockchain(addressTo,parsedAmount,message,keyword);
    setisLoading(true);
    console.log(`Loading - ${transactionHash.hash}`);
    await transactionHash.wait();
    setisLoading(false);
    console.log(`succes - ${transactionHash.hash}`);
    const transactionCount =await transactionsContract.getTranactionCount();
    setTransactionCount(transactionCount.toNumber());
  } 
  catch (error) {
    console.log(error);
    throw new Error ("No ETH object.");
  }
}

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);
  

  return(
    <TransactionContext.Provider value={{connectWallet ,currentAccount,formData,setFormData,handleChange, sendTransaction}}>
      {children}
    </TransactionContext.Provider>
  );
}