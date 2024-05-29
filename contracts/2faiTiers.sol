// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external;
}

contract TwoFAiTiers {

    address public owner;
    //ERC20 public tokenBurn;

    enum Tier {
        bronce,
        silver,
        gold,
        diamond
    }

    mapping(Tier => uint256) public tiersPrice;
    mapping(address => uint256) public burnedTokens;    

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        //tokenBurn = ERC20(_token);
    }

    //#region READS

    function getUserTier(address _adr) external view returns(Tier) {     
        uint256 userBurnedTokens = burnedTokens[_adr];

        if(userBurnedTokens >= tiersPrice[Tier.diamond]) {
            return Tier.diamond;
        }
        if(userBurnedTokens >= tiersPrice[Tier.gold]) {
            return Tier.gold;
        }
        if(userBurnedTokens >= tiersPrice[Tier.silver]) {
            return Tier.silver;
        }
        return Tier.bronce;
    }

    function payForTier(Tier tier, address _adr) public view returns(uint256) {
        uint256 selectedTierPrice = tiersPrice[tier];
        uint256 tokensBurnedAdr = burnedTokens[_adr];
        if(selectedTierPrice > tokensBurnedAdr) {
            return selectedTierPrice - tokensBurnedAdr;
        } else {
            return 0;
        }
    }

    //#endregion

    //#region WRITES 

    function burnForTier(Tier tier) external payable {
        uint256 payment = payForTier(tier, msg.sender);
        require(msg.value >= payment, "Payment not enough");
        //tokenBurn.transferFrom(msg.sender, address(0xdEaD), payment);
        burnedTokens[msg.sender] += payment;
    }

    //#endregion

    //#region OWNER

    function setTierPrice(Tier tier, uint256 tokenAmount) external onlyOwner {
        require(tier != Tier.bronce, "Bronce tier will be always free");
        tiersPrice[tier] = tokenAmount;
    }

    function setNewOwner(address _owner) external onlyOwner {
        owner = _owner;
    }

    //#endregion
}