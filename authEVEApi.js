import axios from 'axios'
import Swagger from 'swagger-client'
import xml2js from 'xml2js-es6-promise'


const oauthURLBase = 'https://login.eveonline.com/oauth/'
const crestURLBase = 'https://crest-tq.eveonline.com/'

const getAuthorizationURL = (id, redirectURL, scope) => {
  return `${oauthURLBase}authorize?response_type=code&redirect_uri=${redirectURL}` +
    `&client_id=${id}&scope=${scope}`
}

const getHeaders = (id, secret) => {
  const Authorization = 'Basic ' + new Buffer(`${id}:${secret}`)
    .toString('base64')
    .replace('\n', '')
    .replace(' ', '')
  return { Authorization }
}

const authenticate = (id, secret, code) => {
  const data = {
    grant_type: 'authorization_code',
    code
  }
  const headers = getHeaders(id, secret)
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

const getAPIKeyInfo = async (keyID, vCode) => {
  const response = await axios.get(`https://api.eveonline.com/account/APIKeyInfo.xml.aspx?keyID=${keyID}&vCode=${vCode}`)
  const xmlData = await xml2js(response.data)
  const { accessMask, type } = xmlData.eveapi.result[0].key[0].$
  const characters = xmlData.eveapi.result[0].key[0].rowset[0].row.map(e => e.$)
  return { accessMask, type, characters }
}


const api = {
  getAuthorizationURL,
  getHeaders,
  authenticate,
  whoami,
  getCorporation,
  isCorpInAlliance,
  getCharacterId,
  getAPIKeyInfo
}

export default api
