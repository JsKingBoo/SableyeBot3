'use strict';

const path = require('path');
const Learnset = require(path.resolve(__dirname, '../../utils/Learnset.js'));

const operatorCompare = {
  '>': (a, b) => { return a > b; },
  '>=': (a, b) => { return a >= b; },
  '=': (a, b) => { return a === b; },
  '==': (a, b) => { return a === b; },
  '<=': (a, b) => { return a <= b; },
  '<': (a, b) => { return a < b; },
  '<>': (a, b) => { return a !== b; },
  '!=': (a, b) => { return a !== b; }
};

function alphanumeric(str) {
  return str.toLowerCase().replace(/[^0-9a-z]/gi, '');
}

function isMultiValue(obj) {
  return (obj.constructor === [].constructor || obj.constructor === {}.constructor);
}

function multiValueChecker(operator, multiValue, value) {
  /*
        Iterates through a list to check if it's equal. "=" is treated as OR while "<>" is treated as AND
        For example, if abilities = [Magic Guard, Unaware] then = will return true when at least one matches, while <> returns false if at least one of them match.
        */
  value = alphanumeric(value+'');
  let isEqual = operatorCompare[operator](1, 1);
  if (multiValue.constructor === [].constructor) {
    for (let i = 0; i < multiValue.length; i++) {
      if (alphanumeric(multiValue[i]+'') === value) {
        return isEqual;
      }
    }
  } else if (multiValue.constructor === {}.constructor) {
    for (let i in multiValue) {
      if (alphanumeric(multiValue[i]) === value) {
        return isEqual;
      }
    }
  } else {
    //Not a multivalue
    return null;
  }
  return !isEqual;
}

const falseyValues = {
  'false': true,
  'null': true,
  'undefined': true,
  'no': true
};

const truthyValues = {
  'true': true,
  'exists': true,
  'defined': true,
  'yes': true
};

function getEffectiveness(defending, attacking, dex) {
  if (defending.length > 1) {
    return getEffectiveness([defending[0]], attacking, dex) + getEffectiveness([defending[1]], attacking, dex);
  }
  let effectiveness = dex.data.TypeChart[defending].damageTaken[attacking];
  if (effectiveness === 1) {
    return 1;
  } else if (effectiveness === 2) {
    return -1;
  } else if (effectiveness === 3) {
    return -9;
  } else {
    return 0;
  }
}

function getPokemonProperty(pokemon, property, dex, flags) {
  switch (property) {
    case 'num': return pokemon.num;
    case 'species':
    case 'name':
    case 'speciesid':
      return pokemon.speciesid;
    case 'basespecies': return dex.getSpecies(pokemon.baseSpecies).speciesid;
    case 'gen': return pokemon.gen;
    case 'ability': return pokemon.abilities;
    case 'type':
    case 'types':
      return pokemon.types;
    case 'monotype':
      return (pokemon.types.length === 1 ? alphanumeric(pokemon.types[0]) : null);
    case 'move': return new Learnset(pokemon, dex).movesArray(!flags.vgc);
    case 'hp':
    case 'health':
      return pokemon.baseStats.hp;
    case 'atk':
    case 'attack':
      return pokemon.baseStats.atk;
    case 'def':
    case 'defense':
      return pokemon.baseStats.def;
    case 'spa':
    case 'specialattack':
      return pokemon.baseStats.spa;
    case 'spd':
    case 'specialdefense':
      return pokemon.baseStats.spd;
    case 'spe':
    case 'speed':
      return pokemon.baseStats.spe;
    case 'bst': return pokemon.baseStats.hp + pokemon.baseStats.atk + pokemon.baseStats.def + pokemon.baseStats.spa + pokemon.baseStats.spd + pokemon.baseStats.spe;
    case 'prevo': return pokemon.prevo || null;
    case 'evos': return pokemon.evos;
    case 'hasprevo': return !!pokemon.prevo;
    case 'hasevo':
    case 'nfe':
      return (pokemon.evos.length > 0);
    case 'evolevel': return pokemon.evoLevel || null;
    case 'heightm':
    case 'height':
      return pokemon.heightm;
    case 'weightkg':
    case 'weight':
      return pokemon.weightkg;
    case 'bmi': return Math.round(pokemon.weightkg/(pokemon.heightm*pokemon.heightm));
    case 'color': return pokemon.color.toLowerCase();
    case 'egggroups':
    case 'egggroup':
    case 'egg':
      return pokemon.eggGroups;
    case 'forme': return pokemon.forme.toLowerCase();
    case 'formeletter': return pokemon.formeLetter.toLowerCase();
    case 'otherformes': return pokemon.otherFormes;
    case 'otherforms': return pokemon.otherForms;
    case 'tier': return pokemon.tier.toLowerCase();
    case 'resist': return '*';
    default: return null;
  }
}

