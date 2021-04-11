import React from 'react'
import './GemDetailsCard.scss'
import { IGemData, CharacterType } from './App'
import Box from '@material-ui/core/Box';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { green, red, yellow } from '@material-ui/core/colors';

interface IProps extends IGemData {
  playerCharacter: CharacterType,
  groupCharacters: CharacterType[],
}

const GemDetailsCard: React.FC<IProps> = ({
  name,
  groupCharacters = [],
  questSource: qS,
  level,
  playerCharacter,
  vendorClasses: vC,
}) => {
  const vendorClasses = vC.replace('All, Classes', 'Scion, Witch, Shadow, Ranger, Duelist, Marauder, Templar')
  const questSource = {
    ...qS,
    classes: qS.classes.replace('All, Classes', 'Scion, Witch, Shadow, Ranger, Duelist, Marauder, Templar')
  }
  const groupBuyability = groupCharacters.filter(char => vendorClasses.includes(char))
  const buyabilityStatus = vendorClasses.includes(playerCharacter)
    ? 'self'
    : groupBuyability.length > 0
      ? 'group'
      : 'cant'

  return (
    <Box m={2}>
      <div className="gem-name">{name}</div>
      <div className="quest">
        {questSource.name === 'fixture_of_fate' 
          ? (
            "Available after the library quest in Act 3"
          ) : (
            <div className="quest-container">
              <div className="quest-act">Act {questSource.act}</div>
              <div className="vr" />
              <div className="quest-name">「{questSource.name.replaceAll('_', ' ')}」</div>
            </div>
          )
        }
      </div>
      <div className="gem-level">Requires Level {level}</div>
      <div className="class-section">
        {(() => {
          switch(buyabilityStatus) {
            case 'self':
              return (
                <span className="quest-qualifier" style={{ color: green[500] }}>
                  <DoneIcon fontSize="small" />
                  <span>You can buy this</span>
                </span>
              )
            case 'group':
              return (
                <span className="quest-qualifier" style={{ color: yellow[900] }}>
                  <DoneIcon fontSize="small" />
                  <span>Your groups' {groupBuyability.join('/')} can buy this</span>
                </span>
              )
            case 'cant':
            default:
              return (
                <span className="quest-qualifier" style={{ color: yellow[900] }}>
                  <CloseIcon fontSize="small" />
                  <span style={{ color: red[500] }}>You cannot buy this until the library quest in Act 3</span>
                </span>
              )
          }
        })()}
      </div>
      
      
    </Box>
  )
}

export default GemDetailsCard
