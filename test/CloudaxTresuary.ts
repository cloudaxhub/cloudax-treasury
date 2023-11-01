import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { Cloudax, Cloudax__factory } from '../typechain-types';

describe('Cloudax', function () {
  let Cloudax: Cloudax;
  let CloudaxFactory: Cloudax__factory;
  let owner: SignerWithAddress;
  let beneficiary: SignerWithAddress;

  beforeEach(async function () {
    [owner, beneficiary] = await ethers.getSigners();

    CloudaxFactory = (await ethers.getContractFactory('Cloudax')) as Cloudax__factory;
    Cloudax = await CloudaxFactory.deploy(owner.address);
  });

  it('should set the beneficiary address', async function () {
    await Cloudax.setBeneficiaryAddress(beneficiary.address);
    const beneficiaryAddress = await Cloudax.getBeneficiaryAddress();
    expect(beneficiaryAddress).to.equal(beneficiary.address);
  });

  it('should initialize a vesting schedule', async function () {
    const vestingDuration = 12; // 12 months
    const vestingAllocation = ethers.utils.parseEther('100'); // 100 tokens

    await Cloudax.initialize(vestingDuration, beneficiary.address, vestingAllocation);

    const scheduleCount = await Cloudax.getVestingSchedulesCount();
    expect(scheduleCount).to.equal(84); // Assuming there are 84 schedules for 12 months.

    const vestingSchedule = await Cloudax.getVestingSchedule(0);
    // You should perform additional checks based on the expected values.
  });

  it('should pause and unpause the vesting release', async function () {
    await Cloudax.pause();
    const paused = await Cloudax.paused();
    expect(paused).to.be.true;

    await Cloudax.unpause();
    const unpaused = await Cloudax.paused();
    expect(unpaused).to.be.false;
  });

  it('should release tokens to the beneficiary', async function () {
    // Assuming the contract is already initialized and not paused.
    const currentTime = await Cloudax.getCurrentTime();
    await Cloudax.release();

    const beneficiaryBalance = await Cloudax.getToken().balanceOf(beneficiary.address);
    expect(beneficiaryBalance).to.be.gt(0);
  });

  it('should swap CLDX to ECO tokens', async function () {
    // Assuming the contract is already initialized and not paused.
    const swapAmount = ethers.utils.parseEther('10');
    await Cloudax.swapCldxToEco(swapAmount);

    const zeroAddressBalance = await Cloudax.getToken().balanceOf('0x0000000000000000000000000000000000000000');
    expect(zeroAddressBalance).to.equal(swapAmount);
  });

  it('should swap ECO tokens to CLDX', async function () {
    // Assuming the contract is already initialized and not paused.
    const swapAmount = ethers.utils.parseEther('10');
    await Cloudax.swapEcoToCldx(swapAmount);

    const beneficiaryBalance = await Cloudax.getToken().balanceOf(beneficiary.address);
    expect(beneficiaryBalance).to.be.gt(0);
  });

  it('should approve an EcoWallet', async function () {
    const newEcoWallet = await ethers.Wallet.createRandom();
    await Cloudax.aproveEcoWallet(newEcoWallet.address);

    const approvalStatus = await Cloudax.ecoApprovalWallet(newEcoWallet.address);
    expect(approvalStatus).to.not.equal(0);
  });

  it('should remove an approved EcoWallet', async function () {
    const newEcoWallet = await ethers.Wallet.createRandom();
    await Cloudax.aproveEcoWallet(newEcoWallet.address);

    const approvalStatusBeforeRemoval = await Cloudax.ecoApprovalWallet(newEcoWallet.address);
    expect(approvalStatusBeforeRemoval).to.not.equal(0);

    await Cloudax.removeEcoWallet(newEcoWallet.address);

    const approvalStatusAfterRemoval = await Cloudax.ecoApprovalWallet(newEcoWallet.address);
    expect(approvalStatusAfterRemoval).to.equal(0);
  });

  it('should withdraw tokens', async function () {
    // Assuming the contract is already initialized and not paused.
    const withdrawAmount = ethers.utils.parseEther('10');
    await Cloudax.withdraw(withdrawAmount);

    const ownerBalance = await Cloudax.getToken().balanceOf(owner.address);
    expect(ownerBalance).to.be.gt(0);
  });

  it('should get the withdrawable amount', async function () {
    // Assuming the contract is already initialized and not paused.
    const withdrawableAmount = await Cloudax.getWithdrawableAmount();
    expect(withdrawableAmount).to.be.gt(0);
  });

  // Add more test cases as needed.
});
