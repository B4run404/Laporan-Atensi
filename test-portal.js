/**
 * ==============================================================================
 * AUTOMATED E2E TEST SUITE FOR SIMAP PORTAL
 * Lapas Kelas IIB Tanjung Pati
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const PORTAL_FILE = path.join(__dirname, 'portal-operasional-tanjung-pati.html');

console.log('==============================================================================');
console.log('⚡ STARTING AUTOMATED TEST SUITE FOR SIMAP PORTAL');
console.log('==============================================================================\n');

let passCount = 0;
let failCount = 0;

function assertTest(description, condition, details = '') {
  if (condition) {
    console.log(`  ✅ PASSED: ${description}`);
    passCount++;
  } else {
    console.error(`  ❌ FAILED: ${description} ${details ? `(${details})` : ''}`);
    failCount++;
  }
}

// 1. FILE EXISTENCE & SYNTAX VERIFICATION
console.log('📌 Test Suite 1: File Existence & Core Structure');
const fileExists = fs.existsSync(PORTAL_FILE);
assertTest('File portal-operasional-tanjung-pati.html exists', fileExists);

if (!fileExists) {
  console.error('CRITICAL: Cannot find portal HTML file. Aborting tests.');
  process.exit(1);
}

const htmlContent = fs.readFileSync(PORTAL_FILE, 'utf8');
assertTest('HTML document contains DOCTYPE and valid closing tags', htmlContent.startsWith('<!DOCTYPE html>') && htmlContent.includes('</html>'));
assertTest('Includes Tailwind CSS CDN', htmlContent.includes('cdn.tailwindcss.com'));
assertTest('Includes Supabase JS Client CDN', htmlContent.includes('@supabase/supabase-js'));
assertTest('Includes Chart.js CDN', htmlContent.includes('chart.js'));

// 2. AUTH GUARD TEST
console.log('\n📌 Test Suite 2: Auth Guard & Security Rules');
const hasAuthGuardScript = htmlContent.includes("sessionStorage.getItem('SIMAP_LOGGED_IN')") && htmlContent.includes("window.location.replace('index.html')");
assertTest('Auth Guard script checks SIMAP_LOGGED_IN and redirects unauthorized users', hasAuthGuardScript);

// 3. NAVIGATION & TAB VIEWS
console.log('\n📌 Test Suite 3: Sidebar & Tab Views Navigation');
const requiredTabs = ['dashboard', 'atensi', 'piket', 'humas', 'database', 'history'];
requiredTabs.forEach(tab => {
  const hasNavBtn = htmlContent.includes(`id="nav-${tab}"`);
  const hasBotNavBtn = htmlContent.includes(`id="botnav-${tab}"`);
  const hasViewDiv = htmlContent.includes(`id="view-${tab}"`);
  assertTest(`Tab '${tab}' has sidebar button, bottom nav button, and view container`, hasNavBtn && hasBotNavBtn && hasViewDiv);
});

// 4. FORM ELEMENTS & LIVE PREVIEWS
console.log('\n📌 Test Suite 4: Form Inputs & Real-time Previews');
const requiredInputs = [
  'at_kegiatan', 'at_tanggal', 'at_jam', 'at_tempat',
  'at_uraian', 'at_pelaksana', 'at_kota', 'at_nama_kepala', 'at_nip'
];
requiredInputs.forEach(inputId => {
  assertTest(`Input element '#${inputId}' exists in Form Atensi`, htmlContent.includes(`id="${inputId}"`));
});

assertTest("WhatsApp Live Preview container '#atensi-live-preview' exists", htmlContent.includes('id="atensi-live-preview"'));
assertTest("Copy WhatsApp Button '#btn-copy-atensi' exists", htmlContent.includes('id="btn-copy-atensi"'));
assertTest("Piket Output Textarea '#pk-output-box' exists", htmlContent.includes('id="pk-output-box"'));

// 4B. HUMAS & PRESS RELEASE GENERATOR TESTS
console.log('\n📌 Test Suite 4B: Humas AI Press Release Generator');
const humasInputs = ['hm_judul', 'hm_kategori', 'hm_waktu', 'hm_tanggal', 'hm_lokasi', 'hm_pejabat', 'hm_poin', 'hm_quote'];
humasInputs.forEach(inputId => {
  assertTest(`Humas Form element '#${inputId}' exists`, htmlContent.includes(`id="${inputId}"`));
});

assertTest("Humas Press Release News Output '#hm-news-output' exists", htmlContent.includes('id="hm-news-output"'));
assertTest("Humas Instagram Caption Output '#hm-caption-output' exists", htmlContent.includes('id="hm-caption-output"'));
assertTest("Humas WhatsApp Broadcast Output '#hm-wa-output' exists", htmlContent.includes('id="hm-wa-output"'));
assertTest("JS Function 'generateHumasNews()' exists", htmlContent.includes('function generateHumasNews()'));

// 5. LOCAL STORAGE & OFFLINE FALLBACK
console.log('\n📌 Test Suite 5: Local Storage & Offline Storage Logic');
const hasLocalStorageLogic = htmlContent.includes('localStorage.getItem') && htmlContent.includes('localStorage.setItem');
assertTest('Application contains LocalStorage fallback logic for offline state', hasLocalStorageLogic);

// SUMMARY REPORT
console.log('\n==============================================================================');
console.log(`📊 TEST SUITE SUMMARY RESULT:`);
console.log(`   - Total Passed : ${passCount}`);
console.log(`   - Total Failed : ${failCount}`);
console.log(`   - Status       : ${failCount === 0 ? '🟢 ALL TESTS PASSED SUCCESSFULLY!' : '🔴 SOME TESTS FAILED!'}`);
console.log('==============================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
