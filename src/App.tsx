import React, { ChangeEvent, useReducer, useState } from 'react';
import './App.scss';

/* Material UI imports */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CancelIcon from '@material-ui/icons/Cancel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
/* End of Material UI */

import rawGemData from './gemdata.json'
import GemDetailsCard from './GemDetailsCard';

type TQuest = {
  act: string,
  name: string,
  classes: string,
}

export interface IGemData {
  name: string,
  level: number,
  vendorClasses: string,
  questSource: TQuest,
}

const gemData: IGemData[] = rawGemData.filter(gem => {
  // Vendor length 0 is awakened gens
  return (
    gem.vendors.length > 0
    && !gem.colors.includes('White')
    && !(gem.quests.length === 0 && gem.level === '31')
  )
}).map(gem => ({
  name: gem.name,
  level: +gem.level || 31,
  vendorClasses: gem.vendors[0] && gem.vendors[0].classes,
  questSource: gem.quests[0] || {
    act: "3",
    name: "fixture_of_fate",
    classes: "All, Classes"
  },
}))

const gemMap: {[key: string]: IGemData} = gemData.reduce((total, gem) => {
  // @ts-expect-error idk wtf is going up here honestly
  total[gem.name] = gem
  return total
}, {})

const gemNames = gemData.map(gem => gem.name)

type TGemAction = {
  type: 'add' | 'remove',
  gem: string | null
}

export enum CharacterType {
  Scion = "Scion",
  Witch = "Witch",
  Shadow = "Shadow",
  Ranger = "Ranger",
  Duelist = "Duelist",
  Marauder = "Marauder",
  Templar = "Templar"
}

// ! START OF COMPONENT ! //
function App() {
  const [character, setCharacter] = useState<CharacterType>(CharacterType.Scion)
  const [groupCharacters, setGroupCharacters] = useState<CharacterType[]>([])
  const [activeGems, modifyGem] = useReducer((state: Array<string>, action: TGemAction) => {
    if (!action.gem) return state
    switch(action.type) {
      case 'add':
        if (state.indexOf(action.gem) > -1) {
          return state
        } else {
          return [...state, action.gem].sort((a, b) => gemMap[a].level - gemMap[b].level)
        }
      case 'remove':
        console.log('remove triggered')
        const itemIndex = state.indexOf(action.gem)
        console.log(itemIndex)
        if (itemIndex > -1) {
          const stateCopy = [...state]
          stateCopy.splice(itemIndex, 1)
          return stateCopy
        }
        return [...state]
      default:
        throw new Error();
    }
  }, [])

  const addNewGem = (event: ChangeEvent<{}>, value: string | null) => {
    modifyGem({
      type: 'add',
      gem: value,
    })
  }

  const handleCharacterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCharacter(event.target.value as CharacterType)
  }

  const handleGroupChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGroupCharacters(event.target.value as CharacterType[])
  }

  return (
    <div className="app">
      <div className="body">
        <div id="controls">
          <div id="class-picker">
            <FormControl className="form-control-class-picker">
              <InputLabel>Character</InputLabel>
              <Select value={character} onChange={handleCharacterChange}>
                <MenuItem value="Scion">Scion</MenuItem>
                <MenuItem value="Witch">Witch</MenuItem>
                <MenuItem value="Shadow">Shadow</MenuItem>
                <MenuItem value="Ranger">Ranger</MenuItem>
                <MenuItem value="Duelist">Duelist</MenuItem>
                <MenuItem value="Marauder">Marauder</MenuItem>
                <MenuItem value="Templar">Templar</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div id="gem-search-bar">
            <Autocomplete
              options={gemNames}
              onChange={addNewGem}
              value={null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type here to search for gems"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />
          </div>
          <div id="group-picker">
            <FormControl className="form-control-group-picker">
              <InputLabel>Group Characters</InputLabel>
              <Select multiple value={groupCharacters} onChange={handleGroupChange}>
                <MenuItem value="Scion">Scion</MenuItem>
                <MenuItem value="Witch">Witch</MenuItem>
                <MenuItem value="Shadow">Shadow</MenuItem>
                <MenuItem value="Ranger">Ranger</MenuItem>
                <MenuItem value="Duelist">Duelist</MenuItem>
                <MenuItem value="Marauder">Marauder</MenuItem>
                <MenuItem value="Templar">Templar</MenuItem>
              </Select>
              <FormHelperText>Other classes in your leveling group</FormHelperText>
            </FormControl>
          </div>
        </div>
        <div className="active-gems">
          {activeGems.map(gem => (
            <Button
              className="mui-button"
              key={gem}
              variant="outlined"
              color="primary"
              onClick={() => modifyGem({ type: 'remove', gem })}
            >
              <CancelIcon className="remove-button" />
              { gem }
            </Button>
          ))}
        </div>
        <div id="gem-details">
          {activeGems.map(gem => (
            <GemDetailsCard
              {...gemMap[gem]}
              key={gem}
              playerCharacter={character}
              groupCharacters={groupCharacters}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
