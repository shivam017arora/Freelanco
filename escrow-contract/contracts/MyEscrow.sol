//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Escrow {
    //State
    address public owner;

    enum State {
        NOT_INITIATED,
        AWAITING_START,
        AWAITING_PAYMENT,
        AWAITING_CONFIRMATION,
        COMPLETED
    }
    uint public contractID;
    uint public contractCounter;

    mapping(uint => State) public stateHistory;
    mapping(uint => uint) public priceHistory;
    mapping(uint => address) public customer;
    mapping(uint => address) public freelancer;

    mapping(uint => mapping(address => bool)) public isCustomerIn;
    mapping(uint => mapping(address => bool)) public isCustomerOut;

    mapping(uint => mapping(address => bool)) public isFreelancerIn;
    mapping(uint => mapping(address => bool)) public isFreelancerOut;

    //Events
    event EscrowStarted(
        uint _contractID,
        address _customer,
        address _freelancer,
        uint _price
    );
    event EscrowDeposited(
        uint _contractID,
        address _customer,
        address _freelancer,
        uint _price
    );
    event EscrowEnded(uint _contractID);

    //Constructor
    constructor() {
        owner = msg.sender;
    }

    //Functions
    function initContract(address _freelancer, uint256 _price) public {
        require(
            msg.sender != _freelancer,
            "Customer and Freelancer can't be the same"
        );
        contractID = getContractID(); //should be a unique number
        customer[contractID] = msg.sender;
        freelancer[contractID] = _freelancer;
        stateHistory[contractID] = State.AWAITING_START;
        priceHistory[contractID] = _price;
        emit EscrowStarted(contractID, msg.sender, _freelancer, _price);
    }

    function getCustomer(uint _contractID) public view returns (address) {
        return customer[_contractID];
    }

    function getFreelancer(uint _contractID) public view returns (address) {
        return freelancer[_contractID];
    }

    function getContractID() internal returns (uint) {
        contractCounter += 1;
        return contractCounter;
    }

    function confirmStart(uint _contractID) public {
        require(
            stateHistory[_contractID] == State.AWAITING_START,
            "Contract not in AWAITING_START state"
        );
        if (msg.sender == customer[_contractID]) {
            isCustomerIn[_contractID][msg.sender] = true;
        } else if (msg.sender == freelancer[_contractID]) {
            isFreelancerIn[_contractID][msg.sender] = true;
        }
        if (
            isCustomerIn[_contractID][customer[_contractID]] &&
            isFreelancerIn[_contractID][freelancer[_contractID]]
        ) {
            stateHistory[_contractID] = State.AWAITING_PAYMENT;
        }
    }

    function deposit(uint _contractID) public payable {
        require(
            msg.sender == customer[_contractID],
            "Only the customer can perform this action."
        );
        require(
            stateHistory[_contractID] == State.AWAITING_PAYMENT,
            "The escrow has been funded"
        );
        require(
            msg.value >= priceHistory[_contractID],
            "The amount transfered should be more than approved amount"
        );
        stateHistory[_contractID] = State.AWAITING_CONFIRMATION;
        emit EscrowDeposited(
            _contractID,
            customer[_contractID],
            freelancer[_contractID],
            priceHistory[_contractID]
        );
    }

    function confirmDelivery(uint _contractID) public {
        require(
            stateHistory[_contractID] == State.AWAITING_CONFIRMATION,
            "The escrow can't be confirmed at this stage"
        );
        if (msg.sender == customer[_contractID]) {
            isCustomerOut[_contractID][msg.sender] = true;
        } else if (msg.sender == freelancer[_contractID]) {
            isFreelancerOut[_contractID][msg.sender] = true;
        }
        if (
            isCustomerOut[_contractID][customer[_contractID]] &&
            isFreelancerOut[_contractID][freelancer[_contractID]]
        ) {
            payable(freelancer[_contractID]).transfer(
                priceHistory[_contractID]
            );
            stateHistory[_contractID] = State.COMPLETED;
            emit EscrowEnded(_contractID);
        }
    }

    function refundFunds(uint _contractID) public payable {
        require(
            (msg.sender == owner || msg.sender == freelancer[_contractID]),
            "This can only be performed by the owner of the contract or the freelancer"
        );
        payable(customer[_contractID]).transfer(priceHistory[_contractID]);
        stateHistory[_contractID] = State.COMPLETED;
    }
}
