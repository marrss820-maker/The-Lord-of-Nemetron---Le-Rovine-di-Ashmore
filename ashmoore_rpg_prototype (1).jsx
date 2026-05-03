/*
Ashmoore: Le Rovine Perdute
Part of The Lord of Nemetron project.

Copyright © 2026 Ruffoni Lorenzo. All rights reserved.

This file and the repository contents are public for portfolio and demonstration purposes only.
No permission is granted to copy, modify, redistribute, publish, commercialize, adapt,
translate, train AI systems on, or create derivative works from this code, narrative text,
lore, terminology, game design, or any connected creative material without explicit
written permission from the author.
*/
import React, { useMemo, useState, useEffect } from "react";

const ARCHETYPES = {
  Custode: {
    label: "Custode",
    role: "Protezione / Cura / Tenuta",
    desc: "Un Viaggiatore votato alla stabilità dell'Aura. Resiste alla corruzione, protegge sé stesso e sopravvive dove altri cedono.",
    stats: { struttura: 5, sintonia: 4, vigore: 7, cognizione: 5, tenacia: 8, dominio: 4 },
    maxHp: 115,
    maxAura: 65,
    maxVigore: 70,
  },
  Combattente: {
    label: "Combattente",
    role: "Corpo a corpo / Stabilità",
    desc: "Un corpo addestrato a reggere l'impatto. Forte, diretto, adatto a spezzare le difese dei Drevalkh.",
    stats: { struttura: 8, sintonia: 5, vigore: 7, cognizione: 3, tenacia: 5, dominio: 4 },
    maxHp: 125,
    maxAura: 40,
    maxVigore: 80,
  },
  Predatore: {
    label: "Predatore",
    role: "Furtività / Precisione",
    desc: "Legge il terreno, evita gli scontri inutili e colpisce quando il punto debole si espone.",
    stats: { struttura: 4, sintonia: 8, vigore: 6, cognizione: 4, tenacia: 4, dominio: 6 },
    maxHp: 95,
    maxAura: 50,
    maxVigore: 85,
  },
  Conduttore: {
    label: "Conduttore",
    role: "Archeum / Danno magico",
    desc: "Canalizza l'Archeum attraverso il Bracciale Arconico. Potente, ma dipendente dalla gestione dell'Aura.",
    stats: { struttura: 3, sintonia: 5, vigore: 5, cognizione: 7, tenacia: 6, dominio: 8 },
    maxHp: 90,
    maxAura: 90,
    maxVigore: 55,
  },
  Vincolatore: {
    label: "Vincolatore",
    role: "Controllo / Spiriti",
    desc: "Comprende i legami tra corpo, anima e parassita. Può rallentare, leggere e spezzare i vincoli dei morti.",
    stats: { struttura: 3, sintonia: 5, vigore: 5, cognizione: 8, tenacia: 7, dominio: 7 },
    maxHp: 95,
    maxAura: 80,
    maxVigore: 55,
  },
  Artefice: {
    label: "Artefice",
    role: "Tecnica / Nexus",
    desc: "Usa strumenti, logica e scansioni avanzate. Meno istintivo, più metodico.",
    stats: { struttura: 4, sintonia: 6, vigore: 5, cognizione: 8, tenacia: 4, dominio: 5 },
    maxHp: 100,
    maxAura: 60,
    maxVigore: 65,
  },
};

const PROFESSIONS = {
  Chierico: {
    label: "Chierico di Ravenhold",
    archetype: "Custode",
    bonus: { tenacia: 2, cognizione: 1 },
    spell: "Benedizione Minore",
    weapon: "Mazza Consacrata di Ashmoore",
    desc: "Cura leggera, protezione spirituale e ottima resistenza alla pressione verminacea.",
  },
  Sciamano: {
    label: "Sciamano di Verdacia",
    archetype: "Custode",
    bonus: { vigore: 2, tenacia: 1 },
    spell: "Spirito Radice",
    weapon: "Bastone Vivo del Bosco dei Sussurri",
    desc: "Recupero costante, istinto naturale e buona sopravvivenza durante l'esplorazione.",
  },
  Guerriero: {
    label: "Guerriero di Ravenhold",
    archetype: "Combattente",
    bonus: { struttura: 2, vigore: 1 },
    spell: "Ruggito d'Acciaio",
    weapon: "Spada Lunga Temprata di Ashmoore",
    desc: "Colpi pesanti, alta stabilità e maggiore possibilità di stordire i Drevalkh.",
  },
  Ranger: {
    label: "Ranger della Selva",
    archetype: "Predatore",
    bonus: { sintonia: 2, dominio: 1 },
    spell: "Occhio della Preda",
    weapon: "Arco Velato di Hollowgate",
    desc: "Ottimo nella lettura dei punti deboli e nelle finestre di vulnerabilità da dieci secondi.",
  },
  Mago: {
    label: "Mago di Ravenhold",
    archetype: "Conduttore",
    bonus: { dominio: 2, cognizione: 1 },
    spell: "Dardo d'Archeum",
    weapon: "Bracciale Arconico Infranto",
    desc: "Attacchi energetici efficaci, ma consumo Aura più delicato da gestire.",
  },
  Necromante: {
    label: "Necromante di Ravenhold",
    archetype: "Vincolatore",
    bonus: { dominio: 2, tenacia: 1 },
    spell: "Vincolo Cadaverico",
    weapon: "Grimorio Verminaceo Sigillato",
    desc: "Perfetto per interpretare la maledizione verminacea e rallentare i corpi infestati.",
  },
  ArteficeArca: {
    label: "Artefice dell'Arca",
    archetype: "Artefice",
    bonus: { cognizione: 2, sintonia: 1 },
    spell: "Sonda di Risonanza",
    weapon: "Pugnale Meccanico dell'Arca Celeste",
    desc: "Scansioni più precise, lettura tecnica degli indizi e vantaggi da preparazione.",
  },
};

