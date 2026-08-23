# UDT Trainer 6.3.7 — poprawka pierwszego zadania Planu dnia

- Usunięto diagnostyczne okno technologii z wcześniejszej ścieżki.
- Pierwszy kafelek „8 pytań” zapisuje znacznik sesji w `sessionStorage`.
- Po pełnym ukończeniu 8 pytań `finish()` zapisuje bezpośrednio `theory: true` pod kluczem właściwego modułu.
- Zwykłe sesje spoza Planu dnia nie zaliczają kafelka.
- Usunięto zawodny wrapper `window.finish`, który mógł być omijany przez wewnętrzne wywołanie `finish(true)`.
