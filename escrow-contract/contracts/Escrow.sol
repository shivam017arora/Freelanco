//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract EscrowMoralis {
    //State
    enum State {
        NOT_INITIATED,
        AWAITING_PAYMENT,
        AWAITING_CONFIRMATION,
        AWAITING_DELIVERY,
        COMPLETED
    }
    State public currentState;
    bool public isCustomerIn;
    bool public isCustomerOut;
    bool public isFreelancerIn;
    bool public isFreelancerOut;
    uint public price;

    address public customer;
    address payable public freelancer;

    //Modifiers
    modifier onlyCustomer() {
        require(
            msg.sender == customer,
            "Only the customer can perform this action."
        );
        _;
    }

    modifier onlyFreelancer() {
        require(
            msg.sender == freelancer,
            "Only the freelancer can perform this action."
        );
        _;
    }

    modifier escrowNotStarted() {
        require(
            currentState == State.NOT_INITIATED,
            "The escrow has already started."
        );
        _;
    }

    //Constructor
    constructor(
        address _customer,
        address payable _freelancer,
        uint _price
    ) {
        customer = _customer;
        freelancer = _freelancer;
        price = _price * (1 ether);
        currentState = State.NOT_INITIATED;
    }

    //Functions
    function initContract() public escrowNotStarted {
        if (msg.sender == customer) {
            isCustomerIn = true;
        } else if (msg.sender == freelancer) {
            isFreelancerIn = true;
        }
        if (isCustomerIn && isFreelancerIn) {
            currentState = State.AWAITING_PAYMENT;
        }
    }

    function deposit() public payable onlyCustomer {
        require(
            currentState == State.AWAITING_PAYMENT,
            "Already received payment."
        );
        require(
            msg.value >= price,
            "The amount of ether sent is not enough to pay for the service."
        );
        //get funds from customer
        currentState = State.AWAITING_CONFIRMATION;
    }

    function endContract() public {
        require(
            currentState == State.AWAITING_CONFIRMATION,
            "The escrow has not been deposited funds yet."
        );
        if (msg.sender == customer) {
            isCustomerOut = true;
        } else if (msg.sender == freelancer) {
            isFreelancerOut = true;
        }
        if (isCustomerOut && isFreelancerOut) {
            currentState = State.AWAITING_DELIVERY;
        }
    }

    function confirmDelivery() public payable onlyFreelancer {
        require(
            isCustomerOut && isFreelancerOut,
            "The escrow has not been ended yet."
        );
        freelancer.transfer(price);
        currentState = State.COMPLETED;
    }

    function withdraw() public payable onlyCustomer {
        //in case of refund, transfer funds to customer
        require(
            currentState == State.AWAITING_DELIVERY,
            "Can only withdraw funds before the escrow is completed."
        );
        payable(customer).transfer(price);
        currentState = State.COMPLETED;
    }
}
