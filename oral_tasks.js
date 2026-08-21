const ORAL_TASKS={
  "excavators": [
    {
      "id": "oral:excavators:1",
      "title": "Akumulator elektryczny",
      "prompt": "Wykonaj obsługę akumulatora w ramach obsługi codziennej.",
      "steps": [
        "Zabezpiecz maszynę i wyłącz odbiorniki.",
        "Wskaż akumulator, sprawdź mocowanie i obudowę.",
        "Skontroluj klemy, zaciski i przewody.",
        "Przy usterce nie uruchamiaj maszyny i zgłoś ją."
      ],
      "answer": "Sprawdzam zamocowanie, szczelność obudowy, stan zacisków, przewodów oraz — jeżeli akumulator jest obsługowy — poziom elektrolitu zgodnie z instrukcją.",
      "trap": "Nie zwieraj biegunów narzędziem i nie odłączaj akumulatora przy pracującym silniku."
    },
    {
      "id": "oral:excavators:2",
      "title": "Olej hydrauliczny",
      "prompt": "Sprawdź i w razie potrzeby uzupełnij poziom oleju hydraulicznego.",
      "steps": [
        "Ustaw maszynę poziomo i osprzęt zgodnie z instrukcją.",
        "Wskaż zbiornik oraz wziernik albo bagnet.",
        "Odczytaj poziom i sprawdź szczelność.",
        "Uzupełnij właściwym olejem bez przekraczania maksimum."
      ],
      "answer": "Najpierw ustawiam maszynę w położeniu wymaganym przez producenta, ponieważ położenie siłowników wpływa na odczyt. Poziom i rodzaj oleju potwierdzam w instrukcji.",
      "trap": "Nie otwieraj układu pod ciśnieniem i nie mieszaj przypadkowych olejów."
    },
    {
      "id": "oral:excavators:3",
      "title": "Układ roboczy przed pracą",
      "prompt": "Wykonaj podstawowe czynności obsługi codziennej układu roboczego.",
      "steps": [
        "Opuść i odciąż osprzęt.",
        "Sprawdź wysięgnik, ramię, łyżkę i szybkozłącze.",
        "Skontroluj sworznie, zabezpieczenia, siłowniki i przewody.",
        "Po uruchomieniu wykonaj powolną próbę funkcji."
      ],
      "answer": "Układ roboczy sprawdzam konstrukcyjnie, mechanicznie, hydraulicznie i funkcjonalnie. Brak zabezpieczenia albo wyciek oznacza zakaz pracy.",
      "trap": "Nie wchodź pod podniesiony osprzęt i nie szukaj wycieku dłonią."
    },
    {
      "id": "oral:excavators:4",
      "title": "Układ chłodzenia",
      "prompt": "Sprawdź poziom płynu chłodniczego i omów jego uzupełnianie.",
      "steps": [
        "Kontroluj na zimnym lub ostudzonym silniku.",
        "Wskaż zbiornik wyrównawczy i oznaczenia.",
        "Sprawdź poziom, przewody, opaski i chłodnicę.",
        "Uzupełnij właściwym płynem po ostygnięciu."
      ],
      "answer": "Gorącego układu nie otwieram z powodu ciśnienia i ryzyka poparzenia. Spadek poziomu może oznaczać nieszczelność.",
      "trap": "Nie odkręcaj korka gorącej chłodnicy i nie dolewaj zimnej cieczy do przegrzanego silnika."
    },
    {
      "id": "oral:excavators:5",
      "title": "Podwozie i układ jezdny",
      "prompt": "Wykonaj obsługę codzienną podwozia i układu jezdnego.",
      "steps": [
        "Unieruchom maszynę na stabilnym podłożu.",
        "Sprawdź ramę, osie albo elementy podwozia gąsienicowego.",
        "Skontroluj mocowania, zużycie i wycieki.",
        "Usuń kamienie, drut i inne ciała obce."
      ],
      "answer": "Podwozie kontroluję pod kątem kompletności, mocowania, zużycia, szczelności i obecności ciał obcych.",
      "trap": "Nie pomijaj wewnętrznych stron kół lub gąsienic ani wycieków przy piastach i zwolnicach."
    },
    {
      "id": "oral:excavators:6",
      "title": "Olej silnikowy",
      "prompt": "Sprawdź poziom oleju silnikowego i omów jego uzupełnianie.",
      "steps": [
        "Ustaw maszynę poziomo i wyłącz silnik.",
        "Odczekaj czas wymagany przez producenta.",
        "Wyjmij, wytrzyj i ponownie włóż bagnet.",
        "Odczytaj poziom i uzupełniaj małymi porcjami."
      ],
      "answer": "Poziom powinien znajdować się między MIN i MAX. Zbyt niski i zbyt wysoki poziom są nieprawidłowe.",
      "trap": "Nie mierz na pochyłości, nie przepełniaj i nie zgaduj specyfikacji oleju."
    },
    {
      "id": "oral:excavators:7",
      "title": "Zwolnice",
      "prompt": "Sprawdź poziom oleju w zwolnicach i wskaż właściwy sposób uzupełniania.",
      "steps": [
        "Ustaw zwolnicę w pozycji kontrolnej z instrukcji.",
        "Oczyść okolice korka.",
        "Sprawdź poziom przy otworze kontrolnym.",
        "Uzupełnij właściwym olejem przekładniowym."
      ],
      "answer": "Położenie zwolnicy, poziom oraz rodzaj oleju odczytuję z instrukcji konkretnej maszyny.",
      "trap": "Nie pomyl korka kontrolnego ze spustowym i nie zabrudź wnętrza."
    },
    {
      "id": "oral:excavators:8",
      "title": "Filtr powietrza",
      "prompt": "Sprawdź czystość filtra powietrza i omów reakcję na kontrolkę zabrudzenia.",
      "steps": [
        "Bezpiecznie zatrzymaj i wyłącz silnik.",
        "Sprawdź wskaźnik oraz szczelność dolotu.",
        "Wyjmij wkład bez zabrudzenia przewodu.",
        "Czyść tylko metodą dopuszczoną przez producenta albo wymień."
      ],
      "answer": "Uszkodzony, mokry lub nadmiernie zabrudzony wkład wymieniam. Nie uruchamiam silnika bez filtra.",
      "trap": "Nie uderzaj wkładem i nie przedmuchuj go z bliska przypadkowym wysokim ciśnieniem."
    },
    {
      "id": "oral:excavators:9",
      "title": "Narzędzie robocze",
      "prompt": "Sprawdź stan zamontowanego narzędzia roboczego.",
      "steps": [
        "Opuść i odciąż narzędzie.",
        "Sprawdź łyżkę, zęby, lemiesz i elementy zużywalne.",
        "Skontroluj sworznie, tuleje i zabezpieczenia.",
        "Sprawdź zamknięcie szybkozłącza i wykonaj próbę zapięcia."
      ],
      "answer": "Brak zabezpieczenia sworznia albo niepełne zamknięcie szybkozłącza oznacza zakaz pracy.",
      "trap": "Nie ograniczaj kontroli wyłącznie do zębów łyżki."
    },
    {
      "id": "oral:excavators:10",
      "title": "Wskaźniki płynów",
      "prompt": "Wskaż miejsca kontroli płynów eksploatacyjnych.",
      "steps": [
        "Wskaż bagnet i wlew oleju silnikowego.",
        "Wskaż chłodziwo oraz olej hydrauliczny.",
        "Wskaż paliwo i inne płyny występujące w tym modelu.",
        "Nazwy oraz wartości potwierdź w instrukcji."
      ],
      "answer": "Wskazuję wyłącznie elementy faktycznie występujące w egzaminowanej maszynie, zamiast wymyślać zbiornik, którego nie ma.",
      "trap": "Nie myl zbiorników i nie odpowiadaj bez fizycznego wskazania elementu."
    },
    {
      "id": "oral:excavators:11",
      "title": "Transport na innym środku",
      "prompt": "Przygotuj maszynę do transportu na lawecie lub naczepie.",
      "steps": [
        "Sprawdź masę, gabaryty i nośność środka transportu.",
        "Złóż oraz zablokuj osprzęt i przegub/obrotnicę.",
        "Wjedź powoli po osi najazdów z sygnalistą.",
        "Opuść osprzęt, wyłącz silnik i zamocuj w punktach transportowych."
      ],
      "answer": "Sposób blokowania i punkty mocowania muszą wynikać z instrukcji. Nie zaczepiam łańcucha za przypadkowy siłownik.",
      "trap": "Nie wjeżdżaj bokiem na najazd i nie zostawiaj osprzętu wysoko."
    },
    {
      "id": "oral:excavators:12",
      "title": "Punkty smarne",
      "prompt": "Wskaż trzy punkty smarne i omów ich obsługę.",
      "steps": [
        "Wskaż trzy rzeczywiste kalamitki.",
        "Oczyść je przed podłączeniem smarownicy.",
        "Użyj właściwego smaru i ilości z tabeli.",
        "Usuń nadmiar i sprawdź dopływ świeżego smaru."
      ],
      "answer": "Częstotliwość oraz rodzaj smaru odczytuję z tabeli smarowania konkretnej maszyny.",
      "trap": "Nie wtłaczaj brudu przez nieoczyszczoną kalamitkę i nie wchodź w strefę zgniotu."
    },
    {
      "id": "oral:excavators:13",
      "title": "Wyjście awaryjne",
      "prompt": "Wskaż wyjście awaryjne z kabiny i omów jego użycie.",
      "steps": [
        "Wskaż oznaczone okno, szybę, drzwi albo właz.",
        "Wskaż mechanizm lub młotek ewakuacyjny.",
        "Omów użycie przy zablokowanym wyjściu normalnym.",
        "Po wyjściu oddal się i wezwij pomoc."
      ],
      "answer": "Nie zakładam, że każda szyba jest wyjściem awaryjnym — potwierdzam oznaczenie i procedurę w instrukcji.",
      "trap": "Nie pomijaj odpięcia pasa i narzędzia do wybicia szyby, jeżeli występuje."
    },
    {
      "id": "oral:excavators:14",
      "title": "Paliwo z instrukcji",
      "prompt": "Odszukaj w instrukcji pojemność zbiornika i właściwy rodzaj paliwa.",
      "steps": [
        "Otwórz dane techniczne albo materiały eksploatacyjne.",
        "Odczytaj pojemność zbiornika.",
        "Odczytaj normę i rodzaj paliwa.",
        "Wskaż wlew i zasady bezpiecznego tankowania."
      ],
      "answer": "Podaję wartość dokładnie z instrukcji egzaminowanej maszyny, bez zgadywania.",
      "trap": "Nie myl paliwa z AdBlue/DEF i nie tankuj przy pracującym silniku."
    },
    {
      "id": "oral:excavators:15",
      "title": "Olej silnikowy z instrukcji",
      "prompt": "Odszukaj ilość i rodzaj oleju silnikowego w instrukcji.",
      "steps": [
        "Otwórz tabelę środków smarnych.",
        "Odczytaj pojemność z filtrem lub bez filtra.",
        "Odczytaj lepkość i normę jakości.",
        "Wyjaśnij, że przy dolewce kierujesz się bagnetem."
      ],
      "answer": "Pojemność katalogowa nie oznacza, że podczas dolewki wlewam całą tę ilość.",
      "trap": "Nie podawaj wyłącznie marki oleju i nie myl pojemności układu z ilością dolewki."
    },
    {
      "id": "oral:excavators:16",
      "title": "Oświetlenie",
      "prompt": "Sprawdź działanie oświetlenia maszyny.",
      "steps": [
        "Włącz wymagane światła i zapłon.",
        "Obejdź maszynę i sprawdź lampy z zewnątrz.",
        "Skontroluj czystość kloszy oraz mocowanie.",
        "Przy niesprawności zgłoś usterkę i nie wykonuj niebezpiecznego przejazdu."
      ],
      "answer": "Kontrolka na pulpicie nie jest wystarczającym dowodem — potwierdzam działanie lamp na zewnątrz.",
      "trap": "Nie pomijaj świateł stopu, awaryjnych, kierunkowskazów i świateł roboczych."
    },
    {
      "id": "oral:excavators:17",
      "title": "Wyposażenie bezpieczeństwa",
      "prompt": "Sprawdź kompletność wyposażenia bezpieczeństwa.",
      "steps": [
        "Sprawdź pas, lusterka/kamery, klakson i blokady.",
        "Skontroluj stopnie, poręcze, szyby i wycieraczki.",
        "Wskaż wyjście awaryjne i oznaczenia.",
        "Gaśnicę, apteczkę lub kliny oceniaj zgodnie z wyposażeniem i wymaganiami."
      ],
      "answer": "Zakres wyposażenia potwierdzam w instrukcji oraz wymaganiach miejsca pracy.",
      "trap": "Nie pomijaj pasa bezpieczeństwa i luźnych przedmiotów mogących zablokować pedały."
    },
    {
      "id": "oral:excavators:18",
      "title": "Centralne smarowanie",
      "prompt": "Wykonaj kontrolę centralnego układu smarowania albo punktów ręcznych.",
      "steps": [
        "Sprawdź poziom i rodzaj smaru.",
        "Skontroluj przewody, rozdzielacze i komunikaty.",
        "Uruchom cykl testowy, jeżeli instrukcja pozwala.",
        "Potwierdź, że smar faktycznie dociera do punktów."
      ],
      "answer": "Centralny układ nie zwalnia operatora z kontroli rzeczywistego dopływu smaru.",
      "trap": "Nie ignoruj zerwanego przewodu i nie używaj przypadkowego smaru."
    },
    {
      "id": "oral:excavators:19",
      "title": "Bezpieczniki",
      "prompt": "Wskaż skrzynkę bezpiecznikową i omów wymianę bezpiecznika oświetlenia roboczego.",
      "steps": [
        "Wyłącz zapłon i odbiornik.",
        "Odszukaj obwód na schemacie lub pokrywie.",
        "Usuń przyczynę przepalenia.",
        "Wymień na identyczny typ i amperaż, potem sprawdź działanie."
      ],
      "answer": "Bezpiecznik wymieniam na ten sam typ i ten sam prąd znamionowy. Nie mostkuję go drutem.",
      "trap": "Nie zakładaj mocniejszego bezpiecznika i nie ignoruj ponownego przepalenia."
    },
    {
      "id": "oral:excavators:20",
      "title": "Gaśnica",
      "prompt": "Sprawdź stan gaśnicy i termin jej ważności.",
      "steps": [
        "Wskaż miejsce mocowania i dostęp.",
        "Sprawdź plombę, zawleczkę, manometr i zbiornik.",
        "Odczytaj termin przeglądu.",
        "Potwierdź stabilne zamocowanie."
      ],
      "answer": "Jeżeli gaśnica jest wymagana, brak ważnego i sprawnego egzemplarza wymaga uzupełnienia przed pracą.",
      "trap": "Nie uznawaj gaśnicy za sprawną tylko dlatego, że znajduje się w kabinie."
    },
    {
      "id": "oral:excavators:21",
      "title": "Układ roboczy po pracy",
      "prompt": "Wykonaj obsługę układu roboczego bezpośrednio po pracy.",
      "steps": [
        "Opuść osprzęt, wyłącz silnik i zredukuj ciśnienie.",
        "Oczyść narzędzie i okolice sworzni.",
        "Sprawdź świeże pęknięcia, wycieki i zabezpieczenia.",
        "Nasmaruj wymagane punkty i zgłoś usterki."
      ],
      "answer": "Obsługa po pracy służy wykryciu świeżych uszkodzeń i przygotowaniu maszyny do kolejnej zmiany.",
      "trap": "Nie zostawiaj osprzętu w powietrzu i nie ukrywaj wycieku pod błotem."
    },
    {
      "id": "oral:excavators:22",
      "title": "Zerowanie hydrauliki",
      "prompt": "Zademonstruj zerowanie układu hydraulicznego.",
      "steps": [
        "Opuść osprzęt i wyłącz silnik.",
        "Ustaw zapłon zgodnie z instrukcją.",
        "Poruszaj elementami sterującymi we wszystkie kierunki.",
        "Potwierdź redukcję ciśnienia przed rozłączaniem przewodów."
      ],
      "answer": "Zerowanie oznacza bezpieczne zredukowanie ciśnienia resztkowego, a nie opróżnienie zbiornika z oleju.",
      "trap": "Nie rozłączaj przewodów pod ciśnieniem i uwzględnij akumulator hydrauliczny."
    },
    {
      "id": "oral:excavators:23",
      "title": "Droga publiczna",
      "prompt": "Przygotuj maszynę do przejazdu po drodze publicznej.",
      "steps": [
        "Potwierdź dopuszczenie, dokumenty i wymagane uprawnienia.",
        "Złóż, oczyść i zablokuj osprzęt.",
        "Sprawdź hamulce, światła, kierunkowskazy, klakson i lusterka.",
        "Włącz tryb jazdy oraz blokady zgodnie z instrukcją."
      ],
      "answer": "Uprawnienia operatora nie zastępują wymagań prawa o ruchu drogowym ani ewentualnego prawa jazdy.",
      "trap": "Nie jedź z wysuniętymi podporami, brudnymi światłami albo niezablokowanym osprzętem."
    },
    {
      "id": "oral:excavators:24",
      "title": "Piktogramy",
      "prompt": "Wskaż i omów znaczenie trzech piktogramów.",
      "steps": [
        "Wskaż trzy rzeczywiste oznaczenia.",
        "Nazwij zagrożenie, zakaz lub nakaz.",
        "Wyjaśnij, gdzie występuje ryzyko.",
        "Podaj właściwe zachowanie operatora."
      ],
      "answer": "Nie tylko odczytuję symbol — wyjaśniam jego praktyczne znaczenie i sposób ograniczenia ryzyka.",
      "trap": "Nie zgaduj znaczenia i nie pomijaj wymaganej reakcji operatora."
    },
    {
      "id": "oral:excavators:25",
      "title": "Ogumienie lub napięcie gąsienic",
      "prompt": "Sprawdź stan ogumienia albo napięcie gąsienic.",
      "steps": [
        "Dla opon sprawdź ciśnienie na zimno, bieżnik, boki i obręcze.",
        "Dla gąsienic oceń zwis w miejscu wskazanym przez producenta.",
        "Skontroluj rolki, koła napędowe i napinające.",
        "Przy uszkodzeniu lub złym napięciu nie podejmuj pracy."
      ],
      "answer": "Ciśnienie i dopuszczalny zwis są parametrami konkretnej maszyny i odczytuję je z instrukcji.",
      "trap": "Nie oceniaj ciśnienia na oko i nie reguluj napinacza bez świadomości wysokiego ciśnienia smaru."
    },
    {
      "id": "oral:excavators:26",
      "title": "Przód i tył koparki",
      "prompt": "Określ przód i tył koparki oraz wykonaj kontrolę podwozia.",
      "steps": [
        "Wskaż koła napinające i napędowe.",
        "Przed jazdą oceń orientację podwozia względem kabiny.",
        "Wyjaśnij wpływ obrotu nadwozia na kierunki sterowania.",
        "Skontroluj gąsienice, rolki, koła, napięcie i wycieki."
      ],
      "answer": "Przed ruszeniem sprawdzam położenie kół napędowych, aby nie pojechać odwrotnie niż zamierzam.",
      "trap": "Nie określaj przodu na podstawie samego położenia łyżki."
    },
    {
      "id": "oral:excavators:27",
      "title": "Dwa układy silnika",
      "prompt": "Omów obsługę codzienną dwóch wybranych układów silnika.",
      "steps": [
        "Wybierz np. smarowanie i chłodzenie.",
        "Dla każdego wskaż elementy kontrolne.",
        "Omów poziom, szczelność i reakcję na usterkę.",
        "Parametry potwierdź w instrukcji."
      ],
      "answer": "Odpowiadam według jednego schematu: co kontroluję, jak kontroluję i co robię przy wyniku nieprawidłowym.",
      "trap": "Nie mieszaj elementów różnych układów."
    },
    {
      "id": "oral:excavators:28",
      "title": "Układ hydrauliczny przed pracą",
      "prompt": "Wykonaj obsługę codzienną układu hydraulicznego przed pracą.",
      "steps": [
        "Sprawdź poziom oleju.",
        "Skontroluj przewody, złącza i siłowniki.",
        "Oceń widoczne wycieki i uszkodzenia.",
        "Po uruchomieniu wykonaj powolną próbę funkcji."
      ],
      "answer": "Wycieku pod ciśnieniem nie szukam dłonią; przy nieszczelności wstrzymuję pracę.",
      "trap": "Nie rozpoczynaj próby bez kontroli strefy."
    },
    {
      "id": "oral:excavators:29",
      "title": "Kontrolka zabrudzenia filtra",
      "prompt": "Omów postępowanie po zapaleniu kontrolki zabrudzenia filtra powietrza.",
      "steps": [
        "Ogranicz obciążenie i bezpiecznie zatrzymaj maszynę.",
        "Sprawdź wskaźnik i drożność układu dolotowego.",
        "Oczyść albo wymień wkład wyłącznie zgodnie z instrukcją.",
        "Po złożeniu sprawdź szczelność i zresetuj wskaźnik, jeżeli jest wymagany."
      ],
      "answer": "Nie kontynuuję długiej pracy z kontrolką. Zatrzymuję maszynę i obsługuję filtr zgodnie z instrukcją producenta.",
      "trap": "Nie uruchamiaj silnika bez wkładu i nie przedmuchuj filtra przypadkowym wysokim ciśnieniem."
    }
  ],
  "backhoes": [
    {
      "id": "oral:backhoes:1",
      "title": "Akumulator elektryczny",
      "prompt": "Wykonaj obsługę akumulatora w ramach obsługi codziennej.",
      "steps": [
        "Zabezpiecz maszynę i wyłącz odbiorniki.",
        "Wskaż akumulator, sprawdź mocowanie i obudowę.",
        "Skontroluj klemy, zaciski i przewody.",
        "Przy usterce nie uruchamiaj maszyny i zgłoś ją."
      ],
      "answer": "Sprawdzam zamocowanie, szczelność obudowy, stan zacisków, przewodów oraz — jeżeli akumulator jest obsługowy — poziom elektrolitu zgodnie z instrukcją.",
      "trap": "Nie zwieraj biegunów narzędziem i nie odłączaj akumulatora przy pracującym silniku."
    },
    {
      "id": "oral:backhoes:2",
      "title": "Olej hydrauliczny",
      "prompt": "Sprawdź i w razie potrzeby uzupełnij poziom oleju hydraulicznego.",
      "steps": [
        "Ustaw maszynę poziomo i osprzęt zgodnie z instrukcją.",
        "Wskaż zbiornik oraz wziernik albo bagnet.",
        "Odczytaj poziom i sprawdź szczelność.",
        "Uzupełnij właściwym olejem bez przekraczania maksimum."
      ],
      "answer": "Najpierw ustawiam maszynę w położeniu wymaganym przez producenta, ponieważ położenie siłowników wpływa na odczyt. Poziom i rodzaj oleju potwierdzam w instrukcji.",
      "trap": "Nie otwieraj układu pod ciśnieniem i nie mieszaj przypadkowych olejów."
    },
    {
      "id": "oral:backhoes:3",
      "title": "Układ roboczy przed pracą",
      "prompt": "Wykonaj podstawowe czynności obsługi codziennej układu roboczego.",
      "steps": [
        "Opuść i odciąż osprzęt.",
        "Sprawdź wysięgnik, ramię, łyżkę i szybkozłącze.",
        "Skontroluj sworznie, zabezpieczenia, siłowniki i przewody.",
        "Po uruchomieniu wykonaj powolną próbę funkcji."
      ],
      "answer": "Układ roboczy sprawdzam konstrukcyjnie, mechanicznie, hydraulicznie i funkcjonalnie. Brak zabezpieczenia albo wyciek oznacza zakaz pracy.",
      "trap": "Nie wchodź pod podniesiony osprzęt i nie szukaj wycieku dłonią."
    },
    {
      "id": "oral:backhoes:4",
      "title": "Układ chłodzenia",
      "prompt": "Sprawdź poziom płynu chłodniczego i omów jego uzupełnianie.",
      "steps": [
        "Kontroluj na zimnym lub ostudzonym silniku.",
        "Wskaż zbiornik wyrównawczy i oznaczenia.",
        "Sprawdź poziom, przewody, opaski i chłodnicę.",
        "Uzupełnij właściwym płynem po ostygnięciu."
      ],
      "answer": "Gorącego układu nie otwieram z powodu ciśnienia i ryzyka poparzenia. Spadek poziomu może oznaczać nieszczelność.",
      "trap": "Nie odkręcaj korka gorącej chłodnicy i nie dolewaj zimnej cieczy do przegrzanego silnika."
    },
    {
      "id": "oral:backhoes:5",
      "title": "Podwozie i układ jezdny",
      "prompt": "Wykonaj obsługę codzienną podwozia i układu jezdnego.",
      "steps": [
        "Unieruchom maszynę na stabilnym podłożu.",
        "Sprawdź ramę, osie albo elementy podwozia gąsienicowego.",
        "Skontroluj mocowania, zużycie i wycieki.",
        "Usuń kamienie, drut i inne ciała obce."
      ],
      "answer": "Podwozie kontroluję pod kątem kompletności, mocowania, zużycia, szczelności i obecności ciał obcych.",
      "trap": "Nie pomijaj wewnętrznych stron kół lub gąsienic ani wycieków przy piastach i zwolnicach."
    },
    {
      "id": "oral:backhoes:6",
      "title": "Olej silnikowy",
      "prompt": "Sprawdź poziom oleju silnikowego i omów jego uzupełnianie.",
      "steps": [
        "Ustaw maszynę poziomo i wyłącz silnik.",
        "Odczekaj czas wymagany przez producenta.",
        "Wyjmij, wytrzyj i ponownie włóż bagnet.",
        "Odczytaj poziom i uzupełniaj małymi porcjami."
      ],
      "answer": "Poziom powinien znajdować się między MIN i MAX. Zbyt niski i zbyt wysoki poziom są nieprawidłowe.",
      "trap": "Nie mierz na pochyłości, nie przepełniaj i nie zgaduj specyfikacji oleju."
    },
    {
      "id": "oral:backhoes:7",
      "title": "Zwolnice",
      "prompt": "Sprawdź poziom oleju w zwolnicach i wskaż właściwy sposób uzupełniania.",
      "steps": [
        "Ustaw zwolnicę w pozycji kontrolnej z instrukcji.",
        "Oczyść okolice korka.",
        "Sprawdź poziom przy otworze kontrolnym.",
        "Uzupełnij właściwym olejem przekładniowym."
      ],
      "answer": "Położenie zwolnicy, poziom oraz rodzaj oleju odczytuję z instrukcji konkretnej maszyny.",
      "trap": "Nie pomyl korka kontrolnego ze spustowym i nie zabrudź wnętrza."
    },
    {
      "id": "oral:backhoes:8",
      "title": "Filtr powietrza",
      "prompt": "Sprawdź czystość filtra powietrza i omów reakcję na kontrolkę zabrudzenia.",
      "steps": [
        "Bezpiecznie zatrzymaj i wyłącz silnik.",
        "Sprawdź wskaźnik oraz szczelność dolotu.",
        "Wyjmij wkład bez zabrudzenia przewodu.",
        "Czyść tylko metodą dopuszczoną przez producenta albo wymień."
      ],
      "answer": "Uszkodzony, mokry lub nadmiernie zabrudzony wkład wymieniam. Nie uruchamiam silnika bez filtra.",
      "trap": "Nie uderzaj wkładem i nie przedmuchuj go z bliska przypadkowym wysokim ciśnieniem."
    },
    {
      "id": "oral:backhoes:9",
      "title": "Narzędzie robocze",
      "prompt": "Sprawdź stan zamontowanego narzędzia roboczego.",
      "steps": [
        "Opuść i odciąż narzędzie.",
        "Sprawdź łyżkę, zęby, lemiesz i elementy zużywalne.",
        "Skontroluj sworznie, tuleje i zabezpieczenia.",
        "Sprawdź zamknięcie szybkozłącza i wykonaj próbę zapięcia."
      ],
      "answer": "Brak zabezpieczenia sworznia albo niepełne zamknięcie szybkozłącza oznacza zakaz pracy.",
      "trap": "Nie ograniczaj kontroli wyłącznie do zębów łyżki."
    },
    {
      "id": "oral:backhoes:10",
      "title": "Wskaźniki płynów",
      "prompt": "Wskaż miejsca kontroli płynów eksploatacyjnych.",
      "steps": [
        "Wskaż bagnet i wlew oleju silnikowego.",
        "Wskaż chłodziwo oraz olej hydrauliczny.",
        "Wskaż paliwo i inne płyny występujące w tym modelu.",
        "Nazwy oraz wartości potwierdź w instrukcji."
      ],
      "answer": "Wskazuję wyłącznie elementy faktycznie występujące w egzaminowanej maszynie, zamiast wymyślać zbiornik, którego nie ma.",
      "trap": "Nie myl zbiorników i nie odpowiadaj bez fizycznego wskazania elementu."
    },
    {
      "id": "oral:backhoes:11",
      "title": "Transport na innym środku",
      "prompt": "Przygotuj maszynę do transportu na lawecie lub naczepie.",
      "steps": [
        "Sprawdź masę, gabaryty i nośność środka transportu.",
        "Złóż oraz zablokuj osprzęt i przegub/obrotnicę.",
        "Wjedź powoli po osi najazdów z sygnalistą.",
        "Opuść osprzęt, wyłącz silnik i zamocuj w punktach transportowych."
      ],
      "answer": "Sposób blokowania i punkty mocowania muszą wynikać z instrukcji. Nie zaczepiam łańcucha za przypadkowy siłownik.",
      "trap": "Nie wjeżdżaj bokiem na najazd i nie zostawiaj osprzętu wysoko."
    },
    {
      "id": "oral:backhoes:12",
      "title": "Punkty smarne",
      "prompt": "Wskaż trzy punkty smarne i omów ich obsługę.",
      "steps": [
        "Wskaż trzy rzeczywiste kalamitki.",
        "Oczyść je przed podłączeniem smarownicy.",
        "Użyj właściwego smaru i ilości z tabeli.",
        "Usuń nadmiar i sprawdź dopływ świeżego smaru."
      ],
      "answer": "Częstotliwość oraz rodzaj smaru odczytuję z tabeli smarowania konkretnej maszyny.",
      "trap": "Nie wtłaczaj brudu przez nieoczyszczoną kalamitkę i nie wchodź w strefę zgniotu."
    },
    {
      "id": "oral:backhoes:13",
      "title": "Wyjście awaryjne",
      "prompt": "Wskaż wyjście awaryjne z kabiny i omów jego użycie.",
      "steps": [
        "Wskaż oznaczone okno, szybę, drzwi albo właz.",
        "Wskaż mechanizm lub młotek ewakuacyjny.",
        "Omów użycie przy zablokowanym wyjściu normalnym.",
        "Po wyjściu oddal się i wezwij pomoc."
      ],
      "answer": "Nie zakładam, że każda szyba jest wyjściem awaryjnym — potwierdzam oznaczenie i procedurę w instrukcji.",
      "trap": "Nie pomijaj odpięcia pasa i narzędzia do wybicia szyby, jeżeli występuje."
    },
    {
      "id": "oral:backhoes:14",
      "title": "Paliwo z instrukcji",
      "prompt": "Odszukaj w instrukcji pojemność zbiornika i właściwy rodzaj paliwa.",
      "steps": [
        "Otwórz dane techniczne albo materiały eksploatacyjne.",
        "Odczytaj pojemność zbiornika.",
        "Odczytaj normę i rodzaj paliwa.",
        "Wskaż wlew i zasady bezpiecznego tankowania."
      ],
      "answer": "Podaję wartość dokładnie z instrukcji egzaminowanej maszyny, bez zgadywania.",
      "trap": "Nie myl paliwa z AdBlue/DEF i nie tankuj przy pracującym silniku."
    },
    {
      "id": "oral:backhoes:15",
      "title": "Olej silnikowy z instrukcji",
      "prompt": "Odszukaj ilość i rodzaj oleju silnikowego w instrukcji.",
      "steps": [
        "Otwórz tabelę środków smarnych.",
        "Odczytaj pojemność z filtrem lub bez filtra.",
        "Odczytaj lepkość i normę jakości.",
        "Wyjaśnij, że przy dolewce kierujesz się bagnetem."
      ],
      "answer": "Pojemność katalogowa nie oznacza, że podczas dolewki wlewam całą tę ilość.",
      "trap": "Nie podawaj wyłącznie marki oleju i nie myl pojemności układu z ilością dolewki."
    },
    {
      "id": "oral:backhoes:16",
      "title": "Oświetlenie",
      "prompt": "Sprawdź działanie oświetlenia maszyny.",
      "steps": [
        "Włącz wymagane światła i zapłon.",
        "Obejdź maszynę i sprawdź lampy z zewnątrz.",
        "Skontroluj czystość kloszy oraz mocowanie.",
        "Przy niesprawności zgłoś usterkę i nie wykonuj niebezpiecznego przejazdu."
      ],
      "answer": "Kontrolka na pulpicie nie jest wystarczającym dowodem — potwierdzam działanie lamp na zewnątrz.",
      "trap": "Nie pomijaj świateł stopu, awaryjnych, kierunkowskazów i świateł roboczych."
    },
    {
      "id": "oral:backhoes:17",
      "title": "Wyposażenie bezpieczeństwa",
      "prompt": "Sprawdź kompletność wyposażenia bezpieczeństwa.",
      "steps": [
        "Sprawdź pas, lusterka/kamery, klakson i blokady.",
        "Skontroluj stopnie, poręcze, szyby i wycieraczki.",
        "Wskaż wyjście awaryjne i oznaczenia.",
        "Gaśnicę, apteczkę lub kliny oceniaj zgodnie z wyposażeniem i wymaganiami."
      ],
      "answer": "Zakres wyposażenia potwierdzam w instrukcji oraz wymaganiach miejsca pracy.",
      "trap": "Nie pomijaj pasa bezpieczeństwa i luźnych przedmiotów mogących zablokować pedały."
    },
    {
      "id": "oral:backhoes:18",
      "title": "Centralne smarowanie",
      "prompt": "Wykonaj kontrolę centralnego układu smarowania albo punktów ręcznych.",
      "steps": [
        "Sprawdź poziom i rodzaj smaru.",
        "Skontroluj przewody, rozdzielacze i komunikaty.",
        "Uruchom cykl testowy, jeżeli instrukcja pozwala.",
        "Potwierdź, że smar faktycznie dociera do punktów."
      ],
      "answer": "Centralny układ nie zwalnia operatora z kontroli rzeczywistego dopływu smaru.",
      "trap": "Nie ignoruj zerwanego przewodu i nie używaj przypadkowego smaru."
    },
    {
      "id": "oral:backhoes:19",
      "title": "Bezpieczniki",
      "prompt": "Wskaż skrzynkę bezpiecznikową i omów wymianę bezpiecznika oświetlenia roboczego.",
      "steps": [
        "Wyłącz zapłon i odbiornik.",
        "Odszukaj obwód na schemacie lub pokrywie.",
        "Usuń przyczynę przepalenia.",
        "Wymień na identyczny typ i amperaż, potem sprawdź działanie."
      ],
      "answer": "Bezpiecznik wymieniam na ten sam typ i ten sam prąd znamionowy. Nie mostkuję go drutem.",
      "trap": "Nie zakładaj mocniejszego bezpiecznika i nie ignoruj ponownego przepalenia."
    },
    {
      "id": "oral:backhoes:20",
      "title": "Gaśnica",
      "prompt": "Sprawdź stan gaśnicy i termin jej ważności.",
      "steps": [
        "Wskaż miejsce mocowania i dostęp.",
        "Sprawdź plombę, zawleczkę, manometr i zbiornik.",
        "Odczytaj termin przeglądu.",
        "Potwierdź stabilne zamocowanie."
      ],
      "answer": "Jeżeli gaśnica jest wymagana, brak ważnego i sprawnego egzemplarza wymaga uzupełnienia przed pracą.",
      "trap": "Nie uznawaj gaśnicy za sprawną tylko dlatego, że znajduje się w kabinie."
    },
    {
      "id": "oral:backhoes:21",
      "title": "Układ roboczy po pracy",
      "prompt": "Wykonaj obsługę układu roboczego bezpośrednio po pracy.",
      "steps": [
        "Opuść osprzęt, wyłącz silnik i zredukuj ciśnienie.",
        "Oczyść narzędzie i okolice sworzni.",
        "Sprawdź świeże pęknięcia, wycieki i zabezpieczenia.",
        "Nasmaruj wymagane punkty i zgłoś usterki."
      ],
      "answer": "Obsługa po pracy służy wykryciu świeżych uszkodzeń i przygotowaniu maszyny do kolejnej zmiany.",
      "trap": "Nie zostawiaj osprzętu w powietrzu i nie ukrywaj wycieku pod błotem."
    },
    {
      "id": "oral:backhoes:22",
      "title": "Zerowanie hydrauliki",
      "prompt": "Zademonstruj zerowanie układu hydraulicznego.",
      "steps": [
        "Opuść osprzęt i wyłącz silnik.",
        "Ustaw zapłon zgodnie z instrukcją.",
        "Poruszaj elementami sterującymi we wszystkie kierunki.",
        "Potwierdź redukcję ciśnienia przed rozłączaniem przewodów."
      ],
      "answer": "Zerowanie oznacza bezpieczne zredukowanie ciśnienia resztkowego, a nie opróżnienie zbiornika z oleju.",
      "trap": "Nie rozłączaj przewodów pod ciśnieniem i uwzględnij akumulator hydrauliczny."
    },
    {
      "id": "oral:backhoes:23",
      "title": "Droga publiczna",
      "prompt": "Przygotuj maszynę do przejazdu po drodze publicznej.",
      "steps": [
        "Potwierdź dopuszczenie, dokumenty i wymagane uprawnienia.",
        "Złóż, oczyść i zablokuj osprzęt.",
        "Sprawdź hamulce, światła, kierunkowskazy, klakson i lusterka.",
        "Włącz tryb jazdy oraz blokady zgodnie z instrukcją."
      ],
      "answer": "Uprawnienia operatora nie zastępują wymagań prawa o ruchu drogowym ani ewentualnego prawa jazdy.",
      "trap": "Nie jedź z wysuniętymi podporami, brudnymi światłami albo niezablokowanym osprzętem."
    },
    {
      "id": "oral:backhoes:24",
      "title": "Piktogramy",
      "prompt": "Wskaż i omów znaczenie trzech piktogramów.",
      "steps": [
        "Wskaż trzy rzeczywiste oznaczenia.",
        "Nazwij zagrożenie, zakaz lub nakaz.",
        "Wyjaśnij, gdzie występuje ryzyko.",
        "Podaj właściwe zachowanie operatora."
      ],
      "answer": "Nie tylko odczytuję symbol — wyjaśniam jego praktyczne znaczenie i sposób ograniczenia ryzyka.",
      "trap": "Nie zgaduj znaczenia i nie pomijaj wymaganej reakcji operatora."
    },
    {
      "id": "oral:backhoes:25",
      "title": "Alarm cofania",
      "prompt": "Sprawdź działanie alarmu cofania i omów postępowanie przy niesprawności.",
      "steps": [
        "Sprawdź, czy maszyna jest w niego wyposażona.",
        "Upewnij się, że za maszyną nikogo nie ma.",
        "Włącz bezpiecznie kierunek wsteczny i oceń sygnał.",
        "Przy niesprawności wstrzymaj pracę i zgłoś usterkę."
      ],
      "answer": "Niesprawny element bezpieczeństwa oznacza brak gotowości maszyny do pracy.",
      "trap": "Nie wybieraj wstecznego bez sprawdzenia strefy i nie uznawaj kontrolki za dowód działania sygnału."
    },
    {
      "id": "oral:backhoes:26",
      "title": "Olej w skrzyni biegów",
      "prompt": "Sprawdź poziom oleju w skrzyni biegów z wiarygodnym odczytem.",
      "steps": [
        "Odczytaj w instrukcji wymaganą temperaturę i stan silnika.",
        "Ustaw maszynę poziomo i hamulec postojowy.",
        "Wykonaj sekwencję przełożeń, jeżeli jest wymagana.",
        "Odczytaj właściwą skalę HOT/COLD i uzupełnij właściwym olejem."
      ],
      "answer": "Wiarygodny odczyt zależy od temperatury, pracy silnika i dokładnej procedury producenta.",
      "trap": "Nie traktuj skrzyni jak miski olejowej silnika i nie używaj złej skali."
    },
    {
      "id": "oral:backhoes:27",
      "title": "Stan ogumienia",
      "prompt": "Sprawdź stan ogumienia koparkoładowarki.",
      "steps": [
        "Sprawdź ciśnienie na zimno.",
        "Oceń bieżnik, boki, wentyle i obręcze.",
        "Skontroluj śruby kół i zgodność opon na osi.",
        "Przy wybrzuszeniu, kordzie lub poważnym uszkodzeniu nie jedź."
      ],
      "answer": "Ciśnienie odczytuję z instrukcji; nie oceniam go wyłącznie wzrokowo.",
      "trap": "Nie stój przed zaworem i nie dotykaj przegrzanej opony."
    },
    {
      "id": "oral:backhoes:28",
      "title": "Dwa układy silnika",
      "prompt": "Omów obsługę codzienną dwóch wybranych układów silnika.",
      "steps": [
        "Wybierz np. smarowanie i chłodzenie.",
        "Wskaż elementy kontrolne.",
        "Omów poziom, szczelność i reakcję na usterkę.",
        "Parametry potwierdź w instrukcji."
      ],
      "answer": "Odpowiadam według jednego schematu: co kontroluję, jak kontroluję i co robię przy wyniku nieprawidłowym.",
      "trap": "Nie mieszaj elementów różnych układów."
    },
    {
      "id": "oral:backhoes:29",
      "title": "Układ hydrauliczny przed pracą",
      "prompt": "Wykonaj obsługę codzienną układu hydraulicznego przed pracą.",
      "steps": [
        "Sprawdź poziom oleju.",
        "Skontroluj przewody, złącza i siłowniki.",
        "Oceń wycieki i uszkodzenia.",
        "Po uruchomieniu wykonaj powolną próbę funkcji."
      ],
      "answer": "Wycieku pod ciśnieniem nie szukam dłonią; przy nieszczelności wstrzymuję pracę.",
      "trap": "Nie rozpoczynaj próby bez kontroli strefy."
    },
    {
      "id": "oral:backhoes:30",
      "title": "Kontrolka zabrudzenia filtra",
      "prompt": "Omów postępowanie po zapaleniu kontrolki zabrudzenia filtra powietrza.",
      "steps": [
        "Ogranicz obciążenie i bezpiecznie zatrzymaj maszynę.",
        "Sprawdź wskaźnik i drożność układu dolotowego.",
        "Oczyść albo wymień wkład wyłącznie zgodnie z instrukcją.",
        "Po złożeniu sprawdź szczelność i zresetuj wskaźnik, jeżeli jest wymagany."
      ],
      "answer": "Nie kontynuuję długiej pracy z kontrolką. Zatrzymuję maszynę i obsługuję filtr zgodnie z instrukcją producenta.",
      "trap": "Nie uruchamiaj silnika bez wkładu i nie przedmuchuj filtra przypadkowym wysokim ciśnieniem."
    }
  ]
};
