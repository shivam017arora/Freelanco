# Example Code for making calls from django server to Hardhat blockchain

from web3 import Web3, EthereumTesterProvider
from rest_framework.exceptions import APIException
from contract import abi, bytecode

publickey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
privatekey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

freelancer_pubkey = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
freelancer_privatekey = "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"


def get_w3():
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545/"))
    if(not w3.isConnected()):
        print("Not connected to ethereum node")
        raise APIException("Not connected to ethereum node")
    print("Connected to ethereum node")
    return w3


def get_contract(w3):
    # 0x5fbdb2315678afecb367f032d93f642f64180aa3
    address = w3.toChecksumAddress(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3")
    EscrowContract = w3.eth.contract(abi=abi, address=address)
    print("Contract: ", EscrowContract)
    return EscrowContract


def initContractTx(w3, EscrowContract, freelancer_pubkey):
    nonce = w3.eth.getTransactionCount(publickey)
    tx = EscrowContract.functions.initContract(freelancer_pubkey, Web3.toWei(1, 'ether')).buildTransaction({
        'nonce': nonce,
        'gas': 2000000,
        'gasPrice': w3.toWei('40', 'gwei'),
        # 'chainID': 1337,
    })
    signed_tx = w3.eth.account.signTransaction(tx, privatekey)
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("tx_hash: ", tx_hash)
    tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    print("tx_receipt: ", tx_receipt)
    return tx_receipt


def create_contract():
    EscrowContract = get_contract(get_w3())
    print(EscrowContract.functions.getContractID().call())


create_contract()
