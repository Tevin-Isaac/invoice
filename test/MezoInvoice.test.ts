import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MezoInvoice, IERC20 } from "../typechain-types";

describe("MezoInvoice", function () {
  let mezoInvoice: MezoInvoice;
  let musdToken: IERC20;
  let owner: SignerWithAddress;
  let recipient: SignerWithAddress;
  let payer: SignerWithAddress;
  let dueDate: number;

  beforeEach(async function () {
    // Get signers
    [owner, recipient, payer] = await ethers.getSigners();

    // Deploy mock MUSD token
    const MockToken = await ethers.getContractFactory("MockERC20");
    musdToken = await MockToken.deploy("Mock MUSD", "MUSD");
    await musdToken.deployed();

    // Deploy MezoInvoice contract
    const MezoInvoice = await ethers.getContractFactory("MezoInvoice");
    mezoInvoice = await MezoInvoice.deploy(musdToken.address);
    await mezoInvoice.deployed();

    // Set future due date
    dueDate = (await time.latest()) + time.duration.days(7);

    // Mint some MUSD to payer
    await musdToken.mint(payer.address, ethers.utils.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mezoInvoice.owner()).to.equal(owner.address);
    });

    it("Should set the correct MUSD token address", async function () {
      expect(await mezoInvoice.musdToken()).to.equal(musdToken.address);
    });
  });

  describe("Invoice Creation", function () {
    it("Should create an invoice with correct parameters", async function () {
      const amount = ethers.utils.parseEther("100");
      const tx = await mezoInvoice.createInvoice(
        recipient.address,
        amount,
        dueDate,
        "ipfs://metadata"
      );

      await expect(tx)
        .to.emit(mezoInvoice, "InvoiceCreated")
        .withArgs(1, recipient.address, amount);

      const invoice = await mezoInvoice.getInvoice(1);
      expect(invoice.recipient).to.equal(recipient.address);
      expect(invoice.amount).to.equal(amount);
      expect(invoice.dueDate).to.equal(dueDate);
      expect(invoice.isPaid).to.be.false;
      expect(invoice.metadata).to.equal("ipfs://metadata");
      expect(invoice.payer).to.equal(ethers.constants.AddressZero);
    });

    it("Should fail with invalid parameters", async function () {
      const amount = ethers.utils.parseEther("100");
      const pastDate = (await time.latest()) - time.duration.days(1);

      await expect(
        mezoInvoice.createInvoice(
          ethers.constants.AddressZero,
          amount,
          dueDate,
          "ipfs://metadata"
        )
      ).to.be.revertedWith("Invalid recipient");

      await expect(
        mezoInvoice.createInvoice(
          recipient.address,
          0,
          dueDate,
          "ipfs://metadata"
        )
      ).to.be.revertedWith("Amount must be greater than 0");

      await expect(
        mezoInvoice.createInvoice(
          recipient.address,
          amount,
          pastDate,
          "ipfs://metadata"
        )
      ).to.be.revertedWith("Due date must be in the future");
    });
  });

  describe("Invoice Payment", function () {
    beforeEach(async function () {
      // Create an invoice
      await mezoInvoice.createInvoice(
        recipient.address,
        ethers.utils.parseEther("100"),
        dueDate,
        "ipfs://metadata"
      );

      // Approve MUSD spending
      await musdToken.connect(payer).approve(
        mezoInvoice.address,
        ethers.utils.parseEther("100")
      );
    });

    it("Should successfully pay an invoice", async function () {
      const tx = await mezoInvoice.connect(payer).payInvoice(1);

      await expect(tx)
        .to.emit(mezoInvoice, "InvoicePaid")
        .withArgs(1, payer.address, ethers.utils.parseEther("100"));

      const invoice = await mezoInvoice.getInvoice(1);
      expect(invoice.isPaid).to.be.true;
      expect(invoice.payer).to.equal(payer.address);
    });

    it("Should fail to pay an already paid invoice", async function () {
      await mezoInvoice.connect(payer).payInvoice(1);
      await expect(
        mezoInvoice.connect(payer).payInvoice(1)
      ).to.be.revertedWith("Invoice already paid");
    });

    it("Should fail to pay an expired invoice", async function () {
      await time.increase(time.duration.days(8));
      await expect(
        mezoInvoice.connect(payer).payInvoice(1)
      ).to.be.revertedWith("Invoice expired");
    });

    it("Should fail with insufficient MUSD balance", async function () {
      // Create new invoice with amount more than payer's balance
      await mezoInvoice.createInvoice(
        recipient.address,
        ethers.utils.parseEther("2000"),
        dueDate,
        "ipfs://metadata"
      );

      await expect(
        mezoInvoice.connect(payer).payInvoice(2)
      ).to.be.revertedWith("Insufficient MUSD balance");
    });
  });

  describe("MUSD Integration", function () {
    it("Should correctly report MUSD balances", async function () {
      const balance = await mezoInvoice.getMUSDBalance(payer.address);
      expect(balance).to.equal(ethers.utils.parseEther("1000"));
    });

    it("Should allow owner to update MUSD address", async function () {
      const newToken = await (await ethers.getContractFactory("MockERC20")).deploy("New MUSD", "MUSD");
      await newToken.deployed();

      const tx = await mezoInvoice.updateMUSDAddress(newToken.address);
      await expect(tx)
        .to.emit(mezoInvoice, "MUSDAddressUpdated")
        .withArgs(newToken.address);

      expect(await mezoInvoice.musdToken()).to.equal(newToken.address);
    });
  });
});
