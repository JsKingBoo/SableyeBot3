'use strict';

module.exports = {
  desc: "Number of events a Pokemon has, or the set details of a specific event.",
  longDesc: "Returns event information of a Pokemon. If no event ID is specified, then the number of events that a Pokemon has is listed, if it has been included in an event. If an event ID is apecified, information regarding the Pokemon distributed during the event is retrieved. Event ID index starts at 0.",
  usage: "<Pokemon name>, [event ID]",
  aliases: ['events'],
  options: [],
  upgrade: '`//event <Pokemon name>[, event ID]` - `/event pokemon: <Pokemon name> [event: <event ID>]`',
  process: async function(msg, flags, dex) {
    if (msg.length === 0){
      return null;
    }

    let sendMsg = [];
    let pokemon = dex.species.get(msg[0]);
    let eventId = (msg.length > 1 ? parseInt(msg[1]) : -1);
    if (!pokemon || !pokemon.exists) {
      pokemon = dex.dataSearch(msg[0], ['Pokedex']);
      if (!pokemon) {
        return `No Pokémon ${msg[0]} found.`;
      }
      sendMsg.push(`No Pokémon ${msg[0]} found. Did you mean ${pokemon[0].name}?`);
      pokemon = dex.species.get(pokemon[0].name);
    }
    if (pokemon.gen > dex.gen) {
      return `${pokemon.species} did not exist in gen${dex.gen}; it was introduced in gen${pokemon.gen}.`;
    }

    let eventList = dex.data.Learnsets[pokemon.id].eventData;

    if (!eventList || eventList.length === 0) {
      return `${pokemon.name} does not have any events.`;
    }
    if (eventList.length === 1) {
      eventId = 0;
    }
    if (eventId >= 0) {
      eventId = Math.min(eventList.length - 1, eventId);
    }

    if (eventId < 0) {
      return `${pokemon.name} has ${eventList.length} events. Include the event ID to see specific event details. (0-${eventList.length-1})`;
    }

    let eventData = eventList[eventId];

    sendMsg = sendMsg.concat([
      `${pokemon.name} (Event ${eventId})`,
      `Gen${eventData.generation}; level ${eventData.level}`,
      `${eventData.pokeball ? dex.items.get(eventData.pokeball).name : "-"}; ${(eventData.gender || "-")}; ${(eventData.nature || "-")}`,
      `Hidden ability: ${eventData.isHidden ? "yes" : "no"}; Shiny: ${eventData.shiny ? "yes" : "no"}`
    ]);

    if (eventData.ivs) {
      let IVs = Object.keys(eventData.ivs);
      for (let i = 0; i < IVs.length; i++){
        IVs[i] = `${IVs[i]}:${eventData.ivs[IVs[i]]}`;
      }
      sendMsg.push(`IVs: ${IVs.join(", ")}`);
    }
    if (eventData.perfectIVs != undefined) {
      sendMsg.push(`Number of perfect IVs: ${eventData.perfectIVs}`);
    }
    sendMsg.push("Moves:");
    for (let i = 0; i < eventData.moves.length; i++){
      sendMsg.push(` - ${dex.moves.get(eventData.moves[i]).name}`);
    }
    return sendMsg;

  }
};
