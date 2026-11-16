/* ------------------------------------------------------------------
   EXAM ARCHIVE — the Science Olympiad page builds itself from this list.

   TO ADD AN EXAM
   1. On GitHub, open this file and click the pencil icon to edit it.
   2. Copy one { ... } block below, paste it at the TOP of the list
      (newest first), and fill it in.
   3. Commit. The site updates in a minute or two.

   FIELDS
     invitational  Name of the tournament, e.g. "Rickards Invitational"
     event         "Chemistry Lab", "Forensics", ... Each distinct event
                   automatically becomes a filter button, so spell an
                   event the same way every time.
     division      "B" or "C"
     season        e.g. "2026–27"
     exam          Link to the exam. Leave "" until it is released and the
                   row will say "Not released yet".
     key           Link to the answer key. Optional; leave "" to hide it.
     note          Optional short note, e.g. "Co-written" or "Hybrid format".
     example       Set to true only on the placeholder rows below.
                   Delete those rows once you have real ones.

   LINKS
     Either paste a full address ("https://...") or upload the PDF to the
     exams/ folder in this repository and write its path, e.g.
     "exams/rickards-2026-chem-lab-c.pdf".

   Every block needs a comma after its closing }.
------------------------------------------------------------------- */

window.EXAMS = [
  {
    invitational: "Invitational name",
    event: "Chemistry Lab",
    division: "C",
    season: "Season",
    exam: "",
    key: "",
    note: "",
    example: true,
  },
  {
    invitational: "Invitational name",
    event: "Forensics",
    division: "C",
    season: "Season",
    exam: "",
    key: "",
    note: "",
    example: true,
  },
  {
    invitational: "Invitational name",
    event: "Chemistry Lab",
    division: "B",
    season: "Season",
    exam: "",
    key: "",
    note: "",
    example: true,
  },
];
