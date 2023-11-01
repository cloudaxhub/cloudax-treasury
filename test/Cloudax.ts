// eslint-disable-next-line no-unused-vars
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
// eslint-disable-next-line node/no-missing-import
import type { Cloudax, Cloudax__factory } from '../typechain-types';

describe('Cloudax', function () {
  let Cloudax: Cloudax;
  let CloudaxFactory: Cloudax__factory;
  // eslint-disable-next-line no-unused-vars
  let owner: SignerWithAddress;
  // eslint-disable-next-line no-unused-vars
  let paul: SignerWithAddress;
  // eslint-disable-next-line no-unused-vars
  let john: SignerWithAddress;

  beforeEach(async function () {
    [owner, john, paul] = await ethers.getSigners();

    CloudaxFactory = (await ethers.getContractFactory(
      'Cloudax'
    )) as Cloudax__factory;

    Cloudax = await CloudaxFactory.deploy();
  });

  it('should have correct name and symbol and decimal', async function () {
    const name = await Cloudax.name();
    const symbol = await Cloudax.symbol();
    const decimals = await Cloudax.decimals();
    expect(name, 'Cloudax');
    expect(symbol, 'CLDX');
    expect(decimals, 18);
  });

  it('should only allow owner to blacklist', async function () {
    await expect(
      Cloudax.connect(john).setBlacklisted(john.address, true)
    ).to.be.revertedWith('Ownable: caller is not the owner');
    await Cloudax.setBlacklisted(john.address, true);
    expect(await Cloudax._isBlacklisted(john.address)).to.equal(true);
  });

  it('should not allow non-owner to setup presale address', async function () {
    await expect(
      Cloudax.connect(john).setupPresaleAddress(john.address)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should allow owner to setup presale address', async function () {
    await Cloudax.setupPresaleAddress(paul.address);
    expect(await Cloudax.presaleAddress()).to.equal(paul.address);
  });

  it('should not allow non-owner to enable trading', async function () {
    await expect(
      Cloudax.connect(john).setTradingEnabled(true)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should allow owner to enable trading', async function () {
    await Cloudax.setTradingEnabled(true);
    expect(await Cloudax.isTradingEnabled()).to.equal(true);
  });

  it('should not allow blacklisted address to transfer tokens', async function () {
    await Cloudax.setBlacklisted(john.address, true);
    await expect(
      Cloudax.connect(john).transfer(paul.address, 100)
    ).to.be.revertedWith('An address is blacklisted');
  });

  it('should not allow transfer if trading is not enabled', async function () {
    await expect(
      Cloudax.connect(john).transfer(paul.address, 100)
    ).to.be.revertedWith('Trading is not enabled yet');
  });

  it('should allow owner to withdraw tokens', async function () {
    await Cloudax.setTradingEnabled(true);
    expect(await Cloudax.isTradingEnabled()).to.equal(true);
    await Cloudax.setTradingEnabled(true);
    const token = await CloudaxFactory.deploy();
    await token.transfer(Cloudax.address, ethers.utils.parseEther('1000'));
    await Cloudax.withdrawTokens(
      token.address,
      Cloudax.address,
      ethers.utils.parseEther('1000')
    );
    expect(await token.balanceOf(john.address)).to.equal(
      ethers.utils.parseEther('1000')
    );
  });

  it('should allow owner to withdraw ether', async function () {
    await owner.sendTransaction({
      to: Cloudax.address,
      value: ethers.utils.parseEther('1.0'),
    });
    await Cloudax.withdrawEther(paul.address, ethers.utils.parseEther('1.0'));
    expect(await ethers.provider.getBalance(paul.address)).to.equal(
      ethers.utils.parseEther('1.0')
    );
  });

  // Add more tests as needed
});
