const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Configure Multer for PDF uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'assets/pdfs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Use the original name or a specific name passed in body
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Helper to update the manuals map
function updateManualsMap() {
    const pdfsDir = path.join(__dirname, 'assets/pdfs');
    if (!fs.existsSync(pdfsDir)) return;

    const files = fs.readdirSync(pdfsDir).filter(f => f.endsWith('.pdf'));

    let content = 'export const manualsMap = {\n';
    files.forEach(file => {
        content += `  "${file}": require("../../assets/pdfs/${file}"),\n`;
    });
    content += '};\n';

    fs.writeFileSync(path.join(__dirname, 'src/data/manuals_map.js'), content);
    console.log('Updated manuals_map.js');
}

// Routes
app.get('/api/manuals', (req, res) => {
    const manualsPath = path.join(__dirname, 'src/data/manuals.json');
    const manuals = JSON.parse(fs.readFileSync(manualsPath, 'utf8'));

    // Check which PDFs exist
    const pdfsDir = path.join(__dirname, 'assets/pdfs');
    const existingFiles = fs.existsSync(pdfsDir) ? fs.readdirSync(pdfsDir) : [];

    const data = manuals.map(m => ({
        ...m,
        uploaded: existingFiles.includes(m.file)
    }));

    res.json(data);
});

app.post('/api/upload', upload.single('pdf'), (req, res) => {
    updateManualsMap();
    res.json({ success: true });
});

app.post('/api/build', (req, res) => {
    console.log('Starting build process...');

    // 1. Prebuild (Generate Android folder)
    const buildCmd = 'npx expo prebuild -p android --no-interactive && cd android && ./gradlew assembleRelease';

    const process = exec(buildCmd, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Build error: ${error}`);
            return;
        }
        console.log(`Build stdout: ${stdout}`);
    });

    // We respond immediately to say build started, as it takes a long time
    // In a real app, we'd use websockets to stream logs
    res.json({ success: true, message: "Build started in background. Check terminal for progress." });

    process.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    process.stderr.on('data', (data) => {
        console.error(data.toString());
    });
});

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    updateManualsMap(); // Initial run
    const open = (await import('open')).default;
    open(`http://localhost:${PORT}`);
});
