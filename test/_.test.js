const { expectRevert } = require('@openzeppelin/test-helpers');

const MockToken = artifacts.require('MockToken');
const Airdrop = artifacts.require('Airdrop');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Airdrop Test', accounts => {
  let _token;
  let _airdrop;

  const [beneficiary1, beneficiary2, beneficiary3, beneficiary4] = accounts;

  before(async () => {
    _token = await MockToken.new(
      'MkTk',
      'Mock Token',
      web3.utils.toWei('3000')
    );
    _airdrop = await Airdrop.new();
    await _token.transfer(_airdrop.address, web3.utils.toWei('3000'));
  });

  it('should have transferred 3000 tokens to airdrop contract', async () => {
    const _balance = await _token.balanceOf(_airdrop.address);
    assert.equal(_balance, web3.utils.toWei('3000'));
  });

  it('should not allow non-owner to initiate drop', async () => {
    await expectRevert(
      _airdrop.drop(
        _token.address,
        [beneficiary1, beneficiary2, beneficiary3],
        web3.utils.toWei('1000'),
        { from: beneficiary3 }
      ),
      'Ownable: caller is not the owner'
    );
  });

  it('should throw error if one of beneficiaires is contract', async () => {
    await expectRevert(
      _airdrop.drop(
        _token.address,
        [beneficiary1, _airdrop.address, beneficiary3],
        web3.utils.toWei('1000'),
        { from: beneficiary1 }
      ),
      'cannot send to this contract'
    );
  });

  it('should throw error if there is insufficient amount of tokens', async () => {
    await expectRevert(
      _airdrop.drop(
        _token.address,
        [beneficiary1, beneficiary2, beneficiary3, beneficiary4],
        web3.utils.toWei('1000'),
        { from: beneficiary1 }
      ),
      'insufficient amount of tokens'
    );
  });

  it('should allow owner to initiate drop', async () => {
    await _airdrop.drop(
      _token.address,
      [beneficiary1, beneficiary2, beneficiary3],
      web3.utils.toWei('1000'),
      { from: beneficiary1 }
    );
    const _balance1 = await _token.balanceOf(beneficiary1);
    const _balance2 = await _token.balanceOf(beneficiary2);
    const _balance3 = await _token.balanceOf(beneficiary3);
    _balance1.toString().should.be.bignumber.equal(1e21);
    _balance2.toString().should.be.bignumber.equal(1e21);
    _balance3.toString().should.be.bignumber.equal(1e21);
  });
});
