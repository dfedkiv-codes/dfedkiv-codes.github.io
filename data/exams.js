/* ------------------------------------------------------------------
   EXAM ARCHIVE — the Science Olympiad page builds itself from this file.

   TO ADD AN EXAM
   1. On GitHub, open this file and click the pencil icon to edit it.
   2. Copy one line from the EXAMS list, paste it anywhere in the list,
      and fill it in. Order does not matter: the page sorts by season
      (newest first) and groups the exams for you.
   3. Commit. The site updates in a minute or two.

   FIELDS
     season        e.g. "2026–27". Exams are grouped under this.
     invitational  Name of the tournament, e.g. "Rickards Invitational"
     event         "Chemistry Lab", "Forensics", "Protein Modeling", ...
                   Spell an event the same way every time.
     division      "B" or "C"
     exam          Link to the exam. Leave "" until it is released and the
                   row will say "Not released yet".
     key           Link to the answer key. Optional; leave "" to hide it.
     note          Optional short note, e.g. "Co-written".
     date          Optional, "2026-10-31". Only used to order exams within
                   a season (latest first).
     example       true marks a placeholder row. Delete the placeholder
                   rows once you have real ones.

   LINKS
     Either paste a full address ("https://...") or upload the PDF to the
     exams/ folder in this repository and write its path, e.g.
     "exams/rickards-2026-chem-lab-c.pdf".

   Every line needs a comma at the end.
------------------------------------------------------------------- */

/* The events you write, in the order their filter buttons should appear.
   Each one keeps its colour for as long as it keeps its place in this list,
   so add new events at the end. An event used below but missing here still
   works; it is simply added after these. */
window.EVENTS = [
  "Chemistry Lab",
  "Forensics",
  "Protein Modeling",
  "Materials Science",
];

window.EXAMS = [
  { season: "2026–27", invitational: "UC Riverside", event: "Protein Modeling",    division: "C", folder: ""},
  { season: "2026–27", invitational: "Virginia Tech", event: "Protein Modeling",    division: "C", folder: ""},
  { season: "2026–27", invitational: "Yellow Jacket", event: "Chemistry Lab",    division: "C", folder: ""},
  { season: "2026–27", invitational: "University of North Texas", event: "Experimental Design",    division: "B", folder: ""},
  { season: "2026–27", invitational: "University of North Texas", event: "Crime Busters",    division: "B", folder: ""},
  { season: "2026–27", invitational: "Los Altos Satellite", event: "Chemistry Lab",    division: "C", folder: ""},
  { season: "2026–27", invitational: "GullSO", event: "Chemistry Lab",    division: "C", folder: ""},
  { season: "2026–27", invitational: "GullSO", event: "Fermi Questions",    division: "C", folder: ""},
  { season: "2026–27", invitational: "Lakeland Highschool", event: "Chemistry Lab",    division: "C", folder: ""},
  { season: "2026–27", invitational: "Boyceville Satellite", event: "Chemistry Lab",    division: "C", folder: ""},
  { season: "2026–27", invitational: "BullsSO Satellite", event: "Chemistry Lab",    division: "C", folder: ""},
  { season: "2026–27", invitational: "Rickards Satellite", event: "Chemistry Lab",        division: "C", folder: ""},
  { season: "2026–27", invitational: "Rickards Satellite", event: "Forensics", division: "C", exam: "", folder: ""},
  { season: "2026–27", invitational: "Rickards Satellite", event: "Materials Science", division: "C", folder: ""},
  { season: "2025-26", invitational: "FAUHS Placement Exam", event: "Chemistry Lab",    division: "C", exam: "https://drive.google.com/file/d/1s2syBees_mFu-72zTYFl6LaK0noh1hdI/view?usp=sharing", key: "", note: "" },
  { season: "2025-26", invitational: "FAUHS Placement Exam", event: "Forensics",    division: "C", exam: "https://drive.google.com/file/d/1V4KJYVSaQHtQCjMxgU5bnl3ZYhRQ3SVs/view?usp=sharing", key: "", note: "" },
  { season: "2025-26", invitational: "FAUHS Placement Exam", event: "Materials Science",    division: "C", exam: "https://drive.google.com/file/d/1lZDFpm0t6IudnSw8y5rsXmmFPDYlrypY/view?usp=sharing", key: "", note: "" },
];
