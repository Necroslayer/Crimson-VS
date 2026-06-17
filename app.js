 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { useState, createContext, useContext, useEffect, useRef } = React;

const CVS_VERSION = "v0.5.38";

// ─────────────────────────────────────────────
// EMBEDDED IMAGES (base64 WEBP)
// ─────────────────────────────────────────────
const IMGS = window.__CRIMSON_IMGS__ || {};

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────
const translations = {
  en: {
    menu: { play:"Arena", deckBuilder:"Deck Builder", guide:"Guide & Rules", options:"Options", tagline:"ALTIMIT Mine OS — Arena System" },
    gameMode: {
      title:"Select Game Mode", back:"Back",
      vsAI:"VS  —  Artificial Intelligence",
      vsAIDesc:"Face a CPU opponent. Test your deck, learn the mechanics, and dominate the arena.",
      vsPlayer:"VS  —  Player",
      vsPlayerDesc:"Challenge a friend locally or online. Multiplayer mode coming soon.",
      comingSoon:"Coming Soon",
      difficulty:"AI Difficulty",
      easy:"Easy", normal:"Normal", hard:"Hard",
      start:"Enter the Arena",
    },
    options: { title:"Options", language:"Language", languageDesc:"Select interface language", music:"Game Sound",
 difficulty:"AI Difficulty", difficultyEasy:"Easy", difficultyNormal:"Normal", difficultyHard:"Hard", back:"Back", version:"Version 0.5.37 — Vanilla" },
    guide: {
      title:"Guide & Rules", back:"Back",
      chapters:{
        overview:"Overview", cards:"Card Types", phases:"Game Phases",
        clash:"The Clash", battle:"General Battle",
        timing:"Battle Timing", junction:"Junction Abilities", deckRules:"Deck Rules",
      },
      overview:{ title:"What is Crimson VS?", body:"Crimson VS is a tactical card game set inside the ALTIMIT Mine OS virtual world from .hack//G.U. Two players face off using General cards and Unit support cards, combining strategic pre-game decisions with automated combat resolution. All battles are resolved automatically and mathematically — there is no luck, only strategy." },
      cards:{
        title:"Card Types",
        generalName:"General Cards (001–025)",
        generalDesc:"Leaders of the arena. Each General has HP (health points), AP (attack power), and Chr (Charisma — the max total Pts of the 3 final units). If HP hits 0, you lose instantly.",
        unitName:"Unit Cards (026–085)",
        unitDesc:"Support units placed behind your General. Each has Pts (cost points), a Trinity Type (Assault / Shield / Snipe), and a Junction Ability that activates only if the unit survives the Clash.",
        typeTitle:"Trinity Type Triangle",
        typeDesc:"Types create a rock-paper-scissors advantage used as tiebreaker in the Clash:",
        typeList:["⚔ Assault beats 🛡 Shield","🛡 Shield beats 🦅 Snipe","🦅 Snipe beats ⚔ Assault"],
      },
      phases:{
        title:"Game Flow — Pre-Clash",
        steps:[
          "Step 1 — General Reveal: Both players place their General face-up simultaneously.",
          "Step 2 — Pool Reveal: Each player reveals all 5 support units publicly.",
          "Step 3 — Ban Phase: Each player bans 1 enemy unit permanently. 4 units remain per side.",
          "Step 4 — The Cut: Each player secretly chooses 3 of their 4 units. The 4th is discarded face-down.",
          "Step 5 — Layout: The 3 chosen units are shuffled and placed face-down in positions Left, Center, Right.",
        ],
      },
      clash:{
        title:"Phase 1 — The Clash",
        body:"Units are revealed and resolved one at a time: Right → Center → Left.",
        rules:[
          "Higher Pts wins — lower-Pts unit is destroyed.",
          "Equal Pts → Trinity type advantage decides the winner.",
          "Equal Pts + Equal Type → Fizzle: both units destroy each other.",
          "Surviving units carry their Junction Ability into Phase 2.",
        ],
      },
      battle:{
        title:"Phase 2 — General Battle",
        body:"After the Clash, Junction Abilities from surviving units are activated, then Generals trade direct attacks.",
        rules:[
          "Junction Abilities trigger first, modifying HP/AP or applying effects.",
          "Generals alternate attacks — each deals damage equal to their current AP.",
          "K.O.: a General reaching 0 HP loses instantly, at any point.",
          "Timeout: after 10 attack turns, the General with more remaining HP wins.",
          "Draw: equal HP after 10 turns = technical draw.",
        ],
      },
      timing:{
        title:"Battle Effect Timing",
        intro:"Junction Abilities trigger at specific moments during General Battle. Understanding timing is key to strategy.",
        phases:[
          {
            phase:"On Junction (Before Combat Starts)",
            desc:"These effects apply immediately when the ability is junctioned, before any attack turn begins.",
            abilities:["Vitality Medicine (+5 HP)","Verboten Libation (+7 HP)","Fire Fang (+1 AP)","Flame Fang (+2 AP)","Bone Crunching (+4 AP, -4 HP)","Energy Drain (steal 3 HP)","Divine Punishment (5 dmg to enemy)","Quick Lightning (3 dmg to enemy)","Demonic Spear (7 dmg to enemy)","Hammer of Undoing (5 dmg to both)","Merciless Light (passive: 2 dmg to both each turn)","Border of Zero (both HP → 1)","Change Ring (swap enemy AP↔HP)","Estranged Self (remove all enemy junctions)","Charge Ahead (go first)","Mind's Eye (evade next attack)","Mirror of Revenge (reflect dmg for 3 turns)","Time Torrent (skip enemy turn)","Whirlwind Assault (remove 1 Shield junction)","Snipe Thunder (remove 1 Assault junction)","Shield Protection (remove 1 Snipe junction)","Warning Harmony (remove 1 random enemy junction if ≥2)","Grief of Comrade (+2 HP per enemy junction)","All At Once (+2 AP per friendly junction)"],
          },
          {
            phase:"At the Beginning of Each Turn",
            desc:"These effects trigger at the start of every attack turn, for both players.",
            abilities:["Vengeful Arrow (1 dmg to enemy each your turn)","Tragic Arrow (2 dmg to enemy each your turn)","Energy Genome (+1 HP each your turn)","Immortal Genome (+2 HP each your turn)","Folset's Trial (+1 AP, -1 HP each your turn)","Filling Hollow (remove 1 random junction from both)","Gathering of the Strong (1 dmg to enemy for 5 turns)","Light of Annihilation (3 dmg to both every turn)","First Strike (1 dmg to both at start of each turn)","Anu's Karma (+3 HP end of your turn if you go second)","Aurora Tears (+2 AP end of your turn if you go first)","Harmonic Rhythm (+2 AP start of turn if first / +4 HP if second)","AIDA Corrosion (+1 AP, -1 HP start of turn)","AIDA Berserk (+2 AP, -2 HP start of turn)","Rendezvous (+10 HP at start, -10 HP at turn 8)","Mobilize the Troops (+1 HP per turn after 5 turns)"],
          },
          {
            phase:"On Attack / Damage Events",
            desc:"These effects trigger when your General deals or receives damage.",
            abilities:["Blades Crossing (+1 extra dmg on attack)","Double Trigger (+2 extra dmg on attack)","Massacre Pulse (+1 AP each time you attack)","Cross Counter (1 dmg to enemy when you receive dmg)","Momentary Glory (+3 AP / -3 enemy AP for 1 turn, then reverses)","Quickdance (-3 AP but attack even during enemy turn)","Reckless Rewards (+2 AP, but +1 dmg received)","Ingenious Scheme (reflect all dmg for 2 turns)"],
          },
          {
            phase:"Conditional / Passive",
            desc:"These effects apply under specific conditions throughout the battle.",
            abilities:["Clenching Teeth (force HP to 1 if it hits 0 — once)","Suck it up (force HP to 5 if it hits 0 — once)","Veil of Aura (-2 dmg received permanently)","Spirit Clothes (-1 dmg received permanently)","Emperor's Pride (-1 normal dmg received)","Promised Discretion (cap dmg at 3 per hit)","Detail Oriented (nullify dmg of 1–2, normal above 3)","Avatar's Descent (+5 AP for 5 turns, nullify junction dmg)","Trial by Fire (no attack for 4 turns, then +5 AP +6 HP)","Twilight's Call (reactivate all junctions after 5 turns)","Price of Insight (replace itself with random ability)","Meeting of Souls (swap all junctions between generals)","Fused Consciousness (set AP+HP to average of both)","Different Mix (+2 AP+HP if mixed trinity, -2 if same)","Will of Similars (+3 AP+HP if same trinity, -3 if different)","Demon Sword Maxwell (nullify all junction damage received)"],
          },
        ],
      },
      junction:{
        title:"Junction Abilities Reference",
        intro:"Complete list of all Junction Abilities from Unit Cards 026–085.",
        note:"Abilities only activate if the unit survives the Clash.",
        list:[
          {name:"AIDA Berserk",effect:"Start of turn: +2 AP, take 2 damage."},
          {name:"AIDA Corrosion",effect:"Start of your turn: +1 AP, take 1 damage."},
          {name:"All At Once",effect:"+2 AP for every junctioned card you hold."},
          {name:"Anu's Karma",effect:"+3 HP at end of your turn if you go second."},
          {name:"Aurora Tears",effect:"+2 AP at end of your turn if you go first."},
          {name:"Avatar's Descent",effect:"+5 AP for 5 turns. Nullify all junction damage from enemy."},
          {name:"Blades Crossing",effect:"Each time you deal damage, deal +1 extra."},
          {name:"Bone Crunching",effect:"+4 AP, -4 HP immediately."},
          {name:"Border of Zero",effect:"Both Generals' HP become 1."},
          {name:"Change Ring",effect:"Swap enemy General's AP and HP values."},
          {name:"Charge Ahead",effect:"Your General goes first. Cancelled if both have this."},
          {name:"Clenching Teeth",effect:"Once: if HP hits 0, restore to 1."},
          {name:"Cross Counter",effect:"When you take damage, deal 1 damage to enemy."},
          {name:"Defensive Stance",effect:"Force your General to go second. -1 damage received."},
          {name:"Demonic Spear",effect:"Deal 7 damage to enemy General immediately."},
          {name:"Demon Sword Maxwell",effect:"Nullify all damage from enemy junction abilities."},
          {name:"Detail Oriented",effect:"Damage of 1–2 is reduced to 0. Damage 3+ is normal."},
          {name:"Different Mix",effect:"+2 AP/HP if junctioned with a different trinity. -2 if same."},
          {name:"Divine Punishment",effect:"Deal 5 damage to enemy General immediately."},
          {name:"Double Trigger",effect:"When you deal damage, add +2 extra."},
          {name:"Emperor's Pride",effect:"-1 to all normal damage received."},
          {name:"Energy Drain",effect:"Steal 3 HP from enemy General."},
          {name:"Energy Genome",effect:"+1 HP at the start of each of your turns."},
          {name:"Estranged Self",effect:"Remove all enemy junction abilities. You take +2 damage."},
          {name:"Filling Hollow",effect:"Each your turn: remove 1 random junction from both generals."},
          {name:"Fire Fang",effect:"+1 AP immediately."},
          {name:"First Strike",effect:"1 damage to both Generals at the start of each turn."},
          {name:"First to Action",effect:"Deal 5 damage to enemy. Take 1 damage each subsequent turn."},
          {name:"Flame Fang",effect:"+2 AP immediately."},
          {name:"Folset's Trial",effect:"Start of your turn: +1 AP, -1 HP."},
          {name:"Fused Consciousness",effect:"Set both Generals' AP and HP to the average of both."},
          {name:"Gabi's Call",effect:"Nullify Snipe and Assault junction abilities of enemy."},
          {name:"Gathering of the Strong",effect:"Deal 1 damage to enemy each turn for 5 turns."},
          {name:"Golden Spear",effect:"Deal 4 damage to enemy General immediately."},
          {name:"Grief of Comrade",effect:"+2 HP for each junction ability the enemy holds."},
          {name:"Hammer of Undoing",effect:"Deal 5 damage to both Generals immediately."},
          {name:"Harmonic Rhythm",effect:"+2 AP start of turn if first; +4 HP if second."},
          {name:"Immortal Genome",effect:"+2 HP at the start of each of your turns."},
          {name:"Ingenious Scheme",effect:"Reflect all damage back to enemy for 2 turns."},
          {name:"Kaede's Guard",effect:"Nullify Snipe and Shield junction abilities of enemy."},
          {name:"Light of Annihilation",effect:"3 damage to both Generals every turn."},
          {name:"Long-awaited Return",effect:"Start of your turn: +1 AP, +2 HP."},
          {name:"Massacre Pulse",effect:"Each time you attack, gain +1 AP."},
          {name:"Meeting of Souls",effect:"Swap all junction abilities between both Generals."},
          {name:"Merciless Light",effect:"2 damage to both Generals at start of each turn."},
          {name:"Mind's Eye",effect:"Evade one enemy attack (one turn only)."},
          {name:"Mirror of Revenge",effect:"Reflect all damage received back to enemy for 3 turns."},
          {name:"Mobilize the Troops",effect:"After 5 turns, heal +1 HP per turn."},
          {name:"Momentary Glory",effect:"+3 AP / -3 enemy AP for 1 turn, then -1 AP / +1 enemy AP each turn after."},
          {name:"Pattern of Demons",effect:"Void 1 junction ability from the enemy unit with highest cost."},
          {name:"Price of Insight",effect:"Replace this ability with a random new junction ability."},
          {name:"Promised Discretion",effect:"Cap damage either General receives at 3 per hit."},
          {name:"Quickdance",effect:"-3 AP, but your General attacks even during enemy's turn."},
          {name:"Quick Lightning",effect:"Deal 3 damage to enemy General immediately."},
          {name:"Reckless Rewards",effect:"+2 AP. Each time you receive damage, take +1 extra."},
          {name:"Rendezvous",effect:"+10 HP at start of combat. At turn 8, take 10 damage."},
          {name:"Shield Protection",effect:"Remove 1 Snipe-type junction from enemy."},
          {name:"Shooting Squad",effect:"Nullify Assault and Shield junction abilities of enemy."},
          {name:"Snipe Thunder",effect:"Remove 1 Assault-type junction from enemy."},
          {name:"Spirit Clothes",effect:"-1 to all damage received permanently."},
          {name:"Suck it up",effect:"Once: if HP hits 0, restore to 5."},
          {name:"Time Torrent",effect:"Skip enemy General's turn for 1 round."},
          {name:"Tragic Arrow",effect:"Deal 2 damage to enemy at the start of your turn."},
          {name:"Trial by Fire",effect:"Cannot attack for 4 turns. After turn 4: +5 AP, +6 HP."},
          {name:"Twilight's Call",effect:"After 5 turns, reactivate all your junction abilities."},
          {name:"Veil of Aura",effect:"-2 to all damage received permanently."},
          {name:"Vengeful Arrow",effect:"Deal 1 damage to enemy at the start of your turn."},
          {name:"Verboten Libation",effect:"+7 HP immediately."},
          {name:"Vitality Medicine",effect:"+5 HP immediately."},
          {name:"Warning Harmony",effect:"If enemy has 2+ junctions active: remove 1 random enemy junction."},
          {name:"Whirlwind Assault",effect:"Remove 1 Shield-type junction from enemy."},
          {name:"Will of Similars",effect:"+3 AP/HP if same trinity as your unit. -3 if different."},
        ],
      },
      deckRules:{
        title:"Deck Construction Rules",
        rules:[
          "Each deck: exactly 1 General + 5 Unit cards.",
          "Charisma rule: the 3 final units after Ban+Cut must have total Cost ≤ General's Charisma.",
          "Charisma is only validated on the final 3 units — not the full pool of 5.",
          "Illegal deck (total Cost exceeds Charisma) = instant forfeit loss.",
          "Each player secretly chooses which 3 of 4 units to keep after the ban phase.",
          "The discarded 4th unit is never revealed to the opponent.",
        ],
      },
    },
    deckBuilder:{
      title:"Deck Builder", back:"Back",
      newDeck:"New Deck", savedDecks:"Saved Decks", noDeck:"No decks saved yet.",
      deckName:"Deck Name", save:"Save", delete:"Delete", edit:"Edit", cancel:"Cancel",
      general:"General", units:"Units", selectGeneral:"Select a General",
      selectUnits:"Select 5 Units", poolFull:"Pool full (5/5)",
      charisma:"Charisma", cost:"Pts", rarity:"Rarity", type:"Type", junction:"Junction",
      filterAll:"All", filterAssault:"Assault", filterShield:"Shield", filterSnipe:"Snipe",
      rarityAll:"All Rarities", search:"Search cards...",
      validDeck:"Valid deck", invalidDeck:"Invalid — Pts exceed Chr",
      hp:"HP", ap:"AP", charLabel:"Char.",
      confirmDelete:"Delete this deck?",
      enterName:"Enter deck name...",
    },
  },
  pt: {
    menu: { play:"Arena", deckBuilder:"Construtor de Deck", guide:"Guia e Regras", options:"Opções", tagline:"ALTIMIT Mine OS — Sistema de Arena" },
    gameMode: {
      title:"Selecionar Modo de Jogo", back:"Voltar",
      vsAI:"VS  —  Inteligência Artificial",
      vsAIDesc:"Enfrente um oponente CPU. Teste seu deck, aprenda as mecânicas e domine a arena.",
      vsPlayer:"VS  —  Jogador",
      vsPlayerDesc:"Desafie um amigo localmente ou online. Modo multiplayer em breve.",
      comingSoon:"Em Breve",
      difficulty:"Dificuldade da IA",
      easy:"Fácil", normal:"Normal", hard:"Difícil",
      start:"Entrar na Arena",
    },
    options: { title:"Opções", language:"Idioma", languageDesc:"Selecione o idioma da interface", music:"Som do Jogo",
 difficulty:"Dificuldade da IA", difficultyEasy:"Fácil", difficultyNormal:"Normal", difficultyHard:"Difícil", back:"Voltar", version:"Versão 0.5.37 — Vanilla" },
    guide: {
      title:"Guia e Regras", back:"Voltar",
      chapters:{
        overview:"Visão Geral", cards:"Tipos de Carta", phases:"Fases do Jogo",
        clash:"O Clash", battle:"Batalha dos Generais",
        timing:"Timing de Batalha", junction:"Junction Abilities", deckRules:"Regras de Deck",
      },
      overview:{ title:"O que é Crimson VS?", body:"Crimson VS é um jogo tático de cartas ambientado dentro do mundo virtual ALTIMIT Mine OS de .hack//G.U. Dois jogadores se enfrentam usando cartas de General e cartas de Unidade de suporte, combinando decisões estratégicas pré-jogo com resolução automática de combate. Todas as batalhas são resolvidas automaticamente — sem sorte, apenas estratégia." },
      cards:{
        title:"Tipos de Carta",
        generalName:"Cartas de General (001–025)",
        generalDesc:"Líderes da arena. Cada General tem HP (pontos de vida), AP (poder de ataque) e Chr (Carisma — limite máximo de Pts das 5 unidades do pool). Se o HP chegar a 0, você perde instantaneamente.",
        unitName:"Cartas de Unidade (026–085)",
        unitDesc:"Unidades de suporte posicionadas atrás do seu General. Cada uma tem Pts (pontos de custo), Tipo Trinity (Assault / Shield / Snipe) e uma Junction Ability que só ativa se a unidade sobreviver ao Clash.",
        typeTitle:"Triângulo de Vantagens Trinity",
        typeDesc:"Os tipos criam uma vantagem de pedra-papel-tesoura usada como desempate no Clash:",
        typeList:["⚔ Assault vence 🛡 Shield","🛡 Shield vence 🦅 Snipe","🦅 Snipe vence ⚔ Assault"],
      },
      phases:{
        title:"Fluxo do Jogo — Pré-Clash",
        steps:[
          "Passo 1 — Revelação do General: Ambos os jogadores revelam seus Generais simultaneamente.",
          "Passo 2 — Revelação do Pool: Cada jogador revela suas 5 unidades de suporte publicamente.",
          "Passo 3 — Fase de Ban: Cada jogador bane 1 unidade inimiga permanentemente. Restam 4 unidades por lado.",
          "Passo 4 — The Cut: Cada jogador seleciona secretamente 3 das 4 unidades restantes. A 4ª é descartada sem ser revelada.",
          "Passo 5 — Layout: As 3 unidades escolhidas são embaralhadas e posicionadas viradas para baixo nas posições Esquerda, Centro e Direita.",
        ],
      },
      clash:{
        title:"Fase 1 — O Clash",
        body:"As unidades são reveladas e resolvidas uma a uma: Direita → Centro → Esquerda.",
        rules:[
          "Maior Custo vence — a unidade de menor Custo é destruída.",
          "Custo igual → vantagem de tipo Trinity decide o vencedor.",
          "Pts igual + Tipo igual → Fizzle: ambas as unidades se destroem mutuamente.",
          "Unidades sobreviventes levam sua Junction Ability para a Fase 2.",
        ],
      },
      battle:{
        title:"Fase 2 — Batalha dos Generais",
        body:"Após o Clash, as Junction Abilities das unidades sobreviventes são ativadas e os Generais trocam ataques diretos.",
        rules:[
          "Junction Abilities disparam primeiro, modificando HP/AP ou aplicando efeitos.",
          "Generais se alternam nos ataques — cada um causa dano igual ao seu AP atual.",
          "K.O.: um General que chega a 0 HP perde instantaneamente, em qualquer momento.",
          "Timeout: após 10 turnos de ataque, o General com mais HP restante vence.",
          "Empate: HP igual após 10 turnos = empate técnico.",
        ],
      },
      timing:{
        title:"Timing dos Efeitos de Batalha",
        intro:"As Junction Abilities disparam em momentos específicos durante a Batalha dos Generais. Entender o timing é essencial para a estratégia.",
        phases:[
          {
            phase:"Na Junção (Antes do Combate Começar)",
            desc:"Esses efeitos se aplicam imediatamente quando a habilidade é juntionada, antes de qualquer turno de ataque.",
            abilities:["Vitality Medicine (+5 HP)","Verboten Libation (+7 HP)","Fire Fang (+1 AP)","Flame Fang (+2 AP)","Bone Crunching (+4 AP, -4 HP)","Energy Drain (roubar 3 HP do inimigo)","Divine Punishment (5 de dano ao inimigo)","Quick Lightning (3 de dano ao inimigo)","Demonic Spear (7 de dano ao inimigo)","Hammer of Undoing (5 de dano em ambos)","Border of Zero (HP de ambos → 1)","Change Ring (trocar AP↔HP do inimigo)","Estranged Self (remover todos os junctions inimigos)","Charge Ahead (ir primeiro)","Mind's Eye (esquivar do próximo ataque)","Mirror of Revenge (refletir dano por 3 turnos)","Time Torrent (pular turno inimigo)","Whirlwind Assault (remover 1 junction Shield)","Snipe Thunder (remover 1 junction Assault)","Shield Protection (remover 1 junction Snipe)","Warning Harmony (remover 1 junction inimigo aleatório se ≥2)","Grief of Comrade (+2 HP por junction inimigo)","All At Once (+2 AP por junction aliado)"],
          },
          {
            phase:"No Início de Cada Turno",
            desc:"Esses efeitos disparam no início de cada turno de ataque.",
            abilities:["Vengeful Arrow (1 dano ao inimigo no seu turno)","Tragic Arrow (2 dano ao inimigo no seu turno)","Energy Genome (+1 HP no início do seu turno)","Immortal Genome (+2 HP no início do seu turno)","Folset's Trial (+1 AP, -1 HP no início do seu turno)","Filling Hollow (remover 1 junction aleatório de ambos por turno)","Gathering of the Strong (1 dano ao inimigo por 5 turnos)","Light of Annihilation (3 dano em ambos todo turno)","First Strike (1 dano em ambos no início de cada turno)","Anu's Karma (+3 HP no fim do seu turno se for segundo)","Aurora Tears (+2 AP no fim do seu turno se for primeiro)","Harmonic Rhythm (+2 AP início do turno se primeiro / +4 HP se segundo)","AIDA Corrosion (+1 AP, -1 HP início do turno)","AIDA Berserk (+2 AP, -2 HP início do turno)","Rendezvous (+10 HP no início do combate, -10 HP no turno 8)","Mobilize the Troops (+1 HP por turno após 5 turnos)"],
          },
          {
            phase:"Em Ataque / Eventos de Dano",
            desc:"Esses efeitos disparam quando seu General causa ou recebe dano.",
            abilities:["Blades Crossing (+1 dano extra ao atacar)","Double Trigger (+2 dano extra ao atacar)","Massacre Pulse (+1 AP cada vez que você ataca)","Cross Counter (1 dano ao inimigo quando você recebe dano)","Momentary Glory (+3 AP / -3 AP inimigo por 1 turno, depois inverte)","Quickdance (-3 AP mas ataca mesmo no turno inimigo)","Reckless Rewards (+2 AP, mas +1 dano recebido)","Ingenious Scheme (refletir todo dano por 2 turnos)"],
          },
          {
            phase:"Condicionais / Passivos",
            desc:"Esses efeitos se aplicam sob condições específicas ao longo da batalha.",
            abilities:["Clenching Teeth (força HP para 1 se chegar a 0 — uma vez)","Suck it up (força HP para 5 se chegar a 0 — uma vez)","Veil of Aura (-2 dano recebido permanentemente)","Spirit Clothes (-1 dano recebido permanentemente)","Emperor's Pride (-1 dano normal recebido)","Promised Discretion (limita dano recebido a 3 por hit)","Detail Oriented (anula dano 1–2; dano 3+ é normal)","Avatar's Descent (+5 AP por 5 turnos, anula dano de junctions inimigos)","Trial by Fire (não pode atacar por 4 turnos; depois +5 AP +6 HP)","Twilight's Call (reativa todos os junctions após 5 turnos)","Price of Insight (substitui a si mesmo por uma ability aleatória)","Meeting of Souls (troca todos os junctions entre os dois Generais)","Fused Consciousness (define AP+HP como a média de ambos)","Different Mix (+2 AP/HP se trinity diferente; -2 se igual)","Will of Similars (+3 AP/HP se mesmo trinity; -3 se diferente)","Demon Sword Maxwell (anula todo dano de junctions inimigos)"],
          },
        ],
      },
      junction:{
        title:"Referência de Junction Abilities",
        intro:"Lista completa de todas as Junction Abilities das Cartas de Unidade 026–085.",
        note:"As habilidades só ativam se a unidade sobreviver ao Clash.",
        list:[
          {name:"AIDA Berserk",effect:"Início do turno: +2 AP, recebe 2 de dano."},
          {name:"AIDA Corrosion",effect:"Início do seu turno: +1 AP, recebe 1 de dano."},
          {name:"All At Once",effect:"+2 AP para cada carta juntionada que você possui."},
          {name:"Anu's Karma",effect:"+3 HP no fim do seu turno se você for segundo."},
          {name:"Aurora Tears",effect:"+2 AP no fim do seu turno se você for primeiro."},
          {name:"Avatar's Descent",effect:"+5 AP por 5 turnos. Anula todo dano de junctions inimigos."},
          {name:"Blades Crossing",effect:"Cada vez que causar dano, causa +1 extra."},
          {name:"Bone Crunching",effect:"+4 AP, -4 HP imediatamente."},
          {name:"Border of Zero",effect:"HP de ambos os Generais vira 1."},
          {name:"Change Ring",effect:"Troca AP e HP do General inimigo."},
          {name:"Charge Ahead",effect:"Seu General vai primeiro. Cancelado se ambos tiverem."},
          {name:"Clenching Teeth",effect:"Uma vez: se HP chegar a 0, restaura para 1."},
          {name:"Cross Counter",effect:"Quando você recebe dano, causa 1 de dano ao inimigo."},
          {name:"Defensive Stance",effect:"Força seu General a ir segundo. -1 dano recebido."},
          {name:"Demonic Spear",effect:"Causa 7 de dano ao General inimigo imediatamente."},
          {name:"Demon Sword Maxwell",effect:"Anula todo dano de junctions inimigos."},
          {name:"Detail Oriented",effect:"Dano 1–2 é reduzido a 0. Dano 3+ é normal."},
          {name:"Different Mix",effect:"+2 AP/HP se juntionado com trinity diferente. -2 se igual."},
          {name:"Divine Punishment",effect:"Causa 5 de dano ao General inimigo imediatamente."},
          {name:"Double Trigger",effect:"Quando causar dano, adiciona +2 extra."},
          {name:"Emperor's Pride",effect:"-1 em todo dano normal recebido."},
          {name:"Energy Drain",effect:"Rouba 3 HP do General inimigo."},
          {name:"Energy Genome",effect:"+1 HP no início de cada um dos seus turnos."},
          {name:"Estranged Self",effect:"Remove todas as junctions inimigas. Você recebe +2 de dano."},
          {name:"Filling Hollow",effect:"Cada turno seu: remove 1 junction aleatória de ambos os generais."},
          {name:"Fire Fang",effect:"+1 AP imediatamente."},
          {name:"First Strike",effect:"1 de dano em ambos os Generais no início de cada turno."},
          {name:"First to Action",effect:"Causa 5 de dano ao inimigo. Recebe 1 de dano em cada turno seguinte."},
          {name:"Flame Fang",effect:"+2 AP imediatamente."},
          {name:"Folset's Trial",effect:"Início do seu turno: +1 AP, -1 HP."},
          {name:"Fused Consciousness",effect:"Define AP e HP de ambos como a média dos dois."},
          {name:"Gabi's Call",effect:"Anula junctions Snipe e Assault do inimigo."},
          {name:"Gathering of the Strong",effect:"Causa 1 de dano ao inimigo por turno durante 5 turnos."},
          {name:"Golden Spear",effect:"Causa 4 de dano ao General inimigo imediatamente."},
          {name:"Grief of Comrade",effect:"+2 HP para cada junction que o inimigo possui."},
          {name:"Hammer of Undoing",effect:"Causa 5 de dano em ambos os Generais imediatamente."},
          {name:"Harmonic Rhythm",effect:"+2 AP início do turno se primeiro; +4 HP se segundo."},
          {name:"Immortal Genome",effect:"+2 HP no início de cada um dos seus turnos."},
          {name:"Ingenious Scheme",effect:"Reflete todo dano de volta ao inimigo por 2 turnos."},
          {name:"Kaede's Guard",effect:"Anula junctions Snipe e Shield do inimigo."},
          {name:"Light of Annihilation",effect:"3 de dano em ambos os Generais todo turno."},
          {name:"Long-awaited Return",effect:"Início do seu turno: +1 AP, +2 HP."},
          {name:"Massacre Pulse",effect:"Cada vez que você atacar, ganha +1 AP."},
          {name:"Meeting of Souls",effect:"Troca todas as junctions entre os dois Generais."},
          {name:"Merciless Light",effect:"2 de dano em ambos os Generais no início de cada turno."},
          {name:"Mind's Eye",effect:"Esquiva de um ataque inimigo (apenas um turno)."},
          {name:"Mirror of Revenge",effect:"Reflete todo dano recebido ao inimigo por 3 turnos."},
          {name:"Mobilize the Troops",effect:"Após 5 turnos, cura +1 HP por turno."},
          {name:"Momentary Glory",effect:"+3 AP / -3 AP inimigo por 1 turno, depois -1 AP / +1 AP inimigo por turno."},
          {name:"Pattern of Demons",effect:"Anula 1 junction da unidade inimiga com maior custo."},
          {name:"Price of Insight",effect:"Substitui esta ability por uma junction aleatória."},
          {name:"Promised Discretion",effect:"Limita o dano recebido a 3 por hit."},
          {name:"Quickdance",effect:"-3 AP, mas seu General ataca mesmo no turno inimigo."},
          {name:"Quick Lightning",effect:"Causa 3 de dano ao General inimigo imediatamente."},
          {name:"Reckless Rewards",effect:"+2 AP. Cada vez que receber dano, recebe +1 extra."},
          {name:"Rendezvous",effect:"+10 HP no início do combate. No turno 8, recebe 10 de dano."},
          {name:"Shield Protection",effect:"Remove 1 junction tipo Snipe do inimigo."},
          {name:"Shooting Squad",effect:"Anula junctions Assault e Shield do inimigo."},
          {name:"Snipe Thunder",effect:"Remove 1 junction tipo Assault do inimigo."},
          {name:"Spirit Clothes",effect:"-1 em todo dano recebido permanentemente."},
          {name:"Suck it up",effect:"Uma vez: se HP chegar a 0, restaura para 5."},
          {name:"Time Torrent",effect:"Pula o turno do General inimigo por 1 rodada."},
          {name:"Tragic Arrow",effect:"Causa 2 de dano ao inimigo no início do seu turno."},
          {name:"Trial by Fire",effect:"Não pode atacar por 4 turnos. Depois do turno 4: +5 AP, +6 HP."},
          {name:"Twilight's Call",effect:"Após 5 turnos, reativa todas as suas junction abilities."},
          {name:"Veil of Aura",effect:"-2 em todo dano recebido permanentemente."},
          {name:"Vengeful Arrow",effect:"Causa 1 de dano ao inimigo no início do seu turno."},
          {name:"Verboten Libation",effect:"+7 HP imediatamente."},
          {name:"Vitality Medicine",effect:"+5 HP imediatamente."},
          {name:"Warning Harmony",effect:"Se inimigo tem 2+ junctions ativas: remove 1 junction inimiga aleatória."},
          {name:"Whirlwind Assault",effect:"Remove 1 junction tipo Shield do inimigo."},
          {name:"Will of Similars",effect:"+3 AP/HP se mesmo trinity. -3 se diferente."},
        ],
      },
      deckRules:{
        title:"Regras de Construção de Deck",
        rules:[
          "Cada deck: exatamente 1 General + 5 Cartas de Unidade.",
          "Regra do Carisma: as 3 unidades finais após Ban+Cut devem ter Custo total ≤ Carisma do General.",
          "O Carisma só é validado nas 3 unidades finais — não no pool de 5.",
          "Deck ilegal (Custo total excede o Carisma) = derrota por forfeit instantânea.",
          "Cada jogador escolhe secretamente quais 3 das 4 unidades manter após a fase de ban.",
          "A 4ª unidade descartada nunca é revelada ao oponente.",
        ],
      },
    },
    deckBuilder:{
      title:"Construtor de Deck", back:"Voltar",
      newDeck:"Novo Deck", savedDecks:"Decks Salvos", noDeck:"Nenhum deck salvo ainda.",
      deckName:"Nome do Deck", save:"Salvar", delete:"Excluir", edit:"Editar", cancel:"Cancelar",
      general:"General", units:"Unidades", selectGeneral:"Selecione um General",
      selectUnits:"Selecione 5 Unidades", poolFull:"Pool cheio (5/5)",
      charisma:"Carisma", cost:"Pts", rarity:"Raridade", type:"Tipo", junction:"Junction",
      filterAll:"Todos", filterAssault:"Assault", filterShield:"Shield", filterSnipe:"Snipe",
      rarityAll:"Todas as Raridades", search:"Buscar cartas...",
      validDeck:"Deck válido", invalidDeck:"Inválido — Pts excedem o Chr",
      hp:"HP", ap:"AP", charLabel:"Chr.",
      confirmDelete:"Excluir este deck?",
      enterName:"Digite o nome do deck...",
    },
  },
};

const SettingsCtx = createContext(null);
function useSettings() { return useContext(SettingsCtx); }
function useT() {
  const { settings } = useSettings();
  const lang = settings.language || "en";
  const T = translations[lang] || translations.en;
  return (path) => _nullishCoalesce(path.split(".").reduce((o,k) => _optionalChain([o, 'optionalAccess', _2 => _2[k]]), T), () => ( path));
}

// ─────────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────────
const C = {
  bg:          "#070436",
  bgDeep:      "#04021f",
  // hex canvas stays cyan — background effect only
  cyan:        "#00f5ff",
  cyanDim:     "rgba(0,245,255,0.55)",
  cyanFaint:   "rgba(0,245,255,0.12)",
  // UI accent: warm amber — max contrast on #070436
  accent:      "#f5a623",
  accentDim:   "rgba(245,166,35,0.65)",
  accentFaint: "rgba(245,166,35,0.13)",
  // text hierarchy
  textPrimary: "#e8eeff",
  textSub:     "rgba(210,220,245,0.85)",
  textMuted:   "rgba(190,205,235,0.6)",
  // other
  gold:        "#f0c040",
  goldDim:     "rgba(240,192,64,0.55)",
  crimson:     "#ff3355",
  border:      "rgba(245,166,35,0.2)",
  borderMid:   "rgba(245,166,35,0.4)",
  card:        "rgba(2,4,38,0.7)",
};

