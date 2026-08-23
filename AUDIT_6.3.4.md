# Audyt hotfixu 6.3.4

Poprzednia poprawka opierała się na podmianie globalnej funkcji `setTechStatus` po załadowaniu modułów. W praktyce wywołanie z przycisku mogło nadal trafić do pierwotnego wiązania funkcji, więc zapis planu dnia nie był gwarantowany.

W 6.3.4 zapis przeniesiono bezpośrednio do `academy.js`, do funkcji wykonującej zmianę statusu zadania. Nie ma już zależności od wrappera. Zaliczenie następuje tylko wtedy, gdy zadanie uruchomiono z kafelka planu dnia.
