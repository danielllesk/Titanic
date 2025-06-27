const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mindee = require("mindee");
const dotenv = require("dotenv");
const axios = require('axios');
const cheerio = require('cheerio');
const { parse } = require('csv-parse/sync');
const xlsx = require('xlsx');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(fileUpload({ useTempFiles: true }));

// Check if Mindee API key is available
const mindeeApiKey = process.env.MINDEE_KEY;
if (!mindeeApiKey) {
    console.warn("⚠️  MINDEE_KEY not found in environment variables. Resume parsing will not work.");
    console.warn("   Get your free API key from: https://platform.mindee.com/");
}

const mindeeClient = mindeeApiKey ? new mindee.Client({apiKey: mindeeApiKey}) : null;

app.post("/parse-resume", async (req, res) => {
    const file = req.files?.resume;
    if(!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if file is PDF
    if (!file.mimetype.includes('pdf')) {
        return res.status(400).json({ error: "Only PDF files are supported" });
    }

    if (!mindeeClient) {
        console.log("Mindee client not available, providing fallback response");
        // Provide fallback keywords based on common resume terms
        const fallbackKeywords = [
            "leadership", "communication", "teamwork", "problem solving", 
            "project management", "research", "analysis", "writing", 
            "Microsoft Office", "data analysis", "customer service"
        ];
        
        return res.json({ 
            keywords: fallbackKeywords,
            workExperience: [],
            education: [],
            contactInfo: {},
            skills: fallbackKeywords,
            rawData: {},
            message: "Resume parsed with fallback keywords (Mindee API not configured)"
        });
    }

    try {
        console.log("Processing resume with Mindee API...");
        const input = mindeeClient.docFromBuffer(file.data, { filename: file.name });
        const response = await mindeeClient.enqueueAndParse(mindee.product.ResumeV1, input);
        const doc = response.document;

        console.log("Mindee response received:", JSON.stringify(doc.inference?.prediction, null, 2));

        // Extract comprehensive information from Mindee ResumeV1 response
        const skills = doc.inference?.prediction?.skills?.map(skill => skill.name) || [];
        const jobTitles = doc.inference?.prediction?.work_experiences?.map(exp => exp.job_title) || [];
        const educationFields = doc.inference?.prediction?.educations?.map(edu => edu.degree) || [];
        const organizations = doc.inference?.prediction?.work_experiences?.map(exp => exp.organization) || [];
        const educationInstitutions = doc.inference?.prediction?.educations?.map(edu => edu.organization) || [];

        // Combine and deduplicate keywords
        const keywords = Array.from(new Set([
            ...skills,
            ...jobTitles,
            ...educationFields,
            ...organizations,
            ...educationInstitutions
        ].filter(Boolean)));

        console.log("Extracted keywords:", keywords);

        // If no keywords found, provide fallback
        if (keywords.length === 0) {
            console.log("No keywords extracted, using fallback");
            const fallbackKeywords = [
                "leadership", "communication", "teamwork", "problem solving", 
                "project management", "research", "analysis", "writing", 
                "Microsoft Office", "data analysis", "customer service"
            ];
            keywords.push(...fallbackKeywords);
        }

        // Extract additional details for summary
        const workExperience = doc.inference?.prediction?.work_experiences?.map(exp => ({
            jobTitle: exp.job_title,
            organization: exp.organization,
            startDate: exp.start_date,
            endDate: exp.end_date,
            description: exp.description
        })) || [];

        const education = doc.inference?.prediction?.educations?.map(edu => ({
            degree: edu.degree,
            organization: edu.organization,
            startDate: edu.start_date,
            endDate: edu.end_date,
            grade: edu.grade
        })) || [];

        const contactInfo = {
            name: doc.inference?.prediction?.name?.first_name + ' ' + doc.inference?.prediction?.name?.last_name,
            email: doc.inference?.prediction?.emails?.[0] || '',
            phone: doc.inference?.prediction?.phone_numbers?.[0] || '',
            location: doc.inference?.prediction?.locations?.[0] || ''
        };

        const responseData = { 
            keywords,
            workExperience,
            education,
            contactInfo,
            skills: skills,
            rawData: doc.inference?.prediction || {}
        };

        console.log("Sending response:", JSON.stringify(responseData, null, 2));
        res.json(responseData);
    } catch (error) {
        console.error("Mindee API error:", error);
        
        // Provide fallback response on error
        const fallbackKeywords = [
            "leadership", "communication", "teamwork", "problem solving", 
            "project management", "research", "analysis", "writing", 
            "Microsoft Office", "data analysis", "customer service"
        ];
        
        res.json({ 
            keywords: fallbackKeywords,
            workExperience: [],
            education: [],
            contactInfo: {},
            skills: fallbackKeywords,
            rawData: {},
            error: "Failed to parse resume with Mindee API, using fallback keywords"
        });
    }
});

app.post("/find-scholarships", async (req, res) => {
    const { personalInfo, keywords } = req.body;
    // Combine all keywords and relevant personal info fields for the search query
    const searchTerms = [
        ...(keywords || []),
        personalInfo?.province,
        personalInfo?.study,
        personalInfo?.education
    ].filter(Boolean).join(' ');
    const query = searchTerms || 'scholarship';
    try {
        // Query the CKAN API for Canadian open data on scholarships
        const url = `https://open.canada.ca/data/api/action/package_search?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url);
        const results = (data.result && data.result.results) ? data.result.results : [];
        let allScholarships = [];
        // Define filter keywords
        const filterKeywords = ['2025', '2024', 'student', 'scholarship', 'bursary'];
        const province = personalInfo?.province?.toLowerCase();
        const study = personalInfo?.study?.toLowerCase();
        const education = personalInfo?.education?.toLowerCase();
        for (const dataset of results) {
            const datasetText = (dataset.title + ' ' + (dataset.notes || '')).toLowerCase();
            if (!filterKeywords.some(k => datasetText.includes(k))) continue;
            if (dataset.resources && dataset.resources.length > 0) {
                for (const resource of dataset.resources) {
                    const format = resource.format?.toLowerCase();
                    const resourceText = ((resource.name || '') + ' ' + (resource.description || '')).toLowerCase();
                    if (!filterKeywords.some(k => resourceText.includes(k))) continue;
                    if (format === 'csv') {
                        try {
                            console.log('Attempting to download CSV:', resource.url);
                            const fileRes = await axios.get(resource.url, { responseType: 'arraybuffer' });
                            const csvText = fileRes.data.toString('utf8');
                            const records = parse(csvText, { columns: true, skip_empty_lines: true });
                            // For each row, check if any field matches province, study, or education
                            for (const row of records) {
                                const rowText = JSON.stringify(row).toLowerCase();
                                if (
                                    (province && rowText.includes(province)) ||
                                    (study && rowText.includes(study)) ||
                                    (education && rowText.includes(education))
                                ) {
                                    // Map to best-guess fields
                                    const name = row['Scholarship Name'] || row['Name'] || row['Program Name'] || row['Title'] || row['Award Name'] || row['Scholarship'] || row['scholarship_name'] || row['scholarship'] || row['name'] || '';
                                    const description = row['Description'] || row['description'] || row['Notes'] || row['notes'] || '';
                                    const amount = row['Amount'] || row['amount'] || row['Value'] || row['value'] || '';
                                    const deadline = row['Deadline'] || row['deadline'] || row['Date to Apply'] || row['date_to_apply'] || '';
                                    const link = row['Link'] || row['URL'] || row['url'] || row['Website'] || row['website'] || '';
                                    if (name && link) {
                                        allScholarships.push({ name, description, amount, deadline, link });
                                    }
                                }
                            }
                        } catch (fileErr) {
                            console.log('Failed to download/parse CSV:', resource.url, fileErr.message);
                            continue;
                        }
                    }
                }
            }
        }
        if (allScholarships.length > 0) {
            res.json({ scholarships: allScholarships });
            return;
        }
        // Otherwise, return the dataset metadata as before
        const fallback = results.map(item => ({
            title: item.title,
            organization: item.organization ? item.organization.title : '',
            notes: item.notes,
            url: item.url,
            resources: item.resources ? item.resources.map(r => ({ name: r.name, url: r.url, format: r.format })) : []
        }));
        res.json({ scholarships: fallback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch scholarships from open.canada.ca.' });
    }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});