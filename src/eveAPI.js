import axios from 'axios'
import Swagger from 'swagger-client'


const oauthURLBase = 'https://login.eveonline.com/oauth/'
const crestURLBase = 'https://crest-tq.eveonline.com/'

const getAuthorizationURL = (id, redirectURL, scope) => {
  return `${oauthURLBase}authorize?response_type=code&redirect_uri=${redirectURL}` +
    `&client_id=${id}&scope=${scope}`
}

const getBasicHeader = (id, secret) => {
  const Authorization = 'Basic ' + new Buffer(`${id}:${secret}`)
    .toString('base64')
    .replace('\n', '')
    .replace(' ', '')
  return { Authorization }
}

const getBearerHeader = (token) => {
  return { Authorization: `Bearer ${token}` }
}

const authenticate = (id, secret, code) => {
  const data = {
    grant_type: 'authorization_code',
    code
  }
  const headers = getBasicHeader(id, secret)
  return axios.post(`${oauthURLBase}token`, data, { headers })
    .then(response => response.data.access_token)
}

const whoami = (token) => {
  const headers = {
    'Authorization': `Bearer ${token}`
  }
  return axios.get(`${oauthURLBase}verify`, { headers })
    .then(response => response.data)
}

const getCorporation = (characterId) => {
  return axios.get(`${crestURLBase}characters/${characterId}/`)
    .then(response => response.data.corporation.name)
}

const isCorpInAlliance = (corporationName) => {
  const validCorporations = [
    'Scattered Dreams',
    'Wormbro',
    'Rare Pepe Holdings',
    'Newbbro',
    'Wormbro SRP'
  ]
  return Promise.resolve(validCorporations.indexOf(corporationName) !== -1)
}

const getCharacterId = async (name) => {
  const client = await new Swagger({
    url: 'https://esi.tech.ccp.is/latest/swagger.json?datasource=tranquility',
    usePromise: true
  })
  const response = await client.Search.get_search({
    search: name,
    categories: ['character'],
    strict: true
  })
  return response.obj.character[0]
}

const getSkills = async (characterId, id, secret, token) => {
  const authorization = getBearerHeader(token)
  const client = await new Swagger({
    url: 'https://esi.tech.ccp.is/latest/swagger.json?datasource=tranquility',
    usePromise: true,
    authorizations: {
      evesso: new Swagger.ApiKeyAuthorization('Authorization', authorization.Authorization, 'header')
    }
  })
  const response = await client.Skills.get_characters_character_id_skills({
    character_id: characterId
  })
  return response.obj
}

const api = {
  getAuthorizationURL,
  authenticate,
  whoami,
  getCorporation,
  isCorpInAlliance,
  getCharacterId,
  getSkills
}


export default api
