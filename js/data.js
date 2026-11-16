/* AccessCheck KZ: all content data in one place.
   Every number carries the reference id it came from (see REFS). */
window.ACK = (function () {

  var REFS = [
    { id: 1, text: 'Government of the Republic of Kazakhstan, Office of the Prime Minister. "Network of Rehabilitation Centers and Accessibility Being Expanded in Kazakhstan." 21 April 2026.', url: 'https://primeminister.kz/en/news/set-reabilitacionnyx-centrov-i-dostupnost-sredy-rassiriaiut-v-kazaxstane-31293' },
    { id: 2, text: 'Ranking.kz. "The \'Barrier-Free\' Environment in Kazakhstan Remains Full of Significant Barriers for People with Special Needs." 8 May 2025. Cites the Ministry of Labour and Social Protection portal, data as of 14 February 2025.', url: 'https://ranking.kz/en/reviews-en/industries-en/the-barrier-free-environment-in-kazakhstan-remains-full-of-significant-barriers-for-people-with-special-needs.html' },
    { id: 3, text: 'CABAR.asia (Central Asian Bureau for Analytical Reporting). "How Accessible is Kazakhstan for People with Disabilities?" 2021.', url: 'https://cabar.asia/en/how-accessible-is-kazakhstan-for-people-with-disabilities' },
    { id: 4, text: 'United Nations Committee on the Rights of Persons with Disabilities. "Concluding observations on the initial report of Kazakhstan." CRPD/C/KAZ/CO/1, 19 April 2024. Paragraphs 7, 19, 20, 65.', url: 'https://digitallibrary.un.org/record/4044522' },
    { id: 5, text: 'Orda.kz. "Kazakhstan Plans to Employ 17,000 People With Disabilities in 2026." 21 April 2026. Reports figures given by the Minister of Labour and Social Protection.', url: 'https://en.orda.kz/kazakhstan-plans-to-employ-17000-people-with-disabilities-in-2026-10175/' },
    { id: 6, text: 'QazMonitor. "Kazakhstan Enhances Job Opportunities for People with Disabilities." 10 November 2025. Data as of 1 November 2025.', url: 'https://en.qazmonitor.com/news/3132/kazakhstan-enhances-job-opportunities-for-people-with-disabilities' },
    { id: 7, text: 'UNFPA Kazakhstan. "Outcomes of assessment of social and gender-specific needs of persons with disabilities in Turkestan oblast and Shymkent city." Reports 674,200 persons (2017).', url: 'https://kazakhstan.unfpa.org/sites/default/files/pub-pdf/itogi_ocenki-eng.pdf' },
    { id: 8, text: 'European Training Foundation. "Labour market (re)integration and skills development for persons with disabilities: Kazakhstan. Country note." Turin, 2026. Data as of 1 November 2024.', url: 'https://www.etf.europa.eu/sites/default/files/2026-07/Disability%20Country%20note%20ENG_Kazakhstan.pdf' },
    { id: 9, text: 'Orda.kz. "Kazakhstanis With Disabilities Can Check Building Accessibility Online." 2026. Reports 42,897 facilities on the interactive map.', url: 'https://en.orda.kz/kazakhstanis-with-disabilities-can-check-building-accessibility-online-10708/' },
    { id: 10, text: 'Almaty Development Center. "Implementation of QR Codes for Building Access for People with Disabilities." Cites the Interactive Accessibility Map, inva.gov.kz.', url: 'https://almatydc.kz/en/activities/think-tank/vnedrenie-qr-kodov-dlya-dostupa-v-zdaniya-dlya-lyudej-s-osobymi-potrebnostyami' },
    { id: 11, text: 'World Health Organization. "Global report on health equity for persons with disabilities." Geneva, 2022.', url: 'https://www.who.int/publications/i/item/9789240063600' },
    { id: 12, text: 'Saha, M., Saugstad, M., Maddali, H. T., Zeng, A., Holland, R., Bower, S., Dash, A., Chen, S., Li, A., Hara, K., and Froehlich, J. E. (2019). "Project Sidewalk: A Web-based Crowdsourcing Tool for Collecting Sidewalk Accessibility Data at Scale." Proceedings of CHI 2019. ACM.', url: 'https://doi.org/10.1145/3290605.3300292' },
    { id: 13, text: 'Hara, K., Sun, J., Moore, R., Jacobs, D., and Froehlich, J. E. (2014). "Tohme: Detecting Curb Ramps in Google Street View Using Crowdsourcing, Computer Vision, and Machine Learning." Proceedings of UIST 2014. ACM.', url: 'https://doi.org/10.1145/2642918.2647403' },
    { id: 14, text: 'Weld, G., Jang, E., Li, A., Zeng, A., Heimerl, K., and Froehlich, J. E. (2019). "Deep Learning for Automatically Detecting Sidewalk Accessibility Problems Using Streetscape Imagery." Proceedings of ASSETS 2019. ACM. Figures quoted here are from the authors\' conference slides.', url: 'https://doi.org/10.1145/3308561.3353798' },
    { id: 15, text: 'Liu, X., Wu, K., Kulkarni, M., Saugstad, M., Rapo, P., Freiburger, J., Hosseini, M., Li, C., and Froehlich, J. E. (2024). "Towards Fine-Grained Sidewalk Accessibility Assessment with Deep Learning: Initial Benchmarks and an Open Dataset." Proceedings of ASSETS 2024. ACM.', url: 'https://doi.org/10.1145/3663548.3688531' },
    { id: 16, text: 'Abdrassilova, G., and Murzagaliyeva, E. (2020). "Accessibility as a criterion of quality in an architectural spatial environment (on the example of the city of Almaty)." Budownictwo o Zoptymalizowanym Potencjale Energetycznym, 9(1).', url: 'https://doi.org/10.17512/bozpe.2020.1.04' },
    { id: 17, text: 'Bennett, C. L., and Keyes, O. (2020). "What is the Point of Fairness? Disability, AI and the Complexity of Justice." ACM SIGACCESS Accessibility and Computing, 125.', url: 'https://doi.org/10.1145/3386296.3386301' },
    { id: 18, text: 'Luccioni, A. S., Jernite, Y., and Strubell, E. (2024). "Power Hungry Processing: Watts Driving the Cost of AI Deployment?" Proceedings of ACM FAccT 2024. Table 2, mean energy per 1,000 inferences.', url: 'https://doi.org/10.1145/3630106.3658542' },
    { id: 19, text: 'LowCarbonPower. "Electricity in Kazakhstan." Rolling 12 months, April 2025 to March 2026: 603 g CO2e per kWh, about 85% fossil. Estimates from other compilers differ with method.', url: 'https://lowcarbonpower.org/region/Kazakhstan' },
    { id: 20, text: 'Google Cloud. "Cloud Vision pricing." Object localisation, US$2.25 per 1,000 units for units 1,001 to 5,000,000 per month. Retrieved November 2026.', url: 'https://cloud.google.com/vision/pricing' },
    { id: 21, text: 'Bureau of National Statistics of the Republic of Kazakhstan. "Differentiation of wages of workers in the Republic of Kazakhstan." 23 October 2026. Average hourly wage 2,508 tenge.', url: 'https://stat.gov.kz/en/industries/labor--income/stat-wags/publications/519860/' },
    { id: 22, text: 'Republic of Kazakhstan. SN RK 3.06-01-2011 "Accessibility of buildings and structures for people with limited mobility" and SP RK 3.06-101-2012 "Design of buildings and structures with accessibility for people with limited mobility. General provisions."', url: 'https://www.gov.kz/uploads/2021/5/14/0111e832e36e8e3348a4f8cce36aebf5_original.1102336.doc' },
    { id: 23, text: 'Law of the Republic of Kazakhstan No. 230-VIII "On Artificial Intelligence," 17 November 2025, in force 18 January 2026. Summary: EY Kazakhstan legal alert, December 2025.', url: 'https://www.ey.com/en_kz/technical/tax-alerts/2025/12/law-on-artificial-intelligence-kazakhstan' },
    { id: 24, text: 'Law of the Republic of Kazakhstan No. 94-V "On Personal Data and their Protection," 21 May 2013.', url: 'https://adilet.zan.kz/eng/docs/Z1300000094' },
    { id: 25, text: 'Ministry of Labour and Social Protection of the Population of the Republic of Kazakhstan. Interactive Accessibility Map, regional view. Facility counts per region as displayed on 15 November 2026 (read by the author from the map; total 43,472).', url: 'https://inva.gov.kz/ru/map/207' },
    { id: 26, text: 'Koishibayev, M. M., Nechayeva, Y. L., and Kapitsyn, V. M. (2020). "National plans to ensure the rights of persons with disabilities in Kazakhstan: amendments to the legislation." Disability & Society, 35(8), 1355-1359.', url: 'https://doi.org/10.1080/09687599.2019.1698153' },
    { id: 27, text: 'Allan, J., and Omarova, T. (2022). "Disability and inclusion in Kazakhstan." Disability & Society, 37(7), 1067-1084.', url: 'https://doi.org/10.1080/09687599.2020.1867073' },
    { id: 28, text: 'Moreira, R. S., Moita, S., Torres, J. M., Gouveia, F., Dinis, M. A. P., Ferreira, D., Araujo, M., and Guerreiro, M. J. S. (2025). "Automating City Accessibility Constraints Mapping Through AI-Assisted Scanning of Street View Imagery." IET Smart Cities, 7(1), e70020.', url: 'https://doi.org/10.1049/smc2.70020' },
    { id: 29, text: 'Fraser et al. (2024). Placeholder: full citation to be added by the author.', url: '' },
    { id: 30, text: 'Sfounis et al. (2024). Placeholder: full citation to be added by the author.', url: '' }
  ];

  /* Registered people with disabilities, thousands. t = decimal year. */
  var population = [
    { t: 2017.5, label: '2017', value: 674.2, ref: 7 },
    { t: 2021.08, label: 'Jan 2021', value: 696.5, ref: 3 },
    { t: 2024.83, label: 'Nov 2024', value: 732, ref: 8 },
    { t: 2025.12, label: 'Feb 2025', value: 738.9, ref: 2 },
    { t: 2025.83, label: 'Nov 2025', value: 743.9, ref: 6 },
    { t: 2026.3, label: 'Apr 2026', value: 752, ref: 1 }
  ];

  var adapted = [
    { label: '2024', value: 53, ref: 1 },
    { label: '2025', value: 64, ref: 1 },
    { label: 'Apr 2026', value: 67, ref: 1 }
  ];
  var adaptedTarget = { value: 80, label: '2026 target 80%' };

  var equippedFor = [
    { label: 'All facilities on map', value: 42.9, ref: 2, muted: true },
    { label: 'Hearing', value: 24.1, ref: 2 },
    { label: 'Vision', value: 23.3, ref: 2 },
    { label: 'Wheelchair users', value: 23.0, ref: 2 }
  ];

  var regions = {
    rural: {
      sub: 'Share of people with disabilities living in rural areas, February 2025. Only the regions named by the source are shown.',
      unit: '%', max: 100,
      rows: [
        { label: 'Almaty Region', value: 81.1, ref: 2 },
        { label: 'Turkistan Region', value: 73.6, ref: 2 },
        { label: 'Zhambyl Region', value: 59.3, ref: 2 },
        { label: 'North Kazakhstan', value: 56.7, ref: 2 },
        { label: 'Kazakhstan', value: 40.1, ref: 2, muted: true }
      ]
    },
    employ: {
      sub: 'Share of working-age people with disabilities in employment, as reported by the minister in April 2026. The three highest and three lowest regions named.',
      unit: '%', max: 100,
      rows: [
        { label: 'Ulytau Region', value: 44.5, ref: 5 },
        { label: 'Karaganda Region', value: 38.5, ref: 5 },
        { label: 'Astana', value: 38.0, ref: 5 },
        { label: 'Abay Region', value: 24.5, ref: 5 },
        { label: 'Turkistan Region', value: 23.7, ref: 5 },
        { label: 'Almaty Region', value: 22.4, ref: 5 }
      ]
    },
    facilities: {
      sub: 'Number of facilities shown on the official accessibility map for each region and city, as displayed on 15 November 2026. The map shows how many facilities are registered, not how many of them are adapted.',
      unit: '', max: 10500, decimals: 0, unitLabel: 'Facilities on the map',
      rows: [
        { label: 'Almaty city', value: 9342, ref: 25 },
        { label: 'Turkistan Region', value: 3711, ref: 25 },
        { label: 'Shymkent city', value: 2396, ref: 25 },
        { label: 'Atyrau Region', value: 2386, ref: 25 },
        { label: 'Kyzylorda Region', value: 2378, ref: 25 },
        { label: 'Astana', value: 2115, ref: 25 },
        { label: 'Kostanay Region', value: 1907, ref: 25 },
        { label: 'Akmola Region', value: 1873, ref: 25 },
        { label: 'Karaganda Region', value: 1748, ref: 25 },
        { label: 'West Kazakhstan', value: 1740, ref: 25 },
        { label: 'East Kazakhstan', value: 1735, ref: 25 },
        { label: 'Pavlodar Region', value: 1732, ref: 25 },
        { label: 'North Kazakhstan', value: 1611, ref: 25 },
        { label: 'Mangystau Region', value: 1584, ref: 25 },
        { label: 'Zhambyl Region', value: 1546, ref: 25 },
        { label: 'Almaty Region', value: 1518, ref: 25 },
        { label: 'Aktobe Region', value: 1338, ref: 25 },
        { label: 'Abay Region', value: 1298, ref: 25 },
        { label: 'Zhetisu Region', value: 1120, ref: 25 },
        { label: 'Ulytau Region', value: 394, ref: 25 }
      ]
    }
  };

  var approaches = [
    { key: 'all', label: 'All topics' },
    { key: 'policy', label: 'Disability rights and policy implementation' },
    { key: 'spatial', label: 'Spatial accessibility and urban infrastructure' },
    { key: 'tech', label: 'Participatory and technology-assisted assessment' }
  ];

  /* Six sources chosen by the author, two per topic.
     summary: what the source covers. Leave finding or relevance as '' to show a placeholder. */
  var papers = [
    { ref: 26, approach: 'policy', scope: 'Kazakhstan', cite: 'Koishibayev et al., 2020',
      title: 'National plans to ensure the rights of persons with disabilities in Kazakhstan',
      summary: 'Reviews how Kazakhstan changed its laws after ratifying the UN disability convention. Finds the legislation largely in line with the convention, and names the lack of effective mechanisms for carrying policy out as the main problem.',
      finding: '', relevance: '' },
    { ref: 27, approach: 'policy', scope: 'Kazakhstan', cite: 'Allan and Omarova, 2022',
      title: 'Disability and inclusion in Kazakhstan',
      summary: '', finding: '', relevance: '' },
    { ref: 16, approach: 'spatial', scope: 'Kazakhstan', cite: 'Abdrassilova and Murzagaliyeva, 2020',
      title: 'Accessibility as a criterion of quality in an architectural spatial environment',
      summary: 'Architectural and planning analysis of Almaty for people with limited mobility. Argues that barrier-free access is a core measure of the quality of a city\'s built environment.',
      finding: '', relevance: '' },
    { ref: 29, approach: 'spatial', scope: 'Global', cite: 'Fraser et al., 2024',
      title: 'Title to be added',
      summary: '', finding: '', relevance: '' },
    { ref: 30, approach: 'tech', scope: 'Global', cite: 'Sfounis et al., 2024',
      title: 'Title to be added',
      summary: '', finding: '', relevance: '' },
    { ref: 28, approach: 'tech', scope: 'Global', cite: 'Moreira et al., 2025',
      title: 'Automating city accessibility constraints mapping with AI and street view imagery',
      summary: 'Presents ACAMAI, a pipeline that trains an object detector on Google Street View panoramas to find and locate accessibility constraints, then places them on OpenStreetMap.',
      finding: '', relevance: '' }
  ];

  var features = [
    { key: 'ramp', label: 'Ramp' },
    { key: 'steps', label: 'Steps' },
    { key: 'door', label: 'Entrance door' },
    { key: 'handrail', label: 'Handrail' },
    { key: 'tactile', label: 'Tactile paving' },
    { key: 'obstacle', label: 'Obstacle on route' }
  ];

  /* dir 'max': measured must be at or below the limit. 'min': at or above. */
  var measures = [
    { key: 'slope', label: 'Ramp slope', unit: '%', dir: 'max', derived: true },
    { key: 'rampWidth', label: 'Ramp width', unit: 'cm', dir: 'min' },
    { key: 'doorWidth', label: 'Door clear width', unit: 'cm', dir: 'min' },
    { key: 'threshold', label: 'Threshold height', unit: 'cm', dir: 'max' }
  ];

  var usability = [
    { key: 'route', q: 'Is the route from the street to the door free of obstacles?' },
    { key: 'surface', q: 'Is the surface firm, even and clear of snow or ice?' },
    { key: 'door', q: 'Can the door be opened without help, or is there a working call button?' },
    { key: 'landing', q: 'Is there room to turn a wheelchair at the top?' }
  ];

  /* One drawn scene, used in the hero and as the demo sample. */
  var sceneSVG =
    '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a building entrance with steps, a steep side ramp, and a car parked across the foot of the ramp">' +
    '<rect width="640" height="400" fill="#EAF1FC"/>' +
    '<rect x="70" y="36" width="520" height="304" fill="#FFFFFF" stroke="#C3D2EA" stroke-width="2"/>' +
    '<rect x="110" y="76" width="92" height="110" rx="3" fill="#DCE7F9"/><rect x="458" y="76" width="92" height="110" rx="3" fill="#DCE7F9"/>' +
    '<rect x="258" y="96" width="124" height="26" rx="4" fill="#0B1F3A"/><rect x="274" y="105" width="92" height="8" rx="4" fill="#FFFFFF" opacity=".85"/>' +
    '<rect x="276" y="140" width="88" height="160" rx="3" fill="#1257D6"/><rect x="286" y="152" width="68" height="70" rx="2" fill="#9DB9EE"/><circle cx="350" cy="236" r="5" fill="#FFFFFF"/>' +
    '<rect x="0" y="340" width="640" height="60" fill="#C9D6EA"/><rect x="0" y="340" width="640" height="4" fill="#A9BCDA"/>' +
    '<rect x="240" y="300" width="160" height="40" fill="#AFC0DC"/>' +
    '<rect x="400" y="313" width="28" height="27" fill="#AFC0DC"/><rect x="428" y="326" width="28" height="14" fill="#AFC0DC"/>' +
    '<path class="s-ramp" d="M240 300 L92 340 L240 340 Z" fill="#6F98E6"/>' +
    '<path d="M240 262 L96 301 M240 262 V300 M168 281 V320 M96 301 V339" fill="none" stroke="#0B1F3A" stroke-width="4" stroke-linecap="round"/>' +
    '<g class="s-car"><path d="M14 340 v-22 q0-8 8-8 h14 l14-20 h52 l16 20 h10 q8 0 8 8 v22 Z" fill="#0B1F3A"/><path d="M54 293 h20 v17 h-32 Z M80 293 h18 l12 17 h-30 Z" fill="#9DB9EE"/><circle cx="42" cy="340" r="12" fill="#0B1F3A" stroke="#C9D6EA" stroke-width="4"/><circle cx="112" cy="340" r="12" fill="#0B1F3A" stroke="#C9D6EA" stroke-width="4"/></g>' +
    '<g class="o o1"><path d="M246 294 L78 340 L246 346 Z" fill="none" stroke="#0E7A4F" stroke-width="4" stroke-dasharray="8 6" stroke-linejoin="round"/></g>' +
    '<g class="o o2"><path d="M92 356 H240 M92 350 v12 M240 350 v12 M256 300 V340 M250 300 h12 M250 340 h12" fill="none" stroke="#0B1F3A" stroke-width="3"/><circle cx="166" cy="376" r="15" fill="#FFFFFF" stroke="#0B1F3A" stroke-width="3"/><text x="166" y="383" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="700" fill="#0B1F3A">?</text></g>' +
    '<g class="o o3"><ellipse cx="78" cy="318" rx="76" ry="46" fill="none" stroke="#B3261E" stroke-width="5"/></g>' +
    '</svg>';

  var sceneAnswers = {
    1: { status: 'good', head: 'Yes.', body: 'A ramp is visible beside the steps. This is all a "facility has a ramp" record tells you.' },
    2: { status: 'unknown', head: 'Unknown from one photo.', body: 'The ramp looks steep, but slope and width have to be measured against the building standard.' },
    3: { status: 'serious', head: 'No.', body: 'A parked car blocks the foot of the ramp. Nobody using a wheelchair can reach the door.' }
  };

  return { REFS: REFS, population: population, adapted: adapted, adaptedTarget: adaptedTarget,
    equippedFor: equippedFor, regions: regions, approaches: approaches, papers: papers,
    features: features, measures: measures, usability: usability,
    sceneSVG: sceneSVG, sceneAnswers: sceneAnswers };
})();
