// SPDX-License-Identifier: MIT

/**
 * 2FA + AI WEB3 APP
 * Boosting privacy and security with Web3 2FA enhancements. 
 * Built on BASE
 * 
 * WEB: www.2fai.xyz
 * X:   https://twitter.com/2FAi_erc
 * TG:  https://t.me/erc2FAi
 */

/*solhint-disable*/

pragma solidity ^0.8.12;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract TwoFai is Context, Ownable2Step, IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address payable private TREASURY_WALLET;

    /**
     * @notice 25% tax the first 100 swaps
     */
    uint256 public constant INIT_TAX = 25;
    uint256 private immutable N_FIRST_SWAPS;
    uint256 private _currentSwap;

    uint256 public BUY_TAX = 5;
    uint256 public SELL_TAX = 5;

    string private constant _NAME = "2FAI";
    string private constant _SYMBOL = "2FAI";
    uint8 private constant _DECIMALS = 9;
    uint256 private constant _SUPPLY = 100_000_000 * 10 ** _DECIMALS;

    uint256 public constant MAX_TX_AMOUNT = _SUPPLY / 50; //2%
    uint256 public constant MAX_WALLET_SIZE = _SUPPLY / 50; //2%
    uint256 public constant TAX_SWAP_THRESHOLD = _SUPPLY / 2000; //0.05%
    uint256 public constant MAX_TAX_SWAP = _SUPPLY / 1000; //0.1%

    IUniswapV2Router02 private immutable UniswapV2Router;
    bool private inSwap = false;

    /**
     * @dev Liquidity pairs are exempted from wallet limit
     */
    mapping(address => bool) internal _liqPairs;

    modifier lockTheSwap() {
        inSwap = true;
        _;
        inSwap = false;
    }

    constructor(address _router, uint256 nFirstSwaps) {
        //0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008 router sepolia
        //0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24 router base
        TREASURY_WALLET = payable(_msgSender());
        _balances[TREASURY_WALLET] = _SUPPLY;
        UniswapV2Router = IUniswapV2Router02(_router);
        address uniswapPair = IUniswapV2Factory(UniswapV2Router.factory()).createPair(address(this), UniswapV2Router.WETH());
        _liqPairs[uniswapPair] = true;
        N_FIRST_SWAPS = nFirstSwaps;

        emit Transfer(address(0), TREASURY_WALLET, _SUPPLY);
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public pure returns (string memory) {
        return _NAME;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public pure returns (string memory) {
        return _SYMBOL;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overloaded;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public pure returns (uint8) {
        return _DECIMALS;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public pure override returns (uint256) {
        return _SUPPLY;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See previous function, same functionality but recipient is dead address.
     *
     * Requirements:
     *
     * - the caller must have a balance of at least `amount`.
     */
    function burn(uint256 amount) public returns (bool) {
        _transfer(_msgSender(), address(0xdEaD), amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(_allowances[sender][_msgSender()] >= amount, "ERC20: transfer amount exceeds allowance");
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()] - amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(_msgSender(), spender, currentAllowance - subtractedValue);

        return true;
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(address from, address to, uint256 amount) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        if (to != address(this) && !_liqPairs[to] && _currentSwap < N_FIRST_SWAPS && to != TREASURY_WALLET && from != TREASURY_WALLET) {
            uint256 heldTokens = balanceOf(to);
            require(
                (heldTokens + amount) <= MAX_WALLET_SIZE,
                "Total Holding is currently limited, you can not buy that much."
            );
            require(amount <= MAX_TX_AMOUNT, "TX Limit Exceeded");
        }

        uint256 taxAmount = 0;   
        uint256 taxApply = 0;    
        if(to != TREASURY_WALLET && from != TREASURY_WALLET) {
            if (_liqPairs[from] && to != address(this)) {                
                taxApply = _currentSwap < N_FIRST_SWAPS ? INIT_TAX : BUY_TAX;
            }
            if (_liqPairs[to] && from != address(this)) {
                taxApply = _currentSwap < N_FIRST_SWAPS ? INIT_TAX : SELL_TAX;
            }
        }
        taxAmount = amount * taxApply / 100;        

        uint256 contractTokenBalance = balanceOf(address(this));
        if (!inSwap && _liqPairs[to] && contractTokenBalance > TAX_SWAP_THRESHOLD) {
            swapTokensForEth(min(amount, min(contractTokenBalance, MAX_TAX_SWAP)));
            uint256 contractETHBalance = address(this).balance;
            if (contractETHBalance > 0) {
                sendETHToFee(address(this).balance);
            }
        }

        if (taxAmount > 0) {
            _currentSwap++;
            _balances[address(this)] += taxAmount;
            emit Transfer(from, address(this), taxAmount);
        }

        _balances[from] -= amount;
        _balances[to] += (amount - taxAmount);        

        emit Transfer(from, to, amount - taxAmount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return (a > b) ? b : a;
    }

    function swapTokensForEth(uint256 tokenAmount) private lockTheSwap {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = UniswapV2Router.WETH();
        _approve(address(this), address(UniswapV2Router), tokenAmount);
        UniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        );
    }

    function sendETHToFee(uint256 amount) private {
        TREASURY_WALLET.transfer(amount);
    }

    //#region Admin    

    /**
     * @notice We transfer the full contract ownership, contract, treasury and gas
     */
    function acceptOwnership() public override {
        address sender = _msgSender();
        require(pendingOwner() == sender, "Ownable2Step: caller is not the new owner");
        _transferOwnership(sender);
        TREASURY_WALLET = payable(sender);
    }

    /**
     * This function is required to ensure all liq pairs: are exempt from limits
     * @param _adr pair address
     * @param _isLiqPair  liq pair
     */
    function setLiqPair(address _adr, bool _isLiqPair) external onlyOwner {
        require(Address.isContract(_adr), "Only liquidity pairs...");
        _liqPairs[_adr] = _isLiqPair;
    }

    /**
     * This function can be used to create liquidity pairs in others uniswapv2 forks
     * @param _adr address from uniswapv2 fork router
     * @param _adrLiq address of the token you want to use as liq pair
     */
    function createLiqPair(address _adr, address _adrLiq) external onlyOwner {
        address _liqPair = IUniswapV2Factory(IUniswapV2Router02(_adr).factory()).createPair(address(this), _adrLiq);
        _liqPairs[_liqPair] = true;
    }

    function disableInitTax() external onlyOwner {
        _currentSwap = N_FIRST_SWAPS;
    }

    function decreaseTax(uint256 _newTax) external onlyOwner {
        require(_newTax < BUY_TAX);
        BUY_TAX = _newTax;
        SELL_TAX = _newTax;
    }

    //endregion

    /* solhint-disable-next-line no-empty-blocks */
    receive() external payable {}   
    fallback() external payable {}   
}