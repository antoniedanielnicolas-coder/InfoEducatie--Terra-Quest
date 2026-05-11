export const gradesData = [
    { id: 9, title: { ro: "Insula Clasa 9", en: "Grade 9 Island" }, theme: "tropical", color: "#00e676", icon: "🌴", desc: { ro: "Geografie Fizică și Fundamente", en: "Physical Geography & Basics" } },
    { id: 10, title: { ro: "Insula Clasa 10", en: "Grade 10 Island" }, theme: "desert", color: "#d4a843", icon: "🏜️", desc: { ro: "Geografie Umană și Economică", en: "Human & Economic Geo" } },
    { id: 11, title: { ro: "Insula Clasa 11", en: "Grade 11 Island" }, theme: "arctic", color: "#00d4ff", icon: "❄️", desc: { ro: "Geografia Mediului", en: "Environmental Geo" } },
    { id: 12, title: { ro: "Insula Clasa 12", en: "Grade 12 Island" }, theme: "volcanic", color: "#ff4466", icon: "🌋", desc: { ro: "Geografie Politică și Globalizare", en: "Political Geo & Globalization" } }
];

const grade9Questions = [
    { question: { ro: "Care este cel mai înalt vârf muntos din lume?", en: "Which is the highest mountain peak in the world?" }, options: { ro: ["K2", "Everest", "Kilimanjaro", "Mont Blanc"], en: ["K2", "Everest", "Kilimanjaro", "Mont Blanc"] }, correctIndex: 1, explanation: { ro: "Everest (8.848m) este cel mai înalt vârf.", en: "Everest (8,848m) is the highest peak." } },
    { question: { ro: "Care este cel mai mare ocean al Terrei?", en: "Which is the Earth's largest ocean?" }, options: { ro: ["Oceanul Atlantic", "Oceanul Indian", "Oceanul Pacific", "Oceanul Arctic"], en: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"] }, correctIndex: 2, explanation: { ro: "Oceanul Pacific acoperă aprox. 30% din suprafața Pământului.", en: "The Pacific Ocean covers approx. 30% of the Earth." } },
    { question: { ro: "Ce instrument măsoară intensitatea cutremurelor?", en: "What instrument measures earthquake intensity?" }, options: { ro: ["Barometrul", "Seismograful", "Termometrul", "Higrometrul"], en: ["Barometer", "Seismograph", "Thermometer", "Hygrometer"] }, correctIndex: 1, explanation: { ro: "Seismograful înregistrează undele seismice.", en: "A seismograph records seismic waves." } },
    { question: { ro: "Cum se numește stratul exterior solid al Pământului?", en: "What is the Earth's solid outer layer called?" }, options: { ro: ["Manta", "Nucleu", "Litosferă", "Astenosferă"], en: ["Mantle", "Core", "Lithosphere", "Asthenosphere"] }, correctIndex: 2, explanation: { ro: "Litosfera este crusta stâncoasă a Pământului.", en: "The lithosphere is the rocky crust of the Earth." } },
    { question: { ro: "Care planetă este cea mai apropiată de Soare?", en: "Which planet is closest to the Sun?" }, options: { ro: ["Venus", "Mercur", "Marte", "Pământ"], en: ["Venus", "Mercury", "Mars", "Earth"] }, correctIndex: 1, explanation: { ro: "Mercur este prima planetă de la Soare.", en: "Mercury is the first planet from the Sun." } },
    { question: { ro: "Cea mai mare pădure tropicală se află în bazinul fluviului:", en: "The largest tropical rainforest is in the basin of which river?" }, options: { ro: ["Nil", "Congo", "Amazon", "Mekong"], en: ["Nile", "Congo", "Amazon", "Mekong"] }, correctIndex: 2, explanation: { ro: "Pădurea Amazoniană este cea mai extinsă.", en: "The Amazon Rainforest is the largest." } },
    { question: { ro: "Procesul de transformare a apei din gaz în lichid se numește:", en: "The process of water turning from gas to liquid is called:" }, options: { ro: ["Evaporare", "Condensare", "Precipitație", "Infiltrație"], en: ["Evaporation", "Condensation", "Precipitation", "Infiltration"] }, correctIndex: 1, explanation: { ro: "Condensarea formează norii.", en: "Condensation forms clouds." } },
    { question: { ro: "Care este cel mai lung fluviu din lume?", en: "What is the longest river in the world?" }, options: { ro: ["Amazon", "Nil", "Yangtze", "Mississippi"], en: ["Amazon", "Nile", "Yangtze", "Mississippi"] }, correctIndex: 1, explanation: { ro: "Nilul este general considerat cel mai lung fluviu.", en: "The Nile is generally considered the longest river." } },
    { question: { ro: "Care deșert este cel mai mare deșert cald de pe glob?", en: "Which is the largest hot desert in the world?" }, options: { ro: ["Kalahari", "Gobi", "Atacama", "Sahara"], en: ["Kalahari", "Gobi", "Atacama", "Sahara"] }, correctIndex: 3, explanation: { ro: "Sahara acoperă o mare parte a nordului Africii.", en: "Sahara covers a large part of North Africa." } },
    { question: { ro: "Care este gazul cel mai abundent din atmosfera Terrei?", en: "Which is the most abundant gas in Earth's atmosphere?" }, options: { ro: ["Oxigen", "Dioxid de carbon", "Azot", "Hidrogen"], en: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"] }, correctIndex: 2, explanation: { ro: "Azotul (Nitrogenul) reprezintă ~78% din atmosferă.", en: "Nitrogen makes up ~78% of the atmosphere." } },
    { question: { ro: "În ce strat atmosferic se află stratul de ozon?", en: "In which atmospheric layer is the ozone layer located?" }, options: { ro: ["Troposferă", "Stratosferă", "Mezosferă", "Termosferă"], en: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"] }, correctIndex: 1, explanation: { ro: "Stratosfera conține stratul de ozon care ne protejează de UV.", en: "The stratosphere contains the ozone layer." } },
    { question: { ro: "Care tip de rocă se formează din magma răcită?", en: "What type of rock is formed from cooled magma?" }, options: { ro: ["Sedimentară", "Metamorfică", "Magmatică", "Fosilică"], en: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"] }, correctIndex: 2, explanation: { ro: "Rocile magmatice provin din răcirea magmei/lavei.", en: "Igneous rocks come from cooling magma/lava." } }
];

const grade10Questions = [
    { question: { ro: "Care este cea mai populată țară din lume (2023)?", en: "What is the most populous country in the world (2023)?" }, options: { ro: ["China", "India", "SUA", "Indonezia"], en: ["China", "India", "USA", "Indonesia"] }, correctIndex: 1, explanation: { ro: "India a depășit recent China ca populație.", en: "India recently surpassed China in population." } },
    { question: { ro: "Termenul 'Megalopolis' se referă la:", en: "The term 'Megalopolis' refers to:" }, options: { ro: ["O zonă rurală izolată", "Un lanț continuu de orașe și suburbii", "O capitală istorică", "Un oraș-stat"], en: ["An isolated rural area", "A continuous chain of cities and suburbs", "A historical capital", "A city-state"] }, correctIndex: 1, explanation: { ro: "Exemplu: BosWash în SUA.", en: "Example: BosWash in the USA." } },
    { question: { ro: "Sectorul terțiar al economiei reprezintă:", en: "The tertiary sector of the economy represents:" }, options: { ro: ["Agricultura", "Industria", "Serviciile", "Extracția resurselor"], en: ["Agriculture", "Industry", "Services", "Resource extraction"] }, correctIndex: 2, explanation: { ro: "Serviciile formează sectorul terțiar.", en: "Services make up the tertiary sector." } },
    { question: { ro: "Ce măsură indică valoarea totală a bunurilor produse într-o țară într-un an?", en: "What measure indicates the total value of goods produced in a country in a year?" }, options: { ro: ["IDU", "PIB (GDP)", "Inflația", "Sporul natural"], en: ["HDI", "GDP", "Inflation", "Natural increase"] }, correctIndex: 1, explanation: { ro: "PIB = Produsul Intern Brut.", en: "GDP = Gross Domestic Product." } },
    { question: { ro: "Fenomenul de mutare a populației de la sate la orașe se numește:", en: "The phenomenon of population moving from rural to urban areas is called:" }, options: { ro: ["Mortalitate", "Emigrare", "Urbanizare", "Segregare"], en: ["Mortality", "Emigration", "Urbanization", "Segregation"] }, correctIndex: 2, explanation: { ro: "Urbanizarea este creșterea ponderii populației urbane.", en: "Urbanization is the increase in urban population proportion." } },
    { question: { ro: "Ce religie are cel mai mare număr de adepți la nivel global?", en: "Which religion has the largest number of followers globally?" }, options: { ro: ["Islam", "Hinduism", "Budism", "Creștinism"], en: ["Islam", "Hinduism", "Buddhism", "Christianity"] }, correctIndex: 3, explanation: { ro: "Creștinismul este cea mai mare religie (peste 2.4 miliarde).", en: "Christianity is the largest religion (>2.4 billion)." } },
    { question: { ro: "OPEC este o organizație care reglementează exportul de:", en: "OPEC is an organization that regulates the export of:" }, options: { ro: ["Aur", "Cărbune", "Petrol", "Gaze naturale"], en: ["Gold", "Coal", "Oil", "Natural gas"] }, correctIndex: 2, explanation: { ro: "OPEC = Organizația Țărilor Exportatoare de Petrol.", en: "OPEC = Organization of the Petroleum Exporting Countries." } },
    { question: { ro: "Exodul de creiere (Brain Drain) înseamnă:", en: "Brain Drain means:" }, options: { ro: ["Creșterea ratei de școlarizare", "Emigrarea forței de muncă înalt calificate", "Îmbătrânirea populației", "Scăderea natalității"], en: ["Increase in schooling rate", "Emigration of highly skilled workforce", "Aging of population", "Decrease in birth rate"] }, correctIndex: 1, explanation: { ro: "Multe state în curs de dezvoltare se confruntă cu exodul de creiere.", en: "Many developing states face a brain drain." } },
    { question: { ro: "În ce continent se înregistrează cea mai mare creștere demografică?", en: "Which continent records the highest demographic growth?" }, options: { ro: ["Europa", "Asia", "Africa", "America de Sud"], en: ["Europe", "Asia", "Africa", "South America"] }, correctIndex: 2, explanation: { ro: "Africa are cel mai ridicat spor natural.", en: "Africa has the highest natural increase rate." } },
    { question: { ro: "Care din următoarele este o sursă de energie regenerabilă?", en: "Which of the following is a renewable energy source?" }, options: { ro: ["Uraniu", "Gaz natural", "Cărbune", "Energie eoliană"], en: ["Uranium", "Natural gas", "Coal", "Wind energy"] }, correctIndex: 3, explanation: { ro: "Energia vântului (eoliană) este inepuizabilă.", en: "Wind energy is inexhaustible." } },
    { question: { ro: "Limba mandarina este cea mai vorbită limbă din lume ca limbă maternă. În ce țară?", en: "Mandarin is the most spoken native language. In which country?" }, options: { ro: ["Japonia", "China", "Coreea de Sud", "Thailanda"], en: ["Japan", "China", "South Korea", "Thailand"] }, correctIndex: 1, explanation: { ro: "Mandarina este limba oficială a Chinei.", en: "Mandarin is the official language of China." } },
    { question: { ro: "Ce canal artificial scurtează ruta maritimă dintre Atlantic și Pacific?", en: "Which artificial canal shortens the maritime route between the Atlantic and Pacific?" }, options: { ro: ["Canalul Suez", "Canalul Panama", "Canalul Kiel", "Canalul Corint"], en: ["Suez Canal", "Panama Canal", "Kiel Canal", "Corinth Canal"] }, correctIndex: 1, explanation: { ro: "Canalul Panama taie istmul Americii Centrale.", en: "The Panama Canal cuts through the Central American isthmus." } }
];

const grade11Questions = [
    { question: { ro: "Efectul de seră contribuie în principal la:", en: "The greenhouse effect mainly contributes to:" }, options: { ro: ["Poluarea fonică", "Încălzirea globală", "Subțierea stratului de ozon", "Eutrofizarea apelor"], en: ["Noise pollution", "Global warming", "Ozone depletion", "Water eutrophication"] }, correctIndex: 1, explanation: { ro: "Gazele de seră captează căldura, ducând la încălzire globală.", en: "Greenhouse gases trap heat, leading to global warming." } },
    { question: { ro: "Acordul de la Paris (2015) are ca obiectiv:", en: "The Paris Agreement (2015) aims to:" }, options: { ro: ["Limitarea armelor nucleare", "Combaterea schimbărilor climatice", "Protecția balenelor", "Comerțul liber"], en: ["Limit nuclear weapons", "Combat climate change", "Protect whales", "Free trade"] }, correctIndex: 1, explanation: { ro: "Acordul vizează limitarea creșterii temperaturii globale.", en: "The agreement aims to limit global temperature rise." } },
    { question: { ro: "Care este principala cauză a subțierii stratului de ozon?", en: "What is the main cause of ozone layer depletion?" }, options: { ro: ["Dioxidul de carbon (CO2)", "Clorofluorocarburile (CFC)", "Metanul", "Oxigenul"], en: ["Carbon dioxide (CO2)", "Chlorofluorocarbons (CFCs)", "Methane", "Oxygen"] }, correctIndex: 1, explanation: { ro: "CFC-urile descompun moleculele de ozon în stratosferă.", en: "CFCs break down ozone molecules in the stratosphere." } },
    { question: { ro: "Ce fenomen natural este o cauză majoră a defrișărilor din Indonezia?", en: "What is a major cause of deforestation in Indonesia?" }, options: { ro: ["Plantațiile de ulei de palmier", "Mineritul de cărbune", "Extinderea orașelor", "Tornadele"], en: ["Palm oil plantations", "Coal mining", "Urban expansion", "Tornadoes"] }, correctIndex: 0, explanation: { ro: "Pădurile sunt tăiate pentru agricultura de palmieri.", en: "Forests are cleared for palm agriculture." } },
    { question: { ro: "Smogul fotochimic este o problemă gravă de poluare specifică:", en: "Photochemical smog is a severe pollution problem typical in:" }, options: { ro: ["Zonelor rurale", "Orașelor mari cu trafic auto intens", "Deșerturilor", "Regiunilor polare"], en: ["Rural areas", "Large cities with heavy traffic", "Deserts", "Polar regions"] }, correctIndex: 1, explanation: { ro: "Gazele de eșapament reacționează sub acțiunea soarelui.", en: "Exhaust gases react under sunlight." } },
    { question: { ro: "Marea Aral a secat aproape complet din cauza:", en: "The Aral Sea has almost completely dried up due to:" }, options: { ro: ["Încălzirii globale", "Deturnării râurilor pentru irigații", "Cutremurelor", "Poluării cu petrol"], en: ["Global warming", "River diversion for irrigation", "Earthquakes", "Oil pollution"] }, correctIndex: 1, explanation: { ro: "Sovieticii au deturnat râurile Amu Daria și Sîr Daria.", en: "The Soviets diverted the Amu Darya and Syr Darya rivers." } },
    { question: { ro: "Ploile acide sunt cauzate în principal de emisiile de:", en: "Acid rains are mainly caused by emissions of:" }, options: { ro: ["Dioxid de sulf și oxizi de azot", "Clor", "Ozon", "Vapori de apă"], en: ["Sulfur dioxide and nitrogen oxides", "Chlorine", "Ozone", "Water vapor"] }, correctIndex: 0, explanation: { ro: "Acești compuși reacționează cu apa formând acizi.", en: "These compounds react with water to form acids." } },
    { question: { ro: "Ce înseamnă conceptul de 'Dezvoltare Durabilă'?", en: "What does 'Sustainable Development' mean?" }, options: { ro: ["Creștere economică rapidă fără limite", "Satisfacerea nevoilor prezente fără a compromite viitorul", "Interzicerea completă a industriei", "Exploatarea maximă a resurselor"], en: ["Rapid limitless economic growth", "Meeting present needs without compromising the future", "Complete ban on industry", "Maximum resource exploitation"] }, correctIndex: 1, explanation: { ro: "Dezvoltarea durabilă echilibrează ecologia cu economia.", en: "Sustainable development balances ecology with economy." } },
    { question: { ro: "Deșertificarea afectează cel mai grav:", en: "Desertification most severely affects:" }, options: { ro: ["Regiunea Sahel din Africa", "Nordul Europei", "Estul SUA", "Japonia"], en: ["The Sahel region in Africa", "Northern Europe", "Eastern USA", "Japan"] }, correctIndex: 0, explanation: { ro: "Sahelul, la sud de Sahara, suferă o deșertificare accelerată.", en: "The Sahel, south of the Sahara, faces rapid desertification." } },
    { question: { ro: "Cea mai mare catastrofă nucleară din istorie a avut loc la:", en: "The largest nuclear catastrophe in history occurred at:" }, options: { ro: ["Fukushima", "Three Mile Island", "Cernobîl", "Hiroshima"], en: ["Fukushima", "Three Mile Island", "Chernobyl", "Hiroshima"] }, correctIndex: 2, explanation: { ro: "Accidentul de la Cernobîl din 1986 a poluat radioactiv o mare parte a Europei.", en: "The 1986 Chernobyl accident polluted much of Europe." } },
    { question: { ro: "Microplasticele reprezintă un pericol major pentru:", en: "Microplastics are a major hazard for:" }, options: { ro: ["Atmosferă", "Ecosistemele marine", "Stratul de ozon", "Plăcile tectonice"], en: ["Atmosphere", "Marine ecosystems", "Ozone layer", "Tectonic plates"] }, correctIndex: 1, explanation: { ro: "Pestii si organismele marine ingerează microplastice.", en: "Fish and marine organisms ingest microplastics." } },
    { question: { ro: "Care țară este recunoscută pentru utilizarea intensivă a energiei geotermale?", en: "Which country is renowned for its intensive use of geothermal energy?" }, options: { ro: ["Arabia Saudită", "Islanda", "Australia", "Brazilia"], en: ["Saudi Arabia", "Iceland", "Australia", "Brazil"] }, correctIndex: 1, explanation: { ro: "Islanda își asigură mare parte din energie din surse geotermale (vulcani).", en: "Iceland gets much energy from geothermal sources." } }
];

const g12RealLong = [
    {
        id: "g12_real_1", type: "multiple_choice", difficulty: "hard",
        question: { ro: "Care stat nu este membru permanent al Consiliului de Securitate ONU?", en: "Which state is not a permanent member of the UN Security Council?" },
        options: { ro: ["Rusia", "Germania", "Franța", "China"], en: ["Russia", "Germany", "France", "China"] },
        correctIndex: 1, explanation: { ro: "Germania nu este membru permanent (P5).", en: "Germany is not a permanent member (P5)." }
    },
    {
        id: "g12_real_2", type: "multiple_choice", difficulty: "medium",
        question: { ro: "Ce tratează Acordul Schengen?", en: "What does the Schengen Agreement deal with?" },
        options: { ro: ["Moneda unică", "Abolirea controalelor la frontiere", "Apărarea comună", "Drepturile omului"], en: ["Single currency", "Abolition of border controls", "Common defense", "Human rights"] },
        correctIndex: 1, explanation: { ro: "Spațiul Schengen elimină controalele la granițele interne.", en: "The Schengen area abolishes internal border controls." }
    },
    {
        id: "g12_real_3", type: "multiple_choice", difficulty: "medium",
        question: { ro: "Capitala Uniunii Europene (de facto) este considerată a fi:", en: "The de facto capital of the European Union is considered to be:" },
        options: { ro: ["Strasbourg", "Paris", "Bruxelles", "Berlin"], en: ["Strasbourg", "Paris", "Brussels", "Berlin"] },
        correctIndex: 2, explanation: { ro: "Bruxelles găzduiește principalele instituții UE.", en: "Brussels hosts the main EU institutions." }
    },
    {
        id: "g12_real_4", type: "multiple_choice", difficulty: "easy",
        question: { ro: "Care este cel mai mare stat din lume ca suprafață?", en: "Which is the largest country in the world by area?" },
        options: { ro: ["SUA", "China", "Canada", "Rusia"], en: ["USA", "China", "Canada", "Russia"] },
        correctIndex: 3, explanation: { ro: "Rusia are cea mai mare suprafață.", en: "Russia has the largest area." }
    },
    {
        id: "g12_real_5", type: "multiple_choice", difficulty: "hard",
        question: { ro: "Ce organizație a fost înlocuită de Organizația Națiunilor Unite (ONU)?", en: "Which organization was replaced by the United Nations (UN)?" },
        options: { ro: ["Liga Națiunilor", "Pactul de la Varșovia", "Comunitatea Europeană", "Consiliul Europei"], en: ["League of Nations", "Warsaw Pact", "European Community", "Council of Europe"] },
        correctIndex: 0, explanation: { ro: "Liga Națiunilor a eșuat după WW1 și a fost înlocuită de ONU.", en: "League of Nations failed after WW1 and was replaced by the UN." }
    },
    {
        id: "g12_real_6", type: "multiple_choice", difficulty: "medium",
        question: { ro: "Care este moneda oficială a Japoniei?", en: "What is the official currency of Japan?" },
        options: { ro: ["Yuan", "Won", "Yen", "Ringgit"], en: ["Yuan", "Won", "Yen", "Ringgit"] },
        correctIndex: 2, explanation: { ro: "Yenul japonez este moneda oficială.", en: "The Japanese Yen is the official currency." }
    },
    {
        id: "g12_real_7", type: "multiple_choice", difficulty: "hard",
        question: { ro: "Cine a formulat teoria 'Heartland' (Inima Lumii)?", en: "Who formulated the 'Heartland' theory?" },
        options: { ro: ["Nicholas Spykman", "Halford Mackinder", "Friedrich Ratzel", "Karl Haushofer"], en: ["Nicholas Spykman", "Halford Mackinder", "Friedrich Ratzel", "Karl Haushofer"] },
        correctIndex: 1, explanation: { ro: "Halford Mackinder a formulat teoria Heartland în 1904.", en: "Halford Mackinder formulated the Heartland theory in 1904." }
    },
    {
        id: "g12_real_8", type: "multiple_choice", difficulty: "medium",
        question: { ro: "Câte state sunt membre NATO în prezent (2024)?", en: "How many states are currently NATO members (2024)?" },
        options: { ro: ["28", "30", "32", "34"], en: ["28", "30", "32", "34"] },
        correctIndex: 2, explanation: { ro: "După aderarea Suediei, NATO are 32 de membri.", en: "After Sweden joined, NATO has 32 members." }
    },
    {
        id: "g12_real_9", type: "multiple_choice", difficulty: "hard",
        question: { ro: "Care dintre următoarele strâmtori este esențială pentru tranzitul petrolului din Golful Persic?", en: "Which of the following straits is essential for oil transit from the Persian Gulf?" },
        options: { ro: ["Strâmtoarea Malacca", "Strâmtoarea Ormuz", "Strâmtoarea Bosfor", "Strâmtoarea Gibraltar"], en: ["Strait of Malacca", "Strait of Hormuz", "Bosphorus Strait", "Strait of Gibraltar"] },
        correctIndex: 1, explanation: { ro: "Strâmtoarea Ormuz este un punct de blocaj critic pentru petrol.", en: "The Strait of Hormuz is a critical chokepoint for oil." }
    },
    {
        id: "g12_real_10", type: "multiple_choice", difficulty: "medium",
        question: { ro: "Ce înseamnă acronimul BRICS?", en: "What does the acronym BRICS stand for?" },
        options: { ro: ["Brazilia, Rusia, India, China, Africa de Sud", "Belgia, România, Italia, Croația, Spania", "Bolivia, Rwanda, Iran, Cuba, Siria", "Niciuna"], en: ["Brazil, Russia, India, China, South Africa", "Belgium, Romania, Italy, Croatia, Spain", "Bolivia, Rwanda, Iran, Cuba, Syria", "None"] },
        correctIndex: 0, explanation: { ro: "BRICS reprezintă principalele economii emergente.", en: "BRICS represents the main emerging economies." }
    },
    {
        id: "g12_real_11", type: "multiple_choice", difficulty: "easy",
        question: { ro: "Unde este sediul central al Băncii Mondiale?", en: "Where is the headquarters of the World Bank?" },
        options: { ro: ["New York", "Washington D.C.", "Geneva", "Londra"], en: ["New York", "Washington D.C.", "Geneva", "London"] },
        correctIndex: 1, explanation: { ro: "Banca Mondială are sediul la Washington D.C.", en: "The World Bank is headquartered in Washington D.C." }
    },
    {
        id: "g12_real_12", type: "multiple_choice", difficulty: "hard",
        question: { ro: "Ce este Zona Economică Exclusivă (ZEE) conform UNCLOS?", en: "What is the Exclusive Economic Zone (EEZ) according to UNCLOS?" },
        options: { ro: ["Până la 12 mile marine", "Până la 24 mile marine", "Până la 200 mile marine", "Până la 350 mile marine"], en: ["Up to 12 nautical miles", "Up to 24 nautical miles", "Up to 200 nautical miles", "Up to 350 nautical miles"] },
        correctIndex: 2, explanation: { ro: "ZEE se extinde până la 200 mile marine de la țărm.", en: "EEZ extends up to 200 nautical miles from shore." }
    }
];

// Populate tests
export const testSets = [];

function getQuestionsByGrade(grade, count) {
    let pool = [];
    if (grade === 9) pool = grade9Questions;
    else if (grade === 10) pool = grade10Questions;
    else if (grade === 11) pool = grade11Questions;
    else if (grade === 12) pool = g12RealLong;

    // Return a random selection of 'count' questions from the pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((q, i) => ({ ...q, id: `g${grade}_q_${i}_${Math.random()}` }));
}

[9, 10, 11, 12].forEach(grade => {
    // Generate 10 Levels for each Island
    for (let i = 1; i <= 10; i++) {
        // As levels go up, they get slightly harder/longer
        let numQs = i <= 3 ? 3 : (i <= 7 ? 4 : 5);
        let timeSecs = numQs * 20; // 20 seconds per question

        testSets.push({
            id: `g${grade}_level_${i}`, grade: grade, type: "level", levelNum: i,
            name: { ro: `Nivelul ${i}`, en: `Level ${i}` }, time: timeSecs,
            questions: getQuestionsByGrade(grade, numQs)
        });
    }
});

export const quizCategories = gradesData;
export const quizzesData = [];
