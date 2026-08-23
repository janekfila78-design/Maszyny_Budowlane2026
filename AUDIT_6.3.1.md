# Audyt UDT Trainer 6.3.1

## Zakres

- składnia wszystkich plików JavaScript,
- spójność planu dnia i Mentora,
- zapis ukończenia teorii, obsługi, technologii i gier,
- lokalne daty, serie nauki i historię gotowości,
- cache PWA i wymuszanie aktualizacji,
- integralność czterech baz pytań,
- obecność plików wskazanych w `index.html`.

## Naprawione problemy

1. Kafelek planu dnia deklarował 8 pytań, ale Mentor uruchamiał 10.
2. Szczegółowy plan Mentora pokazywał 5 lub 8 pytań, lecz niezależnie od etykiety uruchamiał 10.
3. Dowolna zakończona sesja, nawet bardzo krótka, mogła zaliczyć teorię w planie dnia.
4. Przy braku wykrytego słabego działu kafelek „8 pytań ABC” otwierał ogólny formularz zamiast uruchomić właściwą sesję.
5. Plan dnia, historia gotowości, aktywność i seria korzystały z daty UTC. W Polsce po północy mogły przez około dwie godziny przypisywać aktywność do poprzedniego dnia.
6. Podbito wersję i klucz cache PWA, aby urządzenie pobrało poprawione pliki.

## Kontrole zakończone pomyślnie

- Wszystkie pliki `.js` przechodzą `node --check`.
- Żurawie: 949 pytań, 949 unikalnych identyfikatorów.
- Koparki: 402 pytania, 402 unikalne identyfikatory.
- Koparkoładowarki: 385 pytań, 385 unikalnych identyfikatorów.
- Ładowarki: 362 pytania, 362 unikalne identyfikatory.
- Brak nieprawidłowych indeksów poprawnych odpowiedzi.
- Każde `correctText` zgadza się z odpowiedzią wskazaną przez `correct`.
- Brak brakujących lokalnych plików podpiętych w `index.html`.

## Zachowanie po poprawce

- Plan dnia uruchamia dokładnie 8 pytań teorii.
- Teoria świeci na zielono dopiero po ukończeniu pełnej sesji mającej co najmniej 8 pytań.
- Obsługa zalicza się po ocenie jednego zadania.
- Technologia zalicza się po oznaczeniu statusu zadania.
- Gry zaliczają się po pięciu rozegranych rundach.