// ─────────────────────────────────────────────
// HEX NETWORK CANVAS BACKGROUND
// ─────────────────────────────────────────────
function HexBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const HEX_SIZE = 32;
    const HEX_GAP  = 6;
    const STEP     = HEX_SIZE * 2 + HEX_GAP;
    const COL_W    = STEP * Math.cos(Math.PI / 6);

    let W, H, hexes, nodes, connections, particles;
    let raf, waveInterval;

    // Trinity colors: Assault red, Shield blue, Snipe green
    const TC = [
      [255, 50,  70 ],
      [40,  130, 255],
      [50,  220, 80 ],
    ];

    function hexPath(x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      ctx.closePath();
    }

    // Neighbor map: hex index -> list of adjacent hex indices
    let nbMap = null;
    function buildNeighborMap() {
      nbMap = hexes.map((h, i) => {
        const nb = [];
        for (let j = 0; j < hexes.length; j++) {
          if (i === j) continue;
          const dx = hexes[j].x - h.x, dy = hexes[j].y - h.y;
          if (Math.sqrt(dx*dx + dy*dy) < COL_W * 1.12) nb.push(j);
        }
        return nb;
      });
    }

    // ── FLOOD FRONTS ──────────────────────────────────────────────────────────
    // Each front: spreads hex-to-hex, carries a Trinity color,
    // leaves a fading trail, limited max active fronts across entire grid
    const MAX_FRONTS   = 8;   // max simultaneous fronts
    const FRONT_TICK   = 6;   // frames between expansion steps (controls speed)
    const FADE_SPEED   = 0.007; // how fast tint fades after front passes
    const ALPHA_START  = 0.9;

    let fronts = [];

    function spawnFront() {
      if (!hexes.length || !nbMap) return;
      // Spread seed points evenly across canvas zones
      // Divide canvas into grid zones and pick randomly within a zone
      const zx = Math.floor(Math.random() * 4);
      const zy = Math.floor(Math.random() * 5);
      const zoneX = (zx / 4) * W;
      const zoneY = (zy / 5) * H;
      // Find hex closest to that zone center
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < hexes.length; i++) {
        const dx = hexes[i].x - zoneX, dy = hexes[i].y - zoneY;
        const d = dx*dx + dy*dy;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      const colIdx = Math.floor(Math.random() * 3);
      const col    = TC[colIdx];
      const fadeMap = new Map();
      fadeMap.set(best, ALPHA_START);
      fronts.push({
        col, colIdx,
        frontier: [best],
        visited:  new Set([best]),
        fadeMap,
        tick: Math.floor(Math.random() * FRONT_TICK), // stagger start
        strength: ALPHA_START,
      });
      // Set initial tint on seed hex
      hexes[best].tintR = col[0];
      hexes[best].tintG = col[1];
      hexes[best].tintB = col[2];
      hexes[best].tintA = ALPHA_START;
    }

    function buildGrid() {
      hexes = []; nodes = []; connections = []; particles = [];
      fronts = []; nbMap = null;

      const cols = Math.ceil(W / COL_W) + 2;
      const rows = Math.ceil(H / STEP)  + 2;

      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const x = col * COL_W;
          const y = row * STEP + (col % 2 === 0 ? 0 : STEP / 2);
          const bright = Math.random();
          let type = "normal";
          if      (bright > 0.93) type = "node";
          else if (bright > 0.82) type = "active";
          hexes.push({
            x, y, type,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.006,
            tintR:0, tintG:0, tintB:0, tintA:0,
          });
          if (type === "node") nodes.push({ x, y });
        }
      }

      // Node connections for the data-particle lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          if (Math.sqrt(dx*dx + dy*dy) < COL_W * 4) {
            connections.push({
              from: nodes[i], to: nodes[j],
              progress: -Math.random() * 2,
              speed: 0.002 + Math.random() * 0.003,
            });
          }
        }
      }

      for (let k = 0; k < 14; k++) spawnParticle();

      // Build neighbor map then seed initial fronts spread across canvas
      setTimeout(() => {
        buildNeighborMap();
        // Seed MAX_FRONTS fronts spread across zones
        for (let i = 0; i < MAX_FRONTS; i++) spawnFront();
      }, 80);
    }

    function spawnParticle() {
      if (!connections.length) return;
      const conn = connections[Math.floor(Math.random() * connections.length)];
      particles.push({
        conn, t: Math.random(),
        speed: 0.003 + Math.random() * 0.003,
        dir: Math.random() > 0.5 ? 1 : -1,
        alpha: 0.6 + Math.random() * 0.3,
        size: 1.5 + Math.random() * 2,
        crimson: Math.random() > 0.7,
      });
    }

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildGrid();
    }

    // Ripple rings
    let ripples = [];
    setInterval(() => {
      if (!nodes.length) return;
      const n   = nodes[Math.floor(Math.random() * nodes.length)];
      const col = TC[Math.floor(Math.random() * 3)];
      ripples.push({ x:n.x, y:n.y, r:0, maxR:60+Math.random()*50, alpha:0.35,
        cr:col[0], cg:col[1], cb:col[2] });
    }, 1200);

    // Respawn fronts to keep MAX_FRONTS always active
    waveInterval = setInterval(() => {
      if (!nbMap || !hexes.length) return;
      while (fronts.length < MAX_FRONTS) spawnFront();
    }, 1500);

    let sweepX = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Background
      const grad = ctx.createRadialGradient(W*.5,H*.4,0, W*.5,H*.5, Math.max(W,H)*.85);
      grad.addColorStop(0,   "rgba(10,6,70,1)");
      grad.addColorStop(0.5, "rgba(7,4,54,1)");
      grad.addColorStop(1,   "rgba(4,2,28,1)");
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

      // Corner glow
      const cg = ctx.createRadialGradient(W,H,0,W,H,W*.5);
      cg.addColorStop(0,"rgba(100,8,25,0.12)"); cg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle = cg; ctx.fillRect(0,0,W,H);

      // Sweep
      sweepX = (sweepX + 0.14) % (W + 200);
      const swg = ctx.createLinearGradient(sweepX-60,0,sweepX+60,0);
      swg.addColorStop(0,"rgba(0,245,255,0)"); swg.addColorStop(0.5,"rgba(0,245,255,0.025)"); swg.addColorStop(1,"rgba(0,245,255,0)");
      ctx.fillStyle = swg; ctx.fillRect(sweepX-60,0,120,H);

      // ── ADVANCE FLOOD FRONTS ──────────────────────────────────────────────
      if (nbMap) {
        // Reset tint on all hexes — rebuild each frame from fadeMap
        hexes.forEach(h => { h.tintA = 0; });

        // Remove dead fronts (frontier empty AND all faded)
        fronts = fronts.filter(f =>
          f.frontier.length > 0 || [...f.fadeMap.values()].some(a => a > 0.01)
        );

        fronts.forEach(f => {
          // Fade all tinted hexes
          const toDelete = [];
          f.fadeMap.forEach((a, idx) => {
            const newA = Math.max(0, a - FADE_SPEED);
            if (newA <= 0) { toDelete.push(idx); }
            else { f.fadeMap.set(idx, newA); }
          });
          toDelete.forEach(idx => f.fadeMap.delete(idx));

          // Expand frontier every N ticks
          f.tick++;
          if (f.tick >= FRONT_TICK && f.frontier.length > 0) {
            f.tick = 0;
            const next = [];
            f.frontier.forEach(idx => {
              (nbMap[idx] || []).forEach(nIdx => {
                if (!f.visited.has(nIdx)) {
                  f.visited.add(nIdx);
                  f.fadeMap.set(nIdx, ALPHA_START);
                  next.push(nIdx);
                }
              });
            });
            f.frontier = next;
            // Slowly reduce strength as front travels far
            f.strength = Math.max(0.3, f.strength - 0.001);
          }

          // Apply tint to hexes — pick strongest source per hex
          f.fadeMap.forEach((a, idx) => {
            const h = hexes[idx];
            if (!h) return;
            const effective = a * f.strength;
            if (effective > h.tintA) {
              h.tintA = effective;
              h.tintR = f.col[0];
              h.tintG = f.col[1];
              h.tintB = f.col[2];
            }
          });
        });
      }

      // ── DRAW HEXAGONS ──────────────────────────────────────────────────────
      hexes.forEach(h => {
        h.pulse += h.speed;
        const wave      = (Math.sin(h.pulse) + 1) / 2;
        const sweepDist = Math.abs(h.x - sweepX);
        const sb        = sweepDist < 80 ? (1 - sweepDist / 80) * 0.25 : 0;

        const hasTint = h.tintA > 0.04;
        const cs      = hasTint ? `${h.tintR},${h.tintG},${h.tintB}` : "0,245,255";
        const ta      = h.tintA;

        if (h.type === "node") {
          const alpha = Math.min(1, 0.2 + wave*.38 + sb + ta*.55);
          hexPath(h.x, h.y, HEX_SIZE);
          ctx.strokeStyle = `rgba(${cs},${alpha})`;
          ctx.lineWidth   = hasTint ? 2 : 1.5; ctx.stroke();

          hexPath(h.x, h.y, HEX_SIZE - 4);
          ctx.fillStyle = hasTint
            ? `rgba(${h.tintR},${h.tintG},${h.tintB},${0.04+ta*.1})`
            : `rgba(0,180,220,${0.03+wave*.06})`; ctx.fill();

          ctx.beginPath(); ctx.arc(h.x, h.y, 3 + sb*2 + ta*2, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${cs},${0.5+wave*.5})`; ctx.fill();

          if (wave > 0.82 || ta > 0.25) {
            hexPath(h.x, h.y, HEX_SIZE + 5 + wave*4 + ta*5);
            ctx.strokeStyle = `rgba(${cs},${Math.max((wave-.82)*.45, ta*.35)})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        } else if (h.type === "active") {
          const alpha = Math.min(0.9, 0.06 + wave*.14 + sb*.1 + ta*.45);
          hexPath(h.x, h.y, HEX_SIZE);
          ctx.strokeStyle = hasTint ? `rgba(${cs},${alpha})` : `rgba(0,212,170,${alpha})`;
          ctx.lineWidth = hasTint ? 1.2 : 0.8; ctx.stroke();
          hexPath(h.x, h.y, HEX_SIZE);
          ctx.fillStyle = hasTint
            ? `rgba(${h.tintR},${h.tintG},${h.tintB},${0.01+ta*.07})`
            : `rgba(0,212,170,${0.01+wave*.02})`; ctx.fill();
        } else {
          const alpha = Math.min(0.8, 0.02 + wave*.04 + sb*.06 + ta*.55);
          hexPath(h.x, h.y, HEX_SIZE);
          ctx.strokeStyle = hasTint ? `rgba(${cs},${alpha})` : `rgba(0,245,255,${alpha})`;
          ctx.lineWidth = hasTint ? 1 : 0.5; ctx.stroke();
          if (hasTint && ta > 0.12) {
            hexPath(h.x, h.y, HEX_SIZE);
            ctx.fillStyle = `rgba(${h.tintR},${h.tintG},${h.tintB},${ta*.08})`; ctx.fill();
          }
        }
      });

      // ── CONNECTION LINES ──────────────────────────────────────────────────
      connections.forEach(c => {
        c.progress += c.speed;
        if (c.progress > 2) c.progress = -0.5;
        const dx = c.to.x-c.from.x, dy = c.to.y-c.from.y;

        ctx.beginPath(); ctx.moveTo(c.from.x,c.from.y); ctx.lineTo(c.to.x,c.to.y);
        ctx.strokeStyle = "rgba(0,245,255,0.04)"; ctx.lineWidth = 0.6; ctx.stroke();

        const p = Math.max(0,Math.min(1,c.progress));
        if (p>0 && p<1) {
          const s=Math.max(0,p-.22), e=Math.min(1,p);
          const lg=ctx.createLinearGradient(c.from.x+dx*s,c.from.y+dy*s,c.from.x+dx*e,c.from.y+dy*e);
          lg.addColorStop(0,"rgba(0,245,255,0)"); lg.addColorStop(0.5,"rgba(0,245,255,0.65)"); lg.addColorStop(1,"rgba(0,245,255,0.08)");
          ctx.beginPath(); ctx.moveTo(c.from.x+dx*s,c.from.y+dy*s); ctx.lineTo(c.from.x+dx*e,c.from.y+dy*e);
          ctx.strokeStyle=lg; ctx.lineWidth=1.5; ctx.stroke();
        }
      });

      // ── DATA PARTICLES ────────────────────────────────────────────────────
      particles.forEach((p,i) => {
        p.t += p.speed*p.dir;
        if (p.t>1.1||p.t<-0.1) {
          const c=connections[Math.floor(Math.random()*connections.length)];
          particles[i]={conn:c,t:p.dir>0?0:1,speed:p.speed,dir:p.dir,alpha:p.alpha,size:p.size,crimson:Math.random()>.72};
          return;
        }
        const tc=Math.max(0,Math.min(1,p.t));
        const px=p.conn.from.x+(p.conn.to.x-p.conn.from.x)*tc;
        const py=p.conn.from.y+(p.conn.to.y-p.conn.from.y)*tc;
        const cs=p.crimson?"255,40,70":"0,245,255";
        const g=ctx.createRadialGradient(px,py,0,px,py,p.size*4);
        g.addColorStop(0,`rgba(${cs},${p.alpha*.8})`); g.addColorStop(1,`rgba(${cs},0)`);
        ctx.beginPath(); ctx.arc(px,py,p.size*4,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,p.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(220,255,255,${p.alpha})`; ctx.fill();
      });
      if (Math.random()<.005 && particles.length<22) spawnParticle();

      // ── RIPPLES ──────────────────────────────────────────────────────────
      ripples=ripples.filter(r=>r.alpha>0.01);
      ripples.forEach(r => {
        r.r+=1.1; r.alpha*=.972;
        const ra=r.alpha*(1-r.r/r.maxR); if(ra<=0)return;
        ctx.beginPath(); ctx.arc(r.x,r.y,r.r,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${r.cr},${r.cg},${r.cb},${ra})`; ctx.lineWidth=1; ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); clearInterval(waveInterval); };
  }, []);

  return (
    React.createElement('canvas', {
      ref: canvasRef,
      style: { position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 },}
    )
  );
}

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes logoIn   { from{opacity:0;transform:translateY(-16px) scale(0.93)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes flicker    { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.4} 94%{opacity:1} 97%{opacity:0.7} 98%{opacity:1} }
  @keyframes crimsonIn  { from{opacity:0;transform:translateY(-20px) scaleX(0.85)} to{opacity:1;transform:translateY(0) scaleX(1)} }
  @keyframes vsIn       { from{opacity:0;transform:translateY(18px) scale(0.7)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes glowPulse  { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.25)} }
  @keyframes scanline { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes borderPulse { 0%,100%{border-color:rgba(0,245,255,0.2)} 50%{border-color:rgba(0,245,255,0.55)} }

  .menu-btn:hover  { background:rgba(245,166,35,0.09) !important; border-color:rgba(0,245,255,0.0) !important; transform:translateX(6px) !important; color:#f5a623 !important; box-shadow: inset 3px 0 0 #f5a623, 0 0 18px rgba(245,166,35,0.15) !important; }
  .menu-btn:active { transform:scale(0.97) translateX(2px) !important; }

  .back-btn:hover { background:rgba(245,166,35,0.08) !important; color:#f5a623 !important; border-color:rgba(245,166,35,0.5) !important; }
  .seg-btn:hover  { filter:brightness(1.2); }
  .tab-btn:hover  { filter:brightness(1.2); }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(0,245,255,0.2); border-radius:2px; }

  ::selection { background:rgba(0,245,255,0.25); color:#00f5ff; }
`;

// ─────────────────────────────────────────────
// SHARED STYLE OBJECTS
// ─────────────────────────────────────────────
const S = {
  root: {
    width:"100%", minHeight:"100vh", background:"transparent",
    fontFamily:"'Courier New', monospace",
  },
  content: {
    position:"relative", zIndex:1,
    maxWidth:440, margin:"0 auto",
    padding:"0 1.25rem",
    minHeight:"100vh",
    display:"flex", flexDirection:"column",
  },

  screenTitle: {
    fontSize:19, fontWeight:700,
    color:C.accent, letterSpacing:"0.12em",
    textTransform:"uppercase",
    margin:"0.75rem 0 0.25rem",
    textShadow:`0 0 18px ${C.accentDim}`,
  },

  card: {
    background:C.card,
    border:`1px solid ${C.border}`,
    borderRadius:10,
    padding:"14px 16px",
    backdropFilter:"blur(6px)",
  },

  label: {
    fontSize:11, fontWeight:700,
    color:C.accentDim,
    letterSpacing:"0.12em",
    textTransform:"uppercase",
    marginBottom:6,
  },
  desc:  { fontSize:12, color:C.textMuted, marginBottom:8 },
  body:  { fontSize:13, lineHeight:1.8, color:C.textSub },

  backBtn: {
    alignSelf:"flex-start",
    background:"transparent",
    border:`1px solid ${C.border}`,
    borderRadius:6,
    color:C.textMuted,
    fontFamily:"'Courier New',monospace",
    fontSize:13,
    padding:"7px 14px",
    cursor:"pointer",
    letterSpacing:"0.05em",
    WebkitTapHighlightColor:"transparent",
    marginTop:"1.5rem",
    transition:"all 0.18s",
  },

  menuBtn: () => ({
    display:"flex", alignItems:"center", gap:14,
    width:"100%", padding:"14px 18px",
    background:"rgba(0,10,60,0.4)",
    border:`1px solid ${C.border}`,
    borderRadius:10, cursor:"pointer",
    color:C.textPrimary,
    fontSize:15, letterSpacing:"0.06em",
    textAlign:"left", transition:"all 0.18s",
    WebkitTapHighlightColor:"transparent",
    backdropFilter:"blur(4px)",
    outline:"none",
  }),
  btnLabel: { flex:1, fontWeight:700, fontFamily:"'Courier New',monospace" },
  btnArrow: { fontSize:20, opacity:0.35 },

  segBtn: (active) => ({
    flex:1, padding:"9px 6px",
    background: active ? C.accentFaint : "rgba(0,10,60,0.4)",
    border:`1px solid ${active ? C.borderMid : C.border}`,
    borderRadius:8,
    color: active ? C.accent : C.textSub,
    fontFamily:"'Courier New',monospace", fontSize:12,
    cursor:"pointer", transition:"all 0.18s",
    WebkitTapHighlightColor:"transparent",
    textShadow: active ? `0 0 10px ${C.accentDim}` : "none",
  }),

  tab: (active) => ({
    padding:"5px 12px",
    background: active ? C.accentFaint : "rgba(0,10,60,0.35)",
    border:`1px solid ${active ? C.borderMid : C.border}`,
    borderRadius:20,
    color: active ? C.accent : C.textSub,
    fontFamily:"'Courier New',monospace", fontSize:11,
    cursor:"pointer", transition:"all 0.18s",
    WebkitTapHighlightColor:"transparent",
    textShadow: active ? `0 0 8px ${C.cyanDim}` : "none",
  }),

  toggleWrap: (on) => ({
    width:48, height:26,
    background: on ? "rgba(0,245,255,0.2)" : "rgba(0,10,60,0.5)",
    border:`1px solid ${on ? "rgba(0,245,255,0.5)" : C.border}`,
    borderRadius:13, cursor:"pointer",
    position:"relative", transition:"all 0.25s",
    flexShrink:0, WebkitTapHighlightColor:"transparent",
  }),
  knob: (on) => ({
    position:"absolute", top:3, left:3,
    width:18, height:18, borderRadius:"50%",
    background: on ? C.cyan : "rgba(0,200,220,0.35)",
    boxShadow: on ? `0 0 8px ${C.cyanDim}` : "none",
    transition:"transform 0.25s cubic-bezier(0.22,1,0.36,1), background 0.25s",
    transform: on ? "translateX(22px)" : "none",
  }),

  callout: {
    display:"flex", alignItems:"center", gap:10,
    padding:"10px 14px",
    background:C.accentFaint,
    border:`1px solid ${C.border}`,
    borderRadius:8,
    fontSize:12, color:C.textSub,
  },

  phaseStep: { display:"flex", gap:12, alignItems:"flex-start" },
  phaseNum: {
    width:26, height:26, borderRadius:"50%",
    background:C.accentFaint,
    border:`1px solid ${C.border}`,
    color:C.accent, fontSize:12, fontWeight:700,
    display:"flex", alignItems:"center", justifyContent:"center",
    flexShrink:0,
    textShadow:`0 0 8px ${C.accentDim}`,
  },

  flowStep: {
    width:"100%", padding:"10px 14px",
    background:C.accentFaint,
    border:`1px solid ${C.border}`,
    borderRadius:8, fontSize:12,
    color:C.textSub, textAlign:"center",
  },
  flowArrow: { textAlign:"center", color:C.textMuted, fontSize:16, margin:"2px 0" },

  outcome: { display:"flex", alignItems:"center", gap:10, fontSize:12, color:C.textSub },

  footer: {
    display:"flex", alignItems:"center", justifyContent:"center",
    gap:8, fontSize:10,
    color:C.textMuted,
    letterSpacing:"0.12em",
    paddingBottom:"1.5rem", marginTop:"auto",
  },

  csBox: {
    display:"flex", flexDirection:"column", alignItems:"center",
    gap:12, padding:"3rem 2rem",
    background:C.card,
    border:`1px solid ${C.border}`,
    borderRadius:12, textAlign:"center", margin:"1rem 0",
    backdropFilter:"blur(6px)",
  },
  csTitle: {
    fontSize:18, fontWeight:700,
    color:C.accent, letterSpacing:"0.1em",
    textTransform:"uppercase",
    textShadow:`0 0 14px ${C.accentDim}`,
  },
  csDesc: { fontSize:13, color:C.textMuted, lineHeight:1.7, maxWidth:280 },

  versionTag: {
    fontSize:10, color:C.textMuted,
    letterSpacing:"0.1em", textAlign:"center", marginTop:"0.5rem",
  },
};

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────
function StyleTag() {
  return React.createElement('style', null, GLOBAL_CSS);
}

function BackBtn({ label, onClick }) {
  return React.createElement('button', { className: "back-btn", style: S.backBtn, onClick: onClick,}, label);
}

function Toggle({ on, onToggle }) {
  return (
    React.createElement('div', { style: S.toggleWrap(on), onClick: onToggle,}
      , React.createElement('div', { style: S.knob(on),} )
    )
  );
}

// scanline overlay
function Scanline() {
  return (
    React.createElement('div', { style: {
      position:"fixed", inset:0, pointerEvents:"none", zIndex:2,
      background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",
    },} )
  );
}

// ─── MAIN MENU ────────────────────────────────
function MainMenu({ onNav }) {
  const t = useT();
  const { settings } = useSettings();

  const items = [
    { icon:"⚔",  label:t("menu.play"),        screen:"game"    },
    { icon:"🃏", label:t("menu.deckBuilder"), screen:"deck"    },
    { icon:"📖", label:t("menu.guide"),       screen:"guide"   },
    { icon:"⚙",  label:t("menu.options"),     screen:"options" },
  ];

  return (
    React.createElement('div', { style: S.root,}
      , React.createElement('div', { style: S.content,}

        /* LOGO BLOCK */
        , React.createElement('div', { style: {
          paddingTop:"2.5rem",
          display:"flex", flexDirection:"column", alignItems:"center", gap:10,
          animation:"logoIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
        },}
          /* Logo block */
          , React.createElement('div', { style: { display:"flex", flexDirection:"column", alignItems:"center", gap:0 },}

            /* CRIMSON — cyan with glow */
            , React.createElement('div', { style: {
              fontSize:"clamp(38px,11vw,56px)", fontWeight:900,
              letterSpacing:"0.1em", lineHeight:1,
              fontFamily:"'Courier New',monospace",
              color:"#00f5ff",
              textShadow:"0 0 16px rgba(0,245,255,0.7), 0 0 36px rgba(0,245,255,0.3)",
              position:"relative", zIndex:1,
              animation:"crimsonIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both, glowPulse 3.5s ease-in-out 1s infinite",
            },}, "CRIMSON")

            /* VS — red with glow */
            , React.createElement('div', { style: {
              fontSize:"clamp(26px,7.5vw,40px)", fontWeight:900,
              letterSpacing:"0.42em",
              fontFamily:"'Courier New',monospace",
              color:"#ff2244",
              textShadow:"0 0 18px rgba(255,30,60,0.8), 0 0 42px rgba(255,30,60,0.4), 0 0 2px #fff",
              marginTop:"-2px",
              position:"relative", zIndex:1,
              animation:"vsIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.35s both, glowPulse 3.5s ease-in-out 1.4s infinite",
            },}, "VS")

          )

          /* Japanese subtitle */
          , React.createElement('div', { style: {
            fontSize:9, letterSpacing:"0.3em",
            color:C.textMuted,
            fontFamily:"'Courier New',monospace",
          },}, "クリムソンバーサス")

          /* Tagline */
          , React.createElement('div', { style: {
            fontSize:9, letterSpacing:"0.18em",
            color:C.textMuted,
            textTransform:"uppercase",
            borderTop:`1px solid rgba(0,245,255,0.12)`,
            borderBottom:`1px solid rgba(0,245,255,0.12)`,
            padding:"4px 16px",
            animation:"flicker 6s infinite 2s",
          },}
            , t("menu.tagline")
          )
        )

        /* NAV */
        , React.createElement('nav', { style: { display:"flex", flexDirection:"column", gap:10, padding:"2rem 0 1.5rem" },}
          , items.map((item, i) => (
            React.createElement('button', {
              key: item.screen,
              className: "menu-btn",
              style: {
                ...S.menuBtn(),
                animation:`slideIn 0.45s cubic-bezier(0.22,1,0.36,1) ${i*0.07}s both`,
              },
              onClick: () => onNav(item.screen),}

              , React.createElement('span', { style: { fontSize:18, width:24, textAlign:"center", flexShrink:0 },}, item.icon)
              , React.createElement('span', { style: S.btnLabel,}, item.label)
              , React.createElement('span', { style: S.btnArrow,}, "›")
            )
          ))
        )

        , React.createElement('div', { style: S.footer,}
          , React.createElement('span', null, CVS_VERSION, " Vanilla" )
          , React.createElement('span', { style: {opacity:0.4},}, "·")
          , React.createElement('span', null, settings.language === "en" ? "English" : "Português")
          , React.createElement('span', { style: {opacity:0.4},}, "·")
          , React.createElement('span', { style: {color:C.textMuted},}, "ALTIMIT OS" )
        )
      )
    )
  );
}

// ─── OPTIONS ──────────────────────────────────
function OptionsScreen({ onBack }) {
  const t = useT();
  const { settings, updateSetting } = useSettings();

  const toggles = [
    { key:"music", label:t("options.music") },
  ];

  return (
    React.createElement('div', { style: S.root,}
      , React.createElement('div', { style: {...S.content},}
        , React.createElement(BackBtn, { label: `‹ ${t("options.back")}`, onClick: onBack,} )
        , React.createElement('h1', { style: S.screenTitle,}, t("options.title"))

        , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10, paddingBottom:"2.5rem" },}

          , React.createElement('div', { style: S.card,}
            , React.createElement('div', { style: S.label,}, t("options.language"))
            , React.createElement('div', { style: S.desc,}, t("options.languageDesc"))
            , React.createElement('div', { style: { display:"flex", gap:8 },}
              , ["en","pt"].map(lang => (
                React.createElement('button', { key: lang, className: "seg-btn",
                  style: S.segBtn(settings.language === lang),
                  onClick: () => updateSetting("language", lang),}
                  , lang === "en" ? "🇬🇧 English" : "🇧🇷 Português"
                )
              ))
            )
          )

          , toggles.map(item => (
            React.createElement('div', { key: item.key, style: { ...S.card, display:"flex", alignItems:"center", justifyContent:"space-between" },}
              , React.createElement('div', { style: S.label,}, item.label)
              , React.createElement(Toggle, { on: settings[item.key], onToggle: () => updateSetting(item.key, !settings[item.key]),} )
            )
          ))

        )
      )
    )
  );
}

// ─── GUIDE ────────────────────────────────────
function GuideScreen({ onBack }) {
  const t = useT();
  const [chapter, setChapter] = useState("overview");
  const [jSearch, setJSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const toggleCollapse = (i) => setCollapsed(p => ({...p, [i]: !p[i]}));

  const chapters = [
    { key:"overview",  label:t("guide.chapters.overview")  },
    { key:"cards",     label:t("guide.chapters.cards")     },
    { key:"phases",    label:t("guide.chapters.phases")    },
    { key:"clash",     label:t("guide.chapters.clash")     },
    { key:"battle",    label:t("guide.chapters.battle")    },
    { key:"timing",    label:t("guide.chapters.timing")    },
    { key:"junction",  label:t("guide.chapters.junction")  },
    { key:"deckRules", label:t("guide.chapters.deckRules") },
  ];

  const phaseColors = ["#f5a623","#00f5ff","#ffcc00","#cc88ff"];

  return (
    React.createElement('div', { style: S.root,}
      , React.createElement('div', { style: {...S.content},}
        , React.createElement(BackBtn, { label: `‹ ${t("guide.back")}`, onClick: onBack,} )
        , React.createElement('h1', { style: S.screenTitle,}, t("guide.title"))

        , React.createElement('div', { style: { display:"flex", flexWrap:"wrap", gap:5, margin:"0.5rem 0 0.75rem" },}
          , chapters.map(c => (
            React.createElement('button', { key: c.key, className: "tab-btn", style: S.tab(chapter === c.key), onClick: () => setChapter(c.key),}
              , c.label
            )
          ))
        )

        /* All chapters rendered always — CSS display:none hides inactive ones, no remount */
        , React.createElement('div', { style: { position:"relative" },}

          /* ── OVERVIEW ── */
          , React.createElement('div', { style: { display: chapter==="overview" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:8},}
              , React.createElement('div', { style: {fontSize:14, fontWeight:700, color:C.accent},}, t("guide.overview.title"))
              , React.createElement('p', { style: S.body,}, t("guide.overview.body"))
            )
            , React.createElement('div', { style: S.callout,}, React.createElement('span', null, "⚠"), React.createElement('span', null, ".hack//G.U. — "  , React.createElement('strong', null, "ALTIMIT Mine OS"  )))
          )

          /* ── CARDS ── */
          , React.createElement('div', { style: { display: chapter==="cards" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:8},}
              , React.createElement('div', { style: {fontSize:13, fontWeight:700, color:C.gold},}, t("guide.cards.generalName"))
              , React.createElement('p', { style: S.body,}, t("guide.cards.generalDesc"))
              , React.createElement('div', { style: {display:"flex", gap:6, flexWrap:"wrap"},}
                , [["rgba(0,200,100,0.15)","#44ee88","HP"],["rgba(255,60,80,0.15)","#ff6677","AP"],["rgba(140,60,255,0.15)","#bb88ff","Charisma"]].map(([bg,col,lbl])=>(
                  React.createElement('span', { key: lbl, style: {padding:"4px 10px", borderRadius:20, background:bg, color:col, fontSize:11, fontWeight:600, fontFamily:"monospace"},}, lbl)
                ))
              )
            )
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:8},}
              , React.createElement('div', { style: {fontSize:13, fontWeight:700, color:C.textPrimary},}, t("guide.cards.unitName"))
              , React.createElement('p', { style: S.body,}, t("guide.cards.unitDesc"))
              , React.createElement('div', { style: {fontSize:12, fontWeight:700, color:C.accent, marginTop:4},}, t("guide.cards.typeTitle"))
              , React.createElement('p', { style: {...S.body, fontSize:12},}, t("guide.cards.typeDesc"))
              , React.createElement('div', { style: {display:"flex", gap:6},}
                , [["rgba(255,60,60,0.12)","rgba(255,60,60,0.35)","#ff7766","⚔ Assault"],
                  ["rgba(60,120,255,0.12)","rgba(60,120,255,0.35)","#88aaff","🛡 Shield"],
                  ["rgba(0,200,120,0.12)","rgba(0,200,120,0.35)","#44ee99","🦅 Snipe"]].map(([bg,bd,col,lbl])=>(
                  React.createElement('div', { key: lbl, style: {flex:1, padding:"7px 0", textAlign:"center", background:bg, border:`1px solid ${bd}`, borderRadius:6, color:col, fontSize:11, fontWeight:600, fontFamily:"monospace"},}, lbl)
                ))
              )
              , t("guide.cards.typeList").map((line,i) => (
                React.createElement('div', { key: i, style: {...S.outcome},}
                  , React.createElement('span', { style: {color:"#f5a623", fontSize:12, width:14},}, "›")
                  , React.createElement('span', { style: {fontSize:12},}, line)
                )
              ))
            )
          )

          /* ── PHASES ── */
          , React.createElement('div', { style: { display: chapter==="phases" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:10},}
              , React.createElement('div', { style: {fontSize:14, fontWeight:700, color:C.accent},}, t("guide.phases.title"))
              , t("guide.phases.steps").map((step, i) => (
                React.createElement('div', { key: i, style: S.phaseStep,}
                  , React.createElement('div', { style: S.phaseNum,}, i+1)
                  , React.createElement('p', { style: {...S.body, paddingTop:3},}, step)
                )
              ))
            )
          )

          /* ── CLASH ── */
          , React.createElement('div', { style: { display: chapter==="clash" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:8},}
              , React.createElement('div', { style: {fontSize:14, fontWeight:700, color:C.accent},}, t("guide.clash.title"))
              , React.createElement('p', { style: S.body,}, t("guide.clash.body"))
            )
            , React.createElement('div', { style: {...S.card, display:"flex", alignItems:"center", justifyContent:"center", gap:8},}
              , ["Right","Center","Left"].map((pos,i)=>(
                React.createElement('span', { key: pos, style: {display:"inline-flex", alignItems:"center", gap:8},}
                  , React.createElement('span', { style: {padding:"6px 10px", background:C.accentFaint, border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, fontWeight:700, color:C.accent},}, pos)
                  , i<2 && React.createElement('span', { style: {color:C.textMuted, fontSize:14},}, "→")
                )
              ))
            )
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:8},}
              , t("guide.clash.rules").map((r,i)=>(
                React.createElement('div', { key: i, style: S.outcome,}
                  , React.createElement('span', { style: {color:["#44ee88","#f0c040","#ff4466","#88aaff"][i], fontSize:14, width:20, textAlign:"center"},}, ["✓","△","✕","→"][i])
                  , React.createElement('span', null, r)
                )
              ))
            )
          )

          /* ── BATTLE ── */
          , React.createElement('div', { style: { display: chapter==="battle" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:8},}
              , React.createElement('div', { style: {fontSize:14, fontWeight:700, color:C.accent},}, t("guide.battle.title"))
              , React.createElement('p', { style: S.body,}, t("guide.battle.body"))
            )
            , React.createElement('div', { style: {...S.card, display:"flex", flexDirection:"column", gap:8},}
              , t("guide.battle.rules").map((r,i)=>(
                React.createElement('div', { key: i, style: S.phaseStep,}
                  , React.createElement('div', { style: S.phaseNum,}, i+1)
                  , React.createElement('p', { style: {...S.body, paddingTop:3, fontSize:12},}, r)
                )
              ))
            )
          )

          /* ── TIMING ── */
          , React.createElement('div', { style: { display: chapter==="timing" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card},}
              , React.createElement('div', { style: {fontSize:14, fontWeight:700, color:C.accent, marginBottom:6},}, t("guide.timing.title"))
              , React.createElement('p', { style: S.body,}, t("guide.timing.intro"))
            )
            , t("guide.timing.phases").map((ph, pi) => {
              const isOpen = !collapsed[pi];
              const col    = phaseColors[pi];
              return (
                React.createElement('div', { key: pi, style: { borderRadius:10, border:`1px solid ${col}44`, background:"rgba(2,4,38,0.7)" },}
                  , React.createElement('div', { onClick: () => toggleCollapse(pi), style: {
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"12px 14px", cursor:"pointer",
                    background: isOpen ? `${col}14` : `${col}08`,
                    borderBottom: isOpen ? `1px solid ${col}33` : "none",
                  },}
                    , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:10},}
                      , React.createElement('div', { style: { width:10, height:10, borderRadius:"50%", background:col, boxShadow:`0 0 6px ${col}`, flexShrink:0 },})
                      , React.createElement('span', { style: {fontSize:13, fontWeight:700, color:col, fontFamily:"monospace"},}, ph.phase)
                      , React.createElement('span', { style: { fontSize:9, padding:"2px 7px", borderRadius:10, background:`${col}22`, color:col, border:`1px solid ${col}44`, fontFamily:"monospace" },}, ph.abilities.length)
                    )
                    , React.createElement('span', { style: { fontSize:16, color:col, opacity:0.7, transform: isOpen ? "rotate(180deg)" : "none", lineHeight:1 },}, "⌄")
                  )
                  , isOpen && (
                    React.createElement('div', { style: {padding:"10px 14px 14px", display:"flex", flexDirection:"column", gap:8},}
                      , React.createElement('p', { style: {...S.body, fontSize:12, color:C.textMuted},}, ph.desc)
                      , React.createElement('div', { style: {display:"flex", flexWrap:"wrap", gap:5},}
                        , ph.abilities.map((a, ai) => (
                          React.createElement('span', { key: ai, style: { padding:"4px 9px", borderRadius:5, fontSize:11, fontFamily:"monospace", background:`${col}18`, color:col, border:`1px solid ${col}35`, lineHeight:1.4 },}, a)
                        ))
                      )
                    )
                  )
                )
              );
            })
          )

          /* ── JUNCTION ── */
          , React.createElement('div', { style: { display: chapter==="junction" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card},}
              , React.createElement('div', { style: {fontSize:14, fontWeight:700, color:C.accent, marginBottom:4},}, t("guide.junction.title"))
              , React.createElement('p', { style: {...S.body, fontSize:12},}, t("guide.junction.intro"))
              , React.createElement('div', { style: S.callout,}, React.createElement('span', null, "ℹ"), React.createElement('span', null, t("guide.junction.note")))
            )
            , React.createElement('input', { value: jSearch, onChange: e=>setJSearch(e.target.value), placeholder: "Search abilities..." ,
              style: { width:"100%", background:"rgba(0,10,60,0.5)", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.textPrimary, fontFamily:"monospace", fontSize:12, outline:"none" },}
            )
            , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:5},}
              , t("guide.junction.list")
                .filter(j => !jSearch || j.name.toLowerCase().includes(jSearch.toLowerCase()) || j.effect.toLowerCase().includes(jSearch.toLowerCase()))
                .map((j,i) => (
                React.createElement('div', { key: i, style: { background:"rgba(0,10,50,0.5)", border:`1px solid ${C.border}`, borderRadius:7, padding:"8px 12px", display:"flex", gap:10, alignItems:"flex-start" },}
                  , React.createElement('div', { style: {minWidth:130, fontSize:11, fontWeight:700, color:C.accent, fontFamily:"monospace"},}, j.name)
                  , React.createElement('div', { style: {fontSize:11, color:C.textSub, fontFamily:"monospace", lineHeight:1.5},}, j.effect)
                )
              ))
            )
          )

          /* ── DECK RULES ── */
          , React.createElement('div', { style: { display: chapter==="deckRules" ? "flex" : "none", flexDirection:"column", gap:12, paddingBottom:"2.5rem" },}
            , React.createElement('div', { style: {...S.card},}
              , React.createElement('div', { style: {fontSize:14, fontWeight:700, color:C.accent, marginBottom:6},}, t("guide.deckRules.title"))
              , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:8},}
                , t("guide.deckRules.rules").map((r,i) => (
                  React.createElement('div', { key: i, style: S.phaseStep,}
                    , React.createElement('div', { style: S.phaseNum,}, i+1)
                    , React.createElement('p', { style: {...S.body, paddingTop:3, fontSize:12},}, r)
                  )
                ))
              )
            )
            , React.createElement('div', { style: S.callout,}
              , React.createElement('span', null, "⚠")
              , React.createElement('span', null, "Charisma validation applies only to the final 3 units after Ban + Cut — not the full pool of 5."                   )
            )
          )

        )
      )
    )
  );
}

// ─────────────────────────────────────────────
// CARD DATA
// ─────────────────────────────────────────────
const GENERALS_DATA = [
  {id:1,num:"001",name:"Haseo at Dawn",charisma:12,hp:16,ap:3,type:"Assault",rarity:"Ultra Rare",img:"No_001_Haseo_at_Dawn.png"},
  {id:2,num:"002",name:"Kite",charisma:10,hp:16,ap:3,type:"Assault",rarity:"Super Rare",img:"No_002_Kite.png"},
  {id:3,num:"003",name:"Haseo the Black Rogue",charisma:9,hp:16,ap:4,type:"Assault",rarity:"Super Rare",img:"No_003_Haseo_the_Black_Rogue.png"},
  {id:4,num:"004",name:"BlackRose",charisma:11,hp:11,ap:3,type:"Assault",rarity:"Rare",img:"No_004_Black_Rose.png"},
  {id:5,num:"005",name:"Haseo the Terror",charisma:6,hp:20,ap:4,type:"Assault",rarity:"Rare",img:"No_005_Haseo_the_Terror_of_Death.png"},
  {id:6,num:"006",name:"Pi - Raven",charisma:8,hp:17,ap:3,type:"Assault",rarity:"Common",img:"No_006_Pi_-_Raven.png"},
  {id:7,num:"007",name:"Balmung",charisma:7,hp:15,ap:4,type:"Assault",rarity:"Common",img:"No_007_Balmung.png"},
  {id:8,num:"008",name:"Tabby",charisma:12,hp:14,ap:1,type:"Assault",rarity:"Common",img:"No_008_Tabby_-_Twilight_Brigade.png"},
  {id:9,num:"009",name:"Degenerating Haseo",charisma:7,hp:23,ap:2,type:"Assault",rarity:"Common",img:"No_009_Degenerating_Haseo.png"},
  {id:10,num:"010",name:"Shino",charisma:14,hp:16,ap:2,type:"Shield",rarity:"Ultra Rare",img:"No_010_Shino_-_Twilight_Brigade.png"},
  {id:11,num:"011",name:"Sakisaka",charisma:10,hp:20,ap:2,type:"Shield",rarity:"Ultra Rare",img:"No_011_Sakisaka_-_Twilight_Brigade.png"},
  {id:12,num:"012",name:"Haseo Counterattacks",charisma:8,hp:23,ap:3,type:"Shield",rarity:"Super Rare",img:"No_012_Haseo_Counterattacks.png"},
  {id:13,num:"013",name:"Gaspard - Canard",charisma:11,hp:15,ap:2,type:"Shield",rarity:"Rare",img:"No_013_Gaspard_-_Canard.png"},
  {id:14,num:"014",name:"Atoli - Moon Tree",charisma:10,hp:17,ap:2,type:"Shield",rarity:"Rare",img:"No_014_Atoli_-_Moon_Tree.png"},
  {id:15,num:"015",name:"Sakubo - Trifle",charisma:10,hp:10,ap:2,type:"Shield",rarity:"Common",img:"No_015_Sakubo_-_Trifle.png"},
  {id:16,num:"016",name:"Orca",charisma:9,hp:11,ap:4,type:"Shield",rarity:"Common",img:"No_016_Orca.png"},
  {id:17,num:"017",name:"Raid of New Punishers",charisma:6,hp:29,ap:1,type:"Shield",rarity:"Common",img:"No_017_Raid_of_New_Punishers.png"},
  {id:18,num:"018",name:"Ovan the Wanderer",charisma:12,hp:12,ap:4,type:"Snipe",rarity:"Ultra Rare",img:"No_018_Ovan_the_Wanderer.png"},
  {id:19,num:"019",name:"Tri-Edge",charisma:5,hp:25,ap:5,type:"Snipe",rarity:"Super Rare",img:"No_019_Tri-Edge.png"},
  {id:20,num:"020",name:"Endrance the Exquisite",charisma:13,hp:10,ap:3,type:"Snipe",rarity:"Super Rare",img:"No_020_Endrance_the_Exquisite.png"},
  {id:21,num:"021",name:"Kuhn - Raven",charisma:12,hp:10,ap:2,type:"Snipe",rarity:"Rare",img:"No_021_Kuhn_-_Raven.png"},
  {id:22,num:"022",name:"Bordeaux",charisma:8,hp:24,ap:2,type:"Snipe",rarity:"Rare",img:"No_022_Bordeaux_the_Mad_Blade.png"},
  {id:23,num:"023",name:"Ovan the Twilight",charisma:11,hp:8,ap:3,type:"Snipe",rarity:"Common",img:"No_023_Ovan_the_Twilight.png"},
  {id:24,num:"024",name:"Mistral",charisma:10,hp:14,ap:1,type:"Snipe",rarity:"Common",img:"No_024_Mistral.png"},
  {id:25,num:"025",name:"Silabus - Canard",charisma:9,hp:18,ap:2,type:"Snipe",rarity:"Common",img:"No_025_Silabus_-_Canard.png"},
];

const UNITS_DATA = [
  {id:26,num:"026",name:"Kappa Rappa Kappa",cost:1,type:"Assault",junction:"Whirlwind Assault",rarity:"Common",img:"No_026_Kappa_Rappa_Kappa.png"},
  {id:27,num:"027",name:"Bamyon!",cost:1,type:"Assault",junction:"Mind's Eye",rarity:"Common",img:"No_027_Bamyon_.png"},
  {id:28,num:"028",name:"What Was That?!",cost:2,type:"Assault",junction:"Quick Lightning",rarity:"Common",img:"No_028_What_Was_That__.png"},
  {id:29,num:"029",name:"Climactic Theory",cost:2,type:"Assault",junction:"Whirlwind Assault",rarity:"Common",img:"No_029_Climactic_Theory.png"},
  {id:30,num:"030",name:"The Trinity",cost:2,type:"Assault",junction:"Charge Ahead",rarity:"Common",img:"No_030_The_Trinity.png"},
  {id:31,num:"031",name:"March of Destruction",cost:2,type:"Assault",junction:"Vengeful Arrow",rarity:"Common",img:"No_031_March_of_Destruction.png"},
  {id:32,num:"032",name:"Falling Flag",cost:2,type:"Assault",junction:"Momentary Glory",rarity:"Common",img:"No_032_Falling_Flag.png"},
  {id:33,num:"033",name:"Fearful Shino",cost:3,type:"Assault",junction:"Veil of Aura",rarity:"Common",img:"No_033_Fearful_Shino.png"},
  {id:34,num:"034",name:"Time of Peace",cost:3,type:"Assault",junction:"Whirlwind Assault",rarity:"Rare",img:"No_034_Time_of_Peace.png"},
  {id:35,num:"035",name:"Unreaching Blade",cost:3,type:"Assault",junction:"Mind's Eye",rarity:"Rare",img:"No_035_Unreaching_Blade.png"},
  {id:36,num:"036",name:"Black Rose of Insight",cost:4,type:"Assault",junction:"Charge Ahead",rarity:"Rare",img:"No_036_Black_Rose_of_Insight.png"},
  {id:37,num:"037",name:"Passing Through",cost:4,type:"Assault",junction:"Quick Lightning",rarity:"Rare",img:"No_037_Passing_Through.png"},
  {id:38,num:"038",name:"Iron Fist of Anger",cost:4,type:"Assault",junction:"Hammer of Undoing",rarity:"Rare",img:"No_038_Iron_Fist_of_Anger.png"},
  {id:39,num:"039",name:"Unyielding Sparks",cost:4,type:"Assault",junction:"Merciless Light",rarity:"Rare",img:"No_039_Unyielding_Sparks.png"},
  {id:40,num:"040",name:"Treasonous Self",cost:5,type:"Assault",junction:"Divine Punishment",rarity:"Rare",img:"No_040_Treasonous_Self.png"},
  {id:41,num:"041",name:"Thirst for Justice",cost:4,type:"Assault",junction:"Price of Insight",rarity:"Super Rare",img:"No_041_Thirst_for_Justice.png"},
  {id:42,num:"042",name:"Flame of Consumption",cost:6,type:"Assault",junction:"Divine Punishment",rarity:"Super Rare",img:"No_042_Flame_of_Consumption.png"},
  {id:43,num:"043",name:"Decapitation of Oath",cost:7,type:"Assault",junction:"Demonic Spear",rarity:"Super Rare",img:"No_043_Decapitation_of_Oath.png"},
  {id:44,num:"044",name:'"She"',cost:6,type:"Assault",junction:"Estranged Self",rarity:"Ultra Rare",img:"No_044___She__.png"},
  {id:45,num:"045",name:"Baptism of Smiles",cost:7,type:"Assault",junction:"Border of Zero",rarity:"Ultra Rare",img:"No_045_Baptism_of_Smiles.png"},
  {id:46,num:"046",name:"Wrath of Logos",cost:1,type:"Shield",junction:"Shield Protection",rarity:"Common",img:"No_046_Wrath_of_Logos.png"},
  {id:47,num:"047",name:"Young Girl's Path",cost:1,type:"Shield",junction:"Vitality Medicine",rarity:"Common",img:"No_047_Young_Girl_s_Path.png"},
  {id:48,num:"048",name:"Azure Sea's Laugh",cost:1,type:"Shield",junction:"Energy Genome",rarity:"Common",img:"No_048_Azure_Sea_s_Laugh.png"},
  {id:49,num:"049",name:"Voluntary Trust",cost:2,type:"Shield",junction:"Spirit Clothes",rarity:"Common",img:"No_049_Voluntary_Trust.png"},
  {id:50,num:"050",name:"Come Back Alive",cost:2,type:"Shield",junction:"Clenching Teeth",rarity:"Common",img:"No_050_Come_Back_Alive.png"},
  {id:51,num:"051",name:"Aurora Gaze",cost:2,type:"Shield",junction:"Shield Protection",rarity:"Common",img:"No_051_Aurora_Gaze.png"},
  {id:52,num:"052",name:"Refrain of Shadows",cost:2,type:"Shield",junction:"Grief of Comrade",rarity:"Common",img:"No_052_Refrain_of_Shadows.png"},
  {id:53,num:"053",name:"Coppelia's Repose",cost:3,type:"Shield",junction:"Anu's Karma",rarity:"Common",img:"No_053_Coppelia_s_Repose.png"},
  {id:54,num:"054",name:"Rival Spirits",cost:3,type:"Shield",junction:"Warning Harmony",rarity:"Rare",img:"No_054_Rival_Spirits.png"},
  {id:55,num:"055",name:"A Time To Love",cost:3,type:"Shield",junction:"Shield Protection",rarity:"Rare",img:"No_055_A_Time_To_Love.png"},
  {id:56,num:"056",name:"With My Brother",cost:3,type:"Shield",junction:"Spirit Clothes",rarity:"Rare",img:"No_056_With_My_Brother.png"},
  {id:57,num:"057",name:"Shadow of Memories",cost:4,type:"Shield",junction:"Vitality Medicine",rarity:"Rare",img:"No_057_Shadow_of_Memories.png"},
  {id:58,num:"058",name:"Freedom to Imagine",cost:4,type:"Shield",junction:"Anu's Karma",rarity:"Rare",img:"No_058_Freedom_to_Imagine.png"},
  {id:59,num:"059",name:"Healing Waves",cost:4,type:"Shield",junction:"Immortal Genome",rarity:"Rare",img:"No_059_Healing_Waves.png"},
  {id:60,num:"060",name:"Ace of Hearts",cost:5,type:"Shield",junction:"Verboten Libation",rarity:"Rare",img:"No_060_Ace_of_Hearts.png"},
  {id:61,num:"061",name:"Invisible",cost:6,type:"Shield",junction:"Veil of Aura",rarity:"Super Rare",img:"No_061_Invisible.png"},
  {id:62,num:"062",name:"Restraint of Discipline",cost:5,type:"Shield",junction:"Filling Hollow",rarity:"Super Rare",img:"No_062_Restraint_of_Discipline.png"},
  {id:63,num:"063",name:"No More Loss",cost:6,type:"Shield",junction:"Warning Harmony",rarity:"Super Rare",img:"No_063_No_More_Loss.png"},
  {id:64,num:"064",name:"Melody Pursuer",cost:6,type:"Shield",junction:"Time Torrent",rarity:"Ultra Rare",img:"No_064_Melody_Pursuer.png"},
  {id:65,num:"065",name:"Impenetrable Barrier",cost:7,type:"Shield",junction:"Mirror of Revenge",rarity:"Ultra Rare",img:"No_065_Impenetrable_Barrier.png"},
  {id:66,num:"066",name:"Unstoppable Resolve",cost:1,type:"Snipe",junction:"Snipe Thunder",rarity:"Common",img:"No_066_Unstoppable_Resolve.png"},
  {id:67,num:"067",name:"Cat Punch!!",cost:1,type:"Snipe",junction:"Fire Fang",rarity:"Common",img:"No_066_Cat_Punch__.png"},
  {id:68,num:"068",name:"Bird in a Cage",cost:1,type:"Snipe",junction:"Energy Drain",rarity:"Common",img:"No_068_Bird_In_A_Cage.png"},
  {id:69,num:"069",name:"Master Subaru!",cost:2,type:"Snipe",junction:"Folset's Trial",rarity:"Common",img:"No_069_Master_Subaru_.png"},
  {id:70,num:"070",name:"Jackpot",cost:2,type:"Snipe",junction:"Snipe Thunder",rarity:"Common",img:"No_070_Jackpot.png"},
  {id:71,num:"071",name:"Angry Blue Sky",cost:2,type:"Snipe",junction:"Flame Fang",rarity:"Common",img:"No_071_Angry_Blue_Sky.png"},
  {id:72,num:"072",name:"PK Network",cost:2,type:"Snipe",junction:"All At Once",rarity:"Common",img:"No_072_PK_Network.png"},
  {id:73,num:"073",name:"Two Fangs",cost:3,type:"Snipe",junction:"Bone Crunching",rarity:"Common",img:"No_073_Two_Fangs.png"},
  {id:74,num:"074",name:"Gimme Some Chim!",cost:3,type:"Snipe",junction:"Snipe Thunder",rarity:"Rare",img:"No_074_Gimme_Some_Chim_.png"},
  {id:75,num:"075",name:"Bland Self",cost:3,type:"Snipe",junction:"Change Ring",rarity:"Rare",img:"No_075_Bland_Self.png"},
  {id:76,num:"076",name:"Order Upheld",cost:3,type:"Snipe",junction:"Flame Fang",rarity:"Rare",img:"No_076_Order_Upheld.png"},
  {id:77,num:"077",name:"Rose Letters",cost:4,type:"Snipe",junction:"Aurora Tears",rarity:"Rare",img:"No_077_Rose_Letters.png"},
  {id:78,num:"078",name:"Reckless Roar",cost:4,type:"Snipe",junction:"Bone Crunching",rarity:"Rare",img:"No_078_Reckless_Roar.png"},
  {id:79,num:"079",name:"Check This Out!",cost:5,type:"Snipe",junction:"All At Once",rarity:"Rare",img:"No_079_Check_This_Out_.png"},
  {id:80,num:"080",name:"Broken Full Moon",cost:4,type:"Snipe",junction:"Meeting of Souls",rarity:"Rare",img:"No_080_Broken_Full_Moon.png"},
  {id:81,num:"081",name:"Dancing Lion",cost:5,type:"Snipe",junction:"Will of Similars",rarity:"Super Rare",img:"No_081_Dancing_Lion.png"},
  {id:82,num:"082",name:"Don't Kick!!",cost:6,type:"Snipe",junction:"Trial by Fire",rarity:"Super Rare",img:"No_082_Don_t_kick__.png"},
  {id:83,num:"083",name:"Officially Allowed",cost:6,type:"Snipe",junction:"Quickdance",rarity:"Super Rare",img:"No_083_Officially_Allowed.png"},
  {id:84,num:"084",name:"Strongest Smile",cost:6,type:"Snipe",junction:"Twilight's Call",rarity:"Ultra Rare",img:"No_084_Strongest_Smile.png"},
  {id:85,num:"085",name:"Grim Reaper's Rondo",cost:7,type:"Snipe",junction:"Avatar's Descent",rarity:"Ultra Rare",img:"No_085_Grim_Reaper_s_Rondo.png"},
];

const RARITY_STARS = { "Common":1, "Rare":2, "Super Rare":3, "Ultra Rare":4 };
const RARITY_COLOR = { "Common":"rgba(180,195,220,0.7)", "Rare":"rgba(100,180,255,0.9)", "Super Rare":"rgba(200,120,255,0.9)", "Ultra Rare":"rgba(255,200,50,1)" };
const TYPE_IMG     = { "Assault":IMGS["Assault_Trinity"]||"", "Shield":IMGS["Shield_Trinity"]||"", "Snipe":IMGS["Snipe_Trinity"]||"" };
const TYPE_COLOR   = { "Assault":"#ff4455", "Shield":"#4488ff", "Snipe":"#44cc66" };
const TYPE_GLOW    = { "Assault":"rgba(255,50,60,0.5)", "Shield":"rgba(50,120,255,0.5)", "Snipe":"rgba(50,200,80,0.5)" };
const STAR_IMG     = IMGS["Star_Rarity"]||"";

// ─── SVG HEXAGON HELPER ───────────────────────
function Hex({ size, bg, border, children, style={} }) {
  // Flat-top hexagon using SVG clip — exact match to card example
  const id = `hex-${bg.replace(/[^a-z0-9]/gi,'')}-${size}`;
  return (
    React.createElement('div', { style: {
      position:"relative", width:size, height:size,
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0, ...style,
    },}
      , React.createElement('svg', { width: size, height: size, style: { position:"absolute", inset:0 },}
        , React.createElement('defs', null
          , React.createElement('clipPath', { id: id,}
            , React.createElement('polygon', { points: [0,1,2,3,4,5].map(i=>{
              const a = Math.PI/3*i - Math.PI/6;
              return `${size/2+size/2*0.92*Math.cos(a)},${size/2+size/2*0.92*Math.sin(a)}`;
            }).join(" "),})
          )
        )
        , React.createElement('polygon', {
          points: [0,1,2,3,4,5].map(i=>{
            const a = Math.PI/3*i - Math.PI/6;
            return `${size/2+size/2*0.92*Math.cos(a)},${size/2+size/2*0.92*Math.sin(a)}`;
          }).join(" "),
          fill: bg, stroke: border||"rgba(255,255,255,0.3)", strokeWidth: "1.5",}
        )
      )
      , React.createElement('div', { style: { position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", width:"100%", height:"100%" },}
        , children
      )
    )
  );
}

// ─── UNIT CARD ────────────────────────────────
function UnitCard({ card, selected, onToggle, disabled, ineligible }) {
  const stars  = RARITY_STARS[card.rarity] || 1;
  const tColor = TYPE_COLOR[card.type]  || "#aaa";
  const tGlow  = TYPE_GLOW[card.type]   || "transparent";
  const rColor = RARITY_COLOR[card.rarity] || "#aaa";

  const trinityBg = card.type==="Assault" ? "#1a0a0a"
                  : card.type==="Shield"   ? "#060e2a"
                  : "#061a0a";
  const trinityBorder = card.type==="Assault" ? "#ff3344"
                      : card.type==="Shield"   ? "#3366ff"
                      : "#33cc55";

  return (
    React.createElement('div', {
      onClick: () => !disabled && !ineligible && onToggle && onToggle(card),
      style: {
        position:"relative", width:"100%", aspectRatio:"3/4",
        borderRadius:8, overflow:"hidden",
        cursor: (disabled || ineligible) ? "default" : "pointer",
        border: ineligible ? "1.5px solid rgba(255,40,60,0.5)"
              : selected   ? `2px solid ${tColor}`
              :              "1.5px solid rgba(255,255,255,0.12)",
        boxShadow: selected ? `0 0 16px ${tGlow}, 0 0 4px ${tColor}` : "0 2px 8px rgba(0,0,0,0.5)",
        transition:"all 0.18s", background:"#0a0620",
        flexShrink:0,
        opacity: ineligible ? 0.25 : (disabled && !selected) ? 0.4 : 1,
      },}

      /* Full-card art */
      , React.createElement('img', {
        src: IMGS[card.img.replace('.png','')] || '',
        alt: card.name,
        style: { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" },}
      )

      /* Ineligible overlay — cost exceeds general chr */
      , ineligible && (
        React.createElement('div', { style: {position:"absolute",inset:0,background:"rgba(180,0,0,0.35)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:10},}
          , React.createElement('span', { style: {fontSize:9,fontWeight:900,color:"#ff4466",fontFamily:"monospace",
            background:"rgba(0,0,0,0.8)",padding:"2px 5px",borderRadius:3,
            border:"1px solid rgba(255,40,60,0.5)"},}, "OVER CHR" )
        )
      )

      /* ── TOP-LEFT: Cost hex + Trinity hex side by side, larger ── */
      , React.createElement('div', { style: { position:"absolute", top:5, left:5, display:"flex", flexDirection:"row", gap:1, zIndex:3, alignItems:"center" },}

        /* Cost hexagon — purple solid, FIRST (left) */
        , React.createElement(Hex, { size: 36, bg: "#7a1fc8", border: "#c060ff",}
          , React.createElement('span', { style: { fontSize:18, fontWeight:900, color:"#fff", fontFamily:"monospace", lineHeight:1 },}
            , card.cost
          )
        )

        /* Trinity hexagon — color per type, SECOND (right) */
        , React.createElement(Hex, { size: 36,
          bg: card.type==="Assault" ? "#0a1a40" : card.type==="Shield" ? "#2a1e00" : "#2a0808",
          border: card.type==="Assault" ? "#66bbff" : card.type==="Shield" ? "#ffdd44" : "#ff3333",}

          , React.createElement('img', {
            src: TYPE_IMG[card.type],
            alt: card.type,
            style: {
              width:26, height:26, objectFit:"contain",
              filter: card.type==="Snipe"
                ? "hue-rotate(80deg) saturate(2) brightness(1.4)"
                : "none",
            },}
          )
        )

      )

      /* ── TOP-RIGHT: UNIT tag ── */
      , React.createElement('div', { style: {
        position:"absolute", top:6, right:6, zIndex:3,
        fontSize:10, fontWeight:700, color:"#fff",
        fontFamily:"monospace", letterSpacing:"0.1em",
        textShadow:"0 1px 4px rgba(0,0,0,0.9)",
      },}, "UNIT")

      /* ── BOTTOM OVERLAY ── */
      , React.createElement('div', { style: {
        position:"absolute", bottom:0, left:0, right:0, zIndex:2,
        background:"linear-gradient(transparent 0%, rgba(6,3,24,0.6) 30%, rgba(6,3,24,0.95) 60%)",
      },}

        /* Name bar — purple gradient, >>> num name */
        , React.createElement('div', { style: {
          background:"linear-gradient(90deg, rgba(120,40,180,0.92), rgba(80,20,140,0.85))",
          padding:"4px 7px",
          display:"flex", alignItems:"center", gap:5,
          borderTop:"1px solid rgba(180,100,255,0.4)",
        },}
          , React.createElement('span', { style: { color:"#ffcc44", fontSize:11, fontWeight:900, letterSpacing:"0.05em" },}, ">>")
          , React.createElement('span', { style: { fontSize:10, color:"rgba(255,255,255,0.65)", fontFamily:"monospace", fontWeight:600 },}, card.num)
          , React.createElement('span', { style: {
            fontSize:11, fontWeight:700, color:"#fff", fontFamily:"monospace", flex:1,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          },}, card.name)
        )

        /* Junction bar — grey "CrimsonVS" style with bold underlined text */
        , React.createElement('div', { style: {
          background:"linear-gradient(90deg, rgba(140,130,150,0.85), rgba(100,90,120,0.8))",
          padding:"3px 6px",
          display:"flex", alignItems:"center", justifyContent:"center",
          borderBottom:"1px solid rgba(255,255,255,0.08)",
          position:"relative",
        },}
          /* watermark text */
          , React.createElement('span', { style: {
            position:"absolute", left:5, fontSize:8, color:"rgba(180,170,200,0.3)",
            fontFamily:"monospace", fontWeight:700, letterSpacing:"0.05em", userSelect:"none",
          },}, "Crimson")
          , React.createElement('span', { style: {
            position:"absolute", right:5, fontSize:8, color:"rgba(180,170,200,0.3)",
            fontFamily:"monospace", fontWeight:700, letterSpacing:"0.05em", userSelect:"none",
          },}, "VS")
          , React.createElement('span', { style: {
            fontSize:11, fontWeight:900, color:"#fff", fontFamily:"monospace",
            textDecoration:"underline", whiteSpace:"nowrap", overflow:"hidden",
            textOverflow:"ellipsis", position:"relative", zIndex:1,
            textShadow:"0 0 6px rgba(255,255,255,0.4)",
          },}, card.junction)
        )

        /* Footer: AP hex | rarity bar | HP hex */
        , React.createElement('div', { style: {
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"4px 5px", gap:4,
          background:"rgba(4,2,20,0.9)",
        },}

          /* AP hex — cyan/blue */
          , React.createElement(Hex, { size: 30, bg: "#0066cc", border: "#44aaff",}
            , React.createElement('span', { style: { fontSize:9, fontWeight:900, color:"#fff", fontFamily:"monospace" },}, "AP")
          )

          /* Rarity bar — dark bar with stars centered */
          , React.createElement('div', { style: {
            flex:1, height:22,
            background:"rgba(30,25,50,0.9)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:3,
            display:"flex", alignItems:"center", justifyContent:"center", gap:2,
          },}
            , Array.from({length:stars}).map((_,i) => (
              React.createElement('img', { key: i, src: STAR_IMG, alt: "★",
                style: { width:13, height:13, objectFit:"contain" },}
              )
            ))
          )

          /* HP hex — red */
          , React.createElement(Hex, { size: 30, bg: "#cc1133", border: "#ff4466",}
            , React.createElement('span', { style: { fontSize:9, fontWeight:900, color:"#fff", fontFamily:"monospace" },}, "HP")
          )

        )
      )

      /* Selected checkmark */
      , selected && (
        React.createElement('div', { style: {
          position:"absolute", top:4, right:4, width:15, height:15, zIndex:10,
          background:tColor, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:9, fontWeight:900, color:"#fff",
          boxShadow:`0 0 8px ${tColor}`,
        },}, "✓")
      )
    )
  );
}

// ─── GENERAL CARD ─────────────────────────────
function GeneralCard({ card, selected, onSelect }) {
  const tColor = TYPE_COLOR[card.type]  || "#aaa";
  const tGlow  = TYPE_GLOW[card.type]   || "transparent";
  const rColor = RARITY_COLOR[card.rarity] || "#aaa";
  const stars  = RARITY_STARS[card.rarity] || 1;

  const trinityBg = card.type==="Assault" ? "#1a0a0a"
                  : card.type==="Shield"   ? "#060e2a"
                  : "#061a0a";
  const trinityBorder = card.type==="Assault" ? "#ff3344"
                      : card.type==="Shield"   ? "#3366ff"
                      : "#33cc55";

  return (
    React.createElement('div', { onClick: () => onSelect && onSelect(card),
      style: {
        position:"relative", width:"100%", aspectRatio:"3/4",
        borderRadius:8, overflow:"hidden", cursor:"pointer",
        border: selected ? `2px solid ${tColor}` : "1.5px solid rgba(255,255,255,0.12)",
        boxShadow: selected ? `0 0 16px ${tGlow}` : "0 2px 8px rgba(0,0,0,0.5)",
        transition:"all 0.18s", background:"#0a0620", flexShrink:0,
      },}

      , React.createElement('img', { src: IMGS[card.img.replace('.png','')] || '',
        alt: card.name,
        style: { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" },}
      )

      /* Top-left: Charisma hex (left) + Trinity hex (right), larger */
      , React.createElement('div', { style: { position:"absolute", top:5, left:5, display:"flex", flexDirection:"row", gap:1, zIndex:3, alignItems:"center" },}
        /* Charisma hexagon — purple, FIRST (left) */
        , React.createElement(Hex, { size: 36, bg: "#7a1fc8", border: "#c060ff",}
          , React.createElement('span', { style: { fontSize:16, fontWeight:900, color:"#fff", fontFamily:"monospace", lineHeight:1 },}
            , card.charisma
          )
        )
        /* Trinity hexagon — color per type, SECOND (right) */
        , React.createElement(Hex, { size: 36,
          bg: card.type==="Assault" ? "#0a1a40" : card.type==="Shield" ? "#2a1e00" : "#2a0808",
          border: card.type==="Assault" ? "#66bbff" : card.type==="Shield" ? "#ffdd44" : "#ff3333",}

          , React.createElement('img', { src: TYPE_IMG[card.type], alt: card.type,
            style: {
              width:26, height:26, objectFit:"contain",
              filter: card.type==="Snipe"
                ? "hue-rotate(80deg) saturate(2) brightness(1.4)"
                : "none",
            },})
        )
      )

      /* Top-right: GENERAL tag */
      , React.createElement('div', { style: {
        position:"absolute", top:6, right:6, zIndex:3,
        fontSize:10, fontWeight:700, color:"#fff",
        fontFamily:"monospace", letterSpacing:"0.1em",
        textShadow:"0 1px 4px rgba(0,0,0,0.9)",
      },}, "GENERAL")

      /* Bottom overlay */
      , React.createElement('div', { style: {
        position:"absolute", bottom:0, left:0, right:0, zIndex:2,
        background:"linear-gradient(transparent 0%, rgba(4,2,20,0.6) 25%, rgba(4,2,20,0.96) 60%)",
      },}
        /* Name bar */
        , React.createElement('div', { style: {
          background:"linear-gradient(90deg,rgba(120,40,180,0.88),rgba(80,20,140,0.8))",
          padding:"3px 6px", display:"flex", alignItems:"center", gap:4,
          borderTop:`1px solid ${tColor}55`,
        },}
          , React.createElement('span', { style: { fontSize:10, color:"rgba(255,255,255,0.55)", fontFamily:"monospace" },}, card.num)
          , React.createElement('span', { style: { fontSize:11, fontWeight:700, color:"#fff", fontFamily:"monospace", flex:1,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },}, card.name)
        )

        /* Stats + stars */
        , React.createElement('div', { style: {
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"4px 6px", background:"rgba(4,2,20,0.9)",
        },}
          , React.createElement('div', { style: { display:"flex", gap:5 },}
            , React.createElement('span', { style: { fontSize:10, color:"#44ee88", fontFamily:"monospace", fontWeight:700 },}, "HP " , card.hp)
            , React.createElement('span', { style: { fontSize:10, color:"#ff8844", fontFamily:"monospace", fontWeight:700 },}, "AP " , card.ap)
            , React.createElement('span', { style: { fontSize:10, color:"#cc88ff", fontFamily:"monospace", fontWeight:700 },}, "C " , card.charisma)
          )
          , React.createElement('div', { style: { display:"flex", gap:2, alignItems:"center" },}
            , Array.from({length:stars}).map((_,i) => (
              React.createElement('img', { key: i, src: STAR_IMG, alt: "★",
                style: { width:10, height:10, objectFit:"contain" },})
            ))
          )
        )
      )

      , selected && (
        React.createElement('div', { style: {
          position:"absolute", top:4, right:4, width:15, height:15, zIndex:10,
          background:tColor, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:9, fontWeight:900, color:"#fff",
          boxShadow:`0 0 8px ${tColor}`,
        },}, "✓")
      )
    )
  );
}

// ─── DECK BUILDER ─────────────────────────────
function DeckBuilderScreen({ onBack }) {
  const t = useT();

  // Orientation detection — portrait vs landscape
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined" ? window.innerWidth > window.innerHeight : false
  );
  useEffect(() => {
    const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  const gridCols = isLandscape ? "repeat(6,1fr)" : "repeat(4,1fr)";
  const gridGap  = isLandscape ? 3 : 5;

  // Load decks instantly from localStorage — no delay, no external calls
  const [view, setView]             = useState("list");
  const [decks, setDecks]           = useState(() => {
    try {
      const saved = localStorage.getItem("cvs_decks");
      return saved ? JSON.parse(saved) : [];
    } catch (e2) { return []; }
  });
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckName, setDeckName]       = useState("");
  const [confirmDel, setConfirmDel]   = useState(null);

  // Persist to localStorage on every change — synchronous, instant
  useEffect(() => {
    try { localStorage.setItem("cvs_decks", JSON.stringify(decks)); }
    catch (e3) { /* quota exceeded or unavailable */ }
  }, [decks]);

  // Editor state
  const [tab, setTab]           = useState("general"); // "general" | "units"
  const [filterType, setFilter] = useState("All");
  const [filterRar,  setRar]    = useState("All");
  const [search, setSearch]     = useState("");
  const [selGeneral, setSelGen] = useState(null);
  const [selUnits, setSelUnits] = useState([]);

  function startNew() {
    setEditingDeck(null);
    setDeckName("Deck " + (decks.length + 1));
    setSelGen(null); setSelUnits([]); setTab("general");
    setFilter("All"); setRar("All"); setSearch("");
    setView("edit");
  }

  function startEdit(deck) {
    setEditingDeck(deck);
    setDeckName(deck.name);
    setSelGen(GENERALS_DATA.find(g => g.id === deck.generalId) || null);
    setSelUnits(UNITS_DATA.filter(u => deck.unitIds.includes(u.id)));
    setTab("general"); setFilter("All"); setRar("All"); setSearch("");
    setView("edit");
  }

  function saveDeck() {
    if (!selGeneral || selUnits.length !== 5) return;
    const entry = {
      id: editingDeck ? editingDeck.id : Date.now(),
      name: deckName || "Deck",
      generalId: selGeneral.id,
      unitIds: selUnits.map(u => u.id),
    };
    if (editingDeck) {
      setDecks(d => d.map(x => x.id === editingDeck.id ? entry : x));
    } else {
      setDecks(d => [...d, entry]);
    }
    setView("list");
  }

  function deleteDeck(id) { setDecks(d => d.filter(x => x.id !== id)); setConfirmDel(null); }

  function toggleUnit(card) {
    if (selUnits.find(u => u.id === card.id)) {
      setSelUnits(s => s.filter(u => u.id !== card.id));
    } else if (selUnits.length < 5) {
      // Block if adding this card would make total pts > charisma
      const newTotal = selUnits.reduce((s,u) => s+u.cost, 0) + card.cost;
      if (!selGeneral || newTotal <= selGeneral.charisma) {
        setSelUnits(s => [...s, card]);
      }
    }
  }

  const charisma   = _nullishCoalesce(_optionalChain([selGeneral, 'optionalAccess', _3 => _3.charisma]), () => ( 0));
  const totalCost  = selUnits.reduce((s,u) => s+u.cost, 0);
  // Valid: 5 units, total pts <= chr
  const valid = selGeneral && selUnits.length === 5 && totalCost <= charisma;

  // Filtered cards
  const filteredUnits = UNITS_DATA.filter(u => {
    if (filterType !== "All" && u.type !== filterType) return false;
    if (filterRar  !== "All" && u.rarity !== filterRar)  return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.junction.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredGens = GENERALS_DATA.filter(g => {
    if (filterType !== "All" && g.type !== filterType) return false;
    if (filterRar  !== "All" && g.rarity !== filterRar)  return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── LIST VIEW ──────────────────────────────
  if (view === "list") return (
    React.createElement('div', { style: S.root,}
      , React.createElement('div', { style: {...S.content, paddingBottom:"2rem"},}
        , React.createElement(BackBtn, { label: `‹ ${t("deckBuilder.back")}`, onClick: onBack,})
        , React.createElement('h1', { style: S.screenTitle,}, t("deckBuilder.title"))

        , React.createElement('button', { onClick: startNew, style: {
          width:"100%", padding:"13px", marginBottom:12,
          background:"rgba(245,166,35,0.1)", border:`1px solid ${C.borderMid}`,
          borderRadius:10, color:C.accent, fontFamily:"monospace", fontSize:14,
          fontWeight:700, cursor:"pointer", letterSpacing:"0.05em",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          transition:"all 0.18s",
        },}, "＋ " , t("deckBuilder.newDeck"))

        , React.createElement('div', { style: {...S.label},}, t("deckBuilder.savedDecks"))

        , decks.length === 0 && (
          React.createElement('div', { style: {...S.card, textAlign:"center", padding:"2rem", color:C.textMuted, fontSize:13},}
            , t("deckBuilder.noDeck")
          )
        )

        , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10 },}
          , decks.map(deck => {
            const gen = GENERALS_DATA.find(g => g.id === deck.generalId);
            const units = UNITS_DATA.filter(u => deck.unitIds.includes(u.id));
            const cost = units.reduce((s,u)=>s+u.cost,0);
            const isValid = gen && units.length===5 && cost<=gen.charisma;
            return (
              React.createElement('div', { key: deck.id, style: {...S.card, display:"flex", flexDirection:"column", gap:10},}
                /* Deck header */
                , React.createElement('div', { style: { display:"flex", alignItems:"center", justifyContent:"space-between" },}
                  , React.createElement('div', null
                    , React.createElement('div', { style: { fontSize:15, fontWeight:700, color:C.textPrimary, fontFamily:"monospace" },}, deck.name)
                    , React.createElement('div', { style: { fontSize:11, color: isValid ? "#44ee88" : "#ff4455", fontFamily:"monospace", marginTop:2 },}
                      , isValid ? `✓ ${t("deckBuilder.validDeck")}` : `✕ ${t("deckBuilder.invalidDeck")}`
                    )
                  )
                  , React.createElement('div', { style: { display:"flex", gap:6 },}
                    , React.createElement('button', { onClick: () => startEdit(deck), style: {
                      background:"rgba(0,245,255,0.08)", border:`1px solid ${C.border}`,
                      borderRadius:6, padding:"5px 10px", color:C.textSub, fontFamily:"monospace",
                      fontSize:11, cursor:"pointer",
                    },}, t("deckBuilder.edit"))
                    , React.createElement('button', { onClick: () => setConfirmDel(deck.id), style: {
                      background:"rgba(255,40,60,0.08)", border:"1px solid rgba(255,40,60,0.25)",
                      borderRadius:6, padding:"5px 10px", color:"#ff6677", fontFamily:"monospace",
                      fontSize:11, cursor:"pointer",
                    },}, t("deckBuilder.delete"))
                  )
                )

                /* Preview: general larger left + 5 units smaller right, same row height */
                , React.createElement('div', { style: { display:"flex", gap:4, height:80, alignItems:"stretch" },}

                  /* General — fixed width, full row height */
                  , gen && (
                    React.createElement('div', { style: {
                      width:60, flexShrink:0, height:"100%",
                      borderRadius:6, overflow:"hidden",
                      border:`2px solid ${TYPE_COLOR[gen.type]||"#aaa"}`,
                      boxShadow:`0 0 10px ${TYPE_GLOW[gen.type]||"transparent"}`,
                    },}
                      , React.createElement('img', { src: IMGS[gen.img.replace('.png','')] || '', alt: gen.name,
                        style: { width:"100%", height:"100%", objectFit:"cover", display:"block" },})
                    )
                  )

                  /* 5 Units — fill remaining space, same height */
                  , units.map(u => (
                    React.createElement('div', { key: u.id, style: {
                      flex:1, height:"100%", minWidth:0,
                      borderRadius:5, overflow:"hidden",
                      border:`1.5px solid ${TYPE_COLOR[u.type]||"#aaa"}`,
                      boxShadow:`0 0 4px ${TYPE_GLOW[u.type]||"transparent"}`,
                    },}
                      , React.createElement('img', { src: IMGS[u.img.replace('.png','')] || '', alt: u.name,
                        style: { width:"100%", height:"100%", objectFit:"cover", display:"block" },})
                    )
                  ))

                )

                /* Stats */
                , gen && (
                  React.createElement('div', { style: { display:"flex", gap:10, fontSize:10, color:C.textMuted, fontFamily:"monospace" },}
                    , React.createElement('span', null, "General: " , React.createElement('span', { style: {color:C.textSub},}, gen.name))
                    , React.createElement('span', null, "Cost: " , React.createElement('span', { style: {color: cost<=gen.charisma?"#44ee88":"#ff4455"},}, cost, "/", gen.charisma))
                  )
                )
              )
            );
          })
        )

        /* Confirm delete modal */
        , confirmDel && (
          React.createElement('div', { style: { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100,
            display:"flex", alignItems:"center", justifyContent:"center" },}
            , React.createElement('div', { style: {...S.card, maxWidth:300, width:"90%", textAlign:"center", display:"flex", flexDirection:"column", gap:14},}
              , React.createElement('div', { style: { fontSize:14, color:C.textPrimary, fontFamily:"monospace" },}, t("deckBuilder.confirmDelete"))
              , React.createElement('div', { style: { display:"flex", gap:8, justifyContent:"center" },}
                , React.createElement('button', { onClick: () => deleteDeck(confirmDel), style: {
                  background:"rgba(255,40,60,0.15)", border:"1px solid rgba(255,40,60,0.4)",
                  borderRadius:8, padding:"8px 20px", color:"#ff6677", fontFamily:"monospace", cursor:"pointer",
                },}, t("deckBuilder.delete"))
                , React.createElement('button', { onClick: () => setConfirmDel(null), style: {
                  background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                  borderRadius:8, padding:"8px 20px", color:C.textSub, fontFamily:"monospace", cursor:"pointer",
                },}, t("deckBuilder.cancel"))
              )
            )
          )
        )
      )
    )
  );

  // ── EDIT VIEW ──────────────────────────────
  return (
    React.createElement('div', { style: S.root,}
      , React.createElement('div', { style: { position:"relative", zIndex:1, display:"flex", flexDirection:"row", height:"100vh", overflow:"hidden" },}

        /* ─── LEFT PANEL: card browser ─── */
        , React.createElement('div', { style: { flex:1, display:"flex", flexDirection:"column", minWidth:0, borderRight:`1px solid ${C.border}` },}

          /* Header */
          , React.createElement('div', { style: { padding:"10px 12px 0", flexShrink:0 },}
            , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:8, marginBottom:8 },}
              , React.createElement('button', { onClick: () => setView("list"), style: { ...S.backBtn, marginTop:0, padding:"5px 10px", fontSize:12 },}, "‹")
              , React.createElement('input', {
                value: deckName,
                onChange: e => setDeckName(e.target.value),
                placeholder: t("deckBuilder.enterName"),
                style: {
                  flex:1, background:"rgba(0,10,60,0.6)", border:`1px solid ${C.border}`,
                  borderRadius:8, padding:"6px 10px", color:C.textPrimary,
                  fontFamily:"monospace", fontSize:12, outline:"none",
                },}
              )
              , React.createElement('button', { onClick: saveDeck, disabled: !valid, style: {
                background: valid ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${valid ? C.borderMid : C.border}`,
                borderRadius:8, padding:"6px 12px", color: valid ? C.accent : C.textMuted,
                fontFamily:"monospace", fontSize:11, fontWeight:700,
                cursor: valid ? "pointer" : "default", flexShrink:0,
              },}, t("deckBuilder.save"))
            )

            /* Tabs */
            , React.createElement('div', { style: { display:"flex", gap:5, marginBottom:6 },}
              , [["general", t("deckBuilder.general")], ["units", t("deckBuilder.units")]].map(([key, label]) => (
                React.createElement('button', { key: key, onClick: () => setTab(key), style: {
                  ...S.tab(tab === key), fontSize:13, padding:"7px 18px",
                },}, label, " " , key==="general" && selGeneral ? " ✓" : key==="units" ? ` ${selUnits.length}/5` : "")
              ))
            )

            /* Status bar */
            , selGeneral && (
              React.createElement('div', { style: {
                display:"flex", alignItems:"center", gap:6, padding:"5px 8px",
                background: totalCost > charisma ? "rgba(255,40,60,0.08)" : "rgba(0,255,100,0.05)",
                border:`1px solid ${totalCost > charisma ? "rgba(255,40,60,0.3)" : "rgba(0,255,100,0.2)"}`,
                borderRadius:7, marginBottom:6, fontSize:10, fontFamily:"monospace",
              },}
                , React.createElement('img', { src: IMGS[selGeneral.img.replace('.png','')] || '', alt: "",
                  style: { width:22, height:22, objectFit:"cover", borderRadius:3 },})
                , React.createElement('span', { style: { color:C.textSub, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },}, selGeneral.name)
                , React.createElement('span', { style: { color: totalCost > charisma ? "#ff6677" : "#44ee88", flexShrink:0 },}, "C "
                   , totalCost, "/", charisma, " " , totalCost > charisma ? "✕" : selUnits.length === 5 ? "✓" : `(${selUnits.length}/5)`
                )
              )
            )

            /* Filters */
            , React.createElement('div', { style: { display:"flex", gap:3, flexWrap:"wrap", marginBottom:5 },}
              , ["All","Assault","Shield","Snipe"].map(f => (
                React.createElement('button', { key: f, onClick: () => setFilter(f), style: {
                  ...S.tab(filterType === f), fontSize:12, padding:"6px 13px",
                  display:"flex", alignItems:"center", gap:5,
                },}
                  , f !== "All" && React.createElement('img', { src: TYPE_IMG[f], alt: f, style: { width:14, height:14, objectFit:"contain" },})
                  , f
                )
              ))
              , React.createElement('button', {
                onClick: () => setRar(r => r==="All"?"Ultra Rare":r==="Ultra Rare"?"Super Rare":r==="Super Rare"?"Rare":r==="Rare"?"Common":"All"),
                style: { ...S.tab(filterRar !== "All"), fontSize:12, padding:"6px 13px" },}
                , filterRar === "All" ? "★ All" : "★".repeat(RARITY_STARS[filterRar]||1)+" "+filterRar.replace(" Rare","R").replace("Super ","SR").replace("Ultra ","UR").replace("Common","C")
              )
            )
            , React.createElement('input', {
              value: search, onChange: e => setSearch(e.target.value),
              placeholder: t("deckBuilder.search"),
              style: {
                width:"100%", background:"rgba(0,10,60,0.5)", border:`1px solid ${C.border}`,
                borderRadius:7, padding:"8px 12px", color:C.textPrimary,
                fontFamily:"monospace", fontSize:13, outline:"none", marginBottom:6,
              },}
            )
          )

          /* Card grid — scrollable */
          , React.createElement('div', { style: { flex:1, overflowY:"auto", padding:"0 10px 16px" },}
            , tab === "general" && (
              React.createElement('div', { style: { display:"grid", gridTemplateColumns:gridCols, gap:gridGap },}
                , filteredGens.map(card => (
                  React.createElement(GeneralCard, { key: card.id, card: card,
                    selected: _optionalChain([selGeneral, 'optionalAccess', _4 => _4.id]) === card.id,
                    onSelect: setSelGen,})
                ))
              )
            )
            , tab === "units" && (
              React.createElement('div', { style: { display:"grid", gridTemplateColumns:gridCols, gap:gridGap },}
                , filteredUnits.map(card => {
                  const isSel = selUnits.some(u => u.id === card.id);
                  const curTotal = selUnits.reduce((s,u) => s+u.cost, 0);
                  const ineligible = selGeneral && !isSel && (curTotal + card.cost) > selGeneral.charisma;
                  return (
                    React.createElement(UnitCard, { key: card.id, card: card,
                      selected: isSel,
                      disabled: selUnits.length >= 5 && !isSel,
                      ineligible: ineligible,
                      onToggle: toggleUnit,})
                  );
                })
              )
            )
          )
        )

        /* ─── RIGHT PANEL: deck pool ─── */
        , React.createElement('div', { style: {
          width: isLandscape ? "18vw" : "22vw", maxWidth: isLandscape ? 90 : 110, minWidth:60, flexShrink:0,
          display:"flex", flexDirection:"column",
          background:"rgba(2,4,38,0.88)",
          borderLeft:`1px solid ${C.border}`,
          height:"100vh",
        },}
          /* Panel header */
          , React.createElement('div', { style: {
            padding:"6px 4px", borderBottom:`1px solid ${C.border}`,
            fontFamily:"monospace", fontSize:9, color:C.textMuted,
            letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0,
            textAlign:"center",
          },}, "Pool")

          /* Scrollable content */
          , React.createElement('div', { style: { flex:1, overflowY:"auto", overflowX:"hidden", padding:"6px 5px 12px" },}

            /* General label */
            , React.createElement('div', { style: { fontSize:8, color:C.textMuted, fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:3, textAlign:"center" },}, "GEN")

            /* General slot — image only, ratio via paddingBottom trick */
            , React.createElement('div', { onClick: () => selGeneral && setTab("general"),
              style: {
                position:"relative", width:"100%", paddingBottom:"133%",
                borderRadius:6, overflow:"hidden",
                cursor: selGeneral ? "pointer" : "default",
                border: selGeneral
                  ? `1.5px solid ${TYPE_COLOR[selGeneral.type]||"#aaa"}`
                  : "1.5px dashed rgba(245,166,35,0.2)",
                boxShadow: selGeneral ? `0 0 8px ${TYPE_GLOW[selGeneral.type]||"transparent"}` : "none",
                background: selGeneral ? "transparent" : "rgba(0,0,0,0.2)",
                marginBottom:5, flexShrink:0,
              },}
              , selGeneral ? (
                React.createElement('img', {
                  src: IMGS[selGeneral.img.replace('.png','')] || '',
                  alt: selGeneral.name,
                  style: { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" },}
                )
              ) : (
                React.createElement('span', { style: {
                  position:"absolute", inset:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:18, opacity:0.25, color:"#fff",
                },}, "?")
              )
            )

            /* Divider */
            , React.createElement('div', { style: { height:1, background:C.border, margin:"4px 0 6px", flexShrink:0 },})

            /* Units label */
            , React.createElement('div', { style: { fontSize:8, color:C.textMuted, fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:3, textAlign:"center" },}
              , selUnits.length, "/5"
            )

            /* 5 unit slots — image only, same paddingBottom trick */
            , Array.from({length:5}).map((_,i) => {
              const u = selUnits[i];
              return (
                React.createElement('div', { key: u ? u.id : "slot"+i,
                  onClick: () => u && toggleUnit(u),
                  style: {
                    position:"relative", width:"100%", paddingBottom:"133%",
                    borderRadius:6, overflow:"hidden", marginBottom:5,
                    cursor: u ? "pointer" : "default",
                    border: u
                      ? `1.5px solid ${TYPE_COLOR[u.type]||"#aaa"}`
                      : "1.5px dashed rgba(255,255,255,0.08)",
                    boxShadow: u ? `0 0 6px ${TYPE_GLOW[u.type]||"transparent"}` : "none",
                    background: u ? "transparent" : "rgba(0,0,0,0.12)",
                    flexShrink:0,
                  },}
                  , u ? (
                    React.createElement('img', {
                      src: IMGS[u.img.replace('.png','')] || '',
                      alt: u.name,
                      style: { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" },}
                    )
                  ) : (
                    React.createElement('span', { style: {
                      position:"absolute", inset:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:14, opacity:0.2, color:"#fff",
                    },}, "+")
                  )
                )
              );
            })

          )
        )

      )
    )
  );
}

