import Api from '@/services/api'

export default {
  castBallot(electionId, voterId, picked) {
    return Api().post('castBallot', {       
      electionId: electionId,
      voterId: voterId,
      picked: picked
    })
  },
  queryAll() {
    return Api().get('queryAll')
  },
  queryByObjectType() {
    return Api().get('queryByObjectType')
  },
  queryWithQueryString(selected) {
    return Api().post('queryWithQueryString', {
      selected: selected
    }) 
  },
  registerVoter(voterId, registrarId, firstName, lastName, password) {
    return Api().post('registerVoter', {
      voterId: voterId,
      registrarId: registrarId,
      firstName: firstName,
      lastName: lastName,
      password: password
      
    }) 
  },
  validateVoter(voterId,password) {
    return Api().post('validateVoter', {
      voterId: voterId,
      password: password
    }) 
  },
  validateVoterAdmin(voterId,password) {
    return Api().post('validateVoterAdmin', {
      voterId: "777",
      password: "123"
    }) 
  },
  queryByKey(key) {
    return Api().post('queryByKey', {
      key: key
    }) 
  },
  getCurrentStanding() {
    return Api().get('getCurrentStanding')
  },
  getCurrentStandingAdmin() {
    return Api().get('getCurrentStandingAdmin')
  }
}