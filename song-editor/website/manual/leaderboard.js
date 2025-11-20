/*
  Spentine 20251120
  I'm sorry for the obnoxious code to get EditorConfig data
  I don't use TS pmo 💔
  I'm also sorry for using 2 space indentation
*/

const presetCategories = EditorConfig.EditorConfig.presetCategories;

function getCounts() {
  // get the number of presets with "'s" in presetCategories
  
  const counts = {};
  
  // helper function to increment count
  function incrementCount(name, count) {
    counts[name] ??= 0;
    counts[name] += count;
  }
  
  // user categories
  for (const category of presetCategories) {
    // check if it has "'s"
    if (!category.name.includes("'s")) continue;
    
    // get the name (the part before the 's)
    const name = category.name.split("'s")[0];
    
    // get the number of presets in this category
    const presetCounts = category.presets.length;
    
    incrementCount(name, presetCounts);
  }
  
  // find the community presets
  const communityPresetNames = [
    "Community Presets",
    "Community Novelty Presets",
    "Community Drum Presets",
    "Community Novelty Drum Presets",
  ];
  const presets = [];
  for (const category of presetCategories) {
    // check if community preset
    if (communityPresetNames.includes(category.name)) {
      // add all presets to presets
      for (const preset of category.presets) {
        presets.push(preset);
      }
    }
  }
  
  for (const preset of presets) {
    // check if it has " - "
    if (!preset.name.includes(" - ")) continue;
    
    // get the name (the part after " - ")
    const name = preset.name.split(" - ")[1];
    incrementCount(name, 1);
  }
  
  let people = Object.keys(counts); // the people
  people.sort((a, b) => counts[b] - counts[a]); // sort desc count
  people = people.map((name) => { // map to objects
    return {name: name, count: counts[name]}
  });
  
  return people;
}

function constructTable(counts) {
  const table = document.createElement("table");
  const head = document.createElement("thead");
  head.innerHTML = `
    <tr>
      <th>Rank #</th>
      <th>Submitter</th>
      <th>Presets Submitted</th>
    </tr>
  `;
  const body = document.createElement("tbody");
  
  // add rows
  for (let i = 0; i < counts.length; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${counts[i].name}</td>
      <td>${counts[i].count}</td>
    `;
    body.appendChild(row);
  }
  table.appendChild(head);
  table.appendChild(body);
  return table;
}

function main() {
  // get counts
  const counts = getCounts();
  
  // construct table
  const table = constructTable(counts);
  document.getElementById("table-insert").appendChild(table);
  
  // extra info
  console.log(presetCategories);
  console.log(counts);
}

main();