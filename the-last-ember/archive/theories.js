/* Theories. kind: "interpretation" = text-supported but unconfirmed; "speculation" = needs evidence.
   Nothing here is an author statement. evidence/counter: [text, level, source]. */
(window.LE_DATA = window.LE_DATA || {}).theories = [
{ id:"related-gas", title:"The gas at Area 78 and the gas after the rocket may be connected", level:2, kind:"interpretation",
  confirmation:"Unconfirmed — not stated in the text",
  explain:"Both books mention a gas released in connection with the secret and with the rocket. A reader may ask whether they are the same event or related.",
  evidence:[["Pedro says gas is released during the attack at Area 78.",1,"O 39"],["Carl sees a green gas cloud after the rocket.",2,"B 4"]],
  counter:[["No passage says the two are linked, and the rocket's origin is not stated.",2,"B 4"]],
  chars:["pedro","carl"], events:["area78-attack-gas","green-gas"], mysteries:["area78-secret"] },
{ id:"marla-secret-theory", title:"Marla's “secret” may relate to her hidden parentage", level:2, kind:"speculation",
  confirmation:"Unresolved speculation",
  explain:"Sky's letter says Marla is unsafe if she learns who her parents are. Marla later mentions a secret she will never know. Whether they are the same matter is not stated.",
  evidence:[["Sky's letter about Marla's real parents.",1,"O 16"],["Marla's remark about a secret.",2,"B 7"]],
  counter:[["Marla gives no detail and the text never connects the two.",2,"B 7"]],
  chars:["marla","sky"], events:["skys-letter","carl-finds-marla"], mysteries:["marla-parents","marla-secret"] },
{ id:"jk-coma", title:"The Minister's coma may be tied to his Area 78 denial", level:3, kind:"speculation",
  confirmation:"Unresolved speculation",
  explain:"The Minister denies Area 78 involvement on TV, and later falls into a coma for an unknown reason. Readers may ask if the two are related.",
  evidence:[["His TV denial.",3,"A 10–12"],["His coma.",1,"O 63"]],
  counter:[["No passage links the denial to the coma.",3,"O 63"]],
  chars:["minister"], events:["jk-interview","minister-coma"], mysteries:["minister-coma-cause"] },
{ id:"number-85", title:"Does the number 85 recur on purpose?", level:3, kind:"speculation",
  confirmation:"Unresolved speculation — may be coincidence",
  explain:"The number 85 appears in several places: a New Year toast, the year on the files, and a guard's badge.",
  evidence:[["A New Year announcement says “85 years.”",1,"O 34"],["Pedro cites the year 85 when describing the files.",3,"A 25"],["A guard's badge reads 85.",2,"B 74"]],
  counter:[["The uses are different and no passage connects them.",3,"A 25"]],
  chars:["pedro"], events:[], mysteries:["area78-secret","walled-settlement"] }
];
