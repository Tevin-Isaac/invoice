// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MezoInvoice
 * @dev Smart contract for managing invoices with MUSD integration
 */
contract MezoInvoice is ReentrancyGuard, Ownable {
    // MUSD token interface
    IERC20 public musdToken;

    struct Invoice {
        uint256 id;
        address payable recipient;
        uint256 amount;
        uint256 dueDate;
        bool isPaid;
        string metadata;
        address payer;
    }

    // State variables
    mapping(uint256 => Invoice) public invoices;
    uint256 public nextInvoiceId;

    // Events
    event InvoiceCreated(uint256 indexed invoiceId, address indexed recipient, uint256 amount);
    event InvoicePaid(uint256 indexed invoiceId, address indexed payer, uint256 amount);
    event MUSDAddressUpdated(address indexed newAddress);

    /**
     * @dev Constructor sets the MUSD token address
     * @param _musdToken Address of the MUSD token contract
     */
    constructor(address _musdToken) {
        require(_musdToken != address(0), "Invalid MUSD address");
        musdToken = IERC20(_musdToken);
        nextInvoiceId = 1;
    }

    /**
     * @dev Updates the MUSD token address
     * @param _newMusdToken New MUSD token address
     */
    function updateMUSDAddress(address _newMusdToken) external onlyOwner {
        require(_newMusdToken != address(0), "Invalid MUSD address");
        musdToken = IERC20(_newMusdToken);
        emit MUSDAddressUpdated(_newMusdToken);
    }

    /**
     * @dev Creates a new invoice
     * @param recipient Address to receive the payment
     * @param amount Amount in MUSD (18 decimals)
     * @param dueDate Unix timestamp for invoice due date
     * @param metadata IPFS hash or other metadata
     */
    function createInvoice(
        address payable recipient,
        uint256 amount,
        uint256 dueDate,
        string memory metadata
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(dueDate > block.timestamp, "Due date must be in the future");

        uint256 invoiceId = nextInvoiceId++;
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            recipient: recipient,
            amount: amount,
            dueDate: dueDate,
            isPaid: false,
            metadata: metadata,
            payer: address(0)
        });

        emit InvoiceCreated(invoiceId, recipient, amount);
        return invoiceId;
    }

    /**
     * @dev Pays an invoice using MUSD
     * @param invoiceId ID of the invoice to pay
     */
    function payInvoice(uint256 invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[invoiceId];
        require(invoice.id != 0, "Invoice does not exist");
        require(!invoice.isPaid, "Invoice already paid");
        require(block.timestamp <= invoice.dueDate, "Invoice expired");
        
        uint256 amount = invoice.amount;
        require(musdToken.balanceOf(msg.sender) >= amount, "Insufficient MUSD balance");
        require(musdToken.allowance(msg.sender, address(this)) >= amount, "Insufficient MUSD allowance");

        // Transfer MUSD from payer to recipient
        require(musdToken.transferFrom(msg.sender, invoice.recipient, amount), "MUSD transfer failed");
        
        invoice.isPaid = true;
        invoice.payer = msg.sender;
        
        emit InvoicePaid(invoiceId, msg.sender, amount);
    }

    /**
     * @dev Gets invoice details
     * @param invoiceId ID of the invoice to retrieve
     */
    function getInvoice(uint256 invoiceId) external view returns (
        address recipient,
        uint256 amount,
        uint256 dueDate,
        bool isPaid,
        string memory metadata,
        address payer
    ) {
        Invoice storage invoice = invoices[invoiceId];
        require(invoice.id != 0, "Invoice does not exist");
        
        return (
            invoice.recipient,
            invoice.amount,
            invoice.dueDate,
            invoice.isPaid,
            invoice.metadata,
            invoice.payer
        );
    }

    /**
     * @dev Gets the MUSD balance of an address
     * @param account Address to check balance for
     */
    function getMUSDBalance(address account) external view returns (uint256) {
        return musdToken.balanceOf(account);
    }
}