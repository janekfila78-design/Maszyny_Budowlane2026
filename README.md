# UDT Trainer 5.3.0 Multi

Wersja 5.3.0 porządkuje **SRS i pipeline obsługi odpowiedzi** bez usuwania funkcji Asystenta Nauki.

Najważniejsze zmiany:
- jeden kanoniczny SRS w `state.stats` (`srsLevel`, `due`, `lastAttempt`),
- automatyczna migracja starego `state.srs` ze wszystkich modułów bez kasowania postępu,
- dashboard, inteligentne powtórki i statystyki korzystają z tego samego źródła SRS,
- `choose()` nie jest już wielokrotnie nadpisywane przez dodatki; efekty odpowiedzi korzystają ze wspólnego pipeline `addAnswerEffect()`,
- pomiar czasu odpowiedzi i Asystent Nauki zostały podpięte do wspólnego pipeline,
- zachowane: wyjaśnienia, słabości, PWA/offline, synchronizacja i pozostałe funkcje 5.2,
- cache PWA: `udt-trainer-5.3.0-srs-refactor`.

Jeżeli pytanie w bazie ma własne pola `explanation`, `memoryTip` lub `commonMistake`, aplikacja użyje ich. W przeciwnym razie tworzy lokalne wyjaśnienie na podstawie treści pytania i poprawnej odpowiedzi.


## 5.4.0 — trening odpowiedzi ustnej
- osobny tryb egzaminu obsługowego dla koparki jednonaczyniowej kl. I i koparkoładowarki kl. III,
- 29 i 30 kart poleceń obsługowych,
- schemat odpowiedzi: warunki → wskazanie → kontrola → reakcja → instrukcja,
- samoocena czterostopniowa podpięta do wspólnego `state.stats` i SRS.


## 5.5.0 — trener głosowy i symulator praktyczny
- nagrywanie odpowiedzi z mikrofonu i lokalne odtwarzanie,
- transkrypcja po polsku przez Web Speech API (gdy obsługiwana),
- lokalna analiza kompletności odpowiedzi według rubryki zadania,
- punktacja 0–100%, lista wykrytych i brakujących elementów,
- automatyczne pytanie uzupełniające w trybie pełnej symulacji,
- sugerowana ocena zapisywana w istniejącym SRS.

Nagrania nie są wysyłane przez aplikację na własny serwer. Automatyczna transkrypcja zależy od implementacji przeglądarki/systemu.
