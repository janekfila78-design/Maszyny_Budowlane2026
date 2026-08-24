# Audyt 6.3.8 — stabilny Plan dnia

## Rzeczywista przyczyna
Pierwszy kafelek Planu dnia nie przechowywał wybranego działu. Przy każdym renderowaniu dashboardu dział był liczony ponownie z aktualnych statystyk. Po ukończeniu ośmiu pytań najsłabszy dział mógł się zmienić, więc kafelek przesuwał cel na kolejną kategorię i wyglądał jak nieukończony.

## Poprawki
- plan zapisuje `theoryCategory` raz na dany dzień i moduł;
- pierwszy kafelek uruchamia dokładnie zamrożony dział;
- ukończenie pełnej sesji nadal ustawia `theory: true`;
- główny przycisk uruchamia pierwszy niewykonany element planu, a po 4/4 — 8 trudnych pytań;
- zmiana statystyk w trakcie dnia nie podmienia już zadania teoretycznego;
- zaktualizowano wersję i cache PWA do 6.3.8.

## Dlaczego wcześniejszy audyt tego nie wykrył
Poprzednia kontrola sprawdzała głównie składnię, integralność baz i pojedyncze ścieżki zapisu. Nie zasymulowała cyklu: utworzenie planu → trening zmieniający ranking działów → ponowny render. To była luka w audycie.
