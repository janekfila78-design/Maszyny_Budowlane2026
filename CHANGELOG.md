# Changelog

## 6.3.0 — Inteligentne wyjaśnienia

- dodano automatyczne rozpoznawanie typu pytania: element maszyny, zasada działania, BHP, technologia i eksploatacja,
- wyjaśnienia opisują teraz funkcję elementu, mechanizm, zagrożenie, kolejność robót albo skutek błędnej eksploatacji,
- dodano bazę funkcji najczęstszych podzespołów maszyn,
- odpowiedzi błędne są odrzucane z konkretnym uzasadnieniem zamiast uniwersalnego szablonu,
- zaktualizowano diagnostykę, wersję i cache PWA.

# CHANGELOG

## 6.2.1 — Poprawka zakresu modułu

- Mentor, plan dnia, gotowość i słabe działy analizują wyłącznie aktywną maszynę.
- „Kontynuuj naukę” i trening działu nie przełączają już samoczynnie na koparkoładowarkę.
- Dane Akademii są zapisywane osobno dla koparki i koparkoładowarki.
- Treningi praktyczne niedostępne w danym module pokazują komunikat zamiast zmieniać moduł.

## 6.2.0 Stable 2

### Naprawiono
- Diagnostyka sprawdza elementy nowego Centrum Dowodzenia zamiast usuniętych pól starego dashboardu (`dSeen`, `dAccuracy`).
- Test interfejsu powinien ponownie zwracać 8/8.


## 6.2.0 Stable 1

### Naprawiono
- usunięto konflikt dwóch ekranów Start;
- stary `coachHero` z wersji 5.6.0 nie jest już wstrzykiwany do Dashboardu;
- Centrum Dowodzenia pozostaje widoczne po zakończeniu inicjalizacji;
- ujednolicono numer wersji w nagłówku, stopce i diagnostyce;
- środkowy przycisk dolnej nawigacji korzysta z inteligentnego `Kontynuuj naukę`;
- odświeżono identyfikator cache PWA.

## 6.2.0 Hotfix 2

- dodano `reset.html` do jednorazowego usunięcia starego Service Workera i cache,
- HTML, JavaScript i CSS są pobierane w strategii network-first,
- dodano wersjonowanie adresów zasobów, aby Samsung Browser nie uruchamiał starego `app.js`,
- rejestracja Service Workera omija pamięć HTTP.

# Changelog

## 6.2.0 Hotfix 1

### Naprawiono
- awarię `updateDashboard()` po zastąpieniu starego panelu nowym ekranem Start,
- bezpieczną aktualizację opcjonalnych elementów interfejsu,
- niespójny numer wersji w diagnostyce,
- wymuszenie odświeżenia cache PWA.

## 6.2.0 — Centrum dowodzenia

- Ekran Start stał się głównym centrum aplikacji.
- Dodano duży wskaźnik gotowości, inteligentny przycisk kontynuacji, plan dnia, serię, ostatni postęp, osiągnięcie i komunikat Mentora.
- Plan dnia zapisuje wykonanie teorii, zadania ustnego, technologii i pięciu rund gry.
- Pozostałe funkcje przeniesiono do sekcji „Więcej opcji”.

## 6.2.0
### Dodano
- aktywny plan dnia Mentora,
- historię gotowości do egzaminu i zmianę względem poprzedniego dnia,
- duży przycisk „Kontynuuj naukę”,
- klikalne słabe działy uruchamiające dopasowany trening.

### Zmieniono
- wskaźnik gotowości jest większy i oznaczony kolorem,
- sekcja „O co tu chodzi?” zawsze pokazuje zasadę, przykład i pułapkę,
- powody odrzucenia błędnych odpowiedzi są zależne od tematu pytania,
- wersję aplikacji i cache PWA do 6.2.0.

## 6.1.0
### Dodano
- wspólnego Mentora dla ABC, obsługi, technologii, gier i egzaminów próbnych,
- wskaźnik gotowości do egzaminu,
- automatyczny plan nauki i analizę słabych działów,
- rozbudowane wyjaśnienia „O co tu chodzi?”.

### Zmieniono
- przycisk „Dlaczego?” prowadzi do pełnego wyjaśnienia zasady,
- wersję aplikacji i cache PWA do 6.1.0,
- README z historią projektu od wersji 1.0.
