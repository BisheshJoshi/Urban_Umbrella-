import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-node-test-runner";

export default {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
};
