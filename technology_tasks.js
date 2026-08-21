const TECHNOLOGY_TASKS={
  excavators:[
    {
      id:'tech:excavators:1',title:'Wykop jamisty z symulacją załadunku',
      technical:'Przejedź na wskazane miejsce, wykonaj wykop jamisty w dwóch cyklach kopania i zasymuluj załadunek urobku na środek transportu.',
      human:'Podjedź tam, gdzie wskaże egzaminator. Dwa razy nabierz grunt z jednego miejsca i za każdym razem wykonaj ruch tak, jakbyś wysypywał go na samochód.',
      steps:['Sprawdź trasę przejazdu, otoczenie i strefę pracy.','Ustaw koparkę stabilnie oraz we właściwej odległości od wykopu.','Ustaw podwozie i osprzęt tak, aby ograniczyć zbędny obrót.','Wykonaj pierwszy płynny cykl: zagłębienie łyżki, napełnienie, podniesienie i obrót.','Zasymuluj bezpieczny wysyp do środka transportu bez ruchu nad kabiną.','Wykonaj drugi cykl i zachowaj porządek odkładu lub strefy załadunku.','Po zakończeniu opuść osprzęt, ustaw sterowanie neutralnie i zabezpiecz maszynę.'],
      errors:['Rozpoczęcie bez sprawdzenia strefy.','Napełnianie łyżki podczas jednoczesnego obrotu.','Zbyt wysoki lub gwałtowny obrót nad pojazdem.','Uderzenie łyżką w grunt, pojazd albo ograniczniki.','Pozostawienie osprzętu uniesionego po zakończeniu.'],
      criteria:['bezpieczeństwo i obserwacja strefy','stabilne ustawienie','dwa pełne cykle','płynność ruchów','bezpieczna symulacja załadunku','prawidłowe zakończenie'],
      followups:['Dlaczego nie wolno obracać nad kabiną środka transportu?','Kiedy rozpoczynasz obrót nadwozia po napełnieniu łyżki?','Jak zabezpieczasz maszynę po wykonaniu zadania?']
    },
    {
      id:'tech:excavators:2',title:'Wykop wąskoprzestrzenny',
      technical:'Wykonaj fragment wykopu wąskoprzestrzennego z poziomym dnem długości około 2 m i głębokości około 0,5 m, metodą oraz kierunkiem skrawania wskazanym przez egzaminatora, w dwóch cyklach.',
      human:'Zrób krótki, wąski rów: mniej więcej dwa metry długości i pół metra głębokości. Dno ma być równe. Egzaminator powie, czy pracujesz czołowo czy z boku oraz czy skrawasz poniżej czy powyżej poziomu maszyny.',
      steps:['Sprawdź oznaczenie wykopu, grunt, otoczenie i instalacje podziemne.','Ustaw maszynę stabilnie poza klinem odłamu, zgodnie z wybraną metodą.','Wyznacz wzrokowo długość, szerokość i docelową głębokość.','Pierwszym cyklem odspój grunt i uformuj początek wykopu.','Odłóż urobek w bezpiecznej odległości od krawędzi.','Drugim cyklem wydłuż wykop oraz wyrównaj dno do poziomu.','Skontroluj wymiary, krawędzie i dno, a następnie zabezpiecz maszynę.'],
      errors:['Ustawienie maszyny zbyt blisko krawędzi.','Odkładanie urobku przy samej krawędzi wykopu.','Tworzenie nawisu lub nierównego dna.','Obrót podczas napełniania łyżki.','Brak kontroli zadanych wymiarów.'],
      criteria:['bezpieczne ustawienie','metoda zgodna z poleceniem','około 2 m długości','około 0,5 m głębokości','poziome dno','dwa cykle','bezpieczny odkład'],
      followups:['Od czego zależy bezpieczna odległość maszyny od wykopu?','Gdzie odkładasz urobek?','Jak uzyskujesz poziome dno bez tworzenia nawisu?']
    }
  ],
  backhoes:[
    {
      id:'tech:backhoes:1',title:'Wykop jamisty z symulacją załadunku',
      technical:'Przejedź na wskazane miejsce, wykonaj wykop jamisty w dwóch cyklach kopania i zasymuluj załadunek urobku na środek transportu.',
      human:'Ustaw część koparkową, dwa razy nabierz grunt i za każdym razem wykonaj bezpieczny ruch wysypu tak, jakby obok stał samochód.',
      steps:['Sprawdź przejazd i strefę pracy.','Ustaw maszynę, zaciągnij hamulec, ustaw skrzynię neutralnie i rozstaw podpory.','Ustaw łyżkę ładowarkową stabilizująco zgodnie z instrukcją.','Obróć fotel i odblokuj sterowanie części koparkowej.','Wykonaj pierwszy cykl kopania oraz symulację załadunku.','Wykonaj drugi cykl bez obrotu podczas napełniania.','Opuść osprzęt, wyzeruj sterowanie i przygotuj maszynę do zakończenia.'],
      errors:['Brak podpór lub hamulca postojowego.','Zapomnienie o zabezpieczeniu łyżki przedniej.','Obrót podczas napełniania.','Ruch nad kabiną pojazdu.','Odjazd bez złożenia podpór.'],criteria:['ustawienie i podpory','dwa cykle','płynność','symulacja załadunku','obserwacja strefy','zakończenie'],followups:['Po co rozstawiasz podpory?','Dlaczego nie obracasz podczas napełniania łyżki?','Co sprawdzasz przed złożeniem podpór?']
    },
    {
      id:'tech:backhoes:2',title:'Wykop jamisty z odkładem',
      technical:'Wykonaj wykop jamisty w dwóch cyklach pracy, odkładając urobek na odkład.',
      human:'Dwa razy wykop grunt z jednego miejsca i odłóż go w wyznaczone, bezpieczne miejsce obok wykopu.',
      steps:['Sprawdź miejsce i wyznacz strefę odkładu.','Ustaw oraz ustabilizuj koparkoładowarkę.','Wykonaj pierwszy cykl kopania.','Obróć się po napełnieniu łyżki i odłóż urobek.','Wykonaj drugi cykl, zachowując kształt wykopu.','Uformuj odkład bez zasypywania krawędzi.','Zakończ i zabezpiecz maszynę.'],
      errors:['Odkład przy samej krawędzi.','Nierówne ustawienie na podporach.','Szarpanie osprzętem.','Tworzenie nawisu.'],criteria:['stabilizacja','dwa cykle','bezpieczny odkład','kontrola wykopu','płynność'],followups:['Dlaczego odkład musi być odsunięty od krawędzi?','Co grozi przy nierównym rozstawieniu podpór?']
    },
    {
      id:'tech:backhoes:3',title:'Wykop wąskoprzestrzenny',
      technical:'Wykonaj fragment wykopu wąskoprzestrzennego z poziomym dnem długości około 2 m i głębokości około 0,5 m, metodą wskazaną przez egzaminatora, w dwóch cyklach.',
      human:'Zrób krótki i wąski rów: około dwa metry długości, pół metra głębokości i równe dno. Sposób ustawienia poda egzaminator.',
      steps:['Sprawdź oznaczenie, grunt i instalacje.','Ustaw maszynę i prawidłowo rozstaw podpory.','Wyznacz wzrokowo wymiary wykopu.','Pierwszym cyklem rozpocznij wykop.','Odłóż grunt z dala od krawędzi.','Drugim cyklem wydłuż wykop i wyrównaj dno.','Skontroluj efekt oraz zakończ pracę.'],
      errors:['Podpora w niestabilnym miejscu.','Urobek przy krawędzi.','Nierówne dno.','Brak kontroli wymiarów.'],criteria:['podpory','wymiary','poziome dno','dwa cykle','bezpieczny odkład'],followups:['Jak dobierasz miejsce pod podpory?','Jak kontrolujesz poziom dna?']
    },
    {
      id:'tech:backhoes:4',title:'Nabranie i transport, potem przygotowanie do kopania',
      technical:'Wykonaj jeden cykl nabierania urobku łyżką ładowarkową z transportem na odkład, a następnie przygotuj maszynę do wykonania wykopu.',
      human:'Przednią łyżką nabierz materiał, przewieź go na odkład i wysyp. Potem przestaw maszynę z trybu ładowarki do bezpiecznego trybu koparki.',
      steps:['Sprawdź trasę i ustaw łyżkę do nabierania.','Nabierz materiał bez buksowania i przeciążania.','Ustaw łyżkę w bezpiecznej pozycji transportowej.','Przewieź materiał powoli na odkład i wysyp.','Przejedź na stanowisko kopania.','Zaciągnij hamulec, neutral, rozstaw podpory i ustabilizuj łyżką przednią.','Obróć fotel, sprawdź strefę i przygotuj sterowanie koparkowe.'],
      errors:['Jazda z wysoko podniesioną pełną łyżką.','Gwałtowne skręcanie z ładunkiem.','Rozstawienie podpór bez sprawdzenia podłoża.','Zapomnienie o neutralnym położeniu skrzyni.'],criteria:['nabranie','pozycja transportowa','bezpieczny przejazd','wysyp','pełne przygotowanie do kopania'],followups:['Dlaczego pełną łyżkę przewozisz nisko?','Jakie czynności wykonujesz przed obrotem fotela?']
    },
    {
      id:'tech:backhoes:5',title:'Dwa cykle ładowarką na odkład',
      technical:'Wykonaj dwa cykle nabierania urobku do łyżki ładowarki z transportem na odkład.',
      human:'Dwa razy nabierz grunt przednią łyżką, przewieź go i wysyp na wskazanym odkładzie.',
      steps:['Sprawdź trasę, odkład i osoby w strefie.','Podjedź prostopadle do pryzmy z łyżką przy podłożu.','Nabierz pierwszy ładunek i odchyl łyżkę.','Przewieź go nisko i wysyp na odkładzie.','Wróć bezpiecznie do pryzmy.','Wykonaj drugi pełny cykl.','Zaparkuj i opuść osprzęt.'],
      errors:['Nabieranie przy skręconych kołach.','Jazda z łyżką wysoko.','Buksowanie i gwałtowne ruchy.','Wysyp podczas jazdy bokiem.'],criteria:['dwa cykle','pełna łyżka','niska pozycja transportowa','bezpieczna trasa','płynność'],followups:['Jak ustawiasz maszynę względem pryzmy?','Jaka jest bezpieczna pozycja łyżki w transporcie?']
    },
    {
      id:'tech:backhoes:6',title:'Odspajanie płaskie',
      technical:'Zademonstruj osprzętem ładowarkowym odspajanie płaskie gruntu na długości około 2 m i głębokości około 10 cm.',
      human:'Przednią łyżką zetnij równą, cienką warstwę ziemi: mniej więcej dwa metry długości i dziesięć centymetrów głębokości.',
      steps:['Ustaw maszynę na wprost odcinka.','Ustaw kąt łyżki do płaskiego skrawania.','Opuść lemiesz na planowaną głębokość.','Jedź powoli i utrzymuj stałą głębokość na około 2 m.','Napełniaj łyżkę bez nurkowania i falowania.','Zakończ skrawanie, odchyl łyżkę i zatrzymaj.','Skontroluj równomierność powierzchni.'],
      errors:['Zbyt stromy kąt łyżki.','Głębokie wbicie i zatrzymanie maszyny.','Falowanie łyżką.','Skręt podczas skrawania.'],criteria:['około 2 m','około 10 cm','równomierna warstwa','stały kąt','płynny przejazd'],followups:['Co powoduje zbyt stromy kąt łyżki?','Jak utrzymujesz stałą głębokość?']
    },
    {
      id:'tech:backhoes:7',title:'Wyrównanie terenu przy jeździe do tyłu',
      technical:'Wyrównaj teren osprzętem ładowarkowym na odcinku około 5 m podczas jazdy do tyłu, wykorzystując dostępne funkcje maszyny.',
      human:'Cofając około pięciu metrów, użyj przedniej łyżki jak równiarki i wygładź podłoże.',
      steps:['Sprawdź przestrzeń za maszyną i działanie alarmu cofania.','Ustaw łyżkę w pozycji do równania przy cofaniu.','Rozpocznij powolną jazdę do tyłu.','Utrzymuj stały kąt i nacisk łyżki.','Koryguj wysokość małymi ruchami, obserwując powierzchnię i otoczenie.','Przejedź około 5 m.','Zatrzymaj się, oceń równość i opuść osprzęt.'],
      errors:['Cofanie bez obserwacji strefy.','Zbyt mocny docisk i nabieranie gruntu.','Gwałtowne korekty łyżki.','Jazda zbyt szybko.'],criteria:['bezpieczne cofanie','około 5 m','równa powierzchnia','płynne korekty','kontrola otoczenia'],followups:['Co sprawdzasz przed rozpoczęciem cofania?','Jak unikniesz fal na wyrównywanej powierzchni?']
    },
    {
      id:'tech:backhoes:8',title:'Dwa cykle z symulacją załadunku ładowarką',
      technical:'Wykonaj dwa cykle nabierania urobku do łyżki ładowarki z symulacją załadunku na środek transportu.',
      human:'Dwa razy nabierz materiał przednią łyżką i wykonaj bezpieczny podjazd oraz wysyp tak, jakbyś ładował samochód.',
      steps:['Sprawdź ustawienie pryzmy, pojazdu i trasę.','Nabierz pierwszy ładunek prostopadle do pryzmy.','Cofnij z łyżką nisko, potem podjedź prosto do boku pojazdu.','Podnieś łyżkę dopiero przy pojeździe i zasymuluj wysyp bez uderzenia.','Opuść łyżkę przed odjazdem.','Wykonaj drugi pełny cykl.','Zakończ z osprzętem na podłożu.'],
      errors:['Jazda z wysoko podniesioną łyżką.','Podnoszenie lub wysyp podczas gwałtownego skrętu.','Uderzenie łyżką w burtę.','Przebywanie kierowcy w kabinie lub strefie zagrożenia.'],criteria:['dwa cykle','bezpieczne nabieranie','niski transport','kontrolowany podjazd','symulacja wysypu','zakończenie'],followups:['Kiedy podnosisz łyżkę do wysokości burty?','Kto może przebywać w kabinie pojazdu podczas załadunku?']
    }
  ]
};
