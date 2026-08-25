# Audyt 6.3.9 — Mentor: mieszanie pytań działowych

## Zakres
- kontrola składni wszystkich plików JavaScript,
- kontrola odwołań do lokalnych plików w `index.html` i Service Workerze,
- kontrola liczebności baz i powtarzających się identyfikatorów,
- przegląd Planu dnia, przycisku kontynuacji i treningu słabych działów.

## Zmiana
Trening po kliknięciu słabego działu nie zwraca już w kółko identycznej ósemki. Sesja składa się w przybliżeniu z:
- 75% pytań o najwyższym priorytecie (błędy, niska skuteczność),
- 25% innych pytań z tego samego działu.

Aplikacja pamięta ostatnie 40 pytań pokazanych dla danego działu i modułu, więc w miarę dostępności unika natychmiastowych powtórek. Kolejność pytań jest mieszana. Przy małym dziale pytania mogą się powtarzać — to zamierzony fallback, aby zawsze uruchomić sesję.

## Bez zmian przed egzaminem
Nie dodano daty egzaminu, prognoz ani nowych ekranów. Plan dnia i istniejące dane użytkownika pozostają kompatybilne.