// ─────────────────────────────────────────────
// ARENA — MODULE 1: PREPARATION
// ─────────────────────────────────────────────

// AI deck builder — picks a valid general + 5 units
function buildAIDeck(difficulty) {
  // Pick random general
  const gen = GENERALS_DATA[Math.floor(Math.random() * GENERALS_DATA.length)];
  // Build unit pool: pick units that fit charisma when 3 are chosen
  const shuffled = [...UNITS_DATA].sort(() => Math.random() - 0.5);
  const pool = [];
  // Hard: prefer higher cost units. Easy: random. Normal: mix
  const sorted = difficulty === "hard"
    ? shuffled.sort((a,b) => b.cost - a.cost)
    : difficulty === "easy"
    ? shuffled.sort((a,b) => a.cost - b.cost)
    : shuffled;
  // Try to pick 5 units where at least one valid 3-combo fits charisma
  for (const u of sorted) {
    if (pool.length >= 5) break;
    pool.push(u);
  }
  // Ensure we have exactly 5 unique units
  while (pool.length < 5) {
    const extra = UNITS_DATA.find(u => !pool.find(p => p.id === u.id));
    if (extra) pool.push(extra);
    else break;
  }
  return { general: gen, units: pool.slice(0, 5) };
}

// ─── CARD INFO POPUP ────────────────────────────────────────────────────────
function CardInfoBox({ card, onClose, isGen, bState }) {
  if (!card) return null;
  const tc  = TYPE_COLOR[card.type] || "#aaa";
  const tg  = TYPE_GLOW[card.type]  || "transparent";
  const side = card._side || "player";
  const borderCol  = side==="ai" ? "rgba(255,60,80,0.5)"  : "rgba(0,245,255,0.45)";
  const bgCol      = side==="ai" ? "rgba(30,0,5,0.97)"    : "rgba(0,8,40,0.97)";
  const nameCol    = side==="ai" ? "#ff6677"              : C.cyan;
  // Live stats for generals
  const liveHP = isGen && bState ? (side==="ai" ? bState.aHP : bState.pHP) : null;
  const liveAP = isGen && bState ? (side==="ai" ? bState.aAP : bState.pAP) : null;
  return (
    React.createElement('div', { style: {
      position:"fixed", bottom:72, left:"50%", transform:"translateX(-50%)",
      width:"calc(100% - 32px)", maxWidth:340,
      background:bgCol, borderRadius:12,
      border:`1px solid ${borderCol}`,
      boxShadow:`0 0 24px ${side==="ai"?"rgba(255,40,60,0.2)":"rgba(0,245,255,0.15)"}`,
      padding:"10px 12px", zIndex:200,
      display:"flex", gap:10, alignItems:"flex-start",
    }, onClick: e=>e.stopPropagation(),}
      /* Card image */
      , React.createElement('div', { style: {width:52,height:69,flexShrink:0,borderRadius:6,overflow:"hidden",
        border:`1.5px solid ${tc}`,
        boxShadow:`0 0 8px ${tg}`},}
        , React.createElement('img', { src: IMGS[card.img.replace(".png","")] || "", alt: card.name,
          style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
      )
      /* Info */
      , React.createElement('div', { style: {flex:1,minWidth:0},}
        , React.createElement('div', { style: {fontSize:13,fontWeight:700,color:"#fff",fontFamily:"monospace",marginBottom:4,lineHeight:1.2},}, card.name)
        , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap",marginBottom:4,alignItems:"center"},}
          , isGen ? (React.createElement(React.Fragment, null
            , React.createElement('span', { style: {fontSize:11,color:"#44ee88",fontFamily:"monospace",fontWeight:700},}, "HP " , liveHP!==null?liveHP:card.hp, liveHP!==null?React.createElement('span', { style: {fontSize:9,color:"rgba(255,255,255,0.35)"},}, "/", card.hp):"")
            , React.createElement('span', { style: {fontSize:11,color:"#ff8844",fontFamily:"monospace",fontWeight:700},}, "AP " , liveAP!==null?liveAP:card.ap)
            , React.createElement('span', { style: {fontSize:11,color:"#cc88ff",fontFamily:"monospace",fontWeight:700},}, "Chr " , card.charisma)
          )) : (React.createElement(React.Fragment, null
            , React.createElement('span', { style: {fontSize:11,color:"#cc88ff",fontFamily:"monospace",fontWeight:700},}, "Pts " , card.cost)
          ))
          , React.createElement('span', { style: {fontSize:10,color:tc,fontFamily:"monospace",fontWeight:700,
            background:tc+"22",padding:"1px 6px",borderRadius:3,border:`1px solid ${tc}44`},}, card.type)
        )
        , !isGen && card.junction && (
          React.createElement('div', { style: {fontSize:10,color:"rgba(180,220,255,0.85)",fontFamily:"monospace",lineHeight:1.4},}
            , React.createElement('span', { style: {color:C.textMuted},}, "Junction: " ), card.junction
          )
        )
      )
      /* Close */
      , React.createElement('span', { onClick: onClose,
        style: {cursor:"pointer",color:C.textMuted,fontSize:16,flexShrink:0,
          lineHeight:1,padding:"2px 4px",borderRadius:4,
          background:"rgba(255,255,255,0.06)"},}, "✕")
    )
  );
}


function ArenaPlaceholder({ onBack, difficulty }) {
  const { settings } = useSettings();
  const isPT = settings.language === "pt";
  // ── PHASES ──
  // "select"  → pick saved deck
  // "reveal"  → show both generals + unit pools side by side
  // "ban"     → player picks 1 enemy unit to ban
  // "cut"     → player picks 3 of 4 remaining units
  // "confirm" → layout summary before entering battle
  const [phase, setPhase]         = useState("select");

  // Player deck
  const [savedDecks, setSavedDecks] = useState([]);
  const [playerDeck, setPlayerDeck] = useState(null);   // saved deck object
  const [playerGen,  setPlayerGen]  = useState(null);
  const [playerPool, setPlayerPool] = useState([]);     // 5 units

  // AI deck
  const [aiGen,      setAiGen]      = useState(null);
  const [aiPool,     setAiPool]     = useState([]);     // 5 units

  // Ban phase
  const [playerBan,  setPlayerBan]  = useState(null);   // unit banned by player (from AI pool)
  const [aiBan,      setAiBan]      = useState(null);   // unit banned by AI (from player pool)

  // After ban: 4 remaining each
  const [playerRemaining, setPlayerRemaining] = useState([]); // 4 after ban
  const [aiRemaining,     setAiRemaining]     = useState([]); // 4 after ban

  // The Cut: player picks 3 of 4
  const [playerCut,  setPlayerCut]  = useState([]);     // 3 chosen
  const [aiCut,      setAiCut]      = useState([]);     // 3 chosen by AI

  // Layout: shuffled positions L/C/R (revealed at clash)
  const [playerLayout, setPlayerLayout] = useState([]); // [left, center, right]
  const [aiLayout,     setAiLayout]     = useState([]);
  // Clash state
  const [clashStep,    setClashStep]    = useState(0);
  const [clashResults, setClashResults] = useState([]);
  const [survivors,    setSurvivors]    = useState({player:[],ai:[]});
  const [showLog,      setShowLog]      = useState(false); // false | "clash" | "junction"
  // Persistent logs — survive across all phases
  const [battleLog,    setBattleLog]    = useState([]);    // clash event log entries
  const [junctionLog,  setJunctionLog]  = useState([]);    // junction entries [{card, side, confirmed}]
  // Battle state — declared at root to avoid conditional hook violation
  const [battleReady,  setBattleReady]  = useState(false);
  const [bState,       setBState]       = useState(null);
  const [battleOver,   setBattleOver]   = useState(null); // {winner:"player"|"ai"|"draw", reason}

  const [infoCard,     setInfoCard]   = useState(null);  // card info popup
  const [trinityWinner, setTrinityWinner] = useState(null); // "player"|"ai"|"draw"
  const [trinityChoice, setTrinityChoice] = useState(null); // player's pick
  const [trinityAiChoice, setTrinityAiChoice] = useState(null); // ai's pick
  const t = useT();

  // Load saved decks
  useEffect(() => {
    try {
      const d = localStorage.getItem("cvs_decks");
      if (d) setSavedDecks(JSON.parse(d));
    } catch (e4) {}
  }, []);

  // Initialize battle — must be at root level (Rules of Hooks)
  useEffect(() => {
    if (phase !== "battle" || battleReady || !playerGen || !aiGen) return;

    const pS = { hp:playerGen.hp, ap:playerGen.ap, junctions:[...survivors.player.map(u=>u.junction)] };
    const aS = { hp:aiGen.hp, ap:aiGen.ap, junctions:[...survivors.ai.map(u=>u.junction)] };
    const log = ["━━ JUNCTION PHASE ━━"];

    const applyJ = (jName, owner, opponent, oL) => {
      const eL = oL==="YOU"?"AI":"YOU";
      switch(jName) {
        case "Vitality Medicine":   owner.hp+=5;  log.push(`${oL}: Vitality Medicine +5 HP`); break;
        case "Verboten Libation":   owner.hp+=7;  log.push(`${oL}: Verboten Libation +7 HP`); break;
        case "Fire Fang":           owner.ap+=1;  log.push(`${oL}: Fire Fang +1 AP`); break;
        case "Flame Fang":          owner.ap+=2;  log.push(`${oL}: Flame Fang +2 AP`); break;
        case "Bone Crunching":      owner.ap+=4; owner.hp-=4; log.push(`${oL}: Bone Crunching +4 AP -4 HP`); break;
        case "Energy Drain":        owner.hp+=3; opponent.hp-=3; log.push(`${oL}: Energy Drain steal 3 HP from ${eL}`); break;
        case "Divine Punishment":   opponent.hp-=5; log.push(`${oL}: Divine Punishment 5 dmg to ${eL}`); break;
        case "Quick Lightning":     opponent.hp-=3; log.push(`${oL}: Quick Lightning 3 dmg to ${eL}`); break;
        case "First to Action":     opponent.hp-=5; log.push(`${oL}: First to Action — 5 dmg to ${eL} (takes +1 dmg/turn from now)`); break;
        case "Demonic Spear":       opponent.hp-=7; log.push(`${oL}: Demonic Spear 7 dmg to ${eL}`); break;
        case "Golden Spear":        opponent.hp-=4; log.push(`${oL}: Golden Spear 4 dmg to ${eL}`); break;
        case "Hammer of Undoing":   owner.hp-=5; opponent.hp-=5; log.push(`${oL}: Hammer of Undoing 5 dmg to both`); break;
        case "Border of Zero":      owner.hp=1; opponent.hp=1; log.push(`${oL}: Border of Zero both HP→1`); break;
        case "Change Ring":         { const t=opponent.ap; opponent.ap=opponent.hp; opponent.hp=t; log.push(`${oL}: Change Ring swap ${eL} AP↔HP`); break; }
        case "Reckless Rewards":    owner.ap+=2; log.push(`${oL}: Reckless Rewards +2 AP`); break;
        case "Grief of Comrade":    { const b=opponent.junctions.length*2; owner.hp+=b; log.push(`${oL}: Grief of Comrade +${b} HP`); break; }
        case "All At Once":         { const b=owner.junctions.length*2; owner.ap+=b; log.push(`${oL}: All At Once +${b} AP`); break; }
        case "Estranged Self":      opponent.junctions=[]; log.push(`${oL}: Estranged Self removed all ${eL} junctions`); break;
        case "Rendezvous":          owner.hp+=10; log.push(`${oL}: Rendezvous +10 HP (loses 10 at turn 8)`); break;
        case "Whirlwind Assault":   { const i=opponent.junctions.findIndex(j=>[...survivors.player,...survivors.ai].find(u=>u.junction===j&&u.type==="Shield")); if(i>=0){const r=opponent.junctions.splice(i,1)[0]; log.push(`${oL}: Whirlwind Assault removed Shield junction: ${r}`);} break; }
        case "Snipe Thunder":       { const i=opponent.junctions.findIndex(j=>[...survivors.player,...survivors.ai].find(u=>u.junction===j&&u.type==="Assault")); if(i>=0){const r=opponent.junctions.splice(i,1)[0]; log.push(`${oL}: Snipe Thunder removed Assault junction: ${r}`);} break; }
        case "Shield Protection":   { const i=opponent.junctions.findIndex(j=>[...survivors.player,...survivors.ai].find(u=>u.junction===j&&u.type==="Snipe")); if(i>=0){const r=opponent.junctions.splice(i,1)[0]; log.push(`${oL}: Shield Protection removed Snipe junction: ${r}`);} break; }
        case "Warning Harmony":     { if(opponent.junctions.length>=2){const i=Math.floor(Math.random()*opponent.junctions.length);const r=opponent.junctions.splice(i,1)[0];log.push(`${oL}: Warning Harmony removed ${eL} junction: ${r}`);} break; }
        case "Fused Consciousness": { const ah=Math.round((owner.hp+opponent.hp)/2),aa=Math.round((owner.ap+opponent.ap)/2); owner.hp=ah;opponent.hp=ah;owner.ap=aa;opponent.ap=aa; log.push(`${oL}: Fused Consciousness HP=${ah} AP=${aa}`); break; }
        case "Different Mix":       { const units=oL==="YOU"?survivors.player:survivors.ai; const mixed=units.length>1&&units.some(u=>u.type!==units[0].type); mixed?(owner.ap+=2,owner.hp+=2,log.push(`${oL}: Different Mix +2 AP/HP`)):(owner.ap-=2,owner.hp-=2,log.push(`${oL}: Different Mix -2 AP/HP`)); break; }
        case "Will of Similars":    { const units=oL==="YOU"?survivors.player:survivors.ai; const myT=oL==="YOU"?playerGen.type:aiGen.type; const same=units.every(u=>u.type===myT); same?(owner.ap+=3,owner.hp+=3,log.push(`${oL}: Will of Similars +3 AP/HP`)):(owner.ap-=3,owner.hp-=3,log.push(`${oL}: Will of Similars -3 AP/HP`)); break; }
        case "Meeting of Souls":    { const t=[...owner.junctions]; owner.junctions=[...opponent.junctions]; opponent.junctions=t; log.push(`${oL}: Meeting of Souls junctions swapped`); break; }
        default: break;
      }
    };

    survivors.player.forEach(u => applyJ(u.junction, pS, aS, "YOU"));
    survivors.ai.forEach(u => applyJ(u.junction, aS, pS, "AI"));

    const pCharge   = survivors.player.some(u=>u.junction==="Charge Ahead");
    const aCharge   = survivors.ai.some(u=>u.junction==="Charge Ahead");
    const pDefStance = survivors.player.some(u=>u.junction==="Defensive Stance");
    const aDefStance = survivors.ai.some(u=>u.junction==="Defensive Stance");
    // Trinity mini-game result overrides random; Charge Ahead still overrides trinity
    let firstTurn = trinityWinner==="player" ? "player" : trinityWinner==="ai" ? "ai" : (Math.random()<0.5?"player":"ai");

    // Defensive Stance forces SECOND — applied before Charge Ahead check
    if(pDefStance&&!aDefStance){ firstTurn="ai"; log.push("YOU: Defensive Stance — YOU go second (-1 dmg received)"); }
    if(aDefStance&&!pDefStance){ firstTurn="player"; log.push("AI: Defensive Stance — AI goes second (-1 dmg received)"); }
    // If both have Defensive Stance, cancel each other
    if(pDefStance&&aDefStance){ log.push("Both: Defensive Stance — mutual cancel, order unchanged"); }

    // Charge Ahead overrides Defensive Stance
    if(pCharge&&!aCharge){ firstTurn="player"; log.push("YOU: Charge Ahead — YOU go first (overrides Defensive Stance)"); }
    else if(aCharge&&!pCharge){ firstTurn="ai"; log.push("AI: Charge Ahead — AI goes first (overrides Defensive Stance)"); }
    else if(!pDefStance&&!aDefStance){
      if(trinityWinner==="player") log.push("YOU won the Trinity Duel — YOU go first");
      else if(trinityWinner==="ai") log.push("AI won the Trinity Duel — AI goes first");
      else log.push("Trinity Duel — drawn multiple times, turn order randomized");
    }
    log.push("━━ BATTLE START ━━");
    log.push(`${firstTurn==="player"?"YOU":"AI"} go first`);

    setBattleLog(l => [...l, ...log]);
    setBState({
      pHP:pS.hp, pAP:pS.ap, aHP:aS.hp, aAP:aS.ap,
      pJunctions:[...pS.junctions], aJunctions:[...aS.junctions],
      pEffects:{ goesFirst:firstTurn==="player", mirrorTurns:pS.junctions.includes("Mirror of Revenge")?3:0, schemeTurns:pS.junctions.includes("Ingenious Scheme")?2:0, clenchUsed:false, suckUsed:false, mindEyeUsed:false, firstToAction:pS.junctions.includes("First to Action") },
      aEffects:{ goesFirst:firstTurn==="ai",   mirrorTurns:aS.junctions.includes("Mirror of Revenge")?3:0, schemeTurns:aS.junctions.includes("Ingenious Scheme")?2:0, clenchUsed:false, suckUsed:false, mindEyeUsed:false, firstToAction:aS.junctions.includes("First to Action") },
      currentTurn:firstTurn, turn:1,
    });
    setBattleReady(true);
  }, [phase, battleReady]);

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  // ── AI HELPERS ──────────────────────────────────────────────────────────────

  // Check if a pool of 5 is "ban-safe":
  // No matter which 1 unit the player bans, at least one valid trio of 3 remains
  function poolIsBanSafe(pool, charisma) {
    for (let banIdx = 0; banIdx < pool.length; banIdx++) {
      const after4 = pool.filter((_,i) => i !== banIdx);
      // Check if any trio from these 4 fits charisma
      let hasValidTrio = false;
      for (let skip = 0; skip < after4.length; skip++) {
        const trio = after4.filter((_,i) => i !== skip);
        if (trio.reduce((s,u) => s+u.cost, 0) <= charisma) {
          hasValidTrio = true;
          break;
        }
      }
      if (!hasValidTrio) return false;
    }
    return true;
  }

  function buildAIDeckLocal() {
    // Rule: total Pts of all 5 units <= Chr
    // Difficulty affects general selection and unit preference

    // Sort generals by charisma based on difficulty
    const genPool = [...GENERALS_DATA];
    let genCandidates;
    if (difficulty === "easy") {
      // Easy: prefer low-charisma generals (weaker)
      genCandidates = genPool.sort((a,b) => a.charisma - b.charisma).slice(0, 10);
    } else if (difficulty === "hard") {
      // Hard: prefer high-charisma generals (stronger, more budget)
      genCandidates = genPool.sort((a,b) => b.charisma - a.charisma).slice(0, 10);
    } else {
      genCandidates = genPool; // Normal: any general
    }

    for (let attempt = 0; attempt < 300; attempt++) {
      const gen = genCandidates[Math.floor(Math.random() * genCandidates.length)];

      // Sort units by difficulty preference
      let unitOrder;
      if (difficulty === "hard") {
        // Hard: prefer higher cost units first (more powerful junctions)
        unitOrder = [...UNITS_DATA].sort((a,b) => b.cost - a.cost);
      } else if (difficulty === "easy") {
        // Easy: prefer lower cost units (weaker)
        unitOrder = [...UNITS_DATA].sort((a,b) => a.cost - b.cost);
      } else {
        unitOrder = shuffle([...UNITS_DATA]); // Normal: random
      }

      const pool = [];
      let budget = gen.charisma;
      for (const u of unitOrder) {
        if (pool.length >= 5) break;
        if (u.cost <= budget) { pool.push(u); budget -= u.cost; }
      }

      if (pool.length < 5) continue;
      if (pool.reduce((s,u) => s+u.cost, 0) > gen.charisma) continue;
      if (poolIsBanSafe(pool, gen.charisma)) {
        return { gen, pool };
      }
    }

    // Absolute fallback
    const gen = [...GENERALS_DATA].sort((a,b) => b.charisma - a.charisma)[0];
    const sorted = [...UNITS_DATA].sort((a,b) => a.cost - b.cost);
    const pool = []; let budget = gen.charisma;
    for (const u of sorted) {
      if (pool.length >= 5) break;
      if (u.cost <= budget) { pool.push(u); budget -= u.cost; }
    }
    return { gen, pool: pool.length === 5 ? pool : sorted.slice(0, 5) };
  }

  function aiPickBan(enemyPool) {
    const DANGER = [
    "Merciless Light","Light of Annihilation","First Strike",
    "Double Trigger","Blades Crossing","AIDA Berserk","AIDA Corrosion",
    "Tragic Arrow","Vengeful Arrow","Massacre Pulse","Quickdance",
    "Trial by Fire","Gathering of the Strong","Mirror of Revenge",
    "Rendezvous","Long-awaited Return"
  ];

    if (difficulty === "hard") {
      // Hard: ban the unit with the most dangerous junction first,
      // tiebreak by highest cost
      const scored = enemyPool.map(u => ({
        u,
        score: DANGER.indexOf(u.junction) >= 0
          ? (DANGER.length - DANGER.indexOf(u.junction)) * 100 + u.cost
          : u.cost,
      }));
      return scored.sort((a,b) => b.score - a.score)[0].u;
    }
    if (difficulty === "easy") {
      // Easy: ban a random unit
      return enemyPool[Math.floor(Math.random() * enemyPool.length)];
    }
    // Normal: ban the highest-cost unit
    return [...enemyPool].sort((a,b) => b.cost - a.cost)[0];
  }

  function aiPickCut(remaining, gen) {
    // Enumerate all 4 combos of 3 from 4 remaining, only keep valid (cost <= charisma)
    const validCombos = [];
    for (let i = 0; i < remaining.length; i++) {
      const trio = remaining.filter((_,idx) => idx !== i);
      const cost = trio.reduce((s,u) => s+u.cost, 0);
      if (cost <= gen.charisma) validCombos.push({ trio, cost });
    }

    if (validCombos.length === 0) {
      // Fallback: try all combos of 3 from 4 (brute force)
      const allCombos = [];
      for (let a = 0; a < remaining.length; a++)
        for (let b = a+1; b < remaining.length; b++)
          for (let c = b+1; c < remaining.length; c++) {
            const trio = [remaining[a], remaining[b], remaining[c]];
            const cost = trio.reduce((s,u) => s+u.cost, 0);
            if (cost <= gen.charisma) allCombos.push({ trio, cost });
          }
      if (allCombos.length > 0) {
        allCombos.sort((a,b) => b.cost - a.cost);
        return allCombos[0].trio;
      }
      // Last resort: cheapest 3 (pool was not ban-safe — shouldn't happen)
      return [...remaining].sort((a,b) => a.cost - b.cost).slice(0, 3);
    }

    if (difficulty === "hard")  return validCombos.sort((a,b) => b.cost - a.cost)[0].trio;
    if (difficulty === "easy")  return validCombos.sort((a,b) => a.cost - b.cost)[0].trio;
    return validCombos[Math.floor(Math.random() * validCombos.length)].trio;
  }

  // ── STEP 1: SELECT DECK ────────────────────────────────────────────────────
  function pickDeck(deck) {
    const gen   = GENERALS_DATA.find(g => g.id === deck.generalId);
    const allUnits = UNITS_DATA.filter(u => deck.unitIds.includes(u.id));
    // Only keep units whose cost <= chr (individual unit must be usable)
    const units = allUnits.filter(u => u.cost <= gen.charisma);
    if (!gen || allUnits.length !== 5) return;
    // If any units were filtered out, deck is invalid
    if (units.length !== 5) return;

    // Build AI deck — retry until guaranteed ban-safe
    let ai = buildAIDeckLocal();
    let safetyTries = 0;
    while (!poolIsBanSafe(ai.pool, ai.gen.charisma) && safetyTries < 20) {
      ai = buildAIDeckLocal();
      safetyTries++;
    }
    // Final nuclear fallback: pick highest-chr gen, build safe pool manually
    if (!poolIsBanSafe(ai.pool, ai.gen.charisma)) {
      const safeGen = [...GENERALS_DATA].sort((a,b) => b.charisma - a.charisma)[0];
      const cheapUnits = [...UNITS_DATA].sort((a,b) => a.cost - b.cost);
      // Find 5 cheap units that are ban-safe
      let safePool = null;
      outer: for (let i = 0; i < cheapUnits.length - 4; i++) {
        const candidate = cheapUnits.slice(i, i+5);
        if (poolIsBanSafe(candidate, safeGen.charisma)) {
          safePool = candidate;
          break outer;
        }
      }
      ai = { gen: safeGen, pool: safePool || cheapUnits.slice(0,5) };
    }

    setPlayerDeck(deck);
    setPlayerGen(gen);
    setPlayerPool(units);
    setAiGen(ai.gen);
    setAiPool(ai.pool);
    setTrinityWinner(null);
    setTrinityChoice(null);
    setTrinityAiChoice(null);
    setPhase("trinity");
  }

  // ── STEP 2 → 3: REVEAL → BAN ──────────────────────────────────────────────
  function startBan() {
    // AI immediately picks its ban
    const banned = aiPickBan(playerPool);
    setAiBan(banned);
    setPlayerBan(null); setPhase("ban");
  }

  // Surrender — end the duel immediately, return to game mode screen
  function surrender() {
    // Reset all arena state
    setPhase("select");
    setPlayerDeck(null);
    setPlayerGen(null);
    setPlayerPool([]);
    setAiGen(null);
    setAiPool([]);
    setPlayerBan(null);
    setAiBan(null);
    setPlayerRemaining([]);
    setAiRemaining([]);
    setPlayerCut([]);
    setAiCut([]);
    setPlayerLayout([]);
    setAiLayout([]);
    setClashStep(0);
    setClashResults([]);
    setSurvivors({ player:[], ai:[] });
    setShowLog(false);
    setBattleLog([]);
    setJunctionLog([]);
    setBattleReady(false);
    setBState(null);
    setBattleOver(null);
    setTrinityWinner(null);
    setTrinityChoice(null);
    setTrinityAiChoice(null);
    setInfoCard(null);
  }

  function confirmBan() {
    if (!playerBan) return;
    // Apply bans
    const pRem = playerPool.filter(u => u.id !== aiBan.id);
    const aRem = aiPool.filter(u => u.id !== playerBan.id);
    setPlayerRemaining(pRem);
    setAiRemaining(aRem);
    setPhase("cut");
  }

  // ── STEP 3 → 4: CUT ───────────────────────────────────────────────────────
  function toggleCut(unit) {
    if (playerCut.find(u => u.id === unit.id)) {
      // Deselect
      setPlayerCut(c => c.filter(u => u.id !== unit.id));
    } else if (playerCut.length < 3) {
      // Only add if total cost stays within charisma
      const newCost = playerCut.reduce((s,u) => s+u.cost, 0) + unit.cost;
      if (newCost <= playerGen.charisma) {
        setPlayerCut(c => [...c, unit]);
      }
    }
  }

  // Guaranteed valid trio: find cheapest valid 3 from any pool
  function forceValidTrio(pool, charisma) {
    // Try all combinations of 3
    for (let i = 0; i < pool.length; i++)
      for (let j = i+1; j < pool.length; j++)
        for (let k = j+1; k < pool.length; k++) {
          const trio = [pool[i], pool[j], pool[k]];
          if (trio.reduce((s,u) => s+u.cost, 0) <= charisma) return trio;
        }
    // Last resort: cheapest 3 individually (may exceed but avoids crash)
    return [...pool].sort((a,b) => a.cost - b.cost).slice(0, 3);
  }

  function confirmCut() {
    if (playerCut.length !== 3) return;
    // Hard block: player cost must be within charisma
    const playerCost = playerCut.reduce((s,u) => s+u.cost, 0);
    if (playerCost > playerGen.charisma) return;

    // AI picks cut — use aiPickCut then verify, fallback to forceValidTrio
    let aiChosen = aiPickCut(aiRemaining, aiGen);
    let aiCost  = aiChosen.reduce((s,u) => s+u.cost, 0);
    // Hard enforcement: keep retrying until valid
    if (aiCost > aiGen.charisma || aiChosen.length !== 3) {
      aiChosen = forceValidTrio(aiRemaining, aiGen.charisma);
      aiCost   = aiChosen.reduce((s,u) => s+u.cost, 0);
    }
    // Final safety: if still invalid, take cheapest 3 one-by-one
    if (aiCost > aiGen.charisma || aiChosen.length !== 3) {
      const sorted4 = [...aiRemaining].sort((a,b) => a.cost - b.cost);
      aiChosen = [];
      let budget = aiGen.charisma;
      for (const u of sorted4) {
        if (aiChosen.length < 3 && u.cost <= budget - (aiChosen.reduce((s,c)=>s+c.cost,0))) {
          aiChosen.push(u);
        }
        if (aiChosen.length === 3) break;
      }
      // Pad to 3 if needed (shouldn't happen with valid deck)
      while (aiChosen.length < 3 && sorted4.length > aiChosen.length) {
        const next = sorted4.find(u => !aiChosen.find(c => c.id===u.id));
        if (next) aiChosen.push(next); else break;
      }
    }

    setAiCut(aiChosen);
    setPlayerLayout(shuffle(playerCut));

    // AI layout strategy based on difficulty
    let aiLayout;
    if (difficulty === "hard") {
      // Hard: sort by cost descending, put strongest unit in Center (idx 1)
      // Center is the most contested position
      const byCost = [...aiChosen].sort((a,b) => b.cost - a.cost);
      // Place: [R=2nd, C=strongest, L=3rd]
      aiLayout = [byCost[1], byCost[0], byCost[2]];
    } else if (difficulty === "easy") {
      // Easy: put weakest unit in Center
      const byCost = [...aiChosen].sort((a,b) => a.cost - b.cost);
      aiLayout = [byCost[1], byCost[0], byCost[2]];
    } else {
      // Normal: random
      aiLayout = shuffle(aiChosen);
    }
    setAiLayout(aiLayout);
    setPhase("confirm");
  }

  // ── CARD IMAGE HELPER ──────────────────────────────────────────────────────
  function CardImg({ card, size=52, height, border, glow, dimmed=false, onClick, selected=false }) {
    const h = height || Math.round(size * 1.33);
    const tc = TYPE_COLOR[card.type] || "#aaa";
    const tg = TYPE_GLOW[card.type]  || "transparent";
    return (
      React.createElement('div', { onClick: onClick, style: {
        width:size, height:h, flexShrink:0,
        borderRadius:6, overflow:"hidden",
        border: selected ? `2px solid ${tc}` : (border || `1.5px solid ${tc}44`),
        boxShadow: selected ? `0 0 10px ${tg}` : (glow || "none"),
        opacity: dimmed ? 0.35 : 1,
        cursor: onClick ? "pointer" : "default",
        transition:"all 0.15s",
        position:"relative",
      },}
        , React.createElement('img', { src: IMGS[card.img.replace('.png','')] || '', alt: card.name,
          style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
        , selected && (
          React.createElement('div', { style: {position:"absolute", inset:0, background:`${tg}22`,
            border:`2px solid ${tc}`, borderRadius:5},})
        )
      )
    );
  }

  // ── SHARED HEADER ──────────────────────────────────────────────────────────
  const PHASE_LABELS = { reveal:"Reveal", ban:"Ban Phase", cut:"The Cut", confirm:"Ready", clash:"Clash", battle:"Battle" };
  const PHASE_STEPS  = ["trinity","reveal","ban","cut","confirm","clash","battle"];
  function PhaseHeader({ back, hideBack }) {
    return (
      React.createElement('div', { style: {flexShrink:0, padding:"8px 14px 0", width:"100%"},}
        /* Phase steps row — compact */
        , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:6, marginBottom:8},}
          , !hideBack && (
            React.createElement('button', { onClick: back, style: {
              display:"flex", alignItems:"center", gap:4,
              padding:"4px 9px", borderRadius:6, cursor:"pointer",
              background:"rgba(255,40,60,0.08)", border:"1px solid rgba(255,40,60,0.35)",
              color:"#ff4466", fontFamily:"monospace", fontSize:10, fontWeight:700,
              flexShrink:0,
            },}, isPT?"🏳 Render-se":"🏳 Surrender")
          )
          , React.createElement('div', { style: {flex:1, display:"flex", gap:3, justifyContent:"center", alignItems:"center"},}
            , PHASE_STEPS.map((p,i) => {
              const active = phase === p;
              const done   = PHASE_STEPS.indexOf(phase) > i;
              return (
                React.createElement('div', { key: p, style: {display:"flex", alignItems:"center", gap:2},}
                  , React.createElement('div', { style: {
                    padding:"2px 7px", borderRadius:20, fontFamily:"monospace",
                    fontSize:8, fontWeight:700, letterSpacing:"0.04em",
                    background: active ? "rgba(0,245,255,0.14)" : done ? "rgba(68,238,136,0.1)" : "rgba(0,0,0,0.2)",
                    border:`1px solid ${active ? "rgba(0,245,255,0.5)" : done ? "rgba(68,238,136,0.3)" : "rgba(255,255,255,0.07)"}`,
                    color: active ? C.cyan : done ? "#44ee88" : C.textMuted,
                  },}, done ? "✓" : PHASE_LABELS[p])
                  , i < PHASE_STEPS.length-1 && React.createElement('span', { style: {color:"rgba(255,255,255,0.12)", fontSize:7},}, "›")
                )
              );
            })
          )
        )
        /* Generals bar — bigger */
        , playerGen && aiGen && (
          React.createElement('div', { style: {display:"flex", gap:8, alignItems:"center", marginBottom:8,
            background:"rgba(0,10,40,0.6)", border:`1px solid ${C.border}`,
            borderRadius:9, padding:"8px 12px", width:"100%"},}
            /* Player */
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0},}
              , React.createElement('div', { style: {width:42, height:56, flexShrink:0, borderRadius:6, overflow:"hidden",
                border:`2px solid ${TYPE_COLOR[playerGen.type]||"#aaa"}`,
                boxShadow:`0 0 8px ${TYPE_GLOW[playerGen.type]||"transparent"}`},}
                , React.createElement('img', { src: IMGS[playerGen.img.replace('.png','')] || '', alt: "",
                  style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
              )
              , React.createElement('div', { style: {minWidth:0},}
                , React.createElement('div', { style: {fontSize:9, color:C.cyan, fontFamily:"monospace", fontWeight:700, letterSpacing:"0.06em"},}, "YOU")
                , React.createElement('div', { style: {fontSize:11, fontWeight:700, color:C.textPrimary, fontFamily:"monospace",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:90, marginBottom:2},}, playerGen.name)
                , React.createElement('div', { style: {display:"flex", gap:6},}
                  , React.createElement('span', { style: {fontSize:10, color:"#44ee88", fontFamily:"monospace", fontWeight:700},}, "HP " , playerGen.hp)
                  , React.createElement('span', { style: {fontSize:10, color:"#ff8844", fontFamily:"monospace", fontWeight:700},}, "AP " , playerGen.ap)
                )
                , React.createElement('div', { style: {fontSize:9, color:"#cc88ff", fontFamily:"monospace"},}, "Chr " , playerGen.charisma, " · "  , playerGen.type)
              )
            )
            /* VS */
            , React.createElement('div', { style: {fontSize:15, fontWeight:900, color:"#ff2244",
              textShadow:"0 0 12px rgba(255,34,68,0.7)", flexShrink:0},}, "VS")
            /* AI */
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0, justifyContent:"flex-end"},}
              , React.createElement('div', { style: {minWidth:0, textAlign:"right"},}
                , React.createElement('div', { style: {fontSize:9, color:"#ff4466", fontFamily:"monospace", fontWeight:700, letterSpacing:"0.06em"},}, "AI")
                , React.createElement('div', { style: {fontSize:11, fontWeight:700, color:C.textPrimary, fontFamily:"monospace",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:90, marginBottom:2},}, aiGen.name)
                , React.createElement('div', { style: {display:"flex", gap:6, justifyContent:"flex-end"},}
                  , React.createElement('span', { style: {fontSize:10, color:"#44ee88", fontFamily:"monospace", fontWeight:700},}, "HP " , aiGen.hp)
                  , React.createElement('span', { style: {fontSize:10, color:"#ff8844", fontFamily:"monospace", fontWeight:700},}, "AP " , aiGen.ap)
                )
                , React.createElement('div', { style: {fontSize:9, color:"#cc88ff", fontFamily:"monospace"},}, aiGen.type, " · Chr "   , aiGen.charisma)
              )
              , React.createElement('div', { style: {width:42, height:56, flexShrink:0, borderRadius:6, overflow:"hidden",
                border:`2px solid ${TYPE_COLOR[aiGen.type]||"#aaa"}`,
                boxShadow:`0 0 8px ${TYPE_GLOW[aiGen.type]||"transparent"}`},}
                , React.createElement('img', { src: IMGS[aiGen.img.replace('.png','')] || '', alt: "",
                  style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
              )
            )
          )
        )
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: SELECT DECK
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "select") return (
    React.createElement('div', { style: S.root,}
      , React.createElement('div', { style: {...S.content, paddingBottom:"2rem"},}
        , React.createElement(BackBtn, { label: "‹ Back" , onClick: onBack,} )
        , React.createElement('h1', { style: S.screenTitle,}, "Select Your Deck"  )
        , savedDecks.length === 0 ? (
          React.createElement('div', { style: {...S.card, textAlign:"center", padding:"2.5rem 1rem",
            display:"flex", flexDirection:"column", gap:12, alignItems:"center"},}
            , React.createElement('div', { style: {fontSize:36, opacity:0.3},}, "🃏")
            , React.createElement('div', { style: {fontSize:13, color:C.textMuted, fontFamily:"monospace"},}, "No decks saved yet."   )
            , React.createElement('div', { style: {fontSize:11, color:C.textMuted, fontFamily:"monospace"},}, "Build a deck first in the Deck Builder."       )
            , React.createElement('button', { onClick: onBack, style: {
              marginTop:4, padding:"8px 20px",
              background:"rgba(245,166,35,0.1)", border:`1px solid ${C.borderMid}`,
              borderRadius:8, color:C.accent, fontFamily:"monospace", fontSize:12, cursor:"pointer",
            },}, "← Go Back"  )
          )
        ) : (
          React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:10},}
            , savedDecks.map(deck => {
              const gen   = GENERALS_DATA.find(g => g.id === deck.generalId);
              const units = UNITS_DATA.filter(u => deck.unitIds.includes(u.id));
              // Valid if at least one trio of 3 from 5 fits within charisma
              const valid = gen && units.length === 5 && (() => {
                for (let a=0;a<units.length;a++)
                  for (let b=a+1;b<units.length;b++)
                    for (let c=b+1;c<units.length;c++)
                      if (units[a].cost+units[b].cost+units[c].cost <= gen.charisma) return true;
                return false;
              })();
              const cost = units.reduce((s,u)=>s+u.cost,0);
              return (
                React.createElement('div', { key: deck.id, onClick: () => valid && pickDeck(deck),
                  className: valid ? "deck-row" : "",
                  style: {
                    ...S.card, cursor: valid ? "pointer" : "default",
                    opacity: valid ? 1 : 0.5,
                    border:`1px solid ${valid ? "rgba(0,245,255,0.2)" : "rgba(255,40,60,0.2)"}`,
                    transition:"all 0.18s", position:"relative", overflow:"hidden",
                  },}
                  , valid && React.createElement('div', { style: {position:"absolute", top:0, left:0, right:0, height:1.5,
                    background:"linear-gradient(90deg,transparent,rgba(0,245,255,0.4),transparent)"},})
                  , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10},}
                    , React.createElement('div', { style: {fontFamily:"monospace", fontSize:14, fontWeight:700, color:C.textPrimary},}, deck.name)
                    , React.createElement('div', { style: {fontSize:10, fontWeight:700, fontFamily:"monospace",
                      color: valid ? "#44ee88" : "#ff4455",
                      padding:"2px 8px", borderRadius:10,
                      background: valid ? "rgba(68,238,136,0.08)" : "rgba(255,68,85,0.08)",
                      border:`1px solid ${valid ? "rgba(68,238,136,0.25)" : "rgba(255,68,85,0.25)"}`,
                    },}, valid ? `✓ Pts ${cost}/${_optionalChain([gen, 'optionalAccess', _5 => _5.charisma])}` : `✕ Pts ${cost}/${_optionalChain([gen, 'optionalAccess', _6 => _6.charisma])}`)
                  )
                  , React.createElement('div', { style: {display:"flex", gap:5, alignItems:"flex-start"},}
                    , gen && (
                      React.createElement('div', { style: {width:52, height:69, flexShrink:0, borderRadius:6, overflow:"hidden",
                        border:`2px solid ${TYPE_COLOR[gen.type]||"#aaa"}`,
                        boxShadow:`0 0 8px ${TYPE_GLOW[gen.type]||"transparent"}`},}
                        , React.createElement('img', { src: IMGS[gen.img.replace('.png','')] || '', alt: gen.name,
                          style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                      )
                    )
                    , units.map(u => (
                      React.createElement('div', { key: u.id, style: {width:40, height:53, flexShrink:0, borderRadius:5, overflow:"hidden",
                        border:`1.5px solid ${TYPE_COLOR[u.type]||"#aaa"}`},}
                        , React.createElement('img', { src: IMGS[u.img.replace('.png','')] || '', alt: u.name,
                          style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                      )
                    ))
                  )
                  , gen && (
                    React.createElement('div', { style: {marginTop:8, display:"flex", gap:8, alignItems:"center"},}
                      , React.createElement('span', { style: {fontSize:11, color:C.textSub, fontFamily:"monospace"},}, gen.name)
                      , React.createElement('span', { style: {fontSize:10, color:TYPE_COLOR[gen.type], fontFamily:"monospace",
                        background:`${TYPE_GLOW[gen.type]}22`, padding:"1px 6px", borderRadius:4},}, gen.type)
                    )
                  )
                )
              );
            })
          )
        )
      )
      , React.createElement('style', null, `.deck-row:hover{background:rgba(0,20,70,0.7)!important;border-color:rgba(0,245,255,0.45)!important;}`)
    )
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: REVEAL — both pools shown side by side
  // ─────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: TRINITY DUEL — determine who goes first in General Battle
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "trinity") {
    const TYPES = [
      { key:"Assault", label:"⚔ Assault", beats:"Shield",  color:"#ff4466", bg:"rgba(255,40,60,0.12)",  border:"rgba(255,40,60,0.5)",  glow:"rgba(255,40,60,0.3)"  },
      { key:"Shield",  label:"🛡 Shield",  beats:"Snipe",   color:"#3399ff", bg:"rgba(40,100,255,0.12)", border:"rgba(40,100,255,0.5)", glow:"rgba(40,100,255,0.3)" },
      { key:"Snipe",   label:"🦅 Snipe",   beats:"Assault", color:"#44ee88", bg:"rgba(68,238,136,0.12)", border:"rgba(68,238,136,0.5)", glow:"rgba(68,238,136,0.3)" },
    ];

    function trinityBeats(a, b) {
      if (a === b) return "draw";
      const t = TYPES.find(t => t.key === a);
      return t && t.beats === b ? "player" : "ai";
    }

    function pickAndReveal(playerPick) {
      // AI picks by difficulty
      let aiPick;
      if (difficulty === "easy") {
        aiPick = TYPES[Math.floor(Math.random()*3)].key;
      } else if (difficulty === "hard") {
        // Hard: tries to counter player's pick
        const counter = TYPES.find(t => t.beats === playerPick);
        aiPick = counter ? counter.key : TYPES[Math.floor(Math.random()*3)].key;
      } else {
        aiPick = TYPES[Math.floor(Math.random()*3)].key;
      }
      const result = trinityBeats(playerPick, aiPick);
      if (result === "draw") {
        // Show draw briefly then reset picks so buttons reappear
        setTrinityChoice(playerPick);
        setTrinityAiChoice(aiPick);
        setTrinityWinner("draw");
      } else {
        setTrinityChoice(playerPick);
        setTrinityAiChoice(aiPick);
        setTrinityWinner(result);
      }
    }

    const pType = TYPES.find(t => t.key === trinityChoice);
    const aType = TYPES.find(t => t.key === trinityAiChoice);
    const resolved = trinityChoice && trinityAiChoice;
    const _trinYouFirst  = isPT ? "Você vai primeiro na Batalha dos Generais!" : _trinYouFirst;
    const _trinAIFirst   = isPT ? "A IA vai primeiro na Batalha dos Generais!" : _trinAIFirst;
    const _trinYouWin    = isPT ? "VOCÊ VENCE" : "YOU WIN";
    const _trinAIWins    = isPT ? "IA VENCE" : "AI WINS";
    const _trinDraw2     = isPT ? "EMPATE" : "DRAW";
    const _trinBothChose = isPT ? ("Ambos escolheram " + (_optionalChain([pType, 'optionalAccess', _7 => _7.key])||"") + " — jogue novamente!") : ("Both chose " + (_optionalChain([pType, 'optionalAccess', _8 => _8.key])||"") + " — play again to decide!");
    const _trinChooseAgain = isPT ? "Escolha novamente:" : "Choose again:";
    const _trinChooseType  = isPT ? "Escolha seu tipo Trinity:" : "Choose your Trinity type:";
    const _trinContinue    = isPT ? "Continuar -> Reveal" : "Continue -> Reveal";
    const _trinHeader      = isPT ? "Vencedor vai primeiro na Batalha dos Generais" : "{_trinHeader}";
    const _trinDraw        = isPT ? "⚡ EMPATE!" : "⚡ DRAW!";

    return (
      React.createElement('div', { style: {width:"100%",height:"100vh",display:"flex",flexDirection:"column",
        background:"rgba(6,3,24,0.98)"},}

        /* Header */
        , React.createElement('div', { style: {flexShrink:0,padding:"14px 16px 0",textAlign:"center"},}
          , React.createElement('div', { style: {fontFamily:"monospace",fontSize:16,fontWeight:900,color:C.accent,
            letterSpacing:"0.12em",marginBottom:4,textShadow:`0 0 16px rgba(245,166,35,0.5)`},}, "⚡ TRINITY DUEL ⚡"

          )
          , React.createElement('div', { style: {fontFamily:"monospace",fontSize:11,color:C.textMuted,marginBottom:2},}
            , _trinHeader
          )
          , React.createElement('div', { style: {fontFamily:"monospace",fontSize:10,color:C.textSub,
            padding:"3px 10px",borderRadius:5,display:"inline-block",
            background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"},}, "⚔ beats 🛡  ·  🛡 beats 🦅  ·  🦅 beats ⚔"

          )
        )

        , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",padding:"0 16px",gap:20},}

          /* Versus display — before pick shows question marks, after shows picks */
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:16,width:"100%",maxWidth:360},}
            /* Player pick */
            , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6},}
              , React.createElement('span', { style: {fontSize:9,fontFamily:"monospace",color:C.cyan,fontWeight:700,
                letterSpacing:"0.1em"},}, "YOU")
              , React.createElement('div', { style: {width:90,height:90,borderRadius:12,display:"flex",
                alignItems:"center",justifyContent:"center",fontSize:36,
                background:resolved&&pType ? pType.bg : "rgba(0,245,255,0.05)",
                border:`2px solid ${resolved&&pType ? pType.border : "rgba(0,245,255,0.2)"}`,
                boxShadow:resolved&&pType ? `0 0 20px ${pType.glow}` : "none",
                transition:"all 0.3s"},}
                , resolved && pType ? pType.label.split(" ")[0] : "?"
              )
              , resolved && pType && (
                React.createElement('span', { style: {fontSize:11,fontFamily:"monospace",color:pType.color,fontWeight:700},}
                  , pType.label
                )
              )
            )

            /* VS / Result */
            , React.createElement('div', { style: {display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0},}
              , !resolved ? (
                React.createElement('span', { style: {fontSize:20,fontWeight:900,color:C.textMuted,fontFamily:"monospace"},}, "VS")
              ) : (
                React.createElement('div', { style: {textAlign:"center"},}
                  , React.createElement('div', { style: {fontSize:24,fontWeight:900,
                    color:trinityWinner==="player"?"#44ee88":trinityWinner==="ai"?"#ff4466":"#ffcc00"},}
                    , trinityWinner==="player"?"✓":trinityWinner==="ai"?"✕":"⚡"
                  )
                  , React.createElement('div', { style: {fontSize:10,fontFamily:"monospace",fontWeight:700,
                    color:trinityWinner==="player"?"#44ee88":trinityWinner==="ai"?"#ff4466":"#ffcc00"},}
                    , trinityWinner==="player"?_trinYouWin:trinityWinner==="ai"?_trinAIWins:_trinDraw2
                  )
                )
              )
            )

            /* AI pick */
            , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6},}
              , React.createElement('span', { style: {fontSize:9,fontFamily:"monospace",color:"#ff4466",fontWeight:700,
                letterSpacing:"0.1em"},}, "AI")
              , React.createElement('div', { style: {width:90,height:90,borderRadius:12,display:"flex",
                alignItems:"center",justifyContent:"center",fontSize:36,
                background:resolved&&aType ? aType.bg : "rgba(255,40,60,0.05)",
                border:`2px solid ${resolved&&aType ? aType.border : "rgba(255,40,60,0.2)"}`,
                boxShadow:resolved&&aType ? `0 0 20px ${aType.glow}` : "none",
                transition:"all 0.3s"},}
                , resolved && aType ? aType.label.split(" ")[0] : "?"
              )
              , resolved && aType && (
                React.createElement('span', { style: {fontSize:11,fontFamily:"monospace",color:aType.color,fontWeight:700},}
                  , aType.label
                )
              )
            )
          )

          /* Result message */
          , resolved && trinityWinner !== "draw" && (
            React.createElement('div', { style: {textAlign:"center",padding:"10px 20px",borderRadius:10,
              background:trinityWinner==="player"?"rgba(0,200,80,0.08)":"rgba(255,40,60,0.08)",
              border:`1px solid ${trinityWinner==="player"?"rgba(68,238,136,0.3)":"rgba(255,40,60,0.3)"}`,
              maxWidth:320},}
              , React.createElement('div', { style: {fontSize:12,fontFamily:"monospace",fontWeight:700,
                color:trinityWinner==="player"?"#44ee88":"#ff4466",
                marginBottom:3},}
                , trinityWinner==="player"
                  ? _trinYouFirst
                  : _trinAIFirst
              )
              , pType && aType && (
                React.createElement('div', { style: {fontSize:10,fontFamily:"monospace",color:C.textMuted},}
                  , trinityWinner==="player"
                    ? `${pType.key} beats ${aType.key}`
                    : `${aType.key} beats ${pType.key}`
                )
              )
            )
          )

          /* Draw message — prompt to play again */
          , resolved && trinityWinner === "draw" && (
            React.createElement('div', { style: {textAlign:"center",padding:"10px 20px",borderRadius:10,
              background:"rgba(255,200,0,0.08)",
              border:"1px solid rgba(255,200,0,0.3)",
              maxWidth:320},}
              , React.createElement('div', { style: {fontSize:14,fontFamily:"monospace",fontWeight:900,
                color:"#ffcc00",marginBottom:4},}, _trinDraw)
              , React.createElement('div', { style: {fontSize:11,fontFamily:"monospace",color:C.textMuted},}, "Both chose "
                  , _optionalChain([pType, 'optionalAccess', _9 => _9.key]), " — play again to decide!"
              )
            )
          )

          /* Pick buttons — shown before pick OR after a draw */
          , (!resolved || trinityWinner === "draw") && (
            React.createElement('div', { style: {display:"flex",flexDirection:"column",alignItems:"center",gap:10,width:"100%",maxWidth:320},}
              , React.createElement('div', { style: {fontSize:11,fontFamily:"monospace",color:C.textMuted,marginBottom:4},}
                , trinityWinner === "draw" ? _trinChooseAgain : _trinChooseType
              )
              , TYPES.map(t => (
                React.createElement('button', { key: t.key, onClick: () => pickAndReveal(t.key), style: {
                  width:"100%",padding:"13px 0",
                  background:t.bg,border:`1px solid ${t.border}`,
                  borderRadius:10,cursor:"pointer",
                  color:t.color,fontFamily:"monospace",fontSize:14,fontWeight:700,
                  letterSpacing:"0.08em",
                  textShadow:`0 0 10px ${t.glow}`,
                  transition:"all 0.15s",
                },}, t.label)
              ))
            )
          )

          /* Continue button — only shown after a decisive result */
          , resolved && trinityWinner !== "draw" && (
            React.createElement('button', { onClick: () => setPhase("reveal"), style: {
              padding:"13px 40px",
              background:"rgba(245,166,35,0.12)",border:"1px solid rgba(245,166,35,0.5)",
              borderRadius:10,cursor:"pointer",color:C.accent,
              fontFamily:"monospace",fontSize:14,fontWeight:700,letterSpacing:"0.08em",
              textShadow:`0 0 10px rgba(245,166,35,0.5)`,
            },}, _trinContinue)
          )
        )
      )
    );
  }

  if (phase === "reveal") return (
    React.createElement('div', { style: {width:"100%", height:"100vh", display:"flex", flexDirection:"column"},}
      , React.createElement(PhaseHeader, { back: surrender,} )
      /* Scrollable content */
      , React.createElement('div', { style: {flex:1, overflowY:"auto", padding:"0 14px 10px", width:"100%", boxSizing:"border-box"},}

        , React.createElement('div', { style: {display:"flex", gap:8},}
          /* Player pool */
          , React.createElement('div', { style: {flex:1},}
            , React.createElement('div', { style: {fontSize:12, color:C.cyan, fontFamily:"monospace", fontWeight:700,
              letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4,
              textAlign:"center", textShadow:`0 0 8px rgba(0,245,255,0.4)`},}, isPT?"Suas Unidades":"Your Units")
            , React.createElement('div', { style: {fontSize:9, fontFamily:"monospace", textAlign:"center", marginBottom:8,
              padding:"3px 6px", borderRadius:5, background:"rgba(0,100,200,0.07)",
              border:"1px solid rgba(0,180,255,0.2)", color:"rgba(150,220,255,0.9)"},}, "Pool of 5 — Chr "
                   , React.createElement('strong', { style: {color:"#ff8844"},}, playerGen.charisma), " (3 chosen must fit)"
            )
            , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:7},}
              , playerPool.map(u => {
                const tc = TYPE_COLOR[u.type]||"#aaa";
                return (
                  React.createElement('div', { key: u.id, style: {display:"flex", gap:10, alignItems:"center",
                    background:"rgba(0,10,50,0.55)", borderRadius:8,
                    border:`1px solid ${tc}44`, padding:"8px 9px"},}
                    , React.createElement('div', { style: {width:54, height:72, flexShrink:0, borderRadius:6, overflow:"hidden",
                      border:`1.5px solid ${tc}`, boxShadow:`0 0 7px ${TYPE_GLOW[u.type]||"transparent"}`},}
                      , React.createElement('img', { src: IMGS[u.img.replace('.png','')] || '', alt: u.name,
                        style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                    )
                    , React.createElement('div', { style: {flex:1, minWidth:0},}
                      , React.createElement('div', { style: {fontSize:12, fontWeight:700, color:"#fff", fontFamily:"monospace",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:4},}, u.name)
                      , React.createElement('div', { style: {display:"flex", gap:5, marginBottom:4, alignItems:"center", flexWrap:"wrap"},}
                        , React.createElement('span', { style: {fontSize:11, color:"#cc88ff", fontFamily:"monospace", fontWeight:700},}, "Pts " , u.cost)
                        , React.createElement('span', { style: {fontSize:10, color:tc, fontFamily:"monospace", fontWeight:700,
                          background:`${tc}22`, padding:"1px 6px", borderRadius:3, border:`1px solid ${tc}44`},}, u.type)
                      )
                      , React.createElement('div', { style: {fontSize:10, color:C.textSub, fontFamily:"monospace",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"},}, u.junction)
                    )
                  )
                );
              })
            )
          )
          /* AI pool */
          , React.createElement('div', { style: {flex:1},}
            , React.createElement('div', { style: {fontSize:12, color:"#ff4466", fontFamily:"monospace", fontWeight:700,
              letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4,
              textAlign:"center", textShadow:"0 0 8px rgba(255,40,80,0.4)"},}, isPT?"Unidades da IA":"AI Units")
            , React.createElement('div', { style: {fontSize:9, fontFamily:"monospace", textAlign:"center", marginBottom:8,
              padding:"3px 6px", borderRadius:5, background:"rgba(255,40,60,0.07)",
              border:"1px solid rgba(255,40,60,0.2)", color:"rgba(255,150,150,0.9)"},}, "Pool of 5 — Chr "
                   , React.createElement('strong', { style: {color:"#ff8844"},}, aiGen.charisma), " (3 chosen must fit)"
            )
            , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:7},}
              , aiPool.map(u => {
                const tc = TYPE_COLOR[u.type]||"#aaa";
                return (
                  React.createElement('div', { key: u.id, style: {display:"flex", gap:10, alignItems:"center",
                    background:"rgba(50,0,10,0.45)", borderRadius:8,
                    border:`1px solid ${tc}44`, padding:"8px 9px"},}
                    , React.createElement('div', { style: {width:54, height:72, flexShrink:0, borderRadius:6, overflow:"hidden",
                      border:`1.5px solid ${tc}`, boxShadow:`0 0 7px ${TYPE_GLOW[u.type]||"transparent"}`},}
                      , React.createElement('img', { src: IMGS[u.img.replace('.png','')] || '', alt: u.name,
                        style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                    )
                    , React.createElement('div', { style: {flex:1, minWidth:0},}
                      , React.createElement('div', { style: {fontSize:12, fontWeight:700, color:"#fff", fontFamily:"monospace",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:4},}, u.name)
                      , React.createElement('div', { style: {display:"flex", gap:5, marginBottom:4, alignItems:"center", flexWrap:"wrap"},}
                        , React.createElement('span', { style: {fontSize:11, color:"#cc88ff", fontFamily:"monospace", fontWeight:700},}, "Pts " , u.cost)
                        , React.createElement('span', { style: {fontSize:10, color:tc, fontFamily:"monospace", fontWeight:700,
                          background:`${tc}22`, padding:"1px 6px", borderRadius:3, border:`1px solid ${tc}44`},}, u.type)
                      )
                      , React.createElement('div', { style: {fontSize:10, color:C.textSub, fontFamily:"monospace",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"},}, u.junction)
                    )
                  )
                );
              })
            )
          )
        )
      )
      /* Bottom button — sticky, NOT fixed */
      , React.createElement('div', { style: {flexShrink:0, padding:"10px 14px", background:"rgba(2,4,38,0.95)",
        borderTop:`1px solid ${C.border}`, width:"100%"},}
        , React.createElement('button', { onClick: startBan, style: {
          width:"100%", padding:"13px 0",
          background:"rgba(0,245,255,0.12)", border:"1px solid rgba(0,245,255,0.5)",
          borderRadius:9, cursor:"pointer", color:C.cyan,
          fontFamily:"monospace", fontSize:14, fontWeight:700, letterSpacing:"0.08em",
          textShadow:`0 0 10px rgba(0,245,255,0.5)`,
          boxShadow:"0 0 16px rgba(0,245,255,0.07)",
        },}, "⚔ Ban Phase →"   )
      )
    )
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: BAN — player picks 1 enemy unit to ban
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "ban") return (
    React.createElement('div', { style: {width:"100%", height:"100vh", display:"flex", flexDirection:"column"},}
      , React.createElement(PhaseHeader, { back: surrender,} )
      , React.createElement('div', { style: {flex:1, overflowY:"auto", padding:"0 14px 10px", width:"100%", boxSizing:"border-box"},}
        , React.createElement('h1', { style: {...S.screenTitle, marginBottom:4},}, "Ban Phase" )
        , React.createElement('p', { style: {...S.body, textAlign:"center", marginBottom:14, fontSize:12},}, "Select "
           , React.createElement('strong', { style: {color:"#ff4466"},}, "1 enemy unit"  ), " to permanently ban from this match."
        )

        /* AI banned yours */
        , React.createElement('div', { style: {...S.callout, marginBottom:12, borderColor:"rgba(255,68,80,0.3)", background:"rgba(255,68,80,0.06)"},}
          , React.createElement('span', null, "🤖")
          , React.createElement('span', null, "AI banned your: "   , React.createElement('strong', { style: {color:"#ff6677"},}, _optionalChain([aiBan, 'optionalAccess', _10 => _10.name])))
        )

        /* AI pool — player picks one to ban */
        , React.createElement('div', { style: {fontSize:11, color:C.textMuted, fontFamily:"monospace", marginBottom:8, letterSpacing:"0.06em"},}, "TAP TO BAN:"

        )
        , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:8},}
          , aiPool.map(u => {
            const isBanned = _optionalChain([playerBan, 'optionalAccess', _11 => _11.id]) === u.id;
            const tc = TYPE_COLOR[u.type] || "#aaa";
            return (
              React.createElement('div', { key: u.id, onClick: () => setPlayerBan(u),
                style: {
                  display:"flex", gap:11, alignItems:"center",
                  padding:"9px 11px", borderRadius:9, cursor:"pointer",
                  background: isBanned ? "rgba(255,40,60,0.12)" : "rgba(0,10,50,0.45)",
                  border:`1.5px solid ${isBanned ? "#ff4466" : tc+"44"}`,
                  boxShadow: isBanned ? "0 0 14px rgba(255,40,60,0.25)" : "none",
                  transition:"all 0.15s", position:"relative", overflow:"hidden",
                },}
                , isBanned && React.createElement('div', { style: {position:"absolute", inset:0, background:"rgba(255,40,60,0.06)", pointerEvents:"none"},})
                , React.createElement('div', { style: {width:54, height:72, flexShrink:0, borderRadius:6, overflow:"hidden",
                  border:`1.5px solid ${tc}`, opacity: isBanned ? 0.55 : 1},}
                  , React.createElement('img', { src: IMGS[u.img.replace('.png','')] || '', alt: u.name,
                    style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                )
                , React.createElement('div', { style: {flex:1, minWidth:0},}
                  , React.createElement('div', { style: {fontSize:13, fontWeight:700, color: isBanned ? "#ff6677" : "#fff",
                    fontFamily:"monospace", marginBottom:4,
                    textDecoration: isBanned ? "line-through" : "none",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"},}, u.name)
                  , React.createElement('div', { style: {display:"flex", gap:6, marginBottom:4, alignItems:"center", flexWrap:"wrap"},}
                    , React.createElement('span', { style: {fontSize:11, color:"#cc88ff", fontFamily:"monospace", fontWeight:700},}, "Pts " , u.cost)
                    , React.createElement('span', { style: {fontSize:10, color:tc, fontFamily:"monospace", fontWeight:700,
                      background:`${tc}22`, padding:"1px 6px", borderRadius:3, border:`1px solid ${tc}44`},}, u.type)
                  )
                  , React.createElement('div', { style: {fontSize:10, color:C.textSub, fontFamily:"monospace",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"},}, u.junction)
                )
                , isBanned && React.createElement('div', { style: {flexShrink:0, fontSize:20, color:"#ff4466", fontWeight:900},}, "✕")
              )
            );
          })
        )
      )

      /* Confirm ban — sticky bottom */
      , React.createElement('div', { style: {flexShrink:0, padding:"8px 14px", background:"rgba(2,4,38,0.95)",
        borderTop:`1px solid ${C.border}`, width:"100%"},}
        , React.createElement('button', {
          onClick: () => { if (playerBan) confirmBan(); },
          style: {
            width:"100%", padding:"9px 0",
            background: playerBan ? "rgba(255,40,60,0.14)" : "rgba(255,255,255,0.04)",
            border:`1px solid ${playerBan ? "rgba(255,40,60,0.5)" : C.border}`,
            borderRadius:8,
            cursor: playerBan ? "pointer" : "not-allowed",
            color: playerBan ? "#ff6677" : C.textMuted,
            fontFamily:"monospace", fontSize:11, fontWeight:700, letterSpacing:"0.06em",
            pointerEvents: playerBan ? "auto" : "none",
            opacity: playerBan ? 1 : 0.5,
          },}
          , playerBan ? `✕ Ban "${playerBan.name}" →` : "⚠ Select a unit to ban first"
        )
      )
    )
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: CUT — player picks 3 of 4 remaining units
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "cut") {
    const cutCost = playerCut.reduce((s,u) => s+u.cost, 0);
    const cutValid = playerCut.length === 3 && cutCost <= playerGen.charisma;
    return (
      React.createElement('div', { style: {width:"100%", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden"},}
        , React.createElement(PhaseHeader, { back: surrender,} )

        /* Header info — compact, no scroll */
        , React.createElement('div', { style: {flexShrink:0, padding:"6px 14px 0"},}
          , React.createElement('h1', { style: {...S.screenTitle, marginBottom:3, fontSize:18},}, "The Cut" )
          , React.createElement('p', { style: {...S.body, textAlign:"center", marginBottom:6, fontSize:11},}, "Choose "
             , React.createElement('strong', { style: {color:C.cyan},}, "3 of your 4"   ), " remaining units. The 4th is discarded."
          )
          /* Charisma bar */
          , React.createElement('div', { style: {
            display:"flex", justifyContent:"center", gap:16, marginBottom:6,
            padding:"5px 10px", borderRadius:8,
            background: cutCost > playerGen.charisma ? "rgba(255,40,60,0.08)" : "rgba(0,255,100,0.05)",
            border:`1px solid ${cutCost > playerGen.charisma ? "rgba(255,40,60,0.3)" : "rgba(0,255,100,0.2)"}`,
          },}
            , React.createElement('span', { style: {fontSize:12, color:C.textMuted, fontFamily:"monospace"},}, "Selected: "
               , React.createElement('strong', { style: {color:C.textSub},}, playerCut.length, "/3")
            )
            , React.createElement('span', { style: {fontSize:12, fontFamily:"monospace",
              color: cutCost > playerGen.charisma ? "#ff4455" : "#44ee88", fontWeight:700},}, "Pts "
               , cutCost, " / Chr "   , playerGen.charisma, " " , cutCost > playerGen.charisma ? "✕" : playerCut.length===3 ? "✓" : ""
            )
          )
        )

        /* Units — flex:1, no scroll, each unit grows equally */
        , React.createElement('div', { style: {flex:1, display:"flex", flexDirection:"column", gap:6,
          padding:"0 12px", overflow:"hidden", justifyContent:"space-evenly"},}
          , playerRemaining.map(u => {
            const chosen = playerCut.find(c => c.id === u.id);
            const full   = !chosen && playerCut.length >= 3;
            const tc = TYPE_COLOR[u.type] || "#aaa";
            return (
              React.createElement('div', { key: u.id, onClick: () => !full && toggleCut(u),
                style: {
                  display:"flex", gap:12, alignItems:"center",
                  padding:"10px 12px", borderRadius:10,
                  cursor: full ? "default" : "pointer",
                  background: chosen ? "rgba(0,245,255,0.09)" : "rgba(0,10,50,0.5)",
                  border:`2px solid ${chosen ? "rgba(0,245,255,0.55)" : tc+"44"}`,
                  boxShadow: chosen ? "0 0 14px rgba(0,245,255,0.18)" : "none",
                  opacity: full ? 0.38 : 1,
                  transition:"all 0.15s",
                  flex:1, minHeight:0,
                },}
                /* Card image — bigger */
                , React.createElement('div', { style: {width:58, height:77, flexShrink:0, borderRadius:6, overflow:"hidden",
                  border:`2px solid ${chosen ? C.cyan : tc}`,
                  boxShadow:`0 0 8px ${chosen ? "rgba(0,245,255,0.3)" : TYPE_GLOW[u.type]||"transparent"}`},}
                  , React.createElement('img', { src: IMGS[u.img.replace('.png','')] || '', alt: u.name,
                    style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                )
                /* Info */
                , React.createElement('div', { style: {flex:1, minWidth:0},}
                  , React.createElement('div', { style: {fontSize:14, fontWeight:700, color: chosen ? C.cyan : "#fff",
                    fontFamily:"monospace", marginBottom:4, lineHeight:1.2},}, u.name)
                  , React.createElement('div', { style: {display:"flex", gap:7, flexWrap:"wrap", marginBottom:4},}
                    , React.createElement('span', { style: {fontSize:12, color:"#cc88ff", fontFamily:"monospace", fontWeight:700},}, "Pts " , u.cost)
                    , React.createElement('span', { style: {fontSize:11, color:tc, fontFamily:"monospace",
                      background:tc+"22", padding:"1px 6px", borderRadius:3},}, u.type)
                  )
                  , React.createElement('div', { style: {fontSize:10, color:C.textMuted, fontFamily:"monospace", lineHeight:1.4},}, u.junction)
                )
                /* Checkmark */
                , React.createElement('div', { style: {flexShrink:0, width:26, height:26, borderRadius:"50%",
                  background: chosen ? C.cyan : "rgba(255,255,255,0.06)",
                  border:`2px solid ${chosen ? C.cyan : "rgba(255,255,255,0.15)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, fontWeight:900, color: chosen ? "#000" : "transparent",
                  transition:"all 0.15s"},}, "✓")
              )
            );
          })
        )

        , React.createElement('div', { style: {flexShrink:0, padding:"8px 14px 10px", background:"rgba(2,4,38,0.95)",
          borderTop:`1px solid ${C.border}`, width:"100%"},}
          , React.createElement('button', { onClick: confirmCut, disabled: !cutValid, style: {
            width:"100%", padding:"13px 0",
            background: cutValid ? "rgba(0,245,255,0.12)" : "rgba(255,255,255,0.04)",
            border:`1px solid ${cutValid ? "rgba(0,245,255,0.45)" : C.border}`,
            borderRadius:9, cursor: cutValid ? "pointer" : "default",
            color: cutValid ? C.cyan : C.textMuted,
            fontFamily:"monospace", fontSize:14, fontWeight:700, letterSpacing:"0.08em",
          },}
            , cutValid ? "Lock In Selection →" : playerCut.length < 3 ? `Pick ${3-playerCut.length} more` : "✕ Pts exceed Chr limit"
          )
        )
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: CONFIRM / READY — layout summary
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "confirm") return (
    React.createElement('div', { style: {width:"100%", height:"100vh", display:"flex", flexDirection:"column"},}
      , React.createElement(PhaseHeader, { back: surrender,} )
      , React.createElement('div', { style: {flex:1, overflowY:"auto", padding:"0 14px 10px", width:"100%", boxSizing:"border-box"},}
        , React.createElement('h1', { style: {...S.screenTitle, marginBottom:6, fontSize:18},}, "Ready for Combat"  )

        /* Player side */
        /* Player side */
        , React.createElement('div', { style: {
          background:"rgba(0,10,50,0.55)", border:`1px solid rgba(0,245,255,0.2)`,
          borderRadius:10, padding:"8px 10px", marginBottom:8,
        },}
          , (() => {
            const pPts = playerCut.reduce((s,u)=>s+u.cost,0);
            const valid = pPts <= playerGen.charisma;
            return (
              React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6},}
                , React.createElement('span', { style: {fontSize:9, color:C.cyan, fontFamily:"monospace", letterSpacing:"0.08em",
                  textTransform:"uppercase"},}, "Your Line-up" )
                , React.createElement('span', { style: {fontSize:10, fontFamily:"monospace", fontWeight:700,
                  color:valid?"#44ee88":"#ff4455",
                  background:valid?"rgba(68,238,136,0.08)":"rgba(255,40,60,0.08)",
                  border:`1px solid ${valid?"rgba(68,238,136,0.25)":"rgba(255,40,60,0.25)"}`,
                  padding:"2px 7px", borderRadius:5},}, "Pts "
                   , pPts, " / Chr "   , playerGen.charisma, " " , valid?"✓":"✕"
                )
              )
            );
          })()
          , React.createElement('div', { style: {display:"flex", gap:6, alignItems:"flex-end"},}
            /* General — 90×120 */
            , React.createElement('div', { style: {width:90, height:120, flexShrink:0, borderRadius:7, overflow:"hidden",
              border:`2px solid ${TYPE_COLOR[playerGen.type]||"#aaa"}`,
              boxShadow:`0 0 14px ${TYPE_GLOW[playerGen.type]||"transparent"}`},}
              , React.createElement('img', { src: IMGS[playerGen.img.replace('.png','')] || '', alt: playerGen.name,
                style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
            )
            /* 3 face-down units — 58×77 — Back_1 */
            , ["L","C","R"].map(pos => (
              React.createElement('div', { key: pos, style: {display:"flex", flexDirection:"column", alignItems:"center", gap:2},}
                , React.createElement('div', { style: {fontSize:8, color:C.textMuted, fontFamily:"monospace", fontWeight:700},}, pos)
                , React.createElement('div', { style: {width:58, height:77, borderRadius:6, overflow:"hidden",
                  border:"1.5px solid rgba(180,100,255,0.5)",
                  boxShadow:"0 0 8px rgba(140,50,220,0.35)"},}
                  , React.createElement('img', { src: IMGS["000_Back_1"], alt: "?",
                    style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                )
              )
            ))
          )
          , React.createElement('div', { style: {marginTop:5, fontSize:8, color:C.textMuted, fontFamily:"monospace"},}, "Units shuffled — hidden until Clash"

          )
        )

        /* AI side */
        , React.createElement('div', { style: {
          background:"rgba(50,0,10,0.45)", border:`1px solid rgba(255,40,60,0.2)`,
          borderRadius:10, padding:"8px 10px", marginBottom:10,
        },}
          , (() => {
            const aiPts = aiCut.reduce((s,u)=>s+u.cost,0);
            const valid = aiPts <= aiGen.charisma;
            return (
              React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6},}
                , React.createElement('span', { style: {fontSize:9, color:"#ff4466", fontFamily:"monospace", letterSpacing:"0.08em",
                  textTransform:"uppercase"},}, "AI Line-up" )
                , React.createElement('span', { style: {fontSize:10, fontFamily:"monospace", fontWeight:700,
                  color:valid?"#44ee88":"#ff4455",
                  background:valid?"rgba(68,238,136,0.08)":"rgba(255,40,60,0.08)",
                  border:`1px solid ${valid?"rgba(68,238,136,0.25)":"rgba(255,40,60,0.25)"}`,
                  padding:"2px 7px", borderRadius:5},}, "Pts "
                   , aiPts, " / Chr "   , aiGen.charisma, " " , valid?"✓":"✕"
                )
              )
            );
          })()
          , React.createElement('div', { style: {display:"flex", gap:6, alignItems:"flex-end"},}
            /* General — 90×120 */
            , React.createElement('div', { style: {width:90, height:120, flexShrink:0, borderRadius:7, overflow:"hidden",
              border:`2px solid ${TYPE_COLOR[aiGen.type]||"#aaa"}`,
              boxShadow:`0 0 14px ${TYPE_GLOW[aiGen.type]||"transparent"}`},}
              , React.createElement('img', { src: IMGS[aiGen.img.replace('.png','')] || '', alt: aiGen.name,
                style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
            )
            /* 3 face-down units — 58×77 — Back_2 */
            , ["L","C","R"].map(pos => (
              React.createElement('div', { key: pos, style: {display:"flex", flexDirection:"column", alignItems:"center", gap:2},}
                , React.createElement('div', { style: {fontSize:8, color:C.textMuted, fontFamily:"monospace", fontWeight:700},}, pos)
                , React.createElement('div', { style: {width:58, height:77, borderRadius:6, overflow:"hidden",
                  border:"1.5px solid rgba(255,50,70,0.5)",
                  boxShadow:"0 0 8px rgba(200,20,40,0.3)"},}
                  , React.createElement('img', { src: IMGS["000_Back_2"], alt: "?",
                    style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
                )
              )
            ))
          )
          , React.createElement('div', { style: {marginTop:5, fontSize:8, color:C.textMuted, fontFamily:"monospace"},}, "AI units positioned secretly"

          )
        )

        /* Summary row */
        , React.createElement('div', { style: {display:"flex", gap:8, marginBottom:10},}
          , React.createElement('div', { style: {flex:1, ...S.callout},}
            , React.createElement('span', null, "⚙")
            , React.createElement('span', null, "AI: " , React.createElement('strong', { style: {color:C.accent, textTransform:"capitalize"},}, difficulty))
          )
          , React.createElement('div', { style: {flex:1, ...S.callout},}
            , React.createElement('span', null, "🃏")
            , React.createElement('span', { style: {fontSize:11, color:C.textSub, fontFamily:"monospace", overflow:"hidden",
              textOverflow:"ellipsis", whiteSpace:"nowrap"},}, _optionalChain([playerDeck, 'optionalAccess', _12 => _12.name]))
          )
        )

        /* Enter arena */
        , React.createElement('button', { onClick: () => setPhase("clash"), style: {
          width:"100%", padding:"14px 0",
          background:"rgba(0,245,255,0.12)", border:"1px solid rgba(0,245,255,0.5)",
          borderRadius:10, cursor:"pointer", color:C.cyan,
          fontFamily:"monospace", fontSize:15, fontWeight:700, letterSpacing:"0.1em",
          textShadow:`0 0 12px rgba(0,245,255,0.6)`,
          boxShadow:"0 0 20px rgba(0,245,255,0.08)",
        },}, "⚔ ENTER THE ARENA"   )

        , React.createElement('button', { style: {...S.backBtn, alignSelf:"center", marginTop:10}, onClick: onBack,}, "← Exit Arena"  )
      )
    )
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: CLASH — sequential reveal Right → Center → Left
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "clash") {

    // Trinity advantage: returns true if typeA beats typeB
    function beats(typeA, typeB) {
      return (typeA==="Assault"&&typeB==="Shield") ||
             (typeA==="Shield" &&typeB==="Snipe")  ||
             (typeA==="Snipe"  &&typeB==="Assault");
    }

    // Resolve a single clash between two unit cards
    // Returns: "player" | "ai" | "fizzle"
    function resolveClash(pCard, aCard) {
      if (pCard.cost > aCard.cost)  return "player";
      if (aCard.cost > pCard.cost)  return "ai";
      // Equal cost — type decides
      if (pCard.type === aCard.type) return "fizzle";
      if (beats(pCard.type, aCard.type)) return "player";
      return "ai";
    }

    // Position labels: index 0=Right, 1=Center, 2=Left
    const POS_LABELS = ["Right","Center","Left"];

    // Current step cards (0=R,1=C,2=L)
    const currentPos   = clashStep < 3 ? POS_LABELS[clashStep] : null;
    const pCard        = clashStep < 3 ? playerLayout[clashStep] : null;
    const aCard        = clashStep < 3 ? aiLayout[clashStep]     : null;
    const currentResult= clashStep < 3 && pCard && aCard ? resolveClash(pCard, aCard) : null;

    // All resolved results so far
    const resolvedResults = clashResults;

    function advanceClash() {
      if (!pCard || !aCard) return;
      const winner = resolveClash(pCard, aCard);
      const newResult = { pos: POS_LABELS[clashStep], pCard, aCard, winner };
      const newResults = [...clashResults, newResult];
      setClashResults(newResults);

      // ── Build log entry ──
      const fizzle = winner==="fizzle", pWon = winner==="player";
      const logEntry = {
        type: "result",
        text: fizzle
          ? `⚡ ${POS_LABELS[clashStep]}: FIZZLE — ${pCard.name} (Pts ${pCard.cost} ${pCard.type}) vs ${aCard.name} (Pts ${aCard.cost} ${aCard.type}) — both destroyed`
          : pWon
            ? `✓ ${POS_LABELS[clashStep]}: YOU WIN — ${pCard.name} (Pts ${pCard.cost} ${pCard.type}) defeats ${aCard.name} (Pts ${aCard.cost} ${aCard.type})`
            : `✕ ${POS_LABELS[clashStep]}: AI WINS — ${aCard.name} (Pts ${aCard.cost} ${aCard.type}) defeats ${pCard.name} (Pts ${pCard.cost} ${pCard.type})`,
        color: fizzle?"#ffcc00":pWon?"#44ee88":"#ff6677",
      };
      const extraEntry = (pCard.cost===aCard.cost && !fizzle) ? {
        type:"detail",
        text: beats(pCard.type,aCard.type)
          ? `  → Type advantage: ${pCard.type} beats ${aCard.type}`
          : `  → Type advantage: ${aCard.type} beats ${pCard.type}`,
        color:"rgba(180,180,255,0.65)",
      } : null;
      setBattleLog(l => [...l, logEntry, ...(extraEntry?[extraEntry]:[])]);

      // ── Junction log: add confirmed survivors ──
      if (!fizzle) {
        const survivor = pWon ? pCard : aCard;
        const side = pWon ? "player" : "ai";
        setJunctionLog(l => [...l, { card: survivor, side, confirmed: true }]);
      }

      if (clashStep >= 2) {
        const pSurvivors = newResults.filter(r => r.winner === "player").map(r => r.pCard);
        const aSurvivors = newResults.filter(r => r.winner === "ai").map(r => r.aCard);
        setSurvivors({ player: pSurvivors, ai: aSurvivors });
        setClashStep(3);
      } else {
        setClashStep(s => s + 1);
      }
    }

    // Result display helper
    function ResultBadge({ winner, pType, aType }) {
      if (winner === "fizzle") return (
        React.createElement('div', { style: {
          padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700,
          background:"rgba(150,100,0,0.2)", border:"1px solid rgba(255,200,0,0.4)",
          color:"#ffcc00", fontFamily:"monospace",
        },}, "⚡ FIZZLE" )
      );
      if (winner === "player") return (
        React.createElement('div', { style: {
          padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700,
          background:"rgba(0,245,100,0.1)", border:"1px solid rgba(0,245,100,0.4)",
          color:"#44ee88", fontFamily:"monospace",
        },}, "✓ YOU WIN"  )
      );
      return (
        React.createElement('div', { style: {
          padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700,
          background:"rgba(255,40,60,0.1)", border:"1px solid rgba(255,40,60,0.4)",
          color:"#ff6677", fontFamily:"monospace",
        },}, "✕ AI WINS"  )
      );
    }

    function ClashCard({ card, revealed, side, dimmed }) {
      const tc = TYPE_COLOR[_optionalChain([card, 'optionalAccess', _13 => _13.type])] || "#aaa";
      const tg = TYPE_GLOW[_optionalChain([card, 'optionalAccess', _14 => _14.type])]  || "transparent";
      return (
        React.createElement('div', { style: {
          width:80, height:107, borderRadius:8, overflow:"hidden", flexShrink:0,
          border: revealed ? `2px solid ${tc}` : `1.5px solid rgba(255,255,255,0.15)`,
          boxShadow: revealed && !dimmed ? `0 0 14px ${tg}` : "none",
          opacity: dimmed ? 0.35 : 1,
          transition:"all 0.3s",
          position:"relative",
        },}
          , revealed && card ? (
            React.createElement('img', { src: IMGS[card.img.replace('.png','')] || '', alt: card.name,
              style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
          ) : (
            React.createElement('img', { src: IMGS[side==="player" ? "000_Back_1" : "000_Back_2"], alt: "?",
              style: {width:"100%", height:"100%", objectFit:"cover", display:"block"},})
          )
        )
      );
    }

    // ── CLASH DONE — summary screen ──
    if (clashStep === 3) return (
      React.createElement('div', { style: {width:"100%", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden"},
        onClick: ()=>setInfoCard(null),}
        , React.createElement(PhaseHeader, { back: surrender,} )

        /* Title */
        , React.createElement('div', { style: {flexShrink:0, textAlign:"center", padding:"6px 0 4px"},}
          , React.createElement('span', { style: {fontFamily:"monospace", fontSize:14, fontWeight:700, color:C.accent, letterSpacing:"0.1em"},}, "CLASH RESULTS" )
        )

        , React.createElement('div', { style: {flex:1, display:"flex", flexDirection:"column", gap:5, padding:"0 10px", overflow:"hidden", justifyContent:"space-evenly"},}

          /* 3 result rows */
          , clashResults.map((r, i) => {
            const tc_p = TYPE_COLOR[r.pCard.type]||"#aaa";
            const tc_a = TYPE_COLOR[r.aCard.type]||"#aaa";
            const pWon = r.winner==="player", aWon = r.winner==="ai", fizzle = r.winner==="fizzle";
            const resultCol = fizzle?"#ffcc00":pWon?"#44ee88":"#ff6677";
            return (
              React.createElement('div', { key: i, style: {
                display:"flex", alignItems:"center", gap:8, flex:1, minHeight:0,
                background:"rgba(0,8,36,0.6)", borderRadius:9,
                border:`1px solid ${resultCol}44`, padding:"8px 10px",
              },}
                , React.createElement('div', { style: {height:"100%", maxHeight:72, aspectRatio:"3/4", flexShrink:0, borderRadius:6, overflow:"hidden",
                  border:`2px solid ${pWon?"#44ee88":fizzle?"#ffcc00":"rgba(255,255,255,0.1)"}`,
                  opacity:aWon?0.28:1},}
                  , React.createElement('img', { src: IMGS[r.pCard.img.replace('.png','')] || '', alt: "", style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                )
                , React.createElement('div', { style: {flex:1, minWidth:0},}
                  , React.createElement('div', { style: {fontSize:12, fontWeight:700, color:pWon?"#44ee88":"#aaa",
                    fontFamily:"monospace", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"},}, r.pCard.name)
                  , React.createElement('div', { style: {fontSize:10, color:"#cc88ff", fontFamily:"monospace"},}, "Pts " , r.pCard.cost, " " , React.createElement('span', { style: {color:tc_p},}, r.pCard.type))
                )
                , React.createElement('div', { style: {display:"flex", flexDirection:"column", alignItems:"center", gap:1, flexShrink:0, minWidth:44},}
                  , React.createElement('span', { style: {fontSize:9, color:C.textMuted, fontFamily:"monospace", fontWeight:700},}, r.pos)
                  , React.createElement('span', { style: {fontSize:22, fontWeight:900, color:resultCol, lineHeight:1},}, fizzle?"⚡":pWon?"✓":"✕")
                  , React.createElement('span', { style: {fontSize:9, fontWeight:700, color:resultCol, fontFamily:"monospace"},}, fizzle?"FIZZLE":pWon?"YOU":"AI")
                )
                , React.createElement('div', { style: {flex:1, minWidth:0, textAlign:"right"},}
                  , React.createElement('div', { style: {fontSize:12, fontWeight:700, color:aWon?"#ff6677":"#aaa",
                    fontFamily:"monospace", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"},}, r.aCard.name)
                  , React.createElement('div', { style: {fontSize:10, color:"#cc88ff", fontFamily:"monospace"},}, "Pts " , r.aCard.cost, " " , React.createElement('span', { style: {color:tc_a},}, r.aCard.type))
                )
                , React.createElement('div', { style: {height:"100%", maxHeight:72, aspectRatio:"3/4", flexShrink:0, borderRadius:6, overflow:"hidden",
                  border:`2px solid ${aWon?"#ff6677":fizzle?"#ffcc00":"rgba(255,255,255,0.1)"}`,
                  opacity:pWon?0.28:1},}
                  , React.createElement('img', { src: IMGS[r.aCard.img.replace('.png','')] || '', alt: "", style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                )
              )
            );
          })

        )

        , React.createElement('div', { style: {flexShrink:0, padding:"10px 14px", background:"rgba(2,4,38,0.95)",
          borderTop:`1px solid ${C.border}`, width:"100%"},}
          , React.createElement('button', { onClick: () => setPhase("battle"), style: {
            width:"100%", padding:"13px 0",
            background:"rgba(0,245,255,0.12)", border:"1px solid rgba(0,245,255,0.5)",
            borderRadius:9, cursor:"pointer", color:C.cyan,
            fontFamily:"monospace", fontSize:14, fontWeight:700, letterSpacing:"0.08em",
            textShadow:`0 0 10px rgba(0,245,255,0.5)`,
          },}, isPT?"⚔ Batalha dos Generais ->":"⚔ General Battle ->")
        )
      )
    );

    // score tally
    const pScore = clashResults.filter(r=>r.winner==="player").length;
    const aScore = clashResults.filter(r=>r.winner==="ai").length;

    // Build log from persistent battleLog + current step preview
    const buildLog = () => {
      const entries = [...battleLog];
      const pC = clashStep < 3 ? playerLayout[clashStep] : null;
      const aC = clashStep < 3 ? aiLayout[clashStep] : null;
      if (pC && aC) {
        entries.push({ type:"current", text:`▶ ${POS_LABELS[clashStep]}: ${pC.name} (Pts ${pC.cost} ${pC.type}) vs ${aC.name} (Pts ${aC.cost} ${aC.type})`, color:C.accent });
        entries.push({ type:"junction", text:`  YOU junction: ${pC.junction}`, color:"rgba(0,245,255,0.75)" });
        entries.push({ type:"junction", text:`  AI junction: ${aC.junction}`, color:"rgba(255,80,100,0.75)" });
      }
      return entries;
    };

    // ── CLASH ACTIVE — Duel Links arena ──
    return (
      React.createElement('div', { style: {width:"100%", height:"100vh", display:"flex", flexDirection:"column"},
        onClick: ()=>setInfoCard(null),}
        , React.createElement(PhaseHeader, { back: surrender,} )
        , React.createElement('div', { style: {flex:1, overflowY:"auto", padding:"0 8px 8px", width:"100%", boxSizing:"border-box"},}

          /* ── ARENA ── */
          , React.createElement('div', { style: {borderRadius:10, overflow:"hidden", marginBottom:8,
            border:"1px solid rgba(60,20,120,0.25)"},}

            /* AI FIELD */
            , React.createElement('div', { style: {background:"rgba(14,2,2,0.75)", padding:"6px 8px 8px"},}
              /* AI status */
              , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:5, marginBottom:6},}
                , React.createElement('span', { style: {fontSize:9, fontWeight:700, color:"#ff4466", fontFamily:"monospace", flexShrink:0},}, "AI")
                , React.createElement('span', { style: {fontSize:8, color:"#cc3333", fontFamily:"monospace", flex:1,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"},}, aiGen.name)
                , React.createElement('span', { style: {fontSize:9, color:"#ff8844", fontFamily:"monospace", flexShrink:0},}, "HP "
                   , React.createElement('b', null, aiGen.hp), " AP "  , React.createElement('b', null, aiGen.ap)
                )
              )
              /* AI back row — 3 real unit cards */
              , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2, marginBottom:6},}
                , [0,1,2].map(idx => {
                  const card = aiLayout[idx];
                  const isActive  = idx === clashStep;
                  const isResolved = idx < clashStep;
                  const result = isResolved ? clashResults[idx] : null;
                  const won   = result && result.winner === "ai";
                  const fizzle = result && result.winner === "fizzle";
                  const tc = card ? (TYPE_COLOR[card.type]||"#aaa") : "#444";
                  return (
                    React.createElement('div', { key: idx, style: {display:"flex", flexDirection:"column", alignItems:"center", gap:1},}
                      , React.createElement('div', {
                        onClick: e=>{e.stopPropagation();if(card&&(isActive||isResolved)){const c2={...card,_side:"ai"};setInfoCard(_optionalChain([infoCard, 'optionalAccess', _15 => _15.id])===c2.id&&_optionalChain([infoCard, 'optionalAccess', _16 => _16._side])==="ai"?null:c2);}},
                        style: {
                        width:"100%", maxWidth:72, aspectRatio:"3/4", borderRadius:5,
                        overflow:"hidden", margin:"0 auto", position:"relative",
                        border: isActive  ? `2px solid ${tc}`
                              : won       ? "1.5px solid #44ee88"
                              : fizzle    ? "1.5px solid #ffcc00"
                              : isResolved ? "1px solid rgba(255,80,80,0.3)"
                              : "1px solid rgba(255,50,70,0.35)",
                        boxShadow: isActive ? `0 0 10px ${TYPE_GLOW[_optionalChain([card, 'optionalAccess', _17 => _17.type])]||"transparent"}` : "none",
                        opacity: isResolved && !won && !fizzle ? 0.28 : 1,
                        transition:"all 0.3s",
                        cursor: (isActive||isResolved) && card ? "pointer" : "default",
                      },}
                        , isActive || isResolved
                          ? React.createElement('img', { src: IMGS[card.img.replace('.png','')] || '', alt: card.name,
                              style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                          : React.createElement('img', { src: IMGS["000_Back_2"], alt: "?",
                              style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                        
                        , isActive && (
                          React.createElement('div', { style: {position:"absolute",top:2,left:2,
                            background:"rgba(0,0,0,0.75)",borderRadius:3,
                            padding:"1px 4px",fontSize:7,fontFamily:"monospace",color:tc,fontWeight:700},}, "C"
                            , card.cost
                          )
                        )
                        , isResolved && (
                          React.createElement('div', { style: {position:"absolute",top:2,right:2,
                            background:"rgba(0,0,0,0.8)",borderRadius:"50%",
                            width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:9,color:won?"#44ee88":fizzle?"#ffcc00":"#ff4466"},}
                            , won?"✓":fizzle?"⚡":"✕"
                          )
                        )
                      )
                      , React.createElement('span', { style: {fontSize:6,color:isActive?"rgba(245,166,35,0.9)":won?"rgba(68,238,136,0.6)":"rgba(255,100,120,0.4)",fontFamily:"monospace"},}, POS_LABELS[idx])
                    )
                  );
                })
              )
              /* AI General */
              , React.createElement('div', { style: {display:"flex", justifyContent:"center", alignItems:"center", gap:6},}
                , React.createElement('div', { style: {flex:1, display:"flex", flexDirection:"column", gap:2, alignItems:"flex-end"},}
                  , pCard && aCard && clashStep < 3 && (
                    React.createElement('div', { style: {fontSize:8,color:"rgba(255,80,100,0.8)",fontFamily:"monospace",
                      textAlign:"right",padding:"3px 6px",borderRadius:4,
                      background:"rgba(255,40,60,0.06)",border:"1px solid rgba(255,40,60,0.15)"},}
                      , aCard.junction
                    )
                  )
                )
                , React.createElement('div', { style: {width:88,height:117,borderRadius:7,overflow:"hidden",flexShrink:0,
                  border:`2px solid ${TYPE_COLOR[aiGen.type]||"#aaa"}`,
                  boxShadow:`0 0 8px ${TYPE_GLOW[aiGen.type]||"transparent"}`},}
                  , React.createElement('img', { src: IMGS[aiGen.img.replace('.png','')] || '', alt: aiGen.name,
                    style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                )
                , React.createElement('div', { style: {flex:1},})
              )
            )

            /* DIVIDER */
            , React.createElement('div', { style: {background:"rgba(4,2,18,0.98)", padding:"3px 10px",
              borderTop:"1px solid rgba(80,32,160,0.5)",
              borderBottom:"1px solid rgba(80,32,160,0.5)",
              display:"flex", alignItems:"center", justifyContent:"space-between"},}
              , React.createElement('span', { style: {fontSize:9,fontWeight:700,fontFamily:"monospace",color:C.accent},}
                , _optionalChain([POS_LABELS, 'access', _18 => _18[clashStep], 'optionalAccess', _19 => _19.toUpperCase, 'call', _20 => _20()]), " CLASH ("  , clashStep+1, "/3)"
              )
              , React.createElement('span', { style: {fontSize:9,fontFamily:"monospace"},}
                , React.createElement('span', { style: {color:"#44ee88",fontWeight:700},}, pScore)
                , React.createElement('span', { style: {color:C.textMuted},}, " — "  )
                , React.createElement('span', { style: {color:"#ff4466",fontWeight:700},}, aScore)
              )
              , currentResult && (
                React.createElement('span', { style: {fontSize:12,fontWeight:900,
                  color:currentResult==="fizzle"?"#ffcc00":currentResult==="player"?"#44ee88":"#ff6677"},}
                  , currentResult==="fizzle"?"⚡":currentResult==="player"?"✓":"✕"
                )
              )
            )

            /* PLAYER FIELD */
            , React.createElement('div', { style: {background:"rgba(2,7,20,0.75)", padding:"8px 8px 6px"},}
              /* Player General */
              , React.createElement('div', { style: {display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginBottom:6},}
                , React.createElement('div', { style: {flex:1},})
                , React.createElement('div', { style: {width:88,height:117,borderRadius:7,overflow:"hidden",flexShrink:0,
                  border:`2px solid ${TYPE_COLOR[playerGen.type]||"#aaa"}`,
                  boxShadow:`0 0 8px ${TYPE_GLOW[playerGen.type]||"transparent"}`},}
                  , React.createElement('img', { src: IMGS[playerGen.img.replace('.png','')] || '', alt: playerGen.name,
                    style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                )
                , React.createElement('div', { style: {flex:1, display:"flex", flexDirection:"column", gap:2, alignItems:"flex-start"},}
                  , pCard && aCard && clashStep < 3 && (
                    React.createElement('div', { style: {fontSize:8,color:"rgba(0,210,255,0.8)",fontFamily:"monospace",
                      padding:"3px 6px",borderRadius:4,
                      background:"rgba(0,245,255,0.06)",border:"1px solid rgba(0,245,255,0.15)"},}
                      , pCard.junction
                    )
                  )
                )
              )
              /* Player back row — 3 real unit cards */
              , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2, marginBottom:6},}
                , [0,1,2].map(idx => {
                  const card = playerLayout[idx];
                  const isActive  = idx === clashStep;
                  const isResolved = idx < clashStep;
                  const result = isResolved ? clashResults[idx] : null;
                  const won   = result && result.winner === "player";
                  const fizzle = result && result.winner === "fizzle";
                  const tc = card ? (TYPE_COLOR[card.type]||"#aaa") : "#444";
                  return (
                    React.createElement('div', { key: idx, style: {display:"flex", flexDirection:"column", alignItems:"center", gap:1},}
                      , React.createElement('span', { style: {fontSize:6,color:isActive?"rgba(245,166,35,0.9)":won?"rgba(68,238,136,0.6)":"rgba(80,140,255,0.4)",fontFamily:"monospace"},}, POS_LABELS[idx])
                      , React.createElement('div', {
                        onClick: e=>{e.stopPropagation();if(card&&(isActive||isResolved)){const c2={...card,_side:"player"};setInfoCard(_optionalChain([infoCard, 'optionalAccess', _21 => _21.id])===c2.id&&_optionalChain([infoCard, 'optionalAccess', _22 => _22._side])==="player"?null:c2);}},
                        style: {
                        width:"100%", maxWidth:72, aspectRatio:"3/4", borderRadius:5,
                        overflow:"hidden", margin:"0 auto", position:"relative",
                        border: isActive  ? `2px solid ${tc}`
                              : won       ? "1.5px solid #44ee88"
                              : fizzle    ? "1.5px solid #ffcc00"
                              : isResolved ? "1px solid rgba(80,200,100,0.3)"
                              : "1px solid rgba(80,120,255,0.35)",
                        boxShadow: isActive ? `0 0 10px ${TYPE_GLOW[_optionalChain([card, 'optionalAccess', _23 => _23.type])]||"transparent"}` : "none",
                        opacity: isResolved && !won && !fizzle ? 0.28 : 1,
                        transition:"all 0.3s",
                        cursor: (isActive||isResolved) && card ? "pointer" : "default",
                      },}
                        , isActive || isResolved
                          ? React.createElement('img', { src: IMGS[card.img.replace('.png','')] || '', alt: card.name,
                              style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                          : React.createElement('img', { src: IMGS["000_Back_1"], alt: "?",
                              style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                        
                        , isActive && (
                          React.createElement('div', { style: {position:"absolute",top:2,left:2,
                            background:"rgba(0,0,0,0.75)",borderRadius:3,
                            padding:"1px 4px",fontSize:7,fontFamily:"monospace",color:tc,fontWeight:700},}, "C"
                            , card.cost
                          )
                        )
                        , isResolved && (
                          React.createElement('div', { style: {position:"absolute",top:2,right:2,
                            background:"rgba(0,0,0,0.8)",borderRadius:"50%",
                            width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:9,color:won?"#44ee88":fizzle?"#ffcc00":"#ff4466"},}
                            , won?"✓":fizzle?"⚡":"✕"
                          )
                        )
                      )
                    )
                  );
                })
              )
              /* Player status */
              , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:5},}
                , React.createElement('span', { style: {fontSize:9,fontWeight:700,color:C.cyan,fontFamily:"monospace",flexShrink:0},}, "YOU")
                , React.createElement('span', { style: {fontSize:8,color:"#2255aa",fontFamily:"monospace",flex:1,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, playerGen.name)
                , React.createElement('span', { style: {fontSize:9,color:"#ff8844",fontFamily:"monospace",flexShrink:0},}, "HP "
                   , React.createElement('b', null, playerGen.hp), " AP "  , React.createElement('b', null, playerGen.ap)
                )
              )
            )
          )


        )


        , React.createElement(CardInfoBox, { card: infoCard, onClose: ()=>setInfoCard(null), isGen: false,})
        /* Bottom bar: 📋 Clash Log | ⚡ Resolve | ⚡ Junction Log */
        , React.createElement('div', { style: {flexShrink:0, padding:"8px 10px", background:"rgba(2,4,38,0.97)",
          borderTop:`1px solid ${C.border}`, width:"100%",
          display:"flex", gap:6, alignItems:"center"},}

          /* ── 📋 CLASH LOG button (left) ── */
          , React.createElement('div', { style: {position:"relative", flexShrink:0},}
            , React.createElement('button', { onClick: () => setShowLog(v => v==="clash" ? false : "clash"), style: {
              width:46, height:46, borderRadius:8, flexShrink:0,
              background: showLog==="clash" ? "rgba(245,166,35,0.22)" : "rgba(245,166,35,0.08)",
              border:`1px solid rgba(245,166,35,${showLog==="clash"?0.7:0.3})`,
              cursor:"pointer", color:C.accent, fontSize:20,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: showLog==="clash" ? "0 0 14px rgba(245,166,35,0.35)" : "none",
              transition:"all 0.15s",
            },}, "📋")
            , showLog==="clash" && (
              React.createElement('div', { style: {
                position:"absolute", bottom:54, left:0,
                width:290, maxHeight:270, overflowY:"auto",
                background:"rgba(3,5,36,0.99)", borderRadius:10,
                border:`1px solid ${C.border}`, padding:"10px 12px",
                zIndex:30, boxShadow:"0 -8px 32px rgba(0,0,0,0.85)",
              },}
                , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8},}
                  , React.createElement('span', { style: {fontSize:13,color:C.accent,fontFamily:"monospace",fontWeight:700,letterSpacing:"0.08em"},}, "📋 CLASH LOG"  )
                  , React.createElement('span', { onClick: ()=>setShowLog(false), style: {cursor:"pointer",color:C.textMuted,fontSize:15,padding:"0 3px"},}, "✕")
                )
                , buildLog().length === 0
                  ? React.createElement('div', { style: {fontSize:12,color:C.textMuted,fontFamily:"monospace"},}, _noEvents)
                  : buildLog().map((e,i) => (
                  React.createElement('div', { key: i, style: {
                    fontSize:13, color:e.color, fontFamily:"monospace", lineHeight:1.7,
                    wordBreak:"break-word", marginBottom:3,
                    borderLeft: e.type==="result"||e.type==="current" ? `2px solid ${e.color}` : "none",
                    paddingLeft: e.type==="result"||e.type==="current" ? 8 : 4,
                    opacity: e.type==="detail"||e.type==="junction" ? 0.8 : 1,
                  },}, e.text)
                ))
              )
            )
          )

          /* ── ⚡ RESOLVE button (center) ── */
          , React.createElement('button', { onClick: advanceClash, style: {
            flex:1, padding:"13px 0",
            background:"rgba(245,166,35,0.12)", border:"1px solid rgba(245,166,35,0.5)",
            borderRadius:9, cursor:"pointer", color:C.accent,
            fontFamily:"monospace", fontSize:13, fontWeight:700, letterSpacing:"0.07em",
            textShadow:`0 0 10px rgba(245,166,35,0.5)`,
          },}, "⚡ Resolve "  , POS_LABELS[clashStep], " →" )

          /* ── ⚡ JUNCTION LOG button (right) ── */
          , React.createElement('div', { style: {position:"relative", flexShrink:0},}
            , React.createElement('button', { onClick: () => setShowLog(v => v==="junction" ? false : "junction"), style: {
              width:46, height:46, borderRadius:8, flexShrink:0,
              background: showLog==="junction" ? "rgba(0,245,255,0.18)" : "rgba(0,245,255,0.06)",
              border:`1px solid rgba(0,245,255,${showLog==="junction"?0.7:0.25})`,
              cursor:"pointer", color:C.cyan, fontSize:20,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: showLog==="junction" ? "0 0 14px rgba(0,245,255,0.3)" : "none",
              transition:"all 0.15s",
            },}, "⚡")
            , showLog==="junction" && (() => {
              const pC = clashStep < 3 ? playerLayout[clashStep] : null;
              const aC = clashStep < 3 ? aiLayout[clashStep] : null;
              const pSurv = junctionLog.filter(j=>j.side==="player").map(j=>j.card);
              const aSurv = junctionLog.filter(j=>j.side==="ai").map(j=>j.card);
              // Build text entries same style as clash log
              const entries = [];
              if (pC && aC) {
                entries.push({ text:`▶ ${POS_LABELS[clashStep]} — CURRENT`, color:C.accent, type:"header" });
                entries.push({ text:`  YOU — ${pC.name} (Pts ${pC.cost} ${pC.type})`, color:C.cyan, type:"current" });
                entries.push({ text:`  Junction: ${pC.junction}`, color:"rgba(0,245,255,0.75)", type:"detail" });
                entries.push({ text:`  Activates if YOU win this position`, color:"rgba(0,245,255,0.45)", type:"detail" });
                entries.push({ text:`  AI  — ${aC.name} (Pts ${aC.cost} ${aC.type})`, color:"#ff4466", type:"current" });
                entries.push({ text:`  Junction: ${aC.junction}`, color:"rgba(255,80,100,0.75)", type:"detail" });
                entries.push({ text:`  Activates if AI wins this position`, color:"rgba(255,80,100,0.45)", type:"detail" });
              }
              if (pSurv.length > 0 || aSurv.length > 0) {
                entries.push({ text:`✓ CONFIRMED JUNCTIONS`, color:"#44ee88", type:"header" });
                pSurv.forEach(u => {
                  entries.push({ text:`  YOU — ${u.name} (${u.type})`, color:"#44ee88", type:"result" });
                  entries.push({ text:`  → ${u.junction}`, color:"rgba(68,238,136,0.7)", type:"detail" });
                });
                aSurv.forEach(u => {
                  entries.push({ text:`  AI  — ${u.name} (${u.type})`, color:"#ff6677", type:"result" });
                  entries.push({ text:`  → ${u.junction}`, color:"rgba(255,100,120,0.7)", type:"detail" });
                });
              }
              if (entries.length === 0) {
                entries.push({ text:"No junction data yet.", color:C.textMuted, type:"detail" });
              }
              return (
                React.createElement('div', { style: {
                  position:"absolute", bottom:54, right:0,
                  width:290, maxHeight:280, overflowY:"auto",
                  background:"rgba(3,5,36,0.99)", borderRadius:10,
                  border:`1px solid ${C.border}`, padding:"10px 12px",
                  zIndex:30, boxShadow:"0 -8px 32px rgba(0,0,0,0.85)",
                },}
                  , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8},}
                    , React.createElement('span', { style: {fontSize:13,color:C.cyan,fontFamily:"monospace",fontWeight:700,letterSpacing:"0.07em"},}, "⚡ JUNCTION LOG"  )
                    , React.createElement('span', { onClick: ()=>setShowLog(false), style: {cursor:"pointer",color:C.textMuted,fontSize:15,padding:"0 3px"},}, "✕")
                  )
                  , entries.map((e,i) => (
                    React.createElement('div', { key: i, style: {
                      fontSize:13, color:e.color, fontFamily:"monospace", lineHeight:1.7,
                      wordBreak:"break-word", marginBottom:2,
                      borderLeft: e.type==="header"||e.type==="result"||e.type==="current" ? `2px solid ${e.color}` : "none",
                      paddingLeft: e.type==="header"||e.type==="result"||e.type==="current" ? 8 : 4,
                      opacity: e.type==="detail" ? 0.8 : 1,
                    },}, e.text)
                  ))
                )
              );
            })()
          )

        )
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE: GENERAL BATTLE
  // ─────────────────────────────────────────────────────────────────────────
const JUNCTION_DESC = {
  "AIDA Berserk":        "+2 AP, -2 HP each your turn",
  "AIDA Corrosion":      "+1 AP, -1 HP each your turn",
  "Anu's Karma":         "+3 HP end of your turn when going second",
  "Aurora Tears":        "+2 AP end of your turn when going first",
  "Blades Crossing":     "+1 extra damage on your attacks",
  "Clenching Teeth":     "Once: survive at 1 HP",
  "Cross Counter":       "Deal 1 damage when you take damage",
  "Defensive Stance":    "Forces you to go second; reduces incoming damage by 1",
  "Detail Oriented":     "Damage of 2 or less reduced to 0",
  "Double Trigger":      "+2 extra damage on your attacks",
  "Emperor's Pride":     "-1 incoming damage",
  "Energy Genome":       "+1 HP each your turn",
  "First Strike":        "1 damage to both Generals every turn",
  "First to Action":     "-5 HP to enemy immediately; you take +1 extra dmg per turn after",
  "Folset's Trial":      "+1 AP, -1 HP each your turn",
  "Gathering of the Strong": "Turns 1-5: 1 damage to enemy each turn",
  "Immortal Genome":     "+2 HP each your turn",
  "Light of Annihilation": "3 damage to both every turn",
  "Long-awaited Return": "+1 AP, +2 HP each your turn",
  "Massacre Pulse":      "+1 AP each time you attack",
  "Merciless Light":     "2 damage to both Generals every turn",
  "Mind's Eye":          "Evade one enemy attack (one use)",
  "Mirror of Revenge":   "Reflect all damage for 3 turns",
  "Mobilize the Troops": "After turn 5: +1 HP each your turn",
  "Promised Discretion": "Cap all damage received at 3",
  "Quickdance":          "Extra attack at -3 AP each turn",
  "Rendezvous":          "+10 HP now; -10 HP on turn 8",
  "Spirit Clothes":      "-1 incoming damage",
  "Suck it up":          "Once: survive at 5 HP",
  "Tragic Arrow":        "2 damage to enemy each your turn",
  "Trial by Fire":       "Cannot attack turns 1-4; then +5 AP, +6 HP",
  "Veil of Aura":        "-2 incoming damage",
  "Vengeful Arrow":      "1 damage to enemy each your turn",
};

  if (phase === "battle") {


    // ── TURN ENGINE ───────────────────────────────────────────────────────
    // Process a single attack turn
    function processTurn(state) {
      const { pHP, pAP, aHP, aAP, turn, currentTurn, pJunctions, aJunctions,
              pEffects, aEffects } = state;
      const newLog = [];
      const L = (en, pt) => isPT ? pt : en;
      let npHP=pHP, naHP=aHP, npAP=pAP, naAP=aAP;
      let npJ=[...pJunctions], naJ=[...aJunctions];
      let npEff={...pEffects}, naEff={...aEffects};
      let isPlayer = currentTurn==="player";

      // ── START OF TURN EFFECTS ──
      // Merciless Light (both)
      if(npJ.includes("Merciless Light")||naJ.includes("Merciless Light")){
        npHP-=2; naHP-=2;
        newLog.push(L("⚡ Merciless Light — 2 dmg to both","⚡ Merciless Light — 2 dmg nos dois"));
      }
      // First Strike
      if(npJ.includes("First Strike")||naJ.includes("First Strike")){
        npHP-=1; naHP-=1;
        newLog.push(L("⚡ First Strike — 1 dmg to both","⚡ First Strike — 1 dmg nos dois"));
      }
      // Light of Annihilation
      if(npJ.includes("Light of Annihilation")||naJ.includes("Light of Annihilation")){
        npHP-=3; naHP-=3;
        newLog.push(L("⚡ Light of Annihilation — 3 dmg to both","⚡ Light of Annihilation — 3 dmg nos dois"));
      }

      if(isPlayer) {
        // Energy Genome
        if(npJ.includes("Energy Genome")){ npHP+=1; newLog.push(L("YOU: Energy Genome — +1 HP","VOCÊ: Energy Genome — +1 HP")); }
        if(npJ.includes("Immortal Genome")){ npHP+=2; newLog.push(L("YOU: Immortal Genome — +2 HP","VOCÊ: Immortal Genome — +2 HP")); }
        if(npJ.includes("Vengeful Arrow")){ naHP-=1; newLog.push(L("YOU: Vengeful Arrow — 1 dmg to AI","VOCÊ: Vengeful Arrow — 1 dmg na IA")); }
        if(npJ.includes("Tragic Arrow")){ naHP-=2; newLog.push(L("YOU: Tragic Arrow — 2 dmg to AI","VOCÊ: Tragic Arrow — 2 dmg na IA")); }
        if(npJ.includes("AIDA Corrosion")){ npAP+=1; npHP-=1; newLog.push(L("YOU: AIDA Corrosion — +1 AP, -1 HP","VOCÊ: AIDA Corrosion — +1 AP, -1 HP")); }
        if(npJ.includes("AIDA Berserk")){ npAP+=2; npHP-=2; newLog.push(L("YOU: AIDA Berserk — +2 AP, -2 HP","VOCÊ: AIDA Berserk — +2 AP, -2 HP")); }
        if(npJ.includes("Folset's Trial")){ npAP+=1; npHP-=1; newLog.push(L("YOU: Folset's Trial — +1 AP, -1 HP","VOCÊ: Folset's Trial — +1 AP, -1 HP")); }
        if(npJ.includes("Long-awaited Return")){ npAP+=1; npHP+=2; newLog.push(L("YOU: Long-awaited Return — +1 AP, +2 HP","VOCÊ: Long-awaited Return — +1 AP, +2 HP")); }
        if(npJ.includes("Filling Hollow") && (npJ.length>1||naJ.length>0)){
          const pi=Math.floor(Math.random()*Math.max(1,npJ.length));
          const ai2=Math.floor(Math.random()*Math.max(1,naJ.length));
          if(npJ.length>0){const r=npJ.splice(pi,1)[0]; newLog.push(isPT?`VOCÊ: Filling Hollow — removeu SUA junction: ${r}`:`YOU: Filling Hollow — removed YOUR junction: ${r}`);}
          if(naJ.length>0){const r=naJ.splice(ai2,1)[0]; newLog.push(isPT?`VOCÊ: Filling Hollow — removeu junction da IA: ${r}`:`YOU: Filling Hollow — removed AI junction: ${r}`);}
        }
        if(npJ.includes("Reckless Rewards")){ npAP+=2; npEff.recklessTaken=(npEff.recklessTaken||0)+1; newLog.push(L("YOU: Reckless Rewards — +2 AP (takes +1 dmg when hit)","VOCÊ: Reckless Rewards — +2 AP (+1 dmg)")); }
        if(npJ.includes("Harmonic Rhythm")&&npEff.goesFirst){ npAP+=2; newLog.push("YOU: Harmonic Rhythm — +2 AP (first)"); }
        if(npJ.includes("Gathering of the Strong")&&turn<=5){ naHP-=1; newLog.push(L("YOU: Gathering of the Strong — 1 dmg to AI","VOCÊ: Gathering of the Strong — 1 dmg na IA")); }
        if(npJ.includes("Mobilize the Troops")&&turn>5){ npHP+=1; newLog.push(L("YOU: Mobilize the Troops — +1 HP","VOCÊ: Mobilize the Troops — +1 HP")); }
        if(npJ.includes("Rendezvous")&&turn===8){ npHP-=10; newLog.push(L("YOU: Rendezvous — 10 dmg to YOU (turn 8)","VOCÊ: Rendezvous — 10 dmg (turno 8)")); }
        if(npJ.includes("Trial by Fire")&&turn===5){ npAP+=5; npHP+=6; newLog.push(L("YOU: Trial by Fire — +5 AP, +6 HP (turn 5 unlocked)","VOCÊ: Trial by Fire — +5 AP, +6 HP (turno 5)")); }
        // Anu's Karma (end of your turn when going second) — handled at end
        if(npJ.includes("Aurora Tears")&&npEff.goesFirst){ npAP+=2; newLog.push(L("YOU: Aurora Tears — +2 AP end of turn","VOCÊ: Aurora Tears — +2 AP")); }

        // ── ATTACK ──
        let skip = false;
        if(npJ.includes("Mind's Eye")&&npEff.mindEyeUsed!==true){
          // Mind's Eye: evade next INCOMING attack — handled on receive
        }
        if(npJ.includes("Trial by Fire")&&turn<=4){ skip=true; newLog.push("YOU: Trial by Fire — cannot attack (turn "+(turn)+" of 4)"); }
        if(!skip){
          let dmg = npAP;
          if(npJ.includes("Blades Crossing")) dmg+=1;
          if(npJ.includes("Double Trigger")) dmg+=2;
          if(npJ.includes("Momentary Glory")&&turn===npEff.gloryTurn){ dmg=Math.max(0,dmg); }
          // Damage reduction on AI side
          if(naJ.includes("Spirit Clothes")) dmg=Math.max(0,dmg-1);
          if(naJ.includes("Veil of Aura")) dmg=Math.max(0,dmg-2);
          if(naJ.includes("Emperor's Pride")) dmg=Math.max(0,dmg-1);
          if(naJ.includes("Defensive Stance")) { dmg=Math.max(0,dmg-1); newLog.push(L("AI: Defensive Stance — -1 dmg","IA: Defensive Stance — -1 dmg")); }
          if(naJ.includes("Promised Discretion")) dmg=Math.min(dmg,3);
          if(naJ.includes("Detail Oriented")&&dmg<=2) dmg=0;
          // Mirror/Ingenious reflect
          let reflected=0;
          if(naJ.includes("Mirror of Revenge")&&(naEff.mirrorTurns||0)>0){ reflected=dmg; dmg=0; npHP-=reflected; newLog.push(isPT?`IA: Mirror of Revenge — reflete ${reflected} dmg`:`AI: Mirror of Revenge — reflects ${reflected} dmg back`); naEff.mirrorTurns=(naEff.mirrorTurns||0)-1; }
          if(naJ.includes("Ingenious Scheme")&&(naEff.schemeTurns||0)>0){ reflected=dmg; dmg=0; npHP-=reflected; newLog.push(isPT?`IA: Ingenious Scheme — reflete ${reflected} dmg`:`AI: Ingenious Scheme — reflects ${reflected} dmg back`); naEff.schemeTurns=(naEff.schemeTurns||0)-1; }
          // Apply dmg
          if(naJ.includes("Reckless Rewards")&&dmg>0){ dmg+=1; newLog.push(L("AI: Reckless Rewards — +1 extra dmg taken","IA: Reckless Rewards — +1 dmg extra")); }
          if(naEff.firstToAction&&dmg>0){ dmg+=1; newLog.push(L("AI: First to Action penalty — +1 extra dmg taken","IA: First to Action — +1 dmg extra")); }
          naHP-=dmg;
          if(dmg>0||reflected>0) newLog.push(isPT?`VOCÊ ataca — ${dmg} dmg na IA${reflected>0?" ("+reflected+" refletido)":""}`:` YOU attack — ${dmg} dmg to AI${reflected>0?" ("+reflected+" reflected)":""}`);
          if(naJ.includes("Cross Counter")&&dmg>0){ npHP-=1; newLog.push(L("AI: Cross Counter — 1 dmg to YOU","IA: Cross Counter — 1 dmg em você")); }
          // Massacre Pulse
          if(npJ.includes("Massacre Pulse")&&dmg>0){ npAP+=1; newLog.push(L("YOU: Massacre Pulse — +1 AP","VOCÊ: Massacre Pulse — +1 AP")); }
        }
        if(npJ.includes("Quickdance")){ let dmg2=Math.max(0,npAP-3); if(naJ.includes("Spirit Clothes")) dmg2=Math.max(0,dmg2-1); naHP-=dmg2; newLog.push(isPT?`VOCÊ: Quickdance — ataque extra ${dmg2} dmg`:`YOU: Quickdance — extra attack ${dmg2} dmg`); }
        if(npJ.includes("Anu's Karma")&&!npEff.goesFirst){ npHP+=3; newLog.push(L("YOU: Anu's Karma — +3 HP (going second)","VOCÊ: Anu's Karma — +3 HP (segundo)")); }

      } else {
        // AI TURN — mirror of player
        if(naJ.includes("Energy Genome")){ naHP+=1; newLog.push(L("AI: Energy Genome — +1 HP","IA: Energy Genome — +1 HP")); }
        if(naJ.includes("Immortal Genome")){ naHP+=2; newLog.push(L("AI: Immortal Genome — +2 HP","IA: Immortal Genome — +2 HP")); }
        if(naJ.includes("Vengeful Arrow")){ npHP-=1; newLog.push(L("AI: Vengeful Arrow — 1 dmg to YOU","IA: Vengeful Arrow — 1 dmg em você")); }
        if(naJ.includes("Tragic Arrow")){ npHP-=2; newLog.push(L("AI: Tragic Arrow — 2 dmg to YOU","IA: Tragic Arrow — 2 dmg em você")); }
        if(naJ.includes("AIDA Corrosion")){ naAP+=1; naHP-=1; newLog.push(L("AI: AIDA Corrosion — +1 AP, -1 HP","IA: AIDA Corrosion — +1 AP, -1 HP")); }
        if(naJ.includes("AIDA Berserk")){ naAP+=2; naHP-=2; newLog.push(L("AI: AIDA Berserk — +2 AP, -2 HP","IA: AIDA Berserk — +2 AP, -2 HP")); }
        if(naJ.includes("Folset's Trial")){ naAP+=1; naHP-=1; newLog.push(L("AI: Folset's Trial — +1 AP, -1 HP","IA: Folset's Trial — +1 AP, -1 HP")); }
        if(naJ.includes("Long-awaited Return")){ naAP+=1; naHP+=2; newLog.push(L("AI: Long-awaited Return — +1 AP, +2 HP","IA: Long-awaited Return — +1 AP, +2 HP")); }
        if(naJ.includes("Filling Hollow") && (naJ.length>1||npJ.length>0)){
          const ai2=Math.floor(Math.random()*Math.max(1,naJ.length));
          const pi=Math.floor(Math.random()*Math.max(1,npJ.length));
          if(naJ.length>0){const r=naJ.splice(ai2,1)[0]; newLog.push(isPT?`IA: Filling Hollow — removeu junction da IA: ${r}`:`AI: Filling Hollow — removed AI junction: ${r}`);}
          if(npJ.length>0){const r=npJ.splice(pi,1)[0]; newLog.push(isPT?`IA: Filling Hollow — removeu SUA junction: ${r}`:`AI: Filling Hollow — removed YOUR junction: ${r}`);}
        }
        if(naJ.includes("Reckless Rewards")){ naAP+=2; naEff.recklessTaken=(naEff.recklessTaken||0)+1; newLog.push(L("AI: Reckless Rewards — +2 AP (takes +1 dmg when hit)","IA: Reckless Rewards — +2 AP (+1 dmg)")); }
        if(naJ.includes("Harmonic Rhythm")&&naEff.goesFirst){ naAP+=2; newLog.push(L("AI: Harmonic Rhythm — +2 AP (goes first)","IA: Harmonic Rhythm — +2 AP (primeiro)")); }
        if(naJ.includes("Gathering of the Strong")&&turn<=5){ npHP-=1; newLog.push(L("AI: Gathering of the Strong — 1 dmg to YOU","IA: Gathering of the Strong — 1 dmg em você")); }
        if(naJ.includes("Mobilize the Troops")&&turn>5){ naHP+=1; newLog.push(L("AI: Mobilize the Troops — +1 HP","IA: Mobilize the Troops — +1 HP")); }
        if(naJ.includes("Rendezvous")&&turn===8){ naHP-=10; newLog.push(L("AI: Rendezvous — 10 dmg to AI (turn 8)","IA: Rendezvous — 10 dmg (turno 8)")); }
        if(naJ.includes("Trial by Fire")&&turn===5){ naAP+=5; naHP+=6; newLog.push(L("AI: Trial by Fire — +5 AP, +6 HP unlocked","IA: Trial by Fire — +5 AP, +6 HP liberado")); }
        if(naJ.includes("Aurora Tears")&&naEff.goesFirst){ naAP+=2; newLog.push(L("AI: Aurora Tears — +2 AP (goes first)","IA: Aurora Tears — +2 AP (primeiro)")); }

        let skip = false;
        if(naJ.includes("Trial by Fire")&&turn<=4){ skip=true; newLog.push("AI: Trial by Fire — cannot attack (turn "+(turn)+" of 4)"); }
        if(!skip){
          let dmg = naAP;
          if(naJ.includes("Blades Crossing")) dmg+=1;
          if(naJ.includes("Double Trigger")) dmg+=2;
          // Reckless Rewards: AI takes +1 extra dmg when hit — applied when YOU attack (handled in player turn)
          if(npJ.includes("Spirit Clothes")) dmg=Math.max(0,dmg-1);
          if(npJ.includes("Veil of Aura")) dmg=Math.max(0,dmg-2);
          if(npJ.includes("Emperor's Pride")) dmg=Math.max(0,dmg-1);
          if(npJ.includes("Defensive Stance")) { dmg=Math.max(0,dmg-1); newLog.push(L("YOU: Defensive Stance — -1 dmg","VOCÊ: Defensive Stance — -1 dmg")); }
          if(npJ.includes("Promised Discretion")) dmg=Math.min(dmg,3);
          if(npJ.includes("Detail Oriented")&&dmg<=2) dmg=0;
          if(npJ.includes("Mind's Eye")&&!npEff.mindEyeUsed){ dmg=0; npEff.mindEyeUsed=true; newLog.push(L("YOU: Mind's Eye — evaded AI attack","VOCÊ: Mind's Eye — esquivou")); }
          let reflected=0;
          if(npJ.includes("Mirror of Revenge")&&(npEff.mirrorTurns||0)>0){ reflected=dmg; dmg=0; naHP-=reflected; newLog.push(isPT?`VOCÊ: Mirror of Revenge — reflete ${reflected} dmg`:`YOU: Mirror of Revenge — reflects ${reflected} dmg back`); npEff.mirrorTurns=(npEff.mirrorTurns||0)-1; }
          if(npJ.includes("Ingenious Scheme")&&(npEff.schemeTurns||0)>0){ reflected=dmg; dmg=0; naHP-=reflected; newLog.push(isPT?`VOCÊ: Ingenious Scheme — reflete ${reflected} dmg`:`YOU: Ingenious Scheme — reflects ${reflected} dmg back`); npEff.schemeTurns=(npEff.schemeTurns||0)-1; }
          if(npJ.includes("Reckless Rewards")&&dmg>0){ dmg+=1; newLog.push(L("YOU: Reckless Rewards — +1 extra dmg taken","VOCÊ: Reckless Rewards — +1 dmg extra")); }
          if(npEff.firstToAction&&dmg>0){ dmg+=1; newLog.push(L("YOU: First to Action penalty — +1 extra dmg taken","VOCÊ: First to Action — +1 dmg extra")); }
          npHP-=dmg;
          if(dmg>0||reflected>0) newLog.push(isPT?`IA ataca — ${dmg} dmg em você${reflected>0?" ("+reflected+" refletido)":""}`:` AI attacks — ${dmg} dmg to YOU${reflected>0?" ("+reflected+" reflected)":""}`);
          if(npJ.includes("Cross Counter")&&dmg>0){ naHP-=1; newLog.push(L("YOU: Cross Counter — 1 dmg to AI","VOCÊ: Cross Counter — 1 dmg na IA")); }
          if(naJ.includes("Massacre Pulse")&&dmg>0){ naAP+=1; newLog.push(L("AI: Massacre Pulse — +1 AP","IA: Massacre Pulse — +1 AP")); }
        }
        if(naJ.includes("Quickdance")){ let dmg2=Math.max(0,naAP-3); if(npJ.includes("Spirit Clothes")) dmg2=Math.max(0,dmg2-1); npHP-=dmg2; newLog.push(isPT?`IA: Quickdance — ataque extra ${dmg2} dmg`:`AI: Quickdance — extra attack ${dmg2} dmg`); }
        if(naJ.includes("Anu's Karma")&&!naEff.goesFirst){ naHP+=3; newLog.push(L("AI: Anu's Karma — +3 HP (going second)","IA: Anu's Karma — +3 HP (segundo)")); }
      }

      // Clenching Teeth / Suck it up
      if(npHP<=0&&npJ.includes("Clenching Teeth")&&!npEff.clenchUsed){ npHP=1; npEff.clenchUsed=true; newLog.push("YOU: Clenching Teeth — HP forced to 1"); }
      if(npHP<=0&&npJ.includes("Suck it up")&&!npEff.suckUsed){ npHP=5; npEff.suckUsed=true; newLog.push("YOU: Suck it up — HP forced to 5"); }
      if(naHP<=0&&naJ.includes("Clenching Teeth")&&!naEff.clenchUsed){ naHP=1; naEff.clenchUsed=true; newLog.push("AI: Clenching Teeth — HP forced to 1"); }
      if(naHP<=0&&naJ.includes("Suck it up")&&!naEff.suckUsed){ naHP=5; naEff.suckUsed=true; newLog.push("AI: Suck it up — HP forced to 5"); }

      const nextTurn = currentTurn==="player" ? "ai" : "player";
      return { pHP:npHP, pAP:npAP, aHP:naHP, aAP:naAP,
               pJunctions:npJ, aJunctions:naJ,
               pEffects:npEff, aEffects:naEff,
               currentTurn:nextTurn, turn:turn+1,
               newLogEntries:newLog };
    }



    if (!bState) return (
      React.createElement('div', { style: {width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"},}
        , React.createElement('div', { style: {color:C.cyan,fontFamily:"monospace",fontSize:14},}, "Initializing battle…" )
      )
    );

    function advanceTurn() {
      if (battleOver) return;
      const next = processTurn(bState);
      // Check win conditions
      if (next.pHP <= 0) {
        setBState(next);
        setBattleOver({ winner:"ai", reason:isPT?"K.O. — Seu General foi derrotado":"K.O. — YOUR General was defeated" });
        setBattleLog(l => [...l, isPT?"✕ Você foi nocauteado!":"✕ YOU were K.O.'d!"]);
        return;
      }
      if (next.aHP <= 0) {
        setBState(next);
        setBattleOver({ winner:"player", reason:isPT?"K.O. — General da IA foi derrotado":"K.O. — AI General was defeated" });
        setBattleLog(l => [...l, isPT?"✓ IA nocauteada — VOCÊ VENCEU!":"✓ AI was K.O.'d — YOU WIN!"]);
        return;
      }
      if (next.turn > 10) {
        const winner = next.pHP > next.aHP ? "player" : next.aHP > next.pHP ? "ai" : "draw";
        setBState(next);
        setBattleOver({ winner, reason: winner==="draw" ? "Draw — equal HP after 10 turns" : `Timeout — ${winner==="player"?"YOU":"AI"} wins with more HP` });
        setBattleLog(l => [...l, `⏱ Timeout — ${winner==="player"?"YOU WIN":"AI WINS"} (HP: YOU ${next.pHP} vs AI ${next.aHP})`]);
        return;
      }
      // Append turn log entries
      if (next.newLogEntries && next.newLogEntries.length > 0) {
        setBattleLog(l => [...l, ...next.newLogEntries]);
      }
      setBState(next);
    }

    // HP bar helper
    const HPBar = ({ hp, maxHp, col }) => {
      const pct = Math.max(0, Math.min(100, (hp/maxHp)*100));
    const _yourTurn   = isPT ? "▶ SEU TURNO"      : "▶ YOUR TURN";
    const _aiTurn     = isPT ? "▶ TURNO DA IA"     : "▶ AI TURN";
    const _yourJuncs  = isPT ? "SUAS JUNCTIONS"     : "YOUR JUNCTIONS";
    const _aiJuncs    = isPT ? "JUNCTIONS DA IA"    : "AI JUNCTIONS";
    const _noEvents   = isPT ? "Nenhum evento ainda." : "No events yet.";
    const _noneActive = isPT ? "Nenhuma ativa"      : "None active";
      return (
        React.createElement('div', { style: {width:"100%", height:10, background:"rgba(255,255,255,0.08)", borderRadius:5, overflow:"hidden"},}
          , React.createElement('div', { style: {width:`${pct}%`, height:"100%", background:col, borderRadius:5, transition:"width 0.3s"},})
        )
      );
    };

    const maxPHP = _optionalChain([playerGen, 'optionalAccess', _24 => _24.hp]) || 1, maxAHP = _optionalChain([aiGen, 'optionalAccess', _25 => _25.hp]) || 1;
    const pWinning = (_optionalChain([bState, 'optionalAccess', _26 => _26.pHP])||0) > (_optionalChain([bState, 'optionalAccess', _27 => _27.aHP])||0);
    const aWinning = (_optionalChain([bState, 'optionalAccess', _28 => _28.aHP])||0) > (_optionalChain([bState, 'optionalAccess', _29 => _29.pHP])||0);

    return (
      React.createElement('div', { style: {width:"100%",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"},
        onClick: ()=>setInfoCard(null),}
        , React.createElement(PhaseHeader, { back: surrender, hideBack: !!battleOver,} )

        /* ── ARENA — fills remaining height, no scroll ── */
        , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",overflow:"hidden",
          margin:"6px 8px 0",borderRadius:10,border:"1px solid rgba(60,20,120,0.25)"},}

          /* AI FIELD — status/HP → units back → General front */
          , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",
            background:aWinning?"rgba(22,3,3,0.85)":"rgba(14,2,2,0.75)",
            padding:"7px 10px 5px",overflow:"hidden"},}
            /* AI label + HP */
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,marginBottom:4,flexShrink:0},}
              , React.createElement('span', { style: {fontSize:11,fontWeight:700,color:"#ff4466",fontFamily:"monospace",flexShrink:0},}, "AI")
              , React.createElement('span', { style: {fontSize:10,color:"#cc3333",fontFamily:"monospace",flex:1,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, aiGen.name)
              , React.createElement('span', { style: {fontSize:12,fontWeight:900,fontFamily:"monospace",flexShrink:0,
                color:bState.aHP>maxAHP*0.5?"#ff4466":bState.aHP>maxAHP*0.25?"#ffcc00":"#44ee88"},}
                , bState.aHP, React.createElement('span', { style: {fontSize:9,color:C.textMuted,fontWeight:400},}, "/", maxAHP)
              )
              , React.createElement('span', { style: {fontSize:10,color:"#ff8844",fontFamily:"monospace",flexShrink:0},}, "AP " , React.createElement('strong', null, bState.aAP))
            )
            , React.createElement('div', { style: {height:9,borderRadius:5,background:"rgba(255,255,255,0.08)",overflow:"hidden",marginBottom:6,flexShrink:0},}
              , React.createElement('div', { style: {height:"100%",borderRadius:5,transition:"width 0.4s",
                background:bState.aHP>maxAHP*0.5?"#ff4466":bState.aHP>maxAHP*0.25?"#ffcc00":"#44ee88",
                width:`${Math.max(0,Math.min(100,(bState.aHP/maxAHP)*100))}%`},})
            )
            /* AI units — back row */
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,marginBottom:5,flexShrink:0},}
              , [0,1,2].map(idx=>{
                const r=clashResults[idx]; const card=r&&r.winner==="ai"?r.aCard:null;
                const tc=card?(TYPE_COLOR[card.type]||"#aaa"):"transparent";
                return (
                  React.createElement('div', { key: idx, style: {display:"flex",flexDirection:"column",alignItems:"center",gap:1},}
                    , React.createElement('div', {
                      onClick: e=>{e.stopPropagation();if(card)setInfoCard(_optionalChain([infoCard, 'optionalAccess', _30 => _30.id])===card.id&&_optionalChain([infoCard, 'optionalAccess', _31 => _31._side])==="ai"?null:{...card,_side:"ai"});},
                      style: {width:"100%",maxWidth:62,aspectRatio:"3/4",borderRadius:5,overflow:"hidden",margin:"0 auto",
                      border:card?`1.5px solid ${tc}`:"none",visibility:card?"visible":"hidden",
                      cursor:card?"pointer":"default",
                      boxShadow:_optionalChain([infoCard, 'optionalAccess', _32 => _32.id])===_optionalChain([card, 'optionalAccess', _33 => _33.id])&&_optionalChain([infoCard, 'optionalAccess', _34 => _34._side])==="ai"?`0 0 8px ${TYPE_GLOW[_optionalChain([card, 'optionalAccess', _35 => _35.type])]||"transparent"}`:"none"},}
                      , card&&React.createElement('img', { src: IMGS[card.img.replace('.png','')] || '', alt: card.name, style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                    )
                    , React.createElement('span', { style: {fontSize:7,color:"rgba(255,110,130,0.6)",fontFamily:"monospace",
                      visibility:card?"visible":"hidden",lineHeight:1},}, _optionalChain([card, 'optionalAccess', _36 => _36.name, 'optionalAccess', _37 => _37.split, 'call', _38 => _38(" "), 'access', _39 => _39[0]])||"")
                  )
                );
              })
            )
            /* AI General — front center */
            , React.createElement('div', { style: {flex:1,display:"flex",justifyContent:"center",alignItems:"center",gap:8,minHeight:0},}
              , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"},}
                , bState.aJunctions.slice(0,3).map((j,i)=>(
                  React.createElement('span', { key: i, style: {fontSize:9,fontFamily:"monospace",padding:"2px 6px",borderRadius:3,
                    background:"rgba(255,40,60,0.1)",border:"1px solid rgba(255,40,60,0.25)",
                    color:"rgba(255,110,130,0.95)",whiteSpace:"nowrap"},}, "⚡ " , j)
                ))
              )
              , React.createElement('div', {
                onClick: e=>{e.stopPropagation();setInfoCard(_optionalChain([infoCard, 'optionalAccess', _40 => _40.id])===aiGen.id&&_optionalChain([infoCard, 'optionalAccess', _41 => _41._side])==="ai"?null:{...aiGen,_side:"ai"});},
                style: {width:90,height:120,borderRadius:7,overflow:"hidden",flexShrink:0,cursor:"pointer",
                border:_optionalChain([infoCard, 'optionalAccess', _42 => _42.id])===aiGen.id&&_optionalChain([infoCard, 'optionalAccess', _43 => _43._side])==="ai"?`2px solid #ff4466`:`2px solid ${TYPE_COLOR[aiGen.type]||"#aaa"}`,
                boxShadow:`0 0 ${aWinning?"16px":"8px"} ${TYPE_GLOW[aiGen.type]||"transparent"}`},}
                , React.createElement('img', { src: IMGS[aiGen.img.replace('.png','')] || '', alt: aiGen.name, style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
              )
              , React.createElement('div', { style: {flex:1},})
            )
          )

          /* DIVIDER */
          , React.createElement('div', { style: {flexShrink:0,background:"rgba(4,2,18,0.98)",padding:"4px 12px",
            borderTop:"1px solid rgba(80,32,160,0.5)",borderBottom:"1px solid rgba(80,32,160,0.5)",
            display:"flex",alignItems:"center",justifyContent:"space-between"},}
            , React.createElement('span', { style: {fontSize:11,fontWeight:700,fontFamily:"monospace",
              color:bState.currentTurn==="player"?C.cyan:"#ff4466"},}
              , bState.currentTurn==="player"?_yourTurn:_aiTurn
            )
            , React.createElement('span', { style: {fontSize:10,fontFamily:"monospace",color:C.accent,fontWeight:700},}, "TURN "
               , React.createElement('span', { style: {fontSize:15},}, Math.min(bState.turn,10))
              , React.createElement('span', { style: {fontSize:9,color:C.textMuted,fontWeight:400},}, "/10")
            )
          )

          /* PLAYER FIELD — General front → units back → HP → status */
          , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",
            background:pWinning?"rgba(2,12,34,0.85)":"rgba(2,7,20,0.75)",
            padding:"5px 10px 7px",overflow:"hidden"},}
            /* Player General — front center */
            , React.createElement('div', { style: {flex:1,display:"flex",justifyContent:"center",alignItems:"center",gap:8,minHeight:0,marginBottom:5},}
              , React.createElement('div', { style: {flex:1},})
              , React.createElement('div', {
                onClick: e=>{e.stopPropagation();setInfoCard(_optionalChain([infoCard, 'optionalAccess', _44 => _44.id])===playerGen.id&&_optionalChain([infoCard, 'optionalAccess', _45 => _45._side])==="player"?null:{...playerGen,_side:"player"});},
                style: {width:90,height:120,borderRadius:7,overflow:"hidden",flexShrink:0,cursor:"pointer",
                border:_optionalChain([infoCard, 'optionalAccess', _46 => _46.id])===playerGen.id&&_optionalChain([infoCard, 'optionalAccess', _47 => _47._side])==="player"?`2px solid ${C.cyan}`:`2px solid ${TYPE_COLOR[playerGen.type]||"#aaa"}`,
                boxShadow:`0 0 ${pWinning?"16px":"8px"} ${TYPE_GLOW[playerGen.type]||"transparent"}`},}
                , React.createElement('img', { src: IMGS[playerGen.img.replace('.png','')] || '', alt: playerGen.name, style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
              )
              , React.createElement('div', { style: {flex:1,display:"flex",flexDirection:"column",gap:3,alignItems:"flex-start"},}
                , bState.pJunctions.slice(0,3).map((j,i)=>(
                  React.createElement('span', { key: i, style: {fontSize:9,fontFamily:"monospace",padding:"2px 6px",borderRadius:3,
                    background:"rgba(0,245,255,0.09)",border:"1px solid rgba(0,245,255,0.25)",
                    color:"rgba(0,210,255,0.95)",whiteSpace:"nowrap"},}, "⚡ " , j)
                ))
              )
            )
            /* Player units — back row */
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,marginBottom:5,flexShrink:0},}
              , [0,1,2].map(idx=>{
                const r=clashResults[idx]; const card=r&&r.winner==="player"?r.pCard:null;
                const tc=card?(TYPE_COLOR[card.type]||"#aaa"):"transparent";
                return (
                  React.createElement('div', { key: idx, style: {display:"flex",flexDirection:"column",alignItems:"center",gap:1},}
                    , React.createElement('span', { style: {fontSize:7,color:"rgba(80,140,255,0.6)",fontFamily:"monospace",
                      visibility:card?"visible":"hidden",lineHeight:1},}, _optionalChain([card, 'optionalAccess', _48 => _48.name, 'optionalAccess', _49 => _49.split, 'call', _50 => _50(" "), 'access', _51 => _51[0]])||"")
                    , React.createElement('div', {
                      onClick: e=>{e.stopPropagation();if(card)setInfoCard(_optionalChain([infoCard, 'optionalAccess', _52 => _52.id])===card.id&&_optionalChain([infoCard, 'optionalAccess', _53 => _53._side])==="player"?null:{...card,_side:"player"});},
                      style: {width:"100%",maxWidth:62,aspectRatio:"3/4",borderRadius:5,overflow:"hidden",margin:"0 auto",
                      border:card?`1.5px solid ${tc}`:"none",visibility:card?"visible":"hidden",
                      cursor:card?"pointer":"default",
                      boxShadow:_optionalChain([infoCard, 'optionalAccess', _54 => _54.id])===_optionalChain([card, 'optionalAccess', _55 => _55.id])&&_optionalChain([infoCard, 'optionalAccess', _56 => _56._side])==="player"?`0 0 8px ${TYPE_GLOW[_optionalChain([card, 'optionalAccess', _57 => _57.type])]||"transparent"}`:"none"},}
                      , card&&React.createElement('img', { src: IMGS[card.img.replace('.png','')] || '', alt: card.name, style: {width:"100%",height:"100%",objectFit:"cover",display:"block"},})
                    )
                  )
                );
              })
            )
            /* Player HP bar */
            , React.createElement('div', { style: {height:9,borderRadius:5,background:"rgba(255,255,255,0.08)",overflow:"hidden",marginBottom:4,flexShrink:0},}
              , React.createElement('div', { style: {height:"100%",borderRadius:5,transition:"width 0.4s",
                background:bState.pHP>maxPHP*0.5?"#44ee88":bState.pHP>maxPHP*0.25?"#ffcc00":"#ff4466",
                width:`${Math.max(0,Math.min(100,(bState.pHP/maxPHP)*100))}%`},})
            )
            /* Player label + HP */
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,flexShrink:0},}
              , React.createElement('span', { style: {fontSize:11,fontWeight:700,color:C.cyan,fontFamily:"monospace",flexShrink:0},}, "YOU")
              , React.createElement('span', { style: {fontSize:10,color:"#2255aa",fontFamily:"monospace",flex:1,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, playerGen.name)
              , React.createElement('span', { style: {fontSize:12,fontWeight:900,fontFamily:"monospace",flexShrink:0,
                color:bState.pHP>maxPHP*0.5?"#44ee88":bState.pHP>maxPHP*0.25?"#ffcc00":"#ff4466"},}
                , bState.pHP, React.createElement('span', { style: {fontSize:9,color:C.textMuted,fontWeight:400},}, "/", maxPHP)
              )
              , React.createElement('span', { style: {fontSize:10,color:"#ff8844",fontFamily:"monospace",flexShrink:0},}, "AP " , React.createElement('strong', null, bState.pAP))
            )
          )

        )

        , React.createElement(CardInfoBox, { card: infoCard, onClose: ()=>setInfoCard(null), isGen: !!(infoCard&&(infoCard.hp||infoCard.charisma)), bState: bState,})
        /* Bottom bar */
        , React.createElement('div', { style: {flexShrink:0,padding:"8px 10px",background:"rgba(2,4,38,0.97)",
          borderTop:`1px solid ${C.border}`,width:"100%",display:"flex",gap:6,alignItems:"center"},}

          /* Clash log btn */
          , React.createElement('div', { style: {position:"relative",flexShrink:0},}
            , React.createElement('button', { onClick: ()=>setShowLog(v=>v==="clash"?false:"clash"), style: {
              width:46,height:46,borderRadius:8,
              background:showLog==="clash"?"rgba(245,166,35,0.22)":"rgba(245,166,35,0.08)",
              border:`1px solid rgba(245,166,35,${showLog==="clash"?0.7:0.3})`,
              cursor:"pointer",color:C.accent,fontSize:20,
              display:"flex",alignItems:"center",justifyContent:"center",
            },}, "📋")
            , showLog==="clash" && (
              React.createElement('div', { style: {position:"absolute",bottom:54,left:0,width:290,maxHeight:280,overflowY:"auto",
                background:"rgba(3,5,36,0.99)",borderRadius:10,border:`1px solid ${C.border}`,
                padding:"10px 12px",zIndex:30,boxShadow:"0 -8px 32px rgba(0,0,0,0.85)"},}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7},}
                  , React.createElement('span', { style: {fontSize:13,color:C.accent,fontFamily:"monospace",fontWeight:700},}, "📋 BATTLE LOG"  )
                  , React.createElement('span', { onClick: ()=>setShowLog(false), style: {cursor:"pointer",color:C.textMuted,fontSize:15},}, "✕")
                )
                , battleLog.length===0
                  ? React.createElement('div', { style: {fontSize:12,color:C.textMuted,fontFamily:"monospace"},}, _noEvents)
                  : battleLog.map((e,i)=>{
                    const txt = typeof e==="string" ? e : (e.text||"");
                    const objColor = typeof e==="object" && e.color ? e.color : null;
                    const col = objColor || (
                      txt.startsWith("YOU attack")||txt.startsWith("✓")||txt.startsWith("YOU:")?"#44ee88"
                    : txt.startsWith("AI attack")||txt.startsWith("✕")||txt.startsWith("AI:")?"#ff6677"
                    : txt.startsWith("⚡")||txt.startsWith("━")?"#ffcc00":C.textSub);
                    const hasBorder = txt.startsWith("YOU attack")||txt.startsWith("AI attack")||txt.startsWith("━");
                    return (
                      React.createElement('div', { key: i, style: {fontSize:13,fontFamily:"monospace",lineHeight:1.7,
                        marginBottom:2,wordBreak:"break-word",color:col,
                        borderLeft:hasBorder?`2px solid ${txt.startsWith("YOU")?"#44ee88":txt.startsWith("AI")?"#ff6677":"#ffcc00"}`:"none",
                        paddingLeft:hasBorder?7:2,
                      },}, txt)
                    );
                  })
              )
            )
          )

          /* Advance/Restart button */
          , battleOver ? (
            React.createElement('button', { onClick: ()=>{setPhase("select");setBattleReady(false);setBState(null);setBattleOver(null);setClashStep(0);setClashResults([]);setSurvivors({player:[],ai:[]});setBattleLog([]);setJunctionLog([]);}, style: {
              flex:1,padding:"13px 0",
              background:"rgba(245,166,35,0.12)",border:"1px solid rgba(245,166,35,0.5)",
              borderRadius:9,cursor:"pointer",color:C.accent,
              fontFamily:"monospace",fontSize:13,fontWeight:700,letterSpacing:"0.08em",
            },}, isPT?"🔄 Jogar Novamente":"🔄 Play Again")
          ) : (
            React.createElement('button', { onClick: advanceTurn, style: {
              flex:1,padding:"13px 0",
              background:"rgba(0,245,255,0.1)",border:"1px solid rgba(0,245,255,0.45)",
              borderRadius:9,cursor:"pointer",color:C.cyan,
              fontFamily:"monospace",fontSize:13,fontWeight:700,letterSpacing:"0.08em",
              textShadow:`0 0 10px rgba(0,245,255,0.5)`,
            },}, "⚔ " , bState.currentTurn==="player"?"Attack":"AI Attacks", " →" )
          )

          /* Junction log btn */
          , React.createElement('div', { style: {position:"relative",flexShrink:0},}
            , React.createElement('button', { onClick: ()=>setShowLog(v=>v==="junction"?false:"junction"), style: {
              width:46,height:46,borderRadius:8,
              background:showLog==="junction"?"rgba(0,245,255,0.18)":"rgba(0,245,255,0.06)",
              border:`1px solid rgba(0,245,255,${showLog==="junction"?0.7:0.25})`,
              cursor:"pointer",color:C.cyan,fontSize:20,
              display:"flex",alignItems:"center",justifyContent:"center",
            },}, "⚡")
            , showLog==="junction" && (
              React.createElement('div', { style: {position:"absolute",bottom:54,right:0,width:300,maxHeight:320,overflowY:"auto",
                background:"rgba(3,5,36,0.99)",borderRadius:10,border:`1px solid ${C.border}`,
                padding:"10px 12px",zIndex:30,boxShadow:"0 -8px 32px rgba(0,0,0,0.85)"},}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},}
                  , React.createElement('span', { style: {fontSize:13,color:C.cyan,fontFamily:"monospace",fontWeight:700},}, "⚡ JUNCTION LOG"  )
                  , React.createElement('span', { onClick: ()=>setShowLog(false), style: {cursor:"pointer",color:C.textMuted,fontSize:15},}, "✕")
                )
                /* YOUR JUNCTIONS */
                , React.createElement('div', { style: {fontSize:10,color:C.cyan,fontFamily:"monospace",fontWeight:700,
                  borderLeft:`2px solid ${C.cyan}`,paddingLeft:6,marginBottom:6},}, _yourJuncs)
                , bState.pJunctions.length===0
                  ? React.createElement('div', { style: {fontSize:11,color:C.textMuted,fontFamily:"monospace",marginBottom:8,paddingLeft:4},}, _noneActive)
                  : bState.pJunctions.map((j,i)=>(
                    React.createElement('div', { key: i, style: {marginBottom:7,paddingLeft:4,borderLeft:"2px solid rgba(0,245,255,0.25)"},}
                      , React.createElement('div', { style: {fontSize:12,color:"rgba(0,245,255,0.95)",fontFamily:"monospace",fontWeight:700},}, "⚡ " , j)
                      , JUNCTION_DESC[j] && React.createElement('div', { style: {fontSize:10,color:"rgba(160,210,255,0.75)",fontFamily:"monospace",lineHeight:1.4,marginTop:1,paddingLeft:2},}, JUNCTION_DESC[j])
                    )
                  ))
                
                /* AI JUNCTIONS */
                , React.createElement('div', { style: {fontSize:10,color:"#ff4466",fontFamily:"monospace",fontWeight:700,
                  borderLeft:"2px solid #ff4466",paddingLeft:6,marginTop:4,marginBottom:6},}, _aiJuncs)
                , bState.aJunctions.length===0
                  ? React.createElement('div', { style: {fontSize:11,color:C.textMuted,fontFamily:"monospace",paddingLeft:4},}, _noneActive)
                  : bState.aJunctions.map((j,i)=>(
                    React.createElement('div', { key: i, style: {marginBottom:7,paddingLeft:4,borderLeft:"2px solid rgba(255,60,80,0.25)"},}
                      , React.createElement('div', { style: {fontSize:12,color:"rgba(255,110,130,0.95)",fontFamily:"monospace",fontWeight:700},}, "⚡ " , j)
                      , JUNCTION_DESC[j] && React.createElement('div', { style: {fontSize:10,color:"rgba(255,190,200,0.75)",fontFamily:"monospace",lineHeight:1.4,marginTop:1,paddingLeft:2},}, JUNCTION_DESC[j])
                    )
                  ))
                
              )
            )
          )
        )
      )
    );
  }

  return null;
}

// ─── GAME MODE SCREEN ────────────────────────
function GameModeScreen({ onBack, onStartAI }) {
  const t = useT();
  const { settings, updateSetting } = useSettings();

  const difficulties = [
    { key:"easy",   label:t("gameMode.easy")   },
    { key:"normal", label:t("gameMode.normal") },
    { key:"hard",   label:t("gameMode.hard")   },
  ];

  return (
    React.createElement('div', { style: S.root,}
      , React.createElement('div', { style: {...S.content, justifyContent:"center", minHeight:"100vh", display:"flex", flexDirection:"column", gap:0, paddingBottom:"2rem"},}

        , React.createElement(BackBtn, { label: `‹ ${t("gameMode.back")}`, onClick: onBack,} )
        , React.createElement('h1', { style: {...S.screenTitle, marginBottom:"1.5rem"},}, t("gameMode.title"))

        /* VS AI card — color changes with difficulty */
        , (()=>{
          const dc = settings.difficulty==="easy"
            ? {c:"#44ee88", border:"rgba(68,238,136,0.45)",  bg:"rgba(0,40,10,0.55)",   glow:"rgba(68,238,136,0.6)",  iconBg:"rgba(68,238,136,0.08)",  iconBorder:"rgba(68,238,136,0.3)",  divider:"rgba(68,238,136,0.12)"}
            : settings.difficulty==="hard"
            ? {c:"#ff4466", border:"rgba(255,40,60,0.45)",   bg:"rgba(50,0,10,0.55)",   glow:"rgba(255,40,60,0.6)",   iconBg:"rgba(255,40,60,0.08)",   iconBorder:"rgba(255,40,60,0.3)",   divider:"rgba(255,40,60,0.12)"}
            : {c:C.cyan,    border:"rgba(0,245,255,0.35)",   bg:"rgba(0,10,60,0.55)",   glow:"rgba(0,245,255,0.6)",   iconBg:"rgba(0,245,255,0.08)",   iconBorder:"rgba(0,245,255,0.3)",   divider:"rgba(0,245,255,0.1)"};
          return (
        React.createElement('div', {
          onClick: onStartAI,
          style: {
            ...S.card,
            cursor:"pointer",
            border:`1px solid ${dc.border}`,
            background:dc.bg,
            marginBottom:12,
            transition:"all 0.25s",
            position:"relative",
            overflow:"hidden",
          },
          className: "mode-card",
          onMouseEnter: e => {
            e.currentTarget.style.background = settings.difficulty==="easy" ? "rgba(0,60,15,0.75)"
              : settings.difficulty==="hard" ? "rgba(70,0,15,0.75)" : "rgba(0,20,80,0.75)";
            e.currentTarget.style.borderColor = settings.difficulty==="easy" ? "rgba(68,238,136,0.7)"
              : settings.difficulty==="hard" ? "rgba(255,40,60,0.7)" : "rgba(0,245,255,0.7)";
            e.currentTarget.style.boxShadow = settings.difficulty==="easy"
              ? "0 0 24px rgba(68,238,136,0.15), inset 0 0 20px rgba(68,238,136,0.04)"
              : settings.difficulty==="hard"
              ? "0 0 24px rgba(255,40,60,0.15), inset 0 0 20px rgba(255,40,60,0.04)"
              : "0 0 24px rgba(0,245,255,0.12), inset 0 0 20px rgba(0,245,255,0.03)";
          },
          onMouseLeave: e => {
            e.currentTarget.style.background = settings.difficulty==="easy" ? "rgba(0,40,10,0.55)"
              : settings.difficulty==="hard" ? "rgba(50,0,10,0.55)" : "rgba(0,10,60,0.55)";
            e.currentTarget.style.borderColor = settings.difficulty==="easy" ? "rgba(68,238,136,0.45)"
              : settings.difficulty==="hard" ? "rgba(255,40,60,0.45)" : "rgba(0,245,255,0.35)";
            e.currentTarget.style.boxShadow = "none";
          },}

          /* Glow accent */
          , React.createElement('div', { style: {
            position:"absolute", top:0, left:0, right:0, height:2,
            background:`linear-gradient(90deg, transparent, ${dc.glow}, transparent)`,
            transition:"all 0.25s",
          },})

          , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:14, marginBottom:10},}
            /* AI icon */
            , React.createElement('div', { style: {
              width:52, height:52, borderRadius:10, flexShrink:0,
              background:dc.iconBg,
              border:`1px solid ${dc.iconBorder}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26,
              transition:"all 0.25s",
            },}, "🤖")
            , React.createElement('div', null
              , React.createElement('div', { style: {
                fontSize:15, fontWeight:700, color:dc.c,
                fontFamily:"monospace", letterSpacing:"0.05em",
                textShadow:`0 0 10px ${dc.glow}`,
                transition:"all 0.25s",
              },}, t("gameMode.vsAI"))
              , React.createElement('div', { style: {fontSize:11, color:C.textMuted, fontFamily:"monospace", marginTop:3, lineHeight:1.5},}
                , t("gameMode.vsAIDesc")
              )
            )
          )

          /* Difficulty selector */
          , React.createElement('div', { style: {borderTop:`1px solid ${dc.divider}`, paddingTop:10},}
            , React.createElement('div', { style: {fontSize:10, color:C.textMuted, fontFamily:"monospace", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:7},}
              , t("gameMode.difficulty")
            )
            , React.createElement('div', { style: {display:"flex", gap:6},}
              , difficulties.map(d => {
                const active = settings.difficulty === d.key;
                const col = d.key==="easy"   ? {c:"#44ee88", bg:"rgba(0,200,80,0.14)",  border:"rgba(68,238,136,0.55)", glow:"rgba(68,238,136,0.4)"}
                          : d.key==="hard"   ? {c:"#ff4466", bg:"rgba(255,40,60,0.14)", border:"rgba(255,40,60,0.55)",  glow:"rgba(255,40,60,0.4)"}
                          :                   {c:C.cyan,     bg:"rgba(0,245,255,0.14)", border:"rgba(0,245,255,0.55)",  glow:"rgba(0,245,255,0.4)"};
                return (
                  React.createElement('button', {
                    key: d.key,
                    onClick: e => { e.stopPropagation(); updateSetting("difficulty", d.key); },
                    style: {
                      flex:1, padding:"7px 0",
                      background: active ? col.bg : "rgba(0,10,60,0.4)",
                      border:`1px solid ${active ? col.border : C.border}`,
                      borderRadius:7, cursor:"pointer",
                      color: active ? col.c : C.textMuted,
                      fontFamily:"monospace", fontSize:12, fontWeight:700,
                      textShadow: active ? `0 0 8px ${col.glow}` : "none",
                      transition:"all 0.18s",
                    },}
, d.label)
                );
              })
            )
          )

          /* Enter button */
          , React.createElement('button', {
            onClick: e => { e.stopPropagation(); onStartAI(); },
            style: {
              width:"100%", marginTop:12, padding:"11px 0",
              background:dc.iconBg,
              border:`1px solid ${dc.border}`,
              borderRadius:8, cursor:"pointer",
              color:dc.c, fontFamily:"monospace", fontSize:13, fontWeight:700,
              letterSpacing:"0.08em",
              textShadow:`0 0 10px ${dc.glow}`,
              transition:"all 0.25s",
            },}
, "⚔ " , t("gameMode.start"))
        )
          );
        })()

        /* VS Player card — coming soon */
        , React.createElement('div', { style: {
          ...S.card,
          opacity:0.5,
          cursor:"not-allowed",
          position:"relative",
          overflow:"hidden",
        },}
          , React.createElement('div', { style: {
            position:"absolute", top:0, left:0, right:0, height:2,
            background:"linear-gradient(90deg, transparent, rgba(245,166,35,0.4), transparent)",
          },})

          , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:14},}
            , React.createElement('div', { style: {
              width:52, height:52, borderRadius:10, flexShrink:0,
              background:"rgba(245,166,35,0.06)",
              border:"1px solid rgba(245,166,35,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26,
            },}, "👤")
            , React.createElement('div', { style: {flex:1},}
              , React.createElement('div', { style: {
                fontSize:15, fontWeight:700, color:C.accent,
                fontFamily:"monospace", letterSpacing:"0.05em",
              },}, t("gameMode.vsPlayer"))
              , React.createElement('div', { style: {fontSize:11, color:C.textMuted, fontFamily:"monospace", marginTop:3, lineHeight:1.5},}
                , t("gameMode.vsPlayerDesc")
              )
            )
            /* Coming soon badge */
            , React.createElement('div', { style: {
              flexShrink:0, padding:"4px 10px",
              background:"rgba(245,166,35,0.1)",
              border:"1px solid rgba(245,166,35,0.3)",
              borderRadius:20,
              fontSize:9, fontWeight:700, color:C.accent,
              fontFamily:"monospace", letterSpacing:"0.1em",
              textTransform:"uppercase",
            },}, t("gameMode.comingSoon"))
          )
        )

      )

      , React.createElement('style', null, `
        .mode-card:hover { filter: brightness(1.06); }
      `)
    )
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
function App() {
  const [settings, setSettings] = useState({ language:"en", music:true, difficulty:"normal" });
  const [screen, setScreen]     = useState("menu");
  const updateSetting = (k,v) => setSettings(p => ({...p, [k]:v}));

  return (
    React.createElement(SettingsCtx.Provider, { value: { settings, updateSetting },}
      /* CSS animations */
      , React.createElement(StyleTag, null )
      /* HexBackground canvas — fixed, mounted ONCE, never unmounts */
      , React.createElement(HexBackground, null )
      /* Scanline overlay — fixed, always on top of canvas */
      , React.createElement(Scanline, null )
      /* Screen content — sits above canvas via zIndex */
      , React.createElement('div', { style: { position:"relative", zIndex:1, minHeight:"100vh" },}
        , screen === "menu"     && React.createElement(MainMenu, { onNav: setScreen,} )
        , screen === "options"  && React.createElement(OptionsScreen, { onBack: () => setScreen("menu"),} )
        , screen === "guide"    && React.createElement(GuideScreen, { onBack: () => setScreen("menu"),} )
        , screen === "deck"     && React.createElement(DeckBuilderScreen, { onBack: () => setScreen("menu"),} )
        , screen === "game"     && React.createElement(GameModeScreen, { onBack: () => setScreen("menu"), onStartAI: () => setScreen("arena"),} )
        , screen === "arena"    && React.createElement(ArenaPlaceholder, { onBack: () => setScreen("game"), difficulty: settings.difficulty,} )
      )
    )
  );
}

const __root = ReactDOM.createRoot(document.getElementById("root"));
__root.render(React.createElement(App));
