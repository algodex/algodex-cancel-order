import algosdk from "algosdk";

/**
 * PeraConnectSigner
 * @param {Array<Order>} orders A list of Compiled Orders
 * @param {Object} peraWallet An instance of the PeraConnectLibrary
 * @return {Promise<*>}

*/
const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item.signedTxn],
    }),
    {}
  );

export default async function signer(orders, wallet) {
  try {
    const orderTxns = orders.map((execObj) => execObj.contract.txns);

    orderTxns.forEach((outerTxns) =>
      algosdk.assignGroupID(outerTxns.map((txn) => txn.unsignedTxn))
    );

    const outerTxns = [];
    let txNum = 0; // txNum has to be assigned outside nested loop in order to preserve total order
    orderTxns.forEach((txns, groupNum) => {
      txns.forEach((txn) => {
        outerTxns.push({ ...txn, groupNum: groupNum, txNum: txNum });
        txNum++;
      });
    });

    const unsignedUserSignedLSig = [];

    const formattedTxnsForSigning = outerTxns.map((txn) => {
      if (
        algosdk.encodeAddress(txn.unsignedTxn.from.publicKey) !==
        wallet.connector.accounts[0]
      ) {
        unsignedUserSignedLSig.push({
          ...algosdk.signLogicSigTransactionObject(txn.unsignedTxn, txn.lsig),
        });

        return { txn: txn.unsignedTxn, signers: [] };
        // naive solution assuming target address is first item in accountds array
      } else {
        unsignedUserSignedLSig.push(null);
        return { txn: txn.unsignedTxn };
      }
    });
    console.log({ unsignedUserSignedLSig });

    const signedTransactions = await wallet.signTransaction([
      formattedTxnsForSigning,
    ]);

    const resultsFormatted = unsignedUserSignedLSig.map((element) => {
      return element === null ? { blob: signedTransactions.shift() } : element;
    });

    console.log(resultsFormatted);

    const outerTxnsWithResults = outerTxns.map((txn, i) => {
      return { ...txn, signedTxn: resultsFormatted[i] };
    });

    const signedTxnsObjGroupedByGroupNum = groupBy(
      outerTxnsWithResults,
      "groupNum"
    );

    return Object.values(signedTxnsObjGroupedByGroupNum);
  } catch (error) {
    throw new Error(error.message);
  }
}
