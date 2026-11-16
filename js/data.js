/* AccessCheck KZ: all content data in one place.
   Every number carries the reference id it came from (see REFS). */
window.ACK = (function () {

  var REFS = [
    { id: 1, text: 'Government of the Republic of Kazakhstan, Office of the Prime Minister. "Network of Rehabilitation Centers and Accessibility Being Expanded in Kazakhstan." 21 April 2026.', url: 'https://primeminister.kz/en/news/set-reabilitacionnyx-centrov-i-dostupnost-sredy-rassiriaiut-v-kazaxstane-31293' },
    { id: 2, text: 'Ranking.kz. "The \'Barrier-Free\' Environment in Kazakhstan Remains Full of Significant Barriers for People with Special Needs." 8 May 2025. Cites the Ministry of Labour and Social Protection portal, data as of 14 February 2025.', url: 'https://ranking.kz/en/reviews-en/industries-en/the-barrier-free-environment-in-kazakhstan-remains-full-of-significant-barriers-for-people-with-special-needs.html' },
    { id: 3, text: 'CABAR.asia (Central Asian Bureau for Analytical Reporting). "How Accessible is Kazakhstan for People with Disabilities?" 2021.', url: 'https://cabar.asia/en/how-accessible-is-kazakhstan-for-people-with-disabilities' },
    { id: 4, text: 'United Nations Committee on the Rights of Persons with Disabilities. "Concluding observations on the initial report of Kazakhstan." CRPD/C/KAZ/CO/1, 19 April 2024. Paragraphs 7, 19, 20, 65. The 44.8% rural figure is in paragraph 7(c), citing Kazakhstan\'s initial report (CRPD/C/KAZ/1), paragraph 108.', url: 'https://digitallibrary.un.org/record/4044522' },
    { id: 5, text: 'Orda.kz. "Kazakhstan Plans to Employ 17,000 People With Disabilities in 2026." 21 April 2026. Reports figures given by the Minister of Labour and Social Protection.', url: 'https://en.orda.kz/kazakhstan-plans-to-employ-17000-people-with-disabilities-in-2026-10175/' },
    { id: 6, text: 'QazMonitor. "Kazakhstan Enhances Job Opportunities for People with Disabilities." 10 November 2025. Data as of 1 November 2025.', url: 'https://en.qazmonitor.com/news/3132/kazakhstan-enhances-job-opportunities-for-people-with-disabilities' },
    { id: 7, text: 'UNFPA Kazakhstan. "Outcomes of assessment of social and gender-specific needs of persons with disabilities in Turkestan oblast and Shymkent city." Reports 674,200 persons (2017).', url: 'https://kazakhstan.unfpa.org/sites/default/files/pub-pdf/itogi_ocenki-eng.pdf' },
    { id: 8, text: 'European Training Foundation. "Labour market (re)integration and skills development for persons with disabilities: Kazakhstan. Country note." Turin, 2026. Data as of 1 November 2024.', url: 'https://www.etf.europa.eu/sites/default/files/2026-07/Disability%20Country%20note%20ENG_Kazakhstan.pdf' },
    { id: 9, text: 'Almaty Development Center. "Implementation of QR Codes for Building Access for People with Disabilities." Cites the Interactive Accessibility Map, inva.gov.kz.', url: 'https://almatydc.kz/en/activities/think-tank/vnedrenie-qr-kodov-dlya-dostupa-v-zdaniya-dlya-lyudej-s-osobymi-potrebnostyami' },
    { id: 10, text: 'World Health Organization. "Global report on health equity for persons with disabilities." Geneva, 2022.', url: 'https://www.who.int/publications/i/item/9789240063600' },
    { id: 11, text: 'Saha, M., Saugstad, M., Maddali, H. T., Zeng, A., Holland, R., Bower, S., Dash, A., Chen, S., Li, A., Hara, K., and Froehlich, J. E. (2019). "Project Sidewalk: A Web-based Crowdsourcing Tool for Collecting Sidewalk Accessibility Data at Scale." Proceedings of CHI 2019. ACM.', url: 'https://doi.org/10.1145/3290605.3300292' },
    { id: 12, text: 'Hara, K., Sun, J., Moore, R., Jacobs, D., and Froehlich, J. E. (2014). "Tohme: Detecting Curb Ramps in Google Street View Using Crowdsourcing, Computer Vision, and Machine Learning." Proceedings of UIST 2014. ACM.', url: 'https://doi.org/10.1145/2642918.2647403' },
    { id: 13, text: 'Abdrassilova, G., and Murzagaliyeva, E. (2020). "Accessibility as a criterion of quality in an architectural spatial environment (on the example of the city of Almaty)." Budownictwo o Zoptymalizowanym Potencjale Energetycznym, 9(1).', url: 'https://doi.org/10.17512/bozpe.2020.1.04' },
    { id: 14, text: 'Luccioni, A. S., Jernite, Y., and Strubell, E. (2024). "Power Hungry Processing: Watts Driving the Cost of AI Deployment?" Proceedings of ACM FAccT 2024. Table 2, mean energy per 1,000 inferences.', url: 'https://doi.org/10.1145/3630106.3658542' },
    { id: 15, text: 'LowCarbonPower. "Electricity in Kazakhstan." Rolling 12 months, April 2025 to March 2026: 603 g CO2e per kWh, about 85% fossil. Estimates from other compilers differ with method.', url: 'https://lowcarbonpower.org/region/Kazakhstan' },
    { id: 16, text: 'Google Cloud. "Cloud Vision pricing." Object localisation, US$2.25 per 1,000 units for units 1,001 to 5,000,000 per month. Retrieved November 2026.', url: 'https://cloud.google.com/vision/pricing' },
    { id: 17, text: 'Bureau of National Statistics of the Republic of Kazakhstan. "Differentiation of wages of workers in the Republic of Kazakhstan." 23 October 2026. Average hourly wage 2,508 tenge.', url: 'https://stat.gov.kz/en/industries/labor--income/stat-wags/publications/519860/' },
    { id: 18, text: 'Republic of Kazakhstan. SN RK 3.06-01-2011 "Accessibility of buildings and structures for people with limited mobility" and SP RK 3.06-101-2012 "Design of buildings and structures with accessibility for people with limited mobility. General provisions."', url: 'https://www.gov.kz/uploads/2021/5/14/0111e832e36e8e3348a4f8cce36aebf5_original.1102336.doc' },
    { id: 19, text: 'Law of the Republic of Kazakhstan No. 230-VIII "On Artificial Intelligence," 17 November 2025, in force 18 January 2026. Summary: EY Kazakhstan legal alert, December 2025.', url: 'https://www.ey.com/en_kz/technical/tax-alerts/2025/12/law-on-artificial-intelligence-kazakhstan' },
    { id: 20, text: 'Law of the Republic of Kazakhstan No. 94-V "On Personal Data and their Protection," 21 May 2013.', url: 'https://adilet.zan.kz/eng/docs/Z1300000094' },
    { id: 21, text: 'Ministry of Labour and Social Protection of the Population of the Republic of Kazakhstan. Interactive Accessibility Map, regional view. Facility counts per region as displayed on 15 November 2026 (read by the author from the map; total 43,472).', url: 'https://inva.gov.kz/ru/map/207' },
    { id: 22, text: 'Koishibayev, M. M., Nechayeva, Y. L., and Kapitsyn, V. M. (2020). "National plans to ensure the rights of persons with disabilities in Kazakhstan: amendments to the legislation." Disability & Society, 35(8), 1355-1359.', url: 'https://doi.org/10.1080/09687599.2019.1698153' },
    { id: 23, text: 'Allan, J., and Omarova, T. (2022). "Disability and inclusion in Kazakhstan." Disability & Society, 37(7), 1067-1084.', url: 'https://doi.org/10.1080/09687599.2020.1867073' },
    { id: 24, text: 'Moreira, R. S., Moita, S., Torres, J. M., Gouveia, F., Dinis, M. A. P., Ferreira, D., Araujo, M., and Guerreiro, M. J. S. (2025). "Automating City Accessibility Constraints Mapping Through AI-Assisted Scanning of Street View Imagery." IET Smart Cities, 7(1), e70020.', url: 'https://doi.org/10.1049/smc2.70020' },
    { id: 25, text: 'Tolegen, Z., Konbr, U., Karzhaubayeva, S., Sadvokasova, G., Nauryzbayeva, A., and Amandykova, D. (2023). "Assessment of Safe Access to Pedestrian Infrastructure Facilities in the City of Almaty, Kazakhstan." Civil Engineering and Architecture, 11(1), 351-371.', url: 'https://doi.org/10.13189/cea.2023.110128' }
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
      sub: 'Share of people with disabilities living in rural areas. Nationally it is 44.8%, according to the UN committee\'s 2024 concluding observations, which cite Kazakhstan\'s initial report. The committee noted limited information about disability policies for rural residents. The regional figures come from a different source (February 2025), which gave 40.1% nationally, so compare them with care. This shows where people live. It is not an infrastructure-accessibility rate.',
      unit: '%', max: 100,
      rows: [
        { label: 'Almaty Region', value: 81.1, ref: 2 },
        { label: 'Turkistan Region', value: 73.6, ref: 2 },
        { label: 'Zhambyl Region', value: 59.3, ref: 2 },
        { label: 'North Kazakhstan', value: 56.7, ref: 2 },
        { label: 'Kazakhstan (UN, 2024)', value: 44.8, ref: 4, muted: true }
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
        { label: 'Almaty city', value: 9342, ref: 21 },
        { label: 'Turkistan Region', value: 3711, ref: 21 },
        { label: 'Shymkent city', value: 2396, ref: 21 },
        { label: 'Atyrau Region', value: 2386, ref: 21 },
        { label: 'Kyzylorda Region', value: 2378, ref: 21 },
        { label: 'Astana', value: 2115, ref: 21 },
        { label: 'Kostanay Region', value: 1907, ref: 21 },
        { label: 'Akmola Region', value: 1873, ref: 21 },
        { label: 'Karaganda Region', value: 1748, ref: 21 },
        { label: 'West Kazakhstan', value: 1740, ref: 21 },
        { label: 'East Kazakhstan', value: 1735, ref: 21 },
        { label: 'Pavlodar Region', value: 1732, ref: 21 },
        { label: 'North Kazakhstan', value: 1611, ref: 21 },
        { label: 'Mangystau Region', value: 1584, ref: 21 },
        { label: 'Zhambyl Region', value: 1546, ref: 21 },
        { label: 'Almaty Region', value: 1518, ref: 21 },
        { label: 'Aktobe Region', value: 1338, ref: 21 },
        { label: 'Abay Region', value: 1298, ref: 21 },
        { label: 'Zhetisu Region', value: 1120, ref: 21 },
        { label: 'Ulytau Region', value: 394, ref: 21 }
      ]
    }
  };

  /* Three topics chosen by the author. Seven readings in total. */
  var approaches = [
    { key: 'policy', label: 'Disability rights and policy implementation', scope: 'Kazakhstan sources' },
    { key: 'spatial', label: 'Spatial accessibility and urban infrastructure', scope: 'Kazakhstan sources' },
    { key: 'tech', label: 'Participatory and technology-assisted accessibility assessment', scope: 'Global sources' }
  ];

  var papers = [
    { ref: 22, approach: 'policy', cite: 'Koishibayev et al., 2020',
      title: 'National plans to ensure the rights of persons with disabilities in Kazakhstan',
      summary: 'A short review of how Kazakhstan changed its laws after ratifying the UN disability convention in 2015, covering progress, remaining problems and proposed solutions.',
      finding: 'The laws largely match the convention, but there are no effective mechanisms to carry them out. With weak control over construction and transport, an accessible environment has not been achieved, and the wheelchair ramps that exist usually fail to meet the regulations.',
      relevance: 'Demonstrates that Kazakhstan\'s disability legislation largely aligns with international standards, but weak enforcement leaves accessibility barriers unresolved. This supports AccessCheck KZ\'s goal of making infrastructure problems more visible and providing evidence that could support public accountability.' },
    { ref: 23, approach: 'policy', cite: 'Allan and Omarova, 2022',
      title: 'Disability and inclusion in Kazakhstan',
      summary: 'Examines Kazakhstan\'s readiness for inclusive education after ratifying the convention, using the ideas of "making up people" and "ablenationalism" to analyse how disabled children and adults are positioned in school and society.',
      finding: 'The state system for assessing and classifying disabled children, rooted in a medical model, is a major barrier to inclusion. Many teachers preferred segregation, while parents\' groups have managed to influence policy and practice.',
      relevance: 'Shows how institutional definitions of disability can overlook people\'s actual needs and restrict inclusion. This supports involving people with disabilities in evaluating accessibility rather than relying exclusively on official assessments or AI-generated classifications.' },
    { ref: 13, approach: 'spatial', cite: 'Abdrassilova and Murzagaliyeva, 2020',
      title: 'Accessibility as a criterion of quality in an architectural spatial environment (Almaty)',
      summary: 'Architectural study of Almaty for low-mobility groups, based on a review of standards and a field survey of buildings with measurements and photographs, carried out since 2013.',
      finding: 'Despite a city programme in 2017-2018 that rebuilt 103 km of sidewalks and added more than 2,000 ramps, people with disabilities generally cannot move around safely unassisted. Ramps are often steeper than the 1:20 gradient the standard requires, lack handrails and tactile warnings, or are blocked. Almaty\'s 3-4% natural slope adds to the difficulty.',
      relevance: 'Identifies physical barriers in Almaty, including steep ramps, high curbs, missing handrails, and inaccessible entrances. These findings help define which infrastructure features AccessCheck KZ should detect and explain why a visible ramp does not necessarily guarantee accessibility.' },
    { ref: 25, approach: 'spatial', cite: 'Tolegen et al., 2023',
      title: 'Assessment of safe access to pedestrian infrastructure facilities in Almaty',
      summary: 'Evaluates the comfort and safety of pedestrian routes in part of Almaty\'s Bostandyk district using aerial photography, a field survey and the Pedestrian Comfort Level method. The area was divided into ten sectors with 19 large infrastructure facilities.',
      finding: 'Overall access was rated satisfactory, but the survey lists recurring problems: missing ramps for people with limited mobility, ramp slopes that do not meet the regulations (worse in snow and rain), parked cars that force pedestrians onto the road, sidewalks narrower than 1.5 m, and poor lighting.',
      relevance: 'Demonstrates how pedestrian accessibility can be evaluated through street observations, photographs, and spatial assessments. This informs AccessCheck KZ\'s approach to mapping barriers and assessing the accessibility of connected pedestrian routes rather than isolated buildings.' },
    { ref: 12, approach: 'tech', cite: 'Hara et al., 2014',
      title: 'Tohme: detecting curb ramps in Google Street View using crowdsourcing, computer vision and machine learning',
      summary: 'A system that sends each street scene either to people for labelling or to computer vision followed by human verification, tested on 1,086 scenes in four North American cities with 403 online workers.',
      finding: 'The combined approach matched the quality of manual labelling while using 13% less human time. Computer vision alone found 67% of curb ramps.',
      relevance: 'Provides an early example of combining computer vision, machine learning, and crowdsourcing to detect curb ramps in street imagery. It supports AccessCheck KZ\'s proposed hybrid approach, in which AI identifies potential barriers and humans help verify the results.' },
    { ref: 11, approach: 'tech', cite: 'Saha et al., 2019',
      title: 'Project Sidewalk: a web-based crowdsourcing tool for collecting sidewalk accessibility data at scale',
      summary: 'An online tool in which volunteers and paid workers virtually walk through street-level imagery and label accessibility problems, deployed for 18 months in Washington, DC.',
      finding: '797 users placed 205,385 labels across 2,941 miles of streets. Paid workers reached 67.8% recall and 68.8% precision. The authors note that imagery can be out of date and that the label types follow United States standards.',
      relevance: 'Demonstrates how crowdsourcing can collect sidewalk accessibility information at a large urban scale. This supports AccessCheck KZ\'s participatory mapping component, allowing citizens to contribute observations and help identify barriers that official infrastructure records may overlook.' },
    { ref: 24, approach: 'tech', cite: 'Moreira et al., 2025',
      title: 'Automating city accessibility constraints mapping with AI and street view imagery',
      summary: 'Presents ACAMAI, a two-stage pipeline: a YOLOv8 detector trained on Project Sidewalk data plus a local Porto dataset, then automated scanning of 360-degree Google Street View panoramas, with results placed on OpenStreetMap.',
      finding: 'Adding local images improved results: 91% recall and 85% precision for curb ramps. In panorama scanning, a fine 2-degree step reached 90% recall for curb ramps and 93% for obstacles, but produced many repeated detections that lowered overall precision.',
      relevance: 'Demonstrates the technical feasibility of detecting and mapping accessibility barriers using AI and street-view imagery. Its findings also highlight the importance of local training data and model validation, supporting AccessCheck KZ\'s proposal to adapt AI detection to Kazakhstan rather than assuming that international models will perform equally well.' }
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
