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

function getPokemonProperty(pokemon, property, dex) {
  switch (property) {
  case 'num': return pokemon.num;
  case 'species': 
  case 'name':
  case 'speciesid':
    return pokemon.speciesid;
  case 'basespecies': return dex.getTemplate(pokemon.baseSpecies).speciesid;
  case 'gen': return pokemon.gen;
  case 'ability': return pokemon.abilities;
  case 'type': 
  case 'types':
    return pokemon.types;
  case 'monotype':  
    return (pokemon.types.length === 1 ? alphanumeric(pokemon.types[0]) : null);
  case 'move': return new Learnset(pokemon, dex).movesArray();
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

const alolaDex = {"Rowlet":1, "Dartrix":1, "Decidueye":1, "Litten":1, "Torracat":1, "Incineroar":1, "Popplio":1, "Brionne":1, "Primarina":1, "Pikipek":1, "Trumbeak":1, "Toucannon":1, "Yungoos":1, "Gumshoos":1, "Rattata-Alola":1, "Raticate-Alola":1, "Caterpie":1, "Metapod":1, "Butterfree":1, "Ledyba":1, "Ledian":1, "Spinarak":1, "Ariados":1, "Pichu":1, "Pikachu":1, "Raichu-Alola":1, "Grubbin":1, "Charjabug":1, "Vikavolt":1, "Bonsly":1, "Sudowoodo":1, "Happiny":1, "Chansey":1, "Blissey":1, "Munchlax":1, "Snorlax":1, "Slowpoke":1, "Slowbro":1, "Slowking":1, "Wingull":1, "Pelipper":1, "Abra":1, "Kadabra":1, "Alakazam":1, "Meowth-Alola":1, "Persian-Alola":1, "Magnemite":1, "Magneton":1, "Magnezone":1, "Grimer-Alola":1, "Muk-Alola":1, "Growlithe":1, "Arcanine":1, "Drowzee":1, "Hypno":1, "Makuhita":1, "Hariyama":1, "Smeargle":1, "Crabrawler":1, "Crabominable":1, "Gastly":1, "Haunter":1, "Gengar":1, "Drifloon":1, "Drifblim":1, "Misdreavus":1, "Mismagius":1, "Zubat":1, "Golbat":1, "Crobat":1, "Diglett-Alola":1, "Dugtrio-Alola":1, "Spearow":1, "Fearow":1, "Rufflet":1, "Braviary":1, "Vullaby":1, "Mandibuzz":1, "Mankey":1, "Primeape":1, "Delibird":1, "Oricorio":1, "Cutiefly":1, "Ribombee":1, "Petilil":1, "Lilligant":1, "Cottonee":1, "Whimsicott":1, "Psyduck":1, "Golduck":1, "Magikarp":1, "Gyarados":1, "Barboach":1, "Whiscash":1, "Machop":1, "Machoke":1, "Machamp":1, "Roggenrola":1, "Boldore":1, "Gigalith":1, "Carbink":1, "Sableye":1, "Rockruff":1, "Lycanroc":1, "Spinda":1, "Tentacool":1, "Tentacruel":1, "Finneon":1, "Lumineon":1, "Wishiwashi":1, "Luvdisc":1, "Corsola":1, "Mareanie":1, "Toxapex":1, "Shellder":1, "Cloyster":1, "Bagon":1, "Shelgon":1, "Salamence":1, "Lillipup":1, "Herdier":1, "Stoutland":1, "Eevee":1, "Vaporeon":1, "Jolteon":1, "Flareon":1, "Espeon":1, "Umbreon":1, "Leafeon":1, "Glaceon":1, "Sylveon":1, "Mudbray":1, "Mudsdale":1, "Igglybuff":1, "Jigglypuff":1, "Wigglytuff":1, "Tauros":1, "Miltank":1, "Surskit":1, "Masquerain":1, "Dewpider":1, "Araquanid":1, "Fomantis":1, "Lurantis":1, "Morelull":1, "Shiinotic":1, "Paras":1, "Parasect":1, "Poliwag":1, "Poliwhirl":1, "Poliwrath":1, "Politoed":1, "Goldeen":1, "Seaking":1, "Feebas":1, "Milotic":1, "Alomomola":1, "Fletchling":1, "Fletchinder":1, "Talonflame":1, "Salandit":1, "Salazzle":1, "Cubone":1, "Marowak-Alola":1, "Kangaskhan":1, "Magby":1, "Magmar":1, "Magmortar":1, "Stufful":1, "Bewear":1, "Bounsweet":1, "Steenee":1, "Tsareena":1, "Comfey":1, "Pinsir":1, "Oranguru":1, "Passimian":1, "Goomy":1, "Sliggoo":1, "Goodra":1, "Castform":1, "Wimpod":1, "Golisopod":1, "Staryu":1, "Starmie":1, "Sandygast":1, "Palossand":1, "Cranidos":1, "Rampardos":1, "Shieldon":1, "Bastiodon":1, "Archen":1, "Archeops":1, "Tirtouga":1, "Carracosta":1, "Phantump":1, "Trevenant":1, "Nosepass":1, "Probopass":1, "Pyukumuku":1, "Chinchou":1, "Lanturn":1, "Type: Null":1, "Silvally":1, "Zygarde":1, "Trubbish":1, "Garbodor":1, "Skarmory":1, "Ditto":1, "Cleffa":1, "Clefairy":1, "Clefable":1, "Minior":1, "Beldum":1, "Metang":1, "Metagross":1, "Porygon":1, "Porygon2":1, "Porygon-Z":1, "Pancham":1, "Pangoro":1, "Komala":1, "Torkoal":1, "Turtonator":1, "Togedemaru":1, "Elekid":1, "Electabuzz":1, "Electivire":1, "Geodude-Alola":1, "Graveler-Alola":1, "Golem-Alola":1, "Sandile":1, "Krokorok":1, "Krookodile":1, "Trapinch":1, "Vibrava":1, "Flygon":1, "Gible":1, "Gabite":1, "Garchomp":1, "Klefki":1, "Mimikyu":1, "Bruxish":1, "Drampa":1, "Absol":1, "Snorunt":1, "Glalie":1, "Froslass":1, "Sneasel":1, "Weavile":1, "Sandshrew-Alola":1, "Sandslash-Alola":1, "Vulpix-Alola":1, "Ninetales-Alola":1, "Vanillite":1, "Vanillish":1, "Vanilluxe":1, "Snubbull":1, "Granbull":1, "Shellos":1, "Gastrodon":1, "Relicanth":1, "Dhelmise":1, "Carvanha":1, "Sharpedo":1, "Wailmer":1, "Wailord":1, "Lapras":1, "Exeggcute":1, "Exeggutor-Alola":1, "Jangmo-o":1, "Hakamo-o":1, "Kommo-o":1, "Emolga":1, "Scyther":1, "Scizor":1, "Murkrow":1, "Honchkrow":1, "Riolu":1, "Lucario":1, "Dratini":1, "Dragonair":1, "Dragonite":1, "Aerodactyl":1, "Tapu Koko":1, "Tapu Lele":1, "Tapu Bulu":1, "Tapu Fini":1, "Cosmog":1, "Cosmoem":1, "Solgaleo":1, "Lunala":1, "Nihilego":1, "Buzzwole":1, "Pheromosa":1, "Xurkitree":1, "Celesteela":1, "Kartana":1, "Guzzlord":1, "Necrozma":1, "Magearna":1, "Marshadow":1
};

const gbuBanlist = {"Mewtwo":1, "Mew":2, "Lugia":1, "Ho-Oh":1, "Celebi":2, "Kyogre":1, "Groudon":1, "Rayquaza":1, "Jirachi":2, "Deoxys":2, "Dialga":1, "Palkia":1, "Giratina":1, "Phione":2, "Manaphy":2, "Darkrai":2, "Shaymin":2, "Arceus":2, "Victini":2, "Reshiram":1, "Zekrom":1, "Kyurem":1, "Keldeo":2, "Meloetta":2, "Genesect":2, "Greninja-Ash":2, "Xerneas":1, "Yveltal":1, "Zygarde":1, "Diancie":2, "Hoopa":2, "Volcanion":2, "Cosmog":1, "Cosmoem":1, "Solgaleo":1, "Lunala":1, "Necrozma":1, "Magearna":2, "Marshadow":2, "Zeraora":2};

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
      name: "alola",
      value: false,
      desc: "Only consider Pokemon present in the Sun/Moon Regional Pokedex."
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
      desc: "Only consider Pokémon that are legal in a National Pokedex VGC format."
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
      let template = dex.getTemplate(pokemon);
      if (!flags.cap && template.num <= 0) {
        continue;
      }
      if (flags.alola) {
        if (!(template.baseSpecies in alolaDex) && !(template.species in alolaDex)) {
          continue;
        }
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
        let pokemonProperty = getPokemonProperty(template, parameter.key, dex);
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
      } else if (Object.keys(speciesMatch).length > 1) {
        speciesMatch[0] = null;
      }
      
      if (maxMatches != parameterList.length) {
        sendMsg.push("No Pokémon that satisfies ALL parameters found.");
      }
    }
    
    let verifyMatch = false;
    let fits = Object.keys(speciesMatch).sort((a, b) => { return b - a; });
    for (let i = 0; i < fits.length; i++) {
      let fitsIndex = parseInt(fits[i]);
      if (!speciesMatch[fitsIndex]) { continue; }
      verifyMatch = true;
      sendMsg.push(`Pokémon that satisfy ${fitsIndex} parameter${fitsIndex === 1 ? '' : 's'}: (${speciesMatch[fitsIndex]})`);
      for (let sortIndex = 0; sortIndex < sortParameters.length; sortIndex++) {
        let sorter = sortParameters[sortIndex];
        speciesMatch[fitsIndex].sort(function(aa, bb) {
          let a = getPokemonProperty(dex.getTemplate(aa), sorter.value, dex);
          let b = getPokemonProperty(dex.getTemplate(bb), sorter.value, dex);
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

