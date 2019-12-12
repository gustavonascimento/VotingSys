/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MyAssetContract } = require('..');
let Voter = require('../lib/Voter.js');
let VotableItem = require('../lib/VotableItem.js');
let Election = require('../lib/Election.js');
let Ballot = require('../lib/Ballot.js');
const winston = require('winston');


const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

  constructor() {
    this.stub = sinon.createStubInstance(ChaincodeStub);
    this.clientIdentity = sinon.createStubInstance(ClientIdentity);
    this.logging = {
      getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
      setLevel: sinon.stub(),
    };
  }

}

describe('SmartContract', () => {

  let contract;
  let ctx;

  beforeEach(async () => {
    contract = new MyAssetContract();
    ctx = new TestContext();
    ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my asset 1001 value"}'));
    ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my asset 1002 value"}'));
    
  });

  describe('#CriarContrato', () => {

    it('Contrato criado com sucesso', async () => {
      await contract.myAssetExists(ctx, '1001').should.eventually.be.true;
    });

    it('Contrato já existente!', async () => {
      await contract.myAssetExists(ctx, '1003').should.eventually.be.false;
    });
  });

  describe('#LerContrato', () => {

    it('Deve retornar o contrato', async () => {
      await contract.readMyAsset(ctx, '1001').should.eventually.deep.equal({ value: 'my asset 1001 value' });
    });

  });

  describe('#DeletarContrato', () => {

    it('Deve deletar o contrato', async () => {
      await contract.deleteMyAsset(ctx, '1001');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
    });

  });

  describe('#iniciar', async () => {

    it('Deve retornar um array com dois valores', async () => {
      let result = await contract.init(ctx);
      result.voter = new Voter('1', '234', 'Horea', 'Porutiu'); 
      result.voter = new Voter('12', '2234', 'Horea', 'Porutiu'); 

      result.should.be.an('array');
      result.should.have.lengthOf(2);
    });

  });

  describe('#Eleitor', async () => {

    it('Objeto Eleitor criado com sucesso, com todos os seus atributos', async () => {
      let voter = new Voter('02954492141', '2969533', 'Gustavo', 'Moreira', '123'); 

      voter.should.haveOwnProperty('voterId');
      voter.should.haveOwnProperty('registrarId');
      voter.should.haveOwnProperty('firstName');
      voter.should.haveOwnProperty('lastName');
      voter.should.haveOwnProperty('password');
      voter.should.haveOwnProperty('ballotCreated');
    });

  });

  describe('#Eleicao', async () => {
    it('Objeto Eleição criado com sucesso, com todos os seus atributos', async () => {
      let election = new Election('Eleicao2', 'Eleição para diretor da FGA', 'Brasil',
        '2019', 'November 1, 2019', 'December 29, 2019'); 

      election.should.haveOwnProperty('electionId');
      election.should.haveOwnProperty('name');
      election.should.haveOwnProperty('country');
      election.should.haveOwnProperty('year');
      election.should.haveOwnProperty('startDate');
      election.should.haveOwnProperty('startDate');
    });

  });

  describe('#Cedula', async () => {

    it('Cédula criada com sucesso!', async () => {
      let ballot = new Ballot(ctx, 'Candidato1', 'Eleição para diretor da FGA', '1'); 
      ballot.should.haveOwnProperty('votableItems');
      ballot.should.haveOwnProperty('election');
      ballot.should.haveOwnProperty('voterId');
    });

  });

  describe('#Candidato', async () => {

    it('Candidato criado com sucesso!', async () => {
      let votableItem = new VotableItem(ctx, '1', 'Vandor', 'Candidato de Software', 'false'); 

      votableItem.should.haveOwnProperty('votableId');
      votableItem.should.haveOwnProperty('description');
      votableItem.votableId.should.have.lengthOf(1);
    });

  });

});