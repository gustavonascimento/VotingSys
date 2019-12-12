'use strict';

class Ballot {

  /**
   *
   * Ballot
   *
   * Constructor for a Ballot object. This is what the point of the application is - create 
   * ballots, have a voter fill them out, and then tally the ballots. 
   *  
   * @param items - an array of choices 
   * @param election - what election you are making ballots for 
   * @param voterId - the unique Id which corresponds to a registered voter
   * @returns - registrar object
   */
  constructor(ctx, items, election, voterId) {

    if (this.validateBallot(ctx, voterId)) {

      this.votableItems = items;
      this.election = election;
      this.voterId = voterId;
      this.ballotCast = false;
      this.ballotId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      this.type = 'ballot';
      if (this.__isContract) {
        delete this.__isContract;
      }
      if (this.name) {
        delete this.name;
      }
      return this;

    } else {
      console.log('Já existe um voto para este eleitor!');
      throw new Error ('Já existe um voto para este eleitor!');
    }
  }

  /**
   *
   * validateBallot
   *
   * check to make sure a ballot has not been created for this
   * voter.
   *  
   * @param voterId - the unique Id for a registered voter 
   * @returns - yes if valid Voter, no if invalid
   */
  async validateBallot(ctx, voterId) {

    const buffer = await ctx.stub.getState(voterId);
    
    if (!!buffer && buffer.length > 0) {
      let voter = JSON.parse(buffer.toString());
      if (voter.ballotCreated) {
        console.log('Já existe um voto para este eleitor!');
        return false;
      } else {
        return true;
      }
    } else {
      console.log('Não existe um CPF cadastrado para este eleitor.');
      return false;
    }
  }
}
module.exports = Ballot;