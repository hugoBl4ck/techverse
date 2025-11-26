import { generatePixPayload } from './src/lib/pixGenerator.js';

console.log('--- Debugging Invalid Payload Reproduction ---');

// Scenario 1: Normal generation with user's data
const normalPayload = generatePixPayload(
    '8e04405b-3956-4186-a784-837378857da8',
    0,
    'HUGO LEONARDO',
    'SAO PAULO',
    'BR.COM.PAGSEGURO',
    '',
    '05409000'
);
console.log('Normal Payload:', normalPayload);

// Scenario 2: User entered a pre-encoded key?
// The invalid payload had '0014br.gov.bcb.brcode' as the key value (Tag 01 inside 26)
const weirdKey = '0014br.gov.bcb.brcode02368e04405b-3956-4186-a784-837378857da8';
const weirdKeyPayload = generatePixPayload(
    weirdKey,
    0,
    'HUGO LEONARDO',
    'SAO PAULO',
    'BR.COM.PAGSEGURO',
    '',
    '05409000'
);
console.log('Weird Key Payload:', weirdKeyPayload);

// Scenario 3: Double Encoding?
// What if generatePixPayload is called recursively or the result is encoded again?
// The invalid payload starts with '2687...' which implies the header '000201' is missing.
// And '26' is the first tag.
// If we strip '000201' from normal payload?
console.log('Normal starts with 000201?', normalPayload.startsWith('000201'));

// Check if the invalid payload matches a part of the normal payload
const invalidPayloadStart = '268700180014br.gov.bcb.pix01210014br.gov.bcb.brcode';
if (normalPayload.includes(invalidPayloadStart)) {
    console.log('✅ Invalid payload is a SUBSTRING of normal payload!');
} else {
    console.log('❌ Invalid payload is NOT found in normal payload.');
}

// Check specific field 26 content
function getTagValue(payload, targetTag) {
    let i = 0;
    while (i < payload.length) {
        const tag = payload.substr(i, 2);
        const lenStr = payload.substr(i + 2, 2);
        const len = parseInt(lenStr, 10);
        const val = payload.substr(i + 4, len);
        if (tag === targetTag) return val;
        i += 4 + len;
    }
    return null;
}

const field26 = getTagValue(normalPayload, '26');
console.log('Field 26 Content:', field26);

// Compare with invalid payload's field 26 content (reconstructed from '2687...')
// 26 87 -> Content is the next 87 chars.
const invalidContent = '00180014br.gov.bcb.pix01210014br.gov.bcb.brcode02368e04405b-3956-4186-a784-837378857da8';
console.log('Invalid 26 Content:', invalidContent);

if (field26 === invalidContent) {
    console.log('✅ Field 26 matches exactly!');
} else {
    console.log('❌ Field 26 does NOT match.');
    console.log('   Expected:', field26);
    console.log('   Got:     ', invalidContent);
}