const CHAPTERS = [
  {
    title: "Capitolo I — Ashmoore non risponde",
    location: "Ingresso delle Rovine",
    text: "La strada che conduce ad Ashmoore non è interrotta. È peggio: sembra ancora in attesa di essere percorsa. Non ci sono barricate, non ci sono corpi lungo il sentiero, non ci sono segni di una fuga disordinata. Solo fango nero, ruote ferme e l'arco d'ingresso del villaggio, spaccato a metà come una mascella rimasta aperta.",
    ei: "Registro EI: segnale cartografico instabile. Ultima risposta dal villaggio: diciassette giorni fa. Nessun codice di evacuazione registrato.",
    choices: [
      { label: "Entrare dalla via principale", result: "Superi l'arco spezzato. Un corpo appoggiato alla garitta muove lentamente la testa, come se avesse atteso il tuo arrivo per ricordarsi di essere morto.", effect: "combat" },
      { label: "Aggirare l'ingresso passando tra le case esterne", result: "Tra due abitazioni addossate al muro trovi un passaggio laterale. Sul legno è inciso un simbolo: una corona attraversata da un verme.", effect: "clue" },
      { label: "Ispezionare il carro rovesciato vicino alla strada", result: "Sotto una coperta irrigidita dal fango trovi un piccolo forziere da viaggio. Dentro c'è una Fiala di Aura Minore ancora sigillata.", effect: "lootAura" },
    ],
  },
  {
    title: "Capitolo II — Il mercato congelato",
    location: "Piazza dei Banchi",
    text: "Il mercato è rimasto composto. I banchi sono allineati, le stoffe piegate, le monete posate accanto alle bilance. I mercanti morti stanno ancora al loro posto. Uno di loro tende la mano verso il vuoto, offrendo qualcosa che non possiede più. Non sembra aggressivo. Sembra bloccato nell'ultimo gesto della sua vita.",
    ei: "Registro EI: ripetizione comportamentale. I Drevalkh conservano frammenti motori del corpo ospite, ma non coscienza individuale.",
    choices: [
      { label: "Avvicinarsi al mercante immobile", result: "La mano del mercante scatta verso il tuo polso. Sotto la pelle del collo, una protuberanza pulsa e si gonfia.", effect: "combat" },
      { label: "Leggere il registro del banco principale", result: "Pagina recuperata: 'La cappella ha richiesto sale, bende, ferri sottili e casse di terra umida. Padre Odran paga bene, ma non guarda più nessuno negli occhi.'", effect: "letter" },
      { label: "Aprire il forziere sotto il banco delle stoffe", result: "Il forziere contiene guanti consumati, qualche moneta annerita e una Fiala di Vigore.", effect: "lootVigore" },
    ],
  },
  {
    title: "Capitolo III — Le case illuminate",
    location: "Quartiere Basso",
    text: "Le case del quartiere basso sono chiuse dall'interno, ma alle finestre bruciano candele che non dovrebbero essere ancora vive. La cera è arrivata fino ai pavimenti, eppure le fiamme restano alte, dritte, tutte inclinate verso la cappella. Alcune ombre siedono oltre i vetri, immobili come famiglie in preghiera.",
    ei: "Registro EI: combustione anomala. Le fiamme non consumano ossigeno in modo normale. Possibile funzione rituale o segnaletica.",
    choices: [
      { label: "Entrare nella casa con tre candele alla finestra", result: "Dentro, tre corpi sono seduti a tavola. Quando varchi la soglia, si voltano insieme. La cena nei piatti si muove prima di loro.", effect: "combat" },
      { label: "Spegnere una candela usando poca Aura", result: "La fiamma muore e il fumo disegna una frase sul muro: 'Non aprite il pozzo dopo il vespro.'", effect: "auraCostReward" },
      { label: "Cercare nella dispensa chiusa", result: "Forzi una dispensa rinforzata. Dentro trovi bende asciutte e una fiala intatta. Recuperi parte delle risorse.", effect: "lootFull" },
    ],
  },
  {
    title: "Capitolo IV — Il pozzo chiuso male",
    location: "Piazza del Pozzo",
    text: "Il pozzo al centro di Ashmoore è stato sigillato con assi, catene e icone sacre. Qualcosa lo ha riaperto dall'interno. Le pietre sul bordo sono graffiate da segni sottili, fitti, tutti rivolti verso l'esterno. Dal fondo non sale odore d'acqua. Sale un fruscio continuo, umido, quasi disciplinato.",
    ei: "Registro EI: attività sotterranea intensa. Il pozzo non è la sorgente dell'infezione, ma un condotto. Profondità non calcolabile.",
    choices: [
      { label: "Guardare nel pozzo", result: "Per un istante non vedi nulla. Poi una mano gonfia compare tra le assi spezzate e un Drevalkh deformato si tira fuori dal buio.", effect: "eliteCombat" },
      { label: "Sigillare temporaneamente il bordo con Aura", result: "L'Aura cauterizza i filamenti pallidi che risalgono tra le pietre. Il pozzo tace, ma solo per poco.", effect: "auraCostReward" },
      { label: "Recuperare il foglio inchiodato al coperchio", result: "Nota recuperata: 'Padre Odran dice che il Re sogna sotto di noi. Dice che i vermi sono le sue dita.'", effect: "letter" },
      { label: "Scendere lungo la scala di servizio accanto al pozzo", result: "La scala laterale conduce a un canale basso. Eviti la piazza, ma il passaggio è stretto e ti costa Vigore.", effect: "vigoreCost" },
    ],
  },
  {
    title: "Capitolo V — Il vicolo dei tintori",
    location: "Vicolo dei Tintori",
    text: "Il vicolo dei tintori è stretto, soffocante, pieno di vasche scure dove i colori si sono rappresi come sangue vecchio. Qui i passi rimbalzano contro i muri e tornano indietro diversi, più numerosi. Non è un semplice passaggio: è un punto dove i morti vengono raccolti.",
    ei: "Registro EI: segnali multipli in avvicinamento. I Drevalkh sembrano reagire a vibrazioni e comandi indiretti.",
    choices: [
      { label: "Affrontare il branco nel vicolo", result: "Il primo Drevalkh avanza con una roncola spezzata. Dietro di lui, altri corpi attendono, immobili, come se il vicolo stesso li comandasse.", effect: "eliteCombat" },
      { label: "Rovesciare una vasca per rallentarli", result: "Il liquido denso invade il passaggio. I corpi scivolano, perdono coordinazione e si separano. Ottieni un vantaggio tattico.", effect: "buff" },
      { label: "Salire sui balconi bassi", result: "Ti arrampichi su travi marce e tetti inclinati. Eviti il branco, ma il percorso consuma molto Vigore.", effect: "vigoreCost" },
    ],
  },
  {
    title: "Capitolo VI — L'archivio del balivo",
    location: "Casa Civile",
    text: "La casa del balivo è l'unico edificio che sembra essere stato chiuso con lucidità. Dentro, mappe e registri sono protetti da tele cerate. Qualcuno ha provato a capire cosa stesse accadendo. Qualcuno ha fallito prima di poterlo dire a Blackthorne.",
    ei: "Registro EI: archivio recuperabile. Priorità media. Probabile ricostruzione degli eventi precedenti alla caduta del villaggio.",
    choices: [
      { label: "Leggere il registro degli ultimi giorni", result: "Registro recuperato: 'Le case attorno al pozzo non rispondono. La cappella ordina quarantena. Nessuno deve inviare corvi a Blackthorne.'", effect: "letter" },
      { label: "Aprire l'armadio sigillato del balivo", result: "Dentro trovi una mappa macchiata. Tre zone sono cancellate col sangue: il pozzo, il mercato e la cappella.", effect: "clue" },
      { label: "Scansionare la mappa", result: "L'EI sovrappone i dati raccolti. Tutte le tracce convergono sotto l'altare della cappella.", effect: "scanClue" },
      { label: "Cercare il forziere fiscale", result: "Trovi poche monete, una chiave arrugginita e una fiala di recupero nascosta in un doppio fondo.", effect: "lootFull" },
    ],
  },
  {
    title: "Capitolo VII — La cappella crollata",
    location: "Cappella di Ashmoore",
    text: "La cappella non è stata profanata. È stata usata fino all'ultimo. Le panche sono disposte in cerchio attorno all'altare, non rivolte verso di esso. Sopra la pietra sacra è inchiodata una corona di ferro con chiodi d'osso. Dietro l'altare, il pavimento è stato aperto e richiuso più volte.",
    ei: "Registro EI: sorgente anomala sotto l'altare. Segnale verminaceo massimo. Consiglio: evitare contatto diretto con la corona.",
    choices: [
      { label: "Toccare la corona di ferro", result: "Una visione ti attraversa: Padre Odran incorona un cadavere e lo chiama sovrano. Il cadavere sorride senza labbra.", effect: "clue" },
      { label: "Scardina i chiodi d'osso", result: "La cappella trema. Un Drevalkh vestito da diacono si stacca dall'ombra dietro l'altare.", effect: "eliteCombat" },
      { label: "Meditare davanti all'altare", result: "La tua Aura si stabilizza. Per un istante, tutte le candele della cappella si abbassano insieme.", effect: "heal" },
    ],
  },
  {
    title: "Capitolo VIII — La scala sotto l'altare",
    location: "Passaggio Sepolcrale",
    text: "La scala sotto l'altare non appartiene a una cappella di villaggio. È troppo antica, troppo ampia, costruita con pietra che non proviene da Ashmoore. Lungo le pareti riposano crani aperti con precisione chirurgica. I vermi li hanno abbandonati come stanze ormai vuote.",
    ei: "Registro EI: struttura preesistente al villaggio. La cappella è stata costruita sopra qualcosa, non il contrario.",
    choices: [
      { label: "Scendere senza toccare nulla", result: "Un corpo incastrato in una nicchia apre gli occhi. Non cade dalla parete: ne esce, come se fosse stato murato vivo.", effect: "combat" },
      { label: "Scansionare i crani aperti", result: "Procedura identificata: apertura rituale del cranio, inserimento larvale, esposizione alla corona.", effect: "scanClue" },
      { label: "Aprire il sarcofago laterale", result: "Dentro il sarcofago trovi una corazza consumata e una fiala grande. Qualcuno aveva preparato una fuga che non è mai avvenuta.", effect: "lootFull" },
    ],
  },
  {
    title: "Capitolo IX — L'anticamera regale",
    location: "Sala Sepolta",
    text: "Il passaggio si apre in una sala che non dovrebbe esistere sotto Ashmoore. Colonne antiche emergono dalla terra, avvolte da filamenti pallidi. Sulle pareti, bassorilievi mostrano un sovrano senza volto seduto sopra un popolo inginocchiato. Il culto non ha inventato il Re. Lo ha trovato.",
    ei: "Registro EI: iconografia monarchica arcaica. Probabile entità dominante precedente alla fondazione del villaggio.",
    choices: [
      { label: "Studiare i bassorilievi", result: "Comprendi il senso del rituale: la corona non è un simbolo. È un amplificatore di comando.", effect: "bossAdvantage" },
      { label: "Aprire il forziere rituale ai piedi della statua", result: "Nel forziere trovi una Fiala Grande di Aura e un frammento d'Erytio annerito. L'EI non sa ancora classificarlo.", effect: "lootAura" },
      { label: "Attraversare la sala senza fermarsi", result: "Due Drevalkh corazzati si staccano dalla penombra. Proteggono ciò che attende oltre la porta.", effect: "eliteCombat" },
      { label: "Usare il Sigillo di Odran contro la porta", result: "Il sigillo vibra e la porta risponde. Qualcosa dall'altra parte perde per un istante il controllo sui corpi vicini.", effect: "bossAdvantage" },
    ],
  },
  {
    title: "Capitolo X — Il Re Drevalkh",
    location: "Cripta Regale",
    text: "Il Re Drevalkh siede su un trono scavato nella pietra viva. Non è enorme, non ruggisce, non si agita. È composto, lento, regale. Questo lo rende peggiore. Sotto la corona di ferro, il cranio pulsa. La protuberanza non è un difetto del corpo: è il vero sovrano che indossa un cadavere come veste.",
    ei: "Registro EI: protocollo di taglia finale attivo. Stordire il corpo. Esporre la protuberanza. Recidere il parassita regale entro la finestra utile.",
    choices: [
      { label: "Sfida il Re Drevalkh", result: "Il Re si alza. La corona stride contro l'osso. Tutti i cadaveri nella cripta si inginocchiano.", effect: "bossCombat" },
      { label: "Colpire prima la corona con Aura controllata", result: "L'Aura investe la corona. Il Re non cade, ma i cadaveri attorno perdono coordinazione. Ottieni un vantaggio.", effect: "bossAdvantage" },
      { label: "Preparare l'arma e attendere il primo movimento", result: "Aspetti. Il Re apprezza la tua esitazione. Poi avanza, come se ti avesse già perdonato.", effect: "bossCombat" },
    ],
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mergeStats(base, bonus) {
  const result = { ...base };
  Object.entries(bonus).forEach(([key, value]) => {
    result[key] = (result[key] || 0) + value;
  });
  return result;
}

function Panel({ children, style }) {
  return (
    <div
      style={{
        border: "1px solid rgba(190, 130, 50, 0.55)",
        background: "rgba(12, 8, 7, 0.82)",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function GameButton({ children, onClick, selected, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        border: selected ? "1px solid #f0cf7a" : danger ? "1px solid #8b2a2a" : "1px solid rgba(190, 130, 50, 0.45)",
        background: selected ? "rgba(126, 83, 22, 0.72)" : danger ? "rgba(80, 10, 10, 0.55)" : "rgba(20, 13, 11, 0.8)",
        color: "#fff7df",
        borderRadius: 14,
        padding: "13px 15px",
        marginBottom: 10,
        cursor: "pointer",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 15,
        lineHeight: 1.35,
      }}
    >
      {children}
    </button>
  );
}

function Bar({ label, value, max }) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#f5e6c8" }}>
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div style={{ height: 9, background: "#120b09", border: "1px solid #6b3f16", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#d8b45f" }} />
      </div>
    </div>
  );
}

export default function AshmooreRpgPrototype() {
  const [screen, setScreen] = useState("create");
  const [name, setName] = useState("Viaggiatore");
  const [archetype, setArchetype] = useState("Custode");
  const [profession, setProfession] = useState("Chierico");
  const [chapter, setChapter] = useState(0);
  const [log, setLog] = useState(["Registro EI inattivo. Creare profilo Viaggiatore."]);
  const [combat, setCombat] = useState(null);
  const [weakTimer, setWeakTimer] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [clues, setClues] = useState(0);
  const [bossAdvantage, setBossAdvantage] = useState(0);
  const [damageBonus, setDamageBonus] = useState(0);

  const heroBase = ARCHETYPES[archetype];
  const prof = PROFESSIONS[profession];
  const finalStats = useMemo(() => mergeStats(heroBase.stats, prof.bonus), [heroBase, prof]);

  const [hp, setHp] = useState(ARCHETYPES.Custode.maxHp);
  const [aura, setAura] = useState(ARCHETYPES.Custode.maxAura);
  const [vigore, setVigore] = useState(ARCHETYPES.Custode.maxVigore);

  const currentChapter = CHAPTERS[chapter];

  useEffect(() => {
    const currentProfession = PROFESSIONS[profession];
    if (currentProfession.archetype !== archetype) {
      const firstValid = Object.keys(PROFESSIONS).find((key) => PROFESSIONS[key].archetype === archetype);
      setProfession(firstValid || "Chierico");
    }
  }, [archetype, profession]);

  useEffect(() => {
    if (!combat || !combat.weakWindow || weakTimer <= 0) return;
    const timer = setTimeout(() => setWeakTimer((old) => old - 1), 1000);
    return () => clearTimeout(timer);
  }, [combat, weakTimer]);

  useEffect(() => {
    if (combat && combat.weakWindow && weakTimer === 0) {
      setCombat((old) => old ? { ...old, weakWindow: false, text: "La protuberanza rientra sotto la carne. Il verme riprende il controllo del corpo." } : old);
      addLog("Finestra vulnerabile persa. Il parassita ha ristabilito il controllo motorio.");
    }
  }, [weakTimer, combat]);

  useEffect(() => {
    if (screen === "combat" && hp <= 0) setScreen("death");
  }, [hp, screen]);

  const addLog = (entry) => {
    setLog((old) => [entry, ...old].slice(0, 7));
  };

  const resetAll = () => {
    setScreen("create");
    setChapter(0);
    setCombat(null);
    setWeakTimer(0);
    setScanCount(0);
    setClues(0);
    setBossAdvantage(0);
    setDamageBonus(0);
    setHp(ARCHETYPES.Custode.maxHp);
    setAura(ARCHETYPES.Custode.maxAura);
    setVigore(ARCHETYPES.Custode.maxVigore);
    setLog(["Registro EI inattivo. Creare profilo Viaggiatore."]);
  };

  const confirmCharacter = () => {
    setHp(heroBase.maxHp);
    setAura(heroBase.maxAura);
    setVigore(heroBase.maxVigore);
    setLog([
      `Profilo creato: ${name || "Viaggiatore"}. Archetipo: ${heroBase.label}. Professione: ${prof.label}.`,
      "Nexus collegato. Entità Intelligente avviata.",
    ]);
    setScreen("intro");
  };

  const startMission = () => {
    setChapter(0);
    setScreen("game");
    addLog("Taglia accettata. Destinazione: Rovine di Ashmoore, Regno di Ravenhold.");
  };

  const nextChapter = () => {
    if (chapter >= CHAPTERS.length - 1) {
      setScreen("ending");
      return;
    }
    setChapter((old) => old + 1);
  };

  const applyChoice = (choice) => {
    addLog(choice.result);
    if (currentChapter?.ei) addLog(currentChapter.ei);

    if (choice.effect === "combat") {
      setCombat({ name: "Drevalkh", hp: 72, maxHp: 72, elite: false, boss: false, weakWindow: false, text: choice.result });
      setScreen("combat");
      return;
    }

    if (choice.effect === "eliteCombat") {
      setCombat({ name: "Drevalkh Elite", hp: 112, maxHp: 112, elite: true, boss: false, weakWindow: false, text: choice.result });
      setScreen("combat");
      return;
    }

    if (choice.effect === "bossCombat") {
      const reduction = bossAdvantage * 18;
      setCombat({ name: "Re Drevalkh", hp: clamp(190 - reduction, 100, 190), maxHp: 190, elite: true, boss: true, weakWindow: false, text: choice.result });
      setScreen("combat");
      return;
    }

    if (choice.effect === "lootAura") {
      setAura((old) => clamp(old + 20, 0, heroBase.maxAura));
      addLog("Forziere registrato: recupero Aura.");
    }

    if (choice.effect === "lootVigore") {
      setVigore((old) => clamp(old + 18, 0, heroBase.maxVigore));
      addLog("Forziere registrato: recupero Vigore.");
    }

    if (choice.effect === "lootFull") {
      setHp((old) => clamp(old + 15, 0, heroBase.maxHp));
      setAura((old) => clamp(old + 18, 0, heroBase.maxAura));
      setVigore((old) => clamp(old + 18, 0, heroBase.maxVigore));
      addLog("Forziere importante: parametri stabilizzati.");
    }

    if (choice.effect === "letter") {
      setClues((old) => old + 1);
      setScanCount((old) => old + 1);
      addLog("Documento aggiunto al Diario del Nexus.");
    }

    if (choice.effect === "clue") {
      setClues((old) => old + 1);
      addLog("Indizio ambientale registrato.");
    }

    if (choice.effect === "scanClue") {
      setClues((old) => old + 1);
      setScanCount((old) => old + 1);
      addLog("Scansione EI completata. Correlazione rituale rilevata.");
    }

    if (choice.effect === "buff") {
      setScanCount((old) => old + 1);
      setVigore((old) => clamp(old + 10, 0, heroBase.maxVigore));
      addLog("Vantaggio tattico ottenuto.");
    }

    if (choice.effect === "auraCostReward") {
      setAura((old) => clamp(old - 12, 0, heroBase.maxAura));
      setClues((old) => old + 1);
      addLog("Aura consumata. Reazione ambientale utile registrata.");
    }

    if (choice.effect === "vigoreCost") {
      setVigore((old) => clamp(old - 14, 0, heroBase.maxVigore));
      addLog("Percorso alternativo completato. Vigore consumato.");
      nextChapter();
    }

    if (choice.effect === "heal") {
      setHp((old) => clamp(old + 30, 0, heroBase.maxHp));
      setAura((old) => clamp(old + 10, 0, heroBase.maxAura));
      addLog("Aura stabilizzata. Parametri vitali in recupero.");
    }

    if (choice.effect === "bossAdvantage") {
      setBossAdvantage((old) => old + 1);
      addLog("Vantaggio contro il Re Drevalkh acquisito.");
    }
  };

  const calculateEnemyDamage = (enemy, heavy) => {
    const base = enemy.boss ? 23 : enemy.elite ? 15 : 10;
    const mitigation = Math.floor((finalStats.tenacia + finalStats.vigore) / 6);
    return clamp(base + (heavy ? 3 : 0) - mitigation, 3, 34);
  };

  const combatAction = (kind) => {
    if (!combat) return;

    let playerDamage = 0;
    let vigoreCost = 0;
    let auraCost = 0;
    let stunChance = 0;
    let message = "";

    if (kind === "light") {
      vigoreCost = 8;
      playerDamage = 16 + Math.floor(finalStats.sintonia / 2) + damageBonus;
      stunChance = 0.2 + finalStats.sintonia * 0.015 + scanCount * 0.025;
      message = "Colpisci rapido, cercando di aprire la carne senza esporti troppo.";
    }

    if (kind === "heavy") {
      vigoreCost = 18;
      playerDamage = 29 + Math.floor(finalStats.struttura / 2) + damageBonus;
      stunChance = 0.4 + finalStats.struttura * 0.018 + scanCount * 0.025;
      message = "Scarichi un colpo pesante. Le ossa del cadavere cedono con un rumore secco.";
    }

    if (kind === "spell") {
      auraCost = 14;
      playerDamage = 24 + Math.floor(finalStats.dominio / 2) + damageBonus;
      stunChance = 0.3 + finalStats.cognizione * 0.015 + scanCount * 0.025;
      message = `${prof.spell}: l'Archeum prende forma e lacera la maledizione verminacea.`;
    }

    if (kind === "dodge") {
      if (vigore < 10) {
        const damage = calculateEnemyDamage(combat, true);
        setHp((old) => clamp(old - damage, 0, heroBase.maxHp));
        setCombat({ ...combat, text: `Provi a schivare, ma il Vigore non basta. Subisci ${damage} danni.` });
        return;
      }
      setVigore((old) => clamp(old - 10, 0, heroBase.maxVigore));
      setAura((old) => clamp(old + 4, 0, heroBase.maxAura));
      setScanCount((old) => old + 1);
      setCombat({ ...combat, weakWindow: false, text: "Ti sposti di lato e osservi il pattern. L'EI aggiorna la scheda del nemico." });
      addLog("Pattern nemico aggiornato. Probabilità di esporre la protuberanza aumentata.");
      return;
    }

    if (vigore < vigoreCost || aura < auraCost) {
      const damage = calculateEnemyDamage(combat, true);
      setHp((old) => clamp(old - damage, 0, heroBase.maxHp));
      setCombat({ ...combat, text: `Risorse insufficienti. Esiti un istante e subisci ${damage} danni.` });
      return;
    }

    setVigore((old) => clamp(old - vigoreCost + 3, 0, heroBase.maxVigore));
    setAura((old) => clamp(old - auraCost, 0, heroBase.maxAura));

    const enemyHpAfter = clamp(combat.hp - playerDamage, 0, combat.maxHp);
    const stunned = enemyHpAfter > 0 && Math.random() < stunChance;

    if (enemyHpAfter <= 0) {
      setCombat({ ...combat, hp: 0, weakWindow: true, text: `${message} Il corpo crolla, ma il verme è ancora vivo. La protuberanza è esposta.` });
      setWeakTimer(10);
      addLog("Finestra vulnerabile aperta: dieci secondi per colpire la protuberanza.");
      return;
    }

    if (stunned) {
      setCombat({ ...combat, hp: enemyHpAfter, weakWindow: true, text: `${message} La creatura cade in ginocchio. Una protuberanza pulsa sotto la pelle.` });
      setWeakTimer(10);
      addLog("Stordimento riuscito. Protuberanza esposta per dieci secondi.");
      return;
    }

    const enemyDamage = calculateEnemyDamage(combat, kind === "heavy");
    setHp((old) => clamp(old - enemyDamage, 0, heroBase.maxHp));
    setCombat({ ...combat, hp: enemyHpAfter, weakWindow: false, text: `${message} Il nemico reagisce e ti infligge ${enemyDamage} danni.` });
  };

  const strikeWeakPoint = () => {
    if (!combat || !combat.weakWindow) return;

    const bonus = finalStats.sintonia + finalStats.cognizione + scanCount * 2 + (profession === "Ranger" ? 4 : 0);
    const threshold = combat.boss ? 18 : combat.elite ? 14 : 10;
    const success = Math.random() * 20 + bonus > threshold || combat.hp <= 0;

    if (success) {
      addLog(`Protuberanza recisa. ${combat.name} eliminato.`);
      setCombat(null);
      setWeakTimer(0);
      setHp((old) => clamp(old + 8, 0, heroBase.maxHp));
      setVigore((old) => clamp(old + 12, 0, heroBase.maxVigore));
      if (chapter >= CHAPTERS.length - 1) setScreen("ending");
      else {
        setChapter((old) => old + 1);
        setScreen("game");
      }
      return;
    }

    const damage = calculateEnemyDamage(combat, true);
    setHp((old) => clamp(old - damage, 0, heroBase.maxHp));
    setWeakTimer(0);
    setCombat({ ...combat, weakWindow: false, text: `Miri alla protuberanza, ma il corpo si contorce. Il verme sfugge al colpo. Subisci ${damage} danni.` });
    addLog("Colpo alla protuberanza fallito. Il parassita ha reagito.");
  };

  const pageStyle = {
    minHeight: "100vh",
    padding: 18,
    color: "#fff7df",
    fontFamily: "Georgia, 'Times New Roman', serif",
    background: "radial-gradient(circle at top, rgba(93,47,16,0.85), rgba(19,12,10,0.98) 42%, #020202 100%)",
  };

  const layoutStyle = {
    maxWidth: 1160,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 315px",
    gap: 16,
  };

  const titleStyle = { color: "#e8c878", margin: "0 0 6px", letterSpacing: 0.5 };
  const paragraphStyle = { color: "#e8dcc7", fontSize: 17, lineHeight: 1.75 };

  return (
    <div style={pageStyle}>
      <style>{`
        @media (max-width: 850px) {
          .ash-layout { grid-template-columns: 1fr !important; }
        }
        button:hover { filter: brightness(1.12); }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto 16px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ ...titleStyle, fontSize: 34 }}>Ashmoore: Le Rovine Perdute</h1>
          <div style={{ color: "#cbb995", fontSize: 14 }}>Prototipo RPG narrativo a scelte — The Lord of Nemetron</div>
        </div>
        <button onClick={resetAll} style={{ border: "1px solid #b77b32", background: "rgba(0,0,0,0.4)", color: "#ffe3a0", padding: "10px 14px", borderRadius: 12, cursor: "pointer" }}>Riavvia</button>
      </div>

      <div className="ash-layout" style={layoutStyle}>
        <main>
          <Panel style={{ marginBottom: 14, padding: 14, background: "rgba(8, 6, 5, 0.92)", position: "sticky", top: 8, zIndex: 5 }}>
            <div style={{ color: "#d8b45f", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Registro EI</div>
            <div style={{ color: "#ffe9ad", fontSize: 14, lineHeight: 1.45 }}>{log[0]}</div>
          </Panel>

          {screen === "create" && (
            <div>
              <Panel style={{ marginBottom: 16 }}>
                <h2 style={{ ...titleStyle, fontSize: 28 }}>Creazione del Viaggiatore</h2>
                <p style={paragraphStyle}>Prima di accettare la taglia, l'Arca Celeste richiede la sincronizzazione del Nexus. Scegli il profilo operativo con cui entrerai nelle rovine di Ashmoore.</p>
                <label style={{ display: "block", color: "#cbb995", marginBottom: 6 }}>Nome</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value || "Viaggiatore")}
                  style={{ width: "100%", boxSizing: "border-box", border: "1px solid #6b3f16", background: "#120b09", color: "#fff7df", padding: 12, borderRadius: 12, fontFamily: "Georgia, 'Times New Roman', serif" }}
                />
              </Panel>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                <Panel>
                  <h3 style={{ ...titleStyle, fontSize: 23 }}>Archetipo</h3>
                  {Object.values(ARCHETYPES).map((item) => (
                    <GameButton key={item.label} onClick={() => setArchetype(item.label)} selected={archetype === item.label}>
                      <strong>{item.label}</strong><br />
                      <span style={{ color: "#e8c878", fontSize: 13 }}>{item.role}</span><br />
                      <span style={{ color: "#cfc2aa" }}>{item.desc}</span>
                    </GameButton>
                  ))}
                </Panel>

                <Panel>
                  <h3 style={{ ...titleStyle, fontSize: 23 }}>Professione</h3>
                  {Object.entries(PROFESSIONS).filter(([, item]) => item.archetype === archetype).map(([key, item]) => (
                    <GameButton key={key} onClick={() => setProfession(key)} selected={profession === key}>
                      <strong>{item.label}</strong><br />
                      <span style={{ color: "#e8c878", fontSize: 13 }}>Tecnica: {item.spell}</span><br />
                      <span style={{ color: "#cfc2aa" }}>{item.desc}</span>
                    </GameButton>
                  ))}
                  <GameButton onClick={confirmCharacter} selected>Conferma profilo</GameButton>
                </Panel>
              </div>
            </div>
          )}

          {screen === "intro" && (
            <Panel>
              <div style={{ color: "#d8b45f", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 18 }}>Taglia dell'Arca Celeste</div>
              <h2 style={{ ...titleStyle, fontSize: 30 }}>Ashmoore è svanita senza combattere.</h2>
              <p style={paragraphStyle}>Il villaggio di Ashmoore non è stato conquistato. Non è stato incendiato. Non è stato evacuato. Ha semplicemente smesso di rispondere. Le mappe del Nexus mostrano ancora le sue strade, ma nessun segnale civile attraversa più la nebbia di Ravenhold.</p>
              <p style={paragraphStyle}>L'Arca Celeste ha emesso una taglia di indagine e contenimento. Recuperare prove, identificare la causa della sparizione, neutralizzare eventuali presenze ostili. Le ultime annotazioni parlano di cadaveri in movimento, di un pozzo sigillato e di una cappella che continuava a ricevere fedeli anche dopo la morte del villaggio.</p>
              <p style={paragraphStyle}>Tu sei {name || "il Viaggiatore"}, {prof.label}. Il Nexus è attivo. L'EI osserva. Ashmoore attende.</p>
              <GameButton onClick={startMission} selected>Entrare nelle rovine</GameButton>
            </Panel>
          )}

          {screen === "game" && currentChapter && (
            <Panel>
              <div style={{ color: "#d8b45f", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>{currentChapter.location}</div>
              <h2 style={{ ...titleStyle, fontSize: 30 }}>{currentChapter.title}</h2>
              <p style={paragraphStyle}>{currentChapter.text}</p>
              <div style={{ border: "1px solid rgba(216,180,95,0.35)", background: "rgba(0,0,0,0.22)", borderRadius: 12, padding: 12, color: "#ffe9ad", marginBottom: 16 }}>
                {currentChapter.ei}
              </div>
              {currentChapter.choices.map((choice, index) => (
                <GameButton key={`${chapter}-${index}`} onClick={() => applyChoice(choice)}>
                  <strong>{index + 1}.</strong> {choice.label}
                </GameButton>
              ))}
              {chapter < CHAPTERS.length - 1 && (
                <button onClick={nextChapter} style={{ border: "none", background: "transparent", color: "#e8c878", cursor: "pointer", marginTop: 10, fontFamily: "Georgia, 'Times New Roman', serif" }}>Prosegui senza altre azioni</button>
              )}
            </Panel>
          )}

          {screen === "combat" && combat && (
            <Panel style={{ borderColor: "rgba(160, 40, 40, 0.7)" }}>
              <div style={{ color: "#ffb4a9", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>Combattimento</div>
              <h2 style={{ color: "#ffe1d8", fontSize: 30, marginTop: 0 }}>{combat.name}</h2>
              <p style={paragraphStyle}>{combat.text}</p>

              <div style={{ margin: "16px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#ffd3c7", fontSize: 14 }}>
                  <span>Integrità Cadavere</span>
                  <span>{combat.hp}/{combat.maxHp}</span>
                </div>
                <div style={{ height: 12, background: "#140504", border: "1px solid #7d1f1f", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${clamp((combat.hp / combat.maxHp) * 100, 0, 100)}%`, height: "100%", background: "#d9634f" }} />
                </div>
              </div>

              {combat.weakWindow && (
                <div style={{ border: "1px solid #e8c878", background: "rgba(90, 55, 12, 0.62)", padding: 14, borderRadius: 14, marginBottom: 14 }}>
                  <strong>Finestra vulnerabile: {weakTimer}s</strong>
                  <p style={{ color: "#f0e4ce", marginTop: 6 }}>Colpisci la protuberanza prima che il verme rientri nel corpo.</p>
                  <GameButton onClick={strikeWeakPoint} selected>Colpisci protuberanza</GameButton>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
                <GameButton onClick={() => combatAction("light")}>Attacco leggero</GameButton>
                <GameButton onClick={() => combatAction("heavy")}>Attacco pesante</GameButton>
                <GameButton onClick={() => combatAction("spell")}>{prof.spell}</GameButton>
                <GameButton onClick={() => combatAction("dodge")}>Schiva e osserva</GameButton>
              </div>
            </Panel>
          )}

          {screen === "ending" && (
            <Panel>
              <h2 style={{ ...titleStyle, fontSize: 31 }}>Taglia completata</h2>
              <p style={paragraphStyle}>Il Re Drevalkh cade ai piedi del trono. La corona si spezza. Dal cranio emerge un verme pallido, antico, più grande degli altri. L'EI registra il dato finale: Ashmoore non è svanita. È stata offerta a qualcosa che dormiva sotto la cappella.</p>
              <p style={{ color: "#cbb995" }}>Indizi raccolti: {clues}. Scansioni EI: {scanCount}. Vantaggi boss: {bossAdvantage}.</p>
              <GameButton onClick={resetAll} selected>Rigioca</GameButton>
            </Panel>
          )}

          {screen === "death" && (
            <Panel style={{ borderColor: "rgba(160, 40, 40, 0.7)" }}>
              <h2 style={{ color: "#ffb4a9", fontSize: 31, marginTop: 0 }}>Sei caduto nelle rovine</h2>
              <p style={paragraphStyle}>Il Nexus perde segnale. Nel buio, qualcosa gratta dall'interno delle pietre. Ashmoore conserva anche te.</p>
              <GameButton onClick={confirmCharacter} danger>Riprova dalla taglia</GameButton>
            </Panel>
          )}
        </main>

        <aside>
          <Panel style={{ position: "sticky", top: 16 }}>
            <div style={{ color: "#d8b45f", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>Nexus del Viaggiatore</div>
            <h3 style={{ margin: "6px 0", fontSize: 23 }}>{name}</h3>
            <div style={{ color: "#cbb995", marginBottom: 14 }}>{heroBase.label} — {prof.label}</div>

            <Bar label="Vita" value={hp} max={heroBase.maxHp} />
            <Bar label="Aura" value={aura} max={heroBase.maxAura} />
            <Bar label="Vigore" value={vigore} max={heroBase.maxVigore} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
              {Object.entries(finalStats).map(([key, value]) => (
                <div key={key} style={{ border: "1px solid rgba(190, 130, 50, 0.35)", background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 8, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ textTransform: "capitalize", color: "#cbb995" }}>{key}</span>
                  <strong style={{ color: "#e8c878" }}>{value}</strong>
                </div>
              ))}
            </div>

            <div style={{ border: "1px solid rgba(190, 130, 50, 0.35)", background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: 10, marginTop: 14, color: "#d8c8a8" }}>
              <strong style={{ color: "#e8c878" }}>Equip iniziale</strong><br />
              {prof.weapon}
            </div>

            <div style={{ border: "1px solid rgba(190, 130, 50, 0.35)", background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: 10, marginTop: 14, color: "#d8c8a8", maxHeight: 230, overflow: "auto" }}>
              <strong style={{ color: "#e8c878" }}>Archivio EI</strong>
              {log.map((entry, index) => <p key={index} style={{ borderBottom: "1px solid rgba(190,130,50,0.2)", paddingBottom: 8 }}>{entry}</p>)}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
