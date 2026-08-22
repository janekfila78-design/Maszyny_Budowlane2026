# Maszyny Budowlane 2026 — UDT/WIT Trainer

Mobilna aplikacja PWA do nauki pytań teoretycznych oraz przygotowania do części praktycznej egzaminów operatorów. Działa offline i zapisuje postępy lokalnie.

## Wersja bieżąca: 6.2.1 — Poprawka zakresu modułu

### Najważniejsze funkcje
- pytania ABC dla żurawi, koparek, koparkoładowarek i ładowarek,
- wspólny model SRS i inteligentne powtórki,
- trener odpowiedzi ustnej z nagrywaniem i lokalną analizą,
- zadania obsługowe i technologiczne,
- Akademia Operatora z grami proceduralnymi,
- egzamin próbny 1:1,
- jeden wspólny Mentor dla teorii, obsługi, technologii i gier,
- rozbudowana sekcja „O co tu chodzi?” zamiast pustego „Dlaczego?”.

## Uruchomienie
Rozpakuj pliki i otwórz `index.html`. Pełne funkcje PWA, aktualizacje i mikrofon najlepiej działają przez HTTPS, np. GitHub Pages.

## Historia wersji
Historia 1.x–4.x została odtworzona z zachowanych informacji projektowych; dla części drobnych wydań nie zachował się pełny changelog.

### 1.0
- pierwsza działająca baza pytań,
- podstawowy test jednokrotnego wyboru.

### 1.x
- poprawki treści i obsługi pytań,
- pierwsze statystyki sesji.

### 2.0–2.01
- rozwój wersji paczkowej ZIP,
- kolejne poprawki interfejsu i baz pytań.

### 3.0
- przejście do samodzielnej aplikacji HTML,
- wygodniejsze uruchamianie w przeglądarce.

### 3.1
- rozbudowana lista/baza pytań i nawigacja po materiale.

### 4.0 alpha
- eksperymentalna większa przebudowa,
- wersja niestabilna; część zmian nie weszła do wydania głównego.

### 5.0–5.2
- połączenie modułów maszyn w jedną aplikację,
- PWA i tryb offline,
- statystyki, notatki, ulubione, osiągnięcia i inteligentne powtórki,
- Asystent Nauki i pierwsze wyjaśnienia odpowiedzi.

### 5.3.0 — porządkowanie SRS
- jeden kanoniczny SRS w `state.stats`,
- migracja starego modelu bez kasowania postępów,
- wspólny pipeline obsługi odpowiedzi zamiast kolejnych nakładek na `choose()`.

### 5.4.0 — trening ustny
- 29 kart obsługowych dla koparki jednonaczyniowej kl. I,
- 30 kart dla koparkoładowarki kl. III,
- schemat odpowiedzi i samoocena połączona z SRS.

### 5.5.0 — Voice AI
- nagrywanie i odtwarzanie odpowiedzi,
- transkrypcja Web Speech API,
- lokalna analiza kompletności, wynik 0–100% i pytania uzupełniające.

### 5.6.0 — Oral Examiner
- postęp zadanie X/Y,
- statusy Umiem / Ćwiczę / Do powtórki,
- losowanie, timer, statystyki i do trzech dopytań egzaminatora.

### 6.0.0 — Akademia Operatora
- siedem modułów Akademii,
- zadania technologiczne w języku technicznym i prostym,
- gry: klikana kolejność, brakujący krok, znajdź błąd i sprint,
- statystyki, osiągnięcia i egzamin 1:1.

### 6.1.0 — Mentor 2.0
- jeden Mentor analizujący wszystkie moduły ABC oraz Akademię,
- wspólny wskaźnik gotowości do egzaminu,
- słabe działy teorii i automatyczny plan dnia,
- przyciski uruchamiające zalecany trening,
- sekcja „O co tu chodzi?” z: wersją po ludzku, zasadą, technicznym wyjaśnieniem, przykładem, eliminacją odpowiedzi, pułapką i hasłem do zapamiętania,
- aktualizacja wersji oraz cache PWA.

### 6.2.0 — Aktywny Mentor
- duży, kolorystyczny wskaźnik gotowości do egzaminu,
- historia gotowości i porównanie z poprzednim dniem,
- konkretny plan dnia z liczbą pytań i zadań,
- klikalne słabe działy uruchamiające dopasowaną sesję,
- przycisk „Kontynuuj naukę” na pulpicie i ekranie Mentora,
- bardziej konkretne wyjaśnienia: zasada, przykład praktyczny, pułapka oraz powody odrzucenia odpowiedzi.

## Prywatność
Postęp i nagrania pozostają lokalnie w przeglądarce. Opcjonalna synchronizacja korzysta z prywatnego GitHub Gista skonfigurowanego przez użytkownika.

## Ważne
Aplikacja wspiera naukę, ale nie zastępuje instrukcji konkretnej maszyny, zajęć praktycznych ani oceny instruktora.
