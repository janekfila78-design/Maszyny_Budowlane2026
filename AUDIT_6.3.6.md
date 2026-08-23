# Audyt 6.3.6 — plan dnia / technologia

## Przyczyna
Mechanizm zaliczania technologii był rozdzielony między `academy.js` i `enhancements.js` oraz oparty na globalnym znaczniku modułu. Było to kruche i trudne do zweryfikowania.

## Naprawa
`setTechStatus()` pobiera `activeMachine` w chwili kliknięcia i zapisuje plan bezpośrednio do:

- `udt_home_plan_v621_excavators`
- `udt_home_plan_v621_backhoes`

Zapis ustawia `tech: true` i zachowuje pozostałe pola planu. Nie korzysta z wrapperów ani zmiennych globalnych.

## Kontrola
- składnia wszystkich plików JavaScript sprawdzona przez `node --check`,
- cache PWA oraz parametry wersji podbite do 6.3.6,
- usunięto kod diagnostyczny 6.3.5.
