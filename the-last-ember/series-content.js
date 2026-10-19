/* Approved series metadata and the four book positions.
   - description: leave "" until the owner approves a draft (see /content-drafts/the-last-ember-series-description.md).
   - Only verified fields are filled in. cover:"" means no official book cover has been supplied yet.
   - position: reading-order position; null = awaiting owner confirmation. Source of truth for spoiler levels is archive/spoilers.js. */
window.LE_SERIES = {
  title: "The Last Ember",
  description: "",
  books: [
    { id: "origins", position: 1, title: "Origins", titleOnManuscript: "Introducing The last Ember: Origins",
      cover: "", coverAlt: "", summary: "", status: "", positionStatus: "Book 1 — stated by the owner",
      sources: ["The_Undead_Nightmare_Origins.pdf (68 pp.)"] },
    { id: "born-to-survive", position: 2, title: "Born to Survive", titleOnManuscript: "Introducing The Undead Nightmare Born to survive",
      cover: "", coverAlt: "", summary: "", status: "", positionStatus: "Book 2 — stated by the owner",
      note: "The manuscript title page still carries the former series name; the book title was not changed.",
      sources: ["The_Undead_Nightmare_Born_to_survive__3_.pdf (75 pp.)"] },
    { id: "be-aware", position: null, title: "Be Aware", titleOnManuscript: "(no title page; title taken from the file name)",
      cover: "", coverAlt: "", summary: "", status: "", positionStatus: "Reading-order position awaiting owner confirmation",
      sources: ["the_undead_nightmare_Be_Aware.pdf (31 pp.)"] },
    { id: "reserved", position: 4, title: "", titleOnManuscript: "", cover: "", coverAlt: "", summary: "", status: "",
      positionStatus: "Reserved — no information supplied", reserved: true, sources: [] }
  ]
};
