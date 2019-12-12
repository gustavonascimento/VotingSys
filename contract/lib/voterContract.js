/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

//import Hyperledger Fabric 1.4 SDK
const { Contract } = require('fabric-contract-api');
const path = require('path');
const fs = require('fs');

// connect to the election data file
const electionDataPath = path.join(process.cwd(), './lib/data/electionData.json');
const electionDataJson = fs.readFileSync(electionDataPath, 'utf8');
const electionData = JSON.parse(electionDataJson);

// connect to the pres election file
const ballotDataPath = path.join(process.cwd(), './lib/data/candidatesData.json');
const ballotDataJson = fs.readFileSync(ballotDataPath, 'utf8');
const ballotData = JSON.parse(ballotDataJson);

//import our file which contains our constructors and auxiliary function
let Ballot = require('./Ballot.js');
let Election = require('./Election.js');
let Voter = require('./Voter.js');
let VotableItem = require('./VotableItem.js');
let nodemailer = require('nodemailer');

// wallet
// let network = require('./fabric/network.js');

class MyAssetContract extends Contract {

  /**
   *
   * init
   *
   * This function creates voters and gets the application ready for use by creating 
   * an election from the data files in the data directory.
   * 
   * @param ctx - the context of the transaction
   * @returns the voters which are registered and ready to vote in the election
   */
  async init(ctx, adminEmail) {

    console.log('Chamada da instância do contrato');

    let voters = [];
    let votableItems = [];
    let elections = [];
    let election;

    var adminPassword = Math.random().toString(36).slice(-8);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sysvoting@gmail.com',
        pass: 'gama2019'
      }
    });

    let mailOptions = {
      from: 'sysvoting@gmail.com',
      to: adminEmail,
      subject: 'Senha do usuário Administrador do VotingSys',
      text: 'Usuário: administrador Senha: ' + adminPassword
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
    //create voters
    // let voter1 = await new Voter('V1', '234', 'Horea', 'Porutiu', '123');
    // let voter2 = await new Voter('V2', '345', 'Duncan', 'Conley', '123');
    let voter3 = await new Voter('administrador', '123', 'admin', 'admin', adminPassword);

    //update voters array
    // voters.push(voter1);
    // voters.push(voter2);
    voters.push(voter3);

    //add the voters to the world state, the election class checks for registered voters 
    // await ctx.stub.putState(voter1.voterId, Buffer.from(JSON.stringify(voter1)));
    // await ctx.stub.putState(voter2.voterId, Buffer.from(JSON.stringify(voter2)));
    await ctx.stub.putState(voter3.voterId, Buffer.from(JSON.stringify(voter3)));
    
    // let response = await network.registerVoter(voter3.voterId, voter3.registrarId, voter3.firstName, voter3.lastName, voter3.password);
    // console.log(response);
    // let invokeResponse = await network.invoke(networkObj, false, 'createVoter', args);
    // console.log(invokeResponse);

    //query for election first before creating one.
    let currElections = JSON.parse(await this.queryByObjectType(ctx, 'election'));

    if (currElections.length === 0) {

      //Nov 3 is election day
      let electionStartDate = await new Date(2019, 11, 11, 0, 0, 0, 0);
      let electionEndDate = await new Date(2019, 11, 12, 20, 20, 0, 0);

      //create the election
      election = await new Election(electionData.electionName, electionData.electionCountry,
        electionData.electionYear, electionStartDate, electionEndDate);

      //update elections array
      elections.push(election);

      await ctx.stub.putState(election.electionId, Buffer.from(JSON.stringify(election)));

    } else {
      election = currElections[0];
    }

    //create votableItems for the ballots
    let candidate1 = await new VotableItem(ctx, 'Asfalto Comum', ballotData.candidate1);
    let candidate2 = await new VotableItem(ctx, 'Asfalto de Concreto', ballotData.candidate2);
    let candidate3 = await new VotableItem(ctx, 'Paralelepípedo', ballotData.candidate3);

    //populate choices array so that the ballots can have all of these choices 
    votableItems.push(candidate1);
    votableItems.push(candidate2);
    votableItems.push(candidate3);

    for (let i = 0; i < votableItems.length; i++) {    
      //save votable choices in world state
      await ctx.stub.putState(votableItems[i].votableId, Buffer.from(JSON.stringify(votableItems[i])));

    }

    //generate ballots for all voters
    for (let i = 0; i < voters.length; i++) {

      if (!voters[i].ballot) {

        //give each registered voter a ballot
        await this.generateBallot(ctx, votableItems, election, voters[i]);

      } else {
        console.log('Eleitor com voto já registrado');
        break;
      }

    }

    return voters;

  }

  /**
   *
   * generateBallot
   *
   * Creates a ballot in the world state, and updates voter ballot and castBallot properties.
   * 
   * @param ctx - the context of the transaction
   * @param votableItems - The different political parties and candidates you can vote for, which are on the ballot.
   * @param election - the election we are generating a ballot for. All ballots are the same for an election.
   * @param voter - the voter object
   * @returns - nothing - but updates the world state with a ballot for a particular voter object
   */
  async generateBallot(ctx, votableItems, election, voter) {
    
    //generate ballot
    let ballot = await new Ballot(ctx, votableItems, election, voter.voterId);
    
    //set reference to voters ballot
    voter.ballot = ballot.ballotId;
    voter.ballotCreated = true;

    // //update state with ballot object we just created
    await ctx.stub.putState(ballot.ballotId, Buffer.from(JSON.stringify(ballot)));

    await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));

  }


  /**
   *
   * createVoter
   *
   * Creates a voter in the world state, based on the args given.
   *  
   * @param args.voterId - the Id the voter, used as the key to store the voter object
   * @param args.registrarId - the registrar the voter is registered for
   * @param args.firstName - first name of voter
   * @param args.lastName - last name of voter
   * @returns - nothing - but updates the world state with a voter
   */
  async createVoter(ctx, args) {

    args = JSON.parse(args);

    //create a new voter
    let newVoter = await new Voter(args.voterId, args.registrarId, args.firstName, args.lastName, args.password);

    //update state with new voter
    await ctx.stub.putState(newVoter.voterId, Buffer.from(JSON.stringify(newVoter)));

    //query state for elections
    let currElections = JSON.parse(await this.queryByObjectType(ctx, 'election'));

    if (currElections.length === 0) {
      let response = {};
      response.error = 'sem eleições. Rode a função init().';
      return response;
    }

    //get the election that is created in the init function
    let currElection = currElections[0];

    let votableItems = JSON.parse(await this.queryByObjectType(ctx, 'votableItem'));
    
    //generate ballot with the given votableItems
    await this.generateBallot(ctx, votableItems, currElection, newVoter);

    let response = `Eleitor com o CPF ${newVoter.voterId} foi adicionado`;
    return response;
  }



  /**
   *
   * deleteMyAsset
   *
   * Deletes a key-value pair from the world state, based on the key given.
   *  
   * @param myAssetId - the key of the asset to delete
   * @returns - nothing - but deletes the value in the world state
   */
  async deleteMyAsset(ctx, myAssetId) {

    const exists = await this.myAssetExists(ctx, myAssetId);
    if (!exists) {
      throw new Error(`Ativo ${myAssetId} não existe`);
    }

    await ctx.stub.deleteState(myAssetId);

  }

  /**
   *
   * readMyAsset
   *
   * Reads a key-value pair from the world state, based on the key given.
   *  
   * @param myAssetId - the key of the asset to read
   * @returns - nothing - but reads the value in the world state
   */
  async readMyAsset(ctx, myAssetId) {

    const exists = await this.myAssetExists(ctx, myAssetId);

    if (!exists) {
      // throw new Error(`The my asset ${myAssetId} does not exist`);
      let response = {};
      response.error = `Ativo ${myAssetId} não existe`;
      return response;
    }

    const buffer = await ctx.stub.getState(myAssetId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }


 
  /**
   *
   * myAssetExists
   *
   * Checks to see if a key exists in the world state. 
   * @param myAssetId - the key of the asset to read
   * @returns boolean indicating if the asset exists or not. 
   */
  async myAssetExists(ctx, myAssetId) {

    const buffer = await ctx.stub.getState(myAssetId);
    return (!!buffer && buffer.length > 0);

  }

  /**
   *
   * castVote
   * 
   * First to checks that a particular voterId has not voted before, and then 
   * checks if it is a valid election time, and if it is, we increment the 
   * count of the political party that was picked by the voter and update 
   * the world state. 
   * 
   * @param electionId - the electionId of the election we want to vote in
   * @param voterId - the voterId of the voter that wants to vote
   * @param votableId - the Id of the candidate the voter has selected.
   * @returns an array which has the winning briefs of the ballot. 
   */
  async castVote(ctx, args) {
    args = JSON.parse(args);

    //get the political party the voter voted for, also the key
    let votableId = args.picked;

    //check to make sure the election exists
    let electionExists = await this.myAssetExists(ctx, args.electionId);

    if (electionExists) {

      //make sure we have an election
      let electionAsBytes = await ctx.stub.getState(args.electionId);
      let election = await JSON.parse(electionAsBytes);
      let voterAsBytes = await ctx.stub.getState(args.voterId);
      let voter = await JSON.parse(voterAsBytes);

      if (voter.ballotCast) {
        let response = {};
        response.error = 'Este eleitor já enviou o seu voto!';
        return response;
      }

      //check the date of the election, to make sure the election is still open
      let currentTime = new Date();

      //parse date objects
      let parsedCurrentTime = await Date.parse(currentTime);
      let electionStart = await Date.parse(election.startDate);
      let electionEnd = await Date.parse(election.endDate);

      //only allow vote if the election has started 
      if (parsedCurrentTime >= electionStart && parsedCurrentTime < electionEnd) {

        let votableExists = await this.myAssetExists(ctx, votableId);
        if (!votableExists) {
          let response = {};
          response.error = 'Candidato não existe';
          return response;
        }

        //get the votable object from the state - with the votableId the user picked
        let votableAsBytes = await ctx.stub.getState(votableId);
        let votable = await JSON.parse(votableAsBytes);

        //increase the vote of the political party that was picked by the voter
        await votable.count++;

        //update the state with the new vote count
        let result = await ctx.stub.putState(votableId, Buffer.from(JSON.stringify(votable)));
        console.log(result);

        //make sure this voter cannot vote again! 
        voter.ballotCast = true;
        voter.picked = {};
        voter.picked = args.picked;

        //update state to say that this voter has voted, and who they picked
        let response = await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
        console.log(response);
        return voter;

      } else {
        let response = {};
        response.error = 'Eleição fechada!';
        return response;
      }

    } else {
      let response = {};
      response.error = 'Eleição ou candidato não existe!';
      return response;
    }
  }

  /**
   * Query and return all key value pairs in the world state.
   *
   * @param {Context} ctx the transaction context
   * @returns - all key-value pairs in the world state
  */
  async queryAll(ctx) {

    let queryString = {
      selector: {}
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

  }

  /**
     * Evaluate a queryString
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
    */
  async queryWithQueryString(ctx, queryString) {

    console.log('query String');
    console.log(JSON.stringify(queryString));

    let resultsIterator = await ctx.stub.getQueryResult(queryString);

    let allResults = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let res = await resultsIterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;

        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }

        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await resultsIterator.close();
        console.info(allResults);
        console.log(JSON.stringify(allResults));
        return JSON.stringify(allResults);
      }
    }
  }

  /**
  * Query by the main objects in this app: ballot, election, votableItem, and Voter. 
  * Return all key-value pairs of a given type. 
  *
  * @param {Context} ctx the transaction context
  * @param {String} objectType the type of the object - should be either ballot, election, votableItem, or Voter
  */
  async queryByObjectType(ctx, objectType) {
      let queryString = {
        selector: {
          type: objectType
        }
      };
  
      let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
      console.log(queryResults);

      return queryResults;
     
  }

  /**
  * Query by the main objects in this app: ballot, election, votableItem, and Voter. 
  * Return all key-value pairs of a given type. 
  *
  * @param {Context} ctx the transaction context
  * @param {String} objectType the type of the object - should be either ballot, election, votableItem, or Voter
  */
 async queryByObjectTypeGraph(ctx, objectType) {
  //check the date of the election, to make sure the election is still open
  let currentTime = new Date();

  //parse date objects
  let parsedCurrentTime = await Date.parse(currentTime);
  let electionStart = await new Date(2019, 11, 11, 0, 0, 0, 0);
  let electionEnd = await new Date(2019, 11, 12, 20, 20, 0, 0);

  if(currentTime >= electionEnd) {
    let queryString = {
      selector: {
        type: objectType
      }
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    console.log(queryResults);

    return queryResults;
   } else {
     let response = {};
     response.error = 'Eleição ainda em andamento!';
     console.log(response);
     return response;
   }
   
}

}
module.exports = MyAssetContract;
