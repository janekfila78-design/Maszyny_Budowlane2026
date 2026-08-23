# Hotfix 6.3.3

Przyczyną była krucha kolejność operacji: `markHomePlan('tech')` wykonywało się dopiero po pełnym zakończeniu `setTechStatus()`. Jeżeli wewnętrzne ponowne renderowanie zadania nie kończyło się prawidłowo, zapis ukończenia planu był pomijany. Dodatkowo zapis opierał się wyłącznie na bieżącym `activeMachine`.

Naprawa:
- moduł jest zapamiętywany w chwili uruchomienia zadania technologicznego,
- plan dnia jest zapisywany pod kluczem konkretnego modułu,
- oznaczenie wykonania jest w bloku `finally`, więc nie zostanie pominięte.
