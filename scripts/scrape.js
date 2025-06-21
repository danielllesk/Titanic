import fetch from "node-fetch";
import cheerio from "cheerio";
import { program } from "commander";

program
    .requiredOption("-l, --keywords <items>", "comma-separated list")
    .parse()
const KEYWORDS = program.keywords.split(",").map(s => s.trim().toLowerCase());

const SOURCES = [
    "https://www.scholarshipscanada.com/"
    "https://www.canada.ca/en/services/finance/educationfunding/scholarships.html"
    "https://www.nserc-crsng.gc.ca/Students-Etudiants/UG-PC/index_eng.asp"
    "https://studentawards.com/"
]