const gbuBanlist = {"Mewtwo":1, "Mew":2, "Lugia":1, "Ho-Oh":1, "Celebi":2, "Kyogre":1, "Groudon":1, "Rayquaza":1, "Jirachi":2, "Deoxys":2, "Dialga":1, "Palkia":1, "Giratina":1, "Phione":2, "Manaphy":2, "Darkrai":2, "Shaymin":2, "Arceus":2, "Victini":2, "Reshiram":1, "Zekrom":1, "Kyurem":1, "Keldeo":2, "Meloetta":2, "Genesect":2, "Greninja-Ash":2, "Xerneas":1, "Yveltal":1, "Zygarde":1, "Diancie":2, "Hoopa":2, "Volcanion":2, "Cosmog":1, "Cosmoem":1, "Solgaleo":1, "Lunala":1, "Necrozma":1, "Magearna":2, "Marshadow":2, "Zeraora":2, "Meltan":2, "Melmetal":2, "Zacian":1, "Zamazenta":1, "Eternatus":1, "Zarude": 2, "Calyrex": 1, "Calyrex-Shadow": 1, "Calyrex-Ice":1};

module.exports = {
  desc: "Search Pokémon based on user-inputted parameters.",
  longDesc: [
    "Search Pokémon based on user-inputted parameters. Availible parameters are:",
    'num - Pokedex index number. e.g. "num=302",',
    'species - Species name. e.g. "species=sableye",',
    'baseSpecies - Base form, if applicable. e.g. "baseSpecies=rotom",',
    'gen - Generation introduced. e.g. "gen=5",',
    'ability - Ability. e.g. "ability=prankster",',
    'type - Pokémon typing. e.g. "type=ghost",',
    'monotype - Pokémon typing, except it does not have a secondary typing. e.g. "monotype=ghost",',
    'move - Move from learnset. Sketch is ignored. e.g. "move=will o wisp",',
    'hp - Base HP stat. e.g. "hp=50",',
    'atk - Base ATK stat. e.g. "atk=75",',
    'def - Base DEF stat. e.g. "def=75",',
    'spa - Base SPA stat. e.g. "spa=65",',
    'spd - Base SPD stat. e.g. "spd=65",',
    'spe - Base SPE stat. e.g. "spe=50",',
    'bst - Base stat total. e.g. "bst=380",',
    'prevo - Direct previous evolution. Unevolved Pokémon are ignored. e.g. "prevo=wurmple",',
    'evos - Direct next possible evolutions. Pokémon that cannot evolve further are ignored. e.g. "evos=venusaur",',
    'hasPrevo - Whether a Pokémon has a prevolution. Non-false values are treated as true. e.g. "hasPrevo=1",',
    'hasEvo - Whether a Pokémon has an evolution. Non-false values are treated as true. e.g. "hasEvo=1",',
    'evoLevel - Minimum possible level of an evolved Pokémon. Unevolved Pokémon are ignored. e.g. "evoLevel=16",',
    'heightm - Height in meters. e.g. "heightm=0.5",',
    'weightkg - Weight in kilograms. e.g. "weightkg=11",',
    'color - Color. Options are red, blue, yellow, green, black, brown, purple, gray, white, and pink. e.g. "color=purple",',
    'eggGroups - Egg group. e.g. "eggGroups=humanlike",',
    'forme - Forme. Pokémon in their base forme are ignored. e.g. "forme=Mega",',
    'formeLetter - Forme letter. Pokémon in their base formee are ignored. e.g. "formeLetter=m",',
    'otherFormes - Other formes. Pokémon without other formes are ignored. e.g. "otherFormes=rotomwash",',
    'otherForms - Other forms. Not to be confused with otherFormes. Visual-only forme change. e.g. "otherFormes=gastrodoneast",',
    'threshold - Number of parameters that the Pokémon must fulfill, not including this one or "sort". e.g. "threshold>=2",',
    'sort - The argument that the list will be sorted by in ascending order. e.g. "sort=atk",',
    'EXAMPLE: "//filter hp=50,atk>=75,color=purple,formeLetter=m,eggGroups=humanlike"',
    'NOTE: Some move and/or ability combinations are not compatible. Despite this, the Pokémon may still appear because they do satisfy the two or more requirements. For example, "//filter ability=unaware,move=softboiled" brings up Clefable even though Unaware Clefable cannot learn Soft-boiled.'
  ],
  usage: "<parameters...>",
  options: [
    {
      name: "cap",
      value: false,
      desc: "Includes non-canon Pokémon."
    },
    {
      name: "verbose",
      value: false,
      desc: "Output all Pokémon that satisfy at least one parameter."
    },
    {
      name: "gscup",
      value: false,
      desc: "Only consider GS Cup Restricted Pokémon."
    },
    {
      name: "vgc",
      value: false,
      desc: "Only consider Pokémon and moves that are legal in a National Pokedex VGC format."
    },
    {
      name: "natdex",
      value: false,
      desc: "Consider the entire National Pokedex."
    },
  ],
  regex: /[^0-9a-z\-=<>!]/gi,
  process: async function(msg, flags, dex) {
    if (msg.length === 0) {
      return null;
    }

    let parameterList = [];
    let sortParameters = [];
    let threshholdObject = undefined;
    let sendMsg = [];

    //Parse parameters
    let alphabet = 'qwertyuiopasdfghjklzxcvbnm'.split('');
    let validKeyChars = {};
    let validOperatorChars = {'=': 1, '<': 1, '>': 1, '!': 1};
    for (let i = 0; i < alphabet.length; i++) {
      validKeyChars[alphabet[i]] = 1;
    }

    for (let parameterIndex = 0; parameterIndex < msg.length; parameterIndex++) {
      let parameter = msg[parameterIndex];
      let parameterTemplate = {'key': '', 'value': '', 'operator': '', 'hasCustomParsing': false, 'verified': false };
      let valid = -1;
      let charIndex = 0;
      let charAtIndex = parameter.charAt(charIndex);

      while (validKeyChars[charAtIndex]) {
        parameterTemplate.key += charAtIndex;
        charIndex++;
        charAtIndex = parameter.charAt(charIndex);
        if (charIndex >= parameter.length) {
          valid = 1;
          break;
        }
      }
      if (parameterTemplate.key.length === 0) {
        valid = 1;
      }

      while (validOperatorChars[charAtIndex] && valid < 0) {
        parameterTemplate.operator += charAtIndex;
        charIndex++;
        charAtIndex = parameter.charAt(charIndex);
        if (charIndex >= parameter.length) {
          valid = 2;
          break;
        }
      }
      if (!operatorCompare[parameterTemplate.operator] && valid < 0) {
        valid = 2;
      }

      parameterTemplate.value = parameter.slice(charIndex);
      if (parameterTemplate.value.length === 0 && valid < 0) {
        valid = 3;
      }
      if (!isNaN(parameterTemplate.value)) {
        parameterTemplate.value = parseInt(parameterTemplate.value);
      } else {
        parameterTemplate.value = alphanumeric(parameterTemplate.value);
      }
      if (falseyValues[parameterTemplate.value]) {
        parameterTemplate.value = false;
      } else if (truthyValues[parameterTemplate.value]) {
        parameterTemplate.value = true;
      }

      if (valid > 0) {
        let errorMessage = "";
        switch (valid) {
          case 3:
            errorMessage = "Argument value not given.";
            break;
          case 2:
            errorMessage = "Argument operator not found.";
            break;
          case 1:
          default:
            errorMessage = "Argument key not valid.";
            break;
        }
        sendMsg.push(`Ignoring argument "[${parameterIndex+1}] ${parameter}" due to parsing error: ${errorMessage}`);
        continue;
      }

      let customs = {'threshold': 1, 'sort': 1};
      if (customs[parameterTemplate.key]) {
        parameterTemplate.hasCustomParsing = true;
      }

      if (parameterTemplate.key === 'threshold' && threshholdObject === undefined) {
        threshholdObject = parameterTemplate;
        threshholdObject.value = parseInt(threshholdObject.value);
        sendMsg.push(`[${(parameterIndex+1)}] Looking for Pokémon that satisfy ${threshholdObject.operator}${threshholdObject.value} argument(s).`);
      } else if (parameterTemplate.key === 'sort') {
        parameterTemplate.operator = "=";
        sortParameters.push(parameterTemplate);
        sendMsg.push(`[${(parameterIndex+1)}] Sorting Pokémon by argument key ${parameterTemplate.value}.`);
      } else {
        parameterList.push(parameterTemplate);
        sendMsg.push(`[${(parameterIndex+1)}] ${parameterTemplate.key}${parameterTemplate.operator}${parameterTemplate.value}`);
      }
    }

    sendMsg.push("~~");

    if (parameterList.length === 0) {
      sendMsg.push("No valid arguments given.");
      return sendMsg;
    }

    //Iterate through all Pokémon, then place them in buckets determined by how many parameters they satisfy
    let speciesMatch = {};
    let maxMatches = -1;
    for (let pokemon in dex.data.Pokedex) {
      let template = dex.getSpecies(pokemon);
      if (!flags.cap && template.num <= 0) {
        continue;
      }
      if (!flags.natdex && template.tier === "Illegal") {
        continue;
      }
      if (flags.vgc) {
        if ((template.baseSpecies in gbuBanlist) || (template.species in gbuBanlist)) {
          continue;
        }
      }
      if (flags.gscup) {
        if (!(gbuBanlist[template.baseSpecies] === 1) && !(gbuBanlist[template.species] === 1)) {
          continue;
        }
      }
      if (template.gen > dex.gen) {
        continue;
      }

      let fitParameters = 0;
      for (let parameterIndex = 0; parameterIndex < parameterList.length; parameterIndex++) {
        let parameter = parameterList[parameterIndex];
        let pokemonProperty = getPokemonProperty(template, parameter.key, dex, flags);
        if (pokemonProperty === null) {
          continue;
        }
        parameter.verified = true;
        let parameterCheck = false;
        if (isMultiValue(pokemonProperty)) {
          parameterCheck = multiValueChecker(parameter.operator, pokemonProperty, parameter.value);
        } else if (pokemonProperty === "*") {
          if (parameter.key === "resist") {
            let resists = (getEffectiveness(template.types, parameter.value.charAt(0).toUpperCase() + parameter.value.slice(1), dex) < 0);
            parameterCheck = operatorCompare[parameter.operator](resists, true);
          }
        } else {
          parameterCheck = operatorCompare[parameter.operator](pokemonProperty, parameter.value);
        }
        if (parameterCheck) {
          fitParameters++;
        }
      }

      if (!threshholdObject || operatorCompare[threshholdObject.operator](fitParameters, threshholdObject.value)) {
        if (!speciesMatch[fitParameters]) {
          speciesMatch[fitParameters] = [];
        }
        speciesMatch[fitParameters].push(template.name);
        maxMatches = Math.max(maxMatches, fitParameters);
      }
    }

    for (let parameterIndex = 0; parameterIndex < parameterList.length; parameterIndex++) {
      let parameter = parameterList[parameterIndex];
      if (!parameter.verified) {
        sendMsg.push(`WARNING: Could not verify that ${parameter.key}${parameter.operator}${parameter.value} is valid.`);
      }
    }

    if (!threshholdObject) {
      if (!flags.verbose) {
        for (let i in speciesMatch) {
          if (parseInt(i) !== maxMatches) {
            speciesMatch[i] = null;
          }
        }
        speciesMatch[0] = null;
      } else {
        speciesMatch[0] = null;
      }

      if (maxMatches != parameterList.length) {
        sendMsg.push("No Pokémon that satisfies all parameters found.");
        if (maxMatches > 0 && !flags.verbose) {
          sendMsg.push("Use \"//filter " + msg.join(", ") + ", threshold="
            + maxMatches + "\" (without quotes) to get all pokemon that match "
            + maxMatches + " of the parameters.");
          return sendMsg;
        }
      }
    }

    let verifyMatch = false;
    let fits = Object.keys(speciesMatch).sort((a, b) => { return b - a; });
    for (let i = 0; i < fits.length; i++) {
      let fitsIndex = parseInt(fits[i]);
      if (!speciesMatch[fitsIndex]) { continue; }
      verifyMatch = true;
      sendMsg.push(`Pokémon that satisfy ${fitsIndex} parameter${fitsIndex === 1 ? '' : 's'}: (${speciesMatch[fitsIndex].length})`);
      for (let sortIndex = 0; sortIndex < sortParameters.length; sortIndex++) {
        let sorter = sortParameters[sortIndex];
        speciesMatch[fitsIndex].sort(function(aa, bb) {
          let a = getPokemonProperty(dex.getSpecies(aa), sorter.value, dex, flags);
          let b = getPokemonProperty(dex.getSpecies(bb), sorter.value, dex, flags);
          if (typeof a === "number" || typeof b === "number") {
            return b - a;
          } else if (typeof a === "string" || typeof b === "string") {
            return a.localeCompare(b);
          } else {
            return 0;
          }
        });
      }
      sendMsg.push(speciesMatch[fitsIndex].join(", "));
      sendMsg.push('~~');
    }
    if (!verifyMatch) {
      sendMsg[sendMsg.length - 1] = "No Pokémon satisfy the search criteria";
    }

    return sendMsg;

  }
};

