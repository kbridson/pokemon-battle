const form = document.querySelector("#battle-form");
const first = document.querySelector("#first");
const second = document.querySelector("#second");
const message = document.querySelector("#message");
const count = document.querySelector("#count");
const log = document.querySelector("#log");
const clear = document.querySelector("#clear");

function updateCount() {
  const total = log.querySelectorAll(".battle").length;
  count.textContent = `${total} battles`;
}

function totalStats(pokemon) {
  let total = 0;
  for (const stat of pokemon.stats) {
    total += stat.base_stat;
  }
  return total;
}

function fighter(pokemon, won) {
  const box = document.createElement("div");
  box.className = "fighter";
  const image = document.createElement("img");
  image.setAttribute("src", pokemon.sprites.front_default);
  image.setAttribute("alt", pokemon.name);
  box.appendChild(image);
  const name = document.createElement("h3");
  name.textContent = pokemon.name;
  if (won) {
    name.style.color = "green";
  }
  box.appendChild(name);
  const types = document.createElement("p");
  types.textContent = pokemon.types.map((t) => t.type.name).join(", ");
  box.appendChild(types);
  const stats = document.createElement("p");
  stats.textContent = `Total stats: ${totalStats(pokemon)}`;
  box.appendChild(stats);
  return box;
}

function addBattle(a, b) {
  const totalA = totalStats(a);
  const totalB = totalStats(b);
  const battle = document.createElement("div");
  battle.className = "battle";
  const result = document.createElement("h2");
  if (totalA === totalB) {
    result.textContent = "It's a tie!";
  } else {
    result.textContent = `${totalA > totalB ? a.name : b.name} wins!`;
  }
  battle.appendChild(result);
  battle.appendChild(fighter(a, totalA > totalB));
  battle.appendChild(fighter(b, totalB > totalA));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove";
  remove.textContent = "Remove";
  battle.appendChild(remove);
  log.appendChild(battle);
  updateCount();
}

async function getPokemon(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`No Pokemon named ${name}.`);
  }
  return response.json();
}

async function battle(nameA, nameB) {
  try {
    const a = await getPokemon(nameA);
    const b = await getPokemon(nameB);
    addBattle(a, b);
    message.textContent = "";
  } catch (error) {
    if (error.message.startsWith("No Pokemon")) {
      message.textContent = error.message;
    } else {
      message.textContent = "Could not reach PokeAPI. Try again.";
    }
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameA = first.value.trim().toLowerCase();
  const nameB = second.value.trim().toLowerCase();
  if (nameA === "" || nameB === "") {
    message.textContent = "Type two names.";
  } else if (nameA === nameB) {
    message.textContent = "Pick two different Pokemon.";
  } else {
    first.value = "";
    second.value = "";
    battle(nameA, nameB);
  }
});

log.addEventListener("click", (event) => {
  if (event.target.className === "remove") {
    event.target.parentElement.remove();
    updateCount();
  }
});

clear.addEventListener("click", () => {
  for (const item of log.querySelectorAll(".battle")) {
    item.remove();
  }
  message.textContent = "";
  updateCount();
});
