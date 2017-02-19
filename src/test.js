import eveAPI from './eveAPI'
import config from './config'


const getURL = () => {
  console.log(eveAPI.getAuthorizationURL(
    config.EVE_SSO.DEV.client_id,
    config.EVE_SSO.DEV.callback_url,
    config.EVE_SSO.DEV.scope
  ))
}

const authenticate = async () => {
  console.log(await eveAPI.authenticate(
    config.EVE_SSO.DEV.client_id,
    config.EVE_SSO.DEV.secret_key,
    'foobar'
  ))
}

const getSkills = async () => {
  try {
    console.log(await eveAPI.getSkills(
      91316135,
      config.EVE_SSO.DEV.client_id,
      config.EVE_SSO.DEV.secret_key,
      'foobar'
    ))
  } catch (err) {
    console.error(err)
  }
}

getURL()
// authenticate()
// getSkills()
