# UDT Trainer 5.2.0 Multi

Wersja 5.2.0 dodaje **Asystenta Nauki**.

Najważniejsze zmiany:
- automatyczne krótkie wyjaśnienie po błędnej odpowiedzi,
- przycisk „Dlaczego?” także po poprawnej odpowiedzi,
- rozwijane: wyjaśnienie, wskazówka „Zapamiętaj” i typowa pułapka,
- po 3 błędach pytanie jest oznaczane jako powracające,
- po 5 błędach jest oznaczane jako priorytetowa słabość,
- integracja z istniejącym treningiem słabości i SRS,
- wszystko działa lokalnie i offline,
- cache PWA: `udt-trainer-5.2.0-learning-assistant`.

Jeżeli pytanie w bazie ma własne pola `explanation`, `memoryTip` lub `commonMistake`, aplikacja użyje ich. W przeciwnym razie tworzy lokalne wyjaśnienie na podstawie treści pytania i poprawnej odpowiedzi.
