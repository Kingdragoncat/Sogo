# HTML Email & Avatar Features

## ✨ New Features Added

### 1. **HTML Email Rendering**
- ✅ Safely renders HTML emails with DOMPurify sanitization
- ✅ Removes XSS vectors (scripts, iframes, malicious code)
- ✅ Supports rich formatting, images, tables, links
- ✅ Styled with Mythofy branding (gold links, dark theme)

### 2. **Company Logos & Avatars (BIMI Support)**
- ✅ **BIMI** (Brand Indicators for Message Identification) - verified company logos
- ✅ **Gravatar** - user avatars from gravatar.com
- ✅ **Initials fallback** - shows sender initials if no avatar
- ✅ **Verified badge** - gold shield icon for BIMI-verified senders

---

## 🔐 How It Works

### BIMI (Company Logos)
BIMI is the industry standard for verified company logos in email:

1. **DNS Lookup**: Backend queries `default._bimi.{domain}` TXT record
2. **Logo URL**: Extracts logo URL from BIMI record
3. **Display**: Shows verified company logo with gold shield badge
4. **Fallback**: If no BIMI, falls back to Gravatar or initials

**Example BIMI domains that work:**
- paypal.com
- linkedin.com
- verizon.com
- Many Fortune 500 companies

### Gravatar (User Avatars)
- Uses MD5 hash of email address
- Fetches from gravatar.com
- No badge shown (not verified)

### Initials Fallback
- Extracts first letters from name or email
- Shows in gold gradient circle
- Always displays if image fails

---

## 🎨 What You'll See

### In the Email List:
```
┌─────────────────────────────────────┐
│ [📧 Logo] Amazon Web Services       │
│           Order Confirmation         │
│           Your order has shipped...  │
│                            2h ago    │
└─────────────────────────────────────┘
```

### In the Email Viewer:
```
┌─────────────────────────────────────┐
│  [🏢 Verified Logo] ← Gold shield   │
│   Amazon Web Services               │
│   to me                             │
│   2 hours ago                       │
│                                     │
│   [Rich HTML Content Here]          │
│   • Formatted text                  │
│   • Images                          │
│   • Tables                          │
│   • Styled buttons                  │
└─────────────────────────────────────┘
```

---

## 🔧 Technical Details

### Frontend Components

#### `EmailAvatar.tsx`
- Handles avatar display logic
- Tries BIMI → Gravatar → Initials
- Shows verification badge for BIMI
- Auto-fallback on image errors

#### `HtmlEmail.tsx`
- Sanitizes HTML with DOMPurify
- Removes dangerous tags/attributes
- Makes links open in new tab
- Lazy loads images

#### `avatars.ts`
- `getAvatar()` - async, tries BIMI
- `getAvatarSync()` - sync, Gravatar only
- `getBIMILogo()` - queries backend API
- `getGravatarUrl()` - MD5 hash lookup

### Backend API

#### `/api/bimi/:domain`
- Queries DNS TXT record
- Parses BIMI format
- Returns logo URL
- Example response:
```json
{
  "domain": "paypal.com",
  "logo_url": "https://paypal.com/logo.svg",
  "verified": true
}
```

### Security

**HTML Sanitization:**
- ✅ Removes `<script>`, `<iframe>`, `<form>`
- ✅ Blocks `onclick`, `onerror`, `onload`
- ✅ Only allows safe HTML tags
- ✅ Validates all URLs
- ✅ No JavaScript execution

**Avatar Privacy:**
- ✅ BIMI requires DNS/DMARC (domain verified)
- ✅ Gravatar is public opt-in
- ✅ Initials never expose data
- ✅ All requests use HTTPS

---

## 📊 Data Flow

### Email with BIMI Logo:
```
1. Email arrives from company@paypal.com
2. Frontend extracts domain: "paypal.com"
3. Calls: GET /api/bimi/paypal.com
4. Backend queries: default._bimi.paypal.com (DNS)
5. Finds: v=BIMI1; l=https://paypal.com/logo.svg
6. Returns logo URL to frontend
7. Frontend displays logo with shield ✓
```

### Email with Gravatar:
```
1. Email from user@gmail.com
2. MD5 hash: d4c74594d841139328695756648b6bd6
3. Request: https://gravatar.com/avatar/d4c...
4. If exists: show avatar
5. If 404: show initials
```

### HTML Email:
```
1. Backend parses IMAP email
2. Extracts HTML body
3. Sends to frontend in `htmlBody` field
4. Frontend sanitizes with DOMPurify
5. Renders safely in viewer
6. All links open in new tab
7. Images lazy load
```

---

## 🚀 Testing

### Test BIMI:
1. Send email from BIMI-enabled domain (PayPal, LinkedIn)
2. Avatar should show company logo with gold shield

### Test Gravatar:
1. Send from email with Gravatar account
2. Avatar shows Gravatar image

### Test HTML:
1. Send HTML email with formatting
2. Should render with Mythofy styling
3. Links in gold, tables with borders

### Test Fallback:
1. Send from random email
2. Shows initials in gold gradient

---

## 🎨 Styling

### Avatar Sizes:
- `sm` - 8x8 (32px)
- `md` - 12x12 (48px) [default]
- `lg` - 16x16 (64px)

### Email Content:
- Links: Mythofy gold (`#be8f23`)
- Images: Rounded, max-width 100%
- Tables: Dark borders, slate background
- Quotes: Gold left border
- Code: Dark background with padding

---

## 📝 Future Enhancements

- [ ] Cache BIMI results in Redis (avoid DNS queries)
- [ ] Support custom avatar uploads
- [ ] Add more BIMI providers (VMC validation)
- [ ] Implement avatar priority settings
- [ ] Add avatar placeholder animations

---

## 🔗 References

- [BIMI Specification](https://bimigroup.org/)
- [Gravatar API](https://gravatar.com/site/implement/)
- [DOMPurify Docs](https://github.com/cure53/DOMPurify)
- [Email Security Best Practices](https://owasp.org/www-community/vulnerabilities/XSS)

---

**Mythofy Mail** - Now with verified company logos and secure HTML emails! ✨
