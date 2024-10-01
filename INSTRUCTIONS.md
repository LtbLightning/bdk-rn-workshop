# Instructions

## Starting point

### Head start

To implement a complete app including UI components, state management etc. we would need a lot more time and it would take us too far from the Bitcoin and `bdk_rn` specific code. Therefore you get a head start. All needed widgets, screens, entities, view_models, repositories, controllers and state classes are already implemented and ready for you.

Take a look at the different files and folders in the [`src`](./src/) folder. This is the folder where the code of a React Native app should be located.

> [!NOTE]
> If you cloned this repository, the `bdk_rn` package is already added to the dependencies in the [`package.json`](./package.json) file and is ready to be used.

> [!NOTE]
> The minSdkVersion in the [`android/app/build.gradle`](./android/app/build.gradle) file is also changed to 23 already. Also the iOS platform version in [`ios/Podfile`](./ios/Podfile) is set to 14.0 . These are the minimum versions required by the `bdk_rn` package to work.

### Run the app

1. Install dependencies:

   ```bash
   npm install or yarn install
   ```

2. Run the app on Android or iOS:
   ```bash
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

Start the app to make sure the provided code is working. You should see the user interface of the app, but it does not really permits you to make any transactions yet.

## Let's code

Solutions are also provided in the [solutions](SOLUTIONS.md) file, but try to implement the functions yourself first. If you get stuck, take a look at the solutions to get an idea of how to proceed.

### 1. Create Wallet `createWallet()`

This function creates a new Bitcoin wallet using a mnemonic and the Bitcoin Development Kit (BDK).

```typescript
const createWallet = async () => {
  try {
    _loading(true);
    const mnemonic = await new Mnemonic().fromString(mnemonicString);
    const wallet = await Wallet.new({
      mnemonic,
      network: networkString,
      databaseConfig: DatabaseConfig.memory(),
    });
    console.log('Wallet created successfully:', wallet);
    _loading(false);
  } catch (err) {
    console.log('Wallet creation error:', err);
    _loading(false);
  }
};
```

Explanation:

This function generates a wallet from a mnemonic using the Wallet.new() function.
It uses an in-memory database (DatabaseConfig.memory()), meaning that the wallet state is not persisted on the disk.
Once the wallet is created, it is logged and ready to be used for transactions and management.

### 2. Wallet Balance `getWalletBalance()`

This function retrieves the current balance of the wallet.

```typescript
const getWalletBalance = async () => {
  try {
    _loading(true);
    const balance = await wallet.getBalance();
    console.log('Wallet balance:', balance);

    _loading(false);
  } catch (err) {
    console.log('Error fetching wallet balance:', err);
    _loading(false);
  }
};
```

Explanation:

This function queries the wallet for its balance using the wallet.getBalance() method.
The balance is then logged, showing the total amount of Bitcoin available in the wallet.

### 3. New Address `getNewAddress()`

This function generates a new Bitcoin receiving address from the wallet.

```typescript
const getNewAddress = async () => {
  try {
    _loading(true);
    const address = await wallet.getAddress(AddressIndex.NEW);
    console.log('New Address:', address);

    _loading(false);
  } catch (err) {
    console.log('Error generating new address:', err);
    _loading(false);
  }
};
```

Explanation:

This function generates a new receiving address for the wallet using wallet.getAddress(AddressIndex.NEW).
It logs the new address, which can be shared to receive Bitcoin.

### 4. Sync Wallet `syncWallet`

This function synchronizes the wallet with the blockchain.

```typescript
const syncWallet = async () => {
  try {
    _loading(true);
    let blockchain = new BlockchainElectrumConfig({url: 'electrum_url'});
    await blockchain.sync();
    console.log('Wallet synchronized with the blockchain');

    _loading(false);
  } catch (err) {
    console.log(err);
    _loading(false);
  }
};
```

Explanation:

This function creates a BlockchainElectrumConfig (using an Electrum server URL) and then syncs the wallet with the blockchain using blockchain.sync().
Syncing updates the wallet with the latest blockchain data, ensuring the wallet is aware of the latest transactions and block confirmations.

## 5. Initialize Wallet `initWallet()`

This function initializes a wallet using a provided mnemonic. It interacts with the `BdkRn` package and handles wallet creation, error checking, and UI state updates.

```typescript
const initWallet = async () => {
  try {
    _loading(true);
    const response = await BdkRn.createWallet({
      mnemonic,
      password: '',
      network: 'testnet',
      blockChainConfigUrl: '',
      blockChainSocket5: '',
      retry: '',
      timeOut: '',
      blockChainName: '',
    });
    if (response.isOk()) {
      createWallet(true);
      unlockWallet(true);
    } else Alert.alert('Error', response.error.toString());
    _loading(false);
  } catch (err) {
    _loading(false);
  }
};
```

Explanation:

- The `initWallet()` function initializes the wallet using the mnemonic phrase and configures it for the 'testnet' Bitcoin network.
- If the wallet creation is successful, it unlocks the wallet.
- In case of any errors during the wallet setup, it displays an error message and updates the loading state.

### 6. Generating Mnemonic `genMnemonic()`

Generates a new Bitcoin mnemonic seed phrase.

```typescript
const genMnemonic = async () => {
  try {
    _loading(true);
    let seed = await Mnemonic.create();
    _responseText(seed.value);
    _loading(false);
  } catch (err) {
    _loading(false);
  }
};
```

Explanation:

- `genMnemonic()` uses the `Mnemonic.create()` function to generate a new mnemonic (seed phrase) and displays the result.
- The generated seed phrase is essential for wallet recovery and initialization.

### 7. `getXprv()`

This function retrieves the extended private key (XPRV) for the wallet, allowing access to the wallet's hierarchical deterministic (HD) structure.

```typescript
const getXprv = async () => {
  try {
    _seedModal(false);
    _loading(true);
    let res = await BdkRn.createExtendedKey({
      network: 'testnet',
      mnemonic,
      password: '',
    });
    _responseText(JSON.stringify(res.value));
    _loading(false);
  } catch (err) {
    _loading(false);
  }
};
```

Explanation:

- The `getXprv()` function fetches the extended private key (XPRV) using the mnemonic and network configuration.
- This key allows access to the full range of the HD wallet, including generating addresses and managing keys.

### 8. Generating Seed `genSeed()`

This function generates a 24-word Bitcoin seed phrase.

```typescript
const genSeed = async () => {
  try {
    _loading(true);
    const fromWordCount = await new Mnemonic().create(WordCount.WORDS24);
    console.log('FROM WORDS COUNT:', fromWordCount.asString());

    const fromString = await new Mnemonic().fromString(
      fromWordCount.asString(),
    );
    console.log('FROM STRING:', fromString.asString());

    const fromEntropy = await new Mnemonic().fromEntropy([
      1, 2, 9, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    console.log('FROM ENTROPY:', fromEntropy.asString());

    _response(fromWordCount.asString());
    _seed(fromWordCount.asString());
    _loading(false);
  } catch (err) {
    console.log('ERROR flow', err);
    _loading(false);
  }
};
```

Explanation:

This function generates a mnemonic seed with 24 words and logs the seed created.
It creates a seed from a string and also from entropy values.
The seed is then saved in state and the loading state is updated.

### 9. Descriptor Secret Key `descriptorSecret()`

This function retrieves and derives an extended private key (XPRV) for Bitcoin.

```typescript
const descriptorSecret = async () => {
  try {
    let mnemonic = await new Mnemonic().fromString(mnemonicString);
    const descSecretKeyObj = new DescriptorSecretKey();
    const derivationPathObj = new DerivationPath();

    const xprv = await descSecretKeyObj.create(networkString, mnemonic);
    const derivationPath = await derivationPathObj.create(path);

    let extended = await xprv.extend(derivationPath);
    _descriptor(extended);

    let pubKey = await xprv.asPublic();
    _descriptorPubKey(pubKey);
    _loading(false);
  } catch (err) {
    console.log(err);
    _loading(false);
  }
};
```

Explanation:

This function uses a mnemonic to create a descriptor secret key (XPRV).
The key is derived using a specific derivation path, then extended, and the public key (XPub) is also extracted.
These keys are stored in the state and can be used to interact with the wallet.

### 10. Descriptor Public Key `descriptorPublic`

This function manages the retrieval and derivation of an extended public key (XPUB).

```typescript
const descriptorPublic = async () => {
  try {
    _loading(true);

    const descPubKeyObj = new DescriptorPublicKey();
    const derivationPathObj = new DerivationPath();

    const xpub = await descPubKeyObj.fromString(publicKey);
    const derivationPath = await derivationPathObj.create(publicPath);
    console.log('Extend Public key', await xpub?.extend(derivationPath));

    _loading(false);
  } catch (err) {
    console.log(err);
    _loading(false);
  }
};
```

Explanation:

This function retrieves an extended public key (XPUB) from a string and allows further derivation based on a public derivation path.
It helps to manage public key operations and key extension within the Bitcoin wallet.

### 11. Initialize Blockchain `initBlockChain()`

This function initializes the blockchain instance using a Remote Procedure Call (RPC) configuration and retrieves the current block height and block hash.

```typescript
const initBlockChain = async () => {
  try {
    _loading(true);
    let config: BlockchainRpcConfig = {
      url: 'http://127.0.0.1:18443',
      network: networkString,
      walletName: 'w1',
      authUserPass: {username: 'polaruser', password: 'polarpass'},
      syncParams: {
        startScriptCount: 15,
        startTime: 15,
        forceStartTime: true,
        pollRateSec: 120,
      },
    };

    setBlockchain(await blockchainInstance.create(config, BlockChainNames.Rpc));
    setBlockchain1(
      await blockchainInstance.create(config, BlockChainNames.Rpc),
    );

    const height = await blockchain.getHeight();
    const hash = await blockchain.getBlockHash(height);
    _response(`Height: ${height},\n Hash: ${hash}`);
    _loading(false);
  } catch (e) {
    console.log('RPC error', e);
    _loading(false);
  }
};
```

Explanation:

The function defines a configuration (`config`) object for connecting to a Bitcoin node via RPC (`BlockchainRpcConfig`).

The `url` specifies the RPC endpoint (`http://127.0.0.1:18443`) which is likely a local Bitcoin node running in regtest mode.

The `network` parameter uses the `networkString` which defines the type of Bitcoin network (mainnet, testnet, or regtest).

`walletName` is set to `'w1'`, indicating the wallet on the Bitcoin node that is being interacted with.

`authUserPass` contains the username (`polaruser`) and password (`polarpass`) needed for authentication to the Bitcoin RPC node.

#### `syncParams` defines synchronization parameters such as:

1. `startScriptCount`: Sets the initial count of scripts to monitor.
2. `startTime`: Specifies the start time for syncing.
3. `forceStartTime`: Forces the use of the provided start time during syncing.
4. `pollRateSec`: Sets the polling rate in seconds (120 seconds here) to fetch new data from the blockchain.

### 12. Sign Transaction `signTransaction()`

This function signs a Bitcoin transaction using the provided mnemonic and extended private key (XPRV).

```typescript
const signTransaction = async () => {
  try {
    _loading(true);
    let psbt = PartiallySignedTransaction.fromBase64(psbtString);

    // Create the secret key from the mnemonic
    let mnemonic = await new Mnemonic().fromString(mnemonicString);
    const descSecretKeyObj = new DescriptorSecretKey();
    let xprv = await descSecretKeyObj.create(networkString, mnemonic);

    // Sign the transaction with the private key
    let signedTx = await psbt.sign(xprv, signOptions);
    console.log('Signed Transaction:', await signedTx.toBase64());

    _loading(false);
  } catch (err) {
    console.log(err);
    _loading(false);
  }
};
```

Explanation:

This function takes a partially signed transaction (PSBT) in base64 format and signs it using the private key derived from the mnemonic.
It uses the sign() method on the PSBT with the secret key and sign options (e.g., allowing partial signatures).
Once signed, the transaction is logged in base64 format.

### 13. Broadcast Transaction `broadcastTransaction()`

This function broadcasts a signed Bitcoin transaction to the network.

```typescript
const broadcastTransaction = async () => {
  try {
    _loading(true);
    let tx = Transaction.fromBase64(psbtString);
    await blockchain.broadcast(tx);
    console.log('Transaction broadcasted successfully');

    _loading(false);
  } catch (err) {
    console.log(err);
    _loading(false);
  }
};
```

Explanation:

The function takes a transaction in base64 format, creates a Transaction object, and broadcasts it using the Blockchain object (blockchain.broadcast()).
Broadcasting the transaction sends it to the Bitcoin network, allowing it to be confirmed in a block.

---

## What's next?

Take a look at the [overview](https://github.com/LtbLightning) of other resources, packages and services developed by [Let there be Lightning](https://ltbl.io) to see what else you can use to keep building Bitcoin apps.
