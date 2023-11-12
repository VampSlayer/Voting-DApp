import { ethers } from "ethers";

class ConnectClient {
  async connect() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      return signer.getAddress();
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }
}

export default ConnectClient;
