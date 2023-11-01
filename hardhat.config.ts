import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled:
              (process.env.SOLIDITY_OPTIMIZER &&
                'true' === process.env.SOLIDITY_OPTIMIZER.toLowerCase()) ||
              false,
            runs:
              (process.env.SOLIDITY_OPTIMIZER_RUNS &&
                Boolean(parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)) &&
                parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)) ||
              200,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },

      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled:
              (process.env.SOLIDITY_OPTIMIZER &&
                'true' === process.env.SOLIDITY_OPTIMIZER.toLowerCase()) ||
              false,
            runs:
              (process.env.SOLIDITY_OPTIMIZER_RUNS &&
                Boolean(parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)) &&
                parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)) ||
              200,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },

      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled:
              (process.env.SOLIDITY_OPTIMIZER &&
                'true' === process.env.SOLIDITY_OPTIMIZER.toLowerCase()) ||
              false,
            runs:
              (process.env.SOLIDITY_OPTIMIZER_RUNS &&
                Boolean(parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)) &&
                parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)) ||
              200,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },
    ],
  }
};

export default config;
