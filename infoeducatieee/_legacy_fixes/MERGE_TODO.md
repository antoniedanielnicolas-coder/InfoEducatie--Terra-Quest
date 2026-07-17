# Fisiere puse in carantina — de revizuit manual

Aceste fisiere aveau nume care sugereaza patch-uri temporare
(fix.js, fix_shop.js, fix_i18n_temp.js, debug.js, coaching_temp.html).
Codul lor NU a fost sters, doar mutat aici, pentru ca nu putem sti automat
daca logica lor a fost deja integrata in fisierele principale (app.js,
games.js, i18n.js etc.) sau daca inca e nevoie de ea.

## Ce trebuie sa faci pentru fiecare fisier:
1. Deschide fisierul si vezi ce face.
2. Verifica daca acea logica exista deja in fisierul "oficial" corespunzator
   (ex: fix_shop.js -> probabil in games.js sau app.js).
3. Daca lipseste ceva important, muta acea bucata de cod in fisierul oficial,
   cu un comentariu clar despre ce rezolva.
4. Daca era doar un test/debug care nu mai e relevant, sterge fisierul din
   acest folder.
5. Dupa ce ai terminat, sterge tot folderul _legacy_fixes/.

Scopul: la depunerea proiectului, sa nu mai existe fisiere cu nume de tipul
"fix_*" sau "temp" — un evaluator care le vede intelege ca proiectul are
petice nefinalizate.
