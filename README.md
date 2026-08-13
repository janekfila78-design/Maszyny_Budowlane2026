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
