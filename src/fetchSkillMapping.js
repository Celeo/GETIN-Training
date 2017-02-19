import axios from 'axios'
import xml2js from 'xml2js-es6-promise'
import fs from 'fs'


const retrieve = async () => {
  const response = await axios.get('https://api.eveonline.com/eve/SkillTree.xml.aspx')
  const xml = await xml2js(response.data)

  const skills = {}
  const allGroups = xml.eveapi.result[0].rowset[0].row
  for (let group of allGroups) {
    for (let groupItem of group.rowset[0].row) {
      skills[groupItem.$.typeID] = groupItem.$.typeName
    }
  }
  fs.writeFile('skill_mapping.json', JSON.stringify(skills, null, 2), () => {})
}

retrieve()
