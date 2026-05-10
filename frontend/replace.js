const fs = require('fs');
const path = require('path');

const files = [
    "src/actions/auth.ts",
    "src/actions/restaurant.ts",
    "src/app/bookings/page.tsx",
    "src/app/bookings/[id]/page.tsx",
    "src/app/map/page.tsx",
    "src/app/owner/layout.tsx",
    "src/app/owner/page.tsx",
    "src/app/owner/chat/page.tsx",
    "src/app/owner/menu/page.tsx",
    "src/app/owner/promotions/page.tsx",
    "src/app/owner/reservations/page.tsx",
    "src/app/profile/history/page.tsx",
    "src/app/saved/page.tsx",
    "src/components/BookingModal.tsx",
    "src/context/SocketContext.tsx"
];

for (const relPath of files) {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) {
        console.log("File not found:", fullPath);
        continue;
    }
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Replace single quotes
    content = content.replace(/'http:\/\/localhost:3001([^']*)'/g, '`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3001\'}$1`');
    
    // Replace backticks
    content = content.replace(/`http:\/\/localhost:3001([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3001\'}$1`');
    
    // Replace double quotes
    content = content.replace(/"http:\/\/localhost:3001([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3001\'}$1`');

    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log("Updated", relPath);
}
