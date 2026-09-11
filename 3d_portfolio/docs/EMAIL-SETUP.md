> **Historical.** The contact form described here was removed on 2026-09-11;
> Contact is now a copyable address and an icon row. Nothing in the app reads
> the EmailJS variables. Kept as a record of how the form worked.

# Contact form: email setup (EmailJS)

The contact form works out of the box: with no config it opens the visitor's
mail client prefilled. To make it **send email in-page** (type → Send → done),
wire up EmailJS. Free tier is plenty for a portfolio.

## 1. Create the EmailJS pieces

At <https://dashboard.emailjs.com/>:

1. **Email Service**. connect an inbox (e.g. Gmail). Note the **Service ID**.
2. **Email Template**. create one and note the **Template ID**. The template
   **must** use these exact variables (this is what the code sends):

   | Variable | Meaning |
   | --- | --- |
   | `{{from_name}}` | the sender's name |
   | `{{reply_to}}` | the sender's email (set the template's *Reply-To* to this) |
   | `{{message}}` | the message body |

   Example template body:

   ```
   New message from {{from_name}} ({{reply_to}}):

   {{message}}
   ```

3. **Public Key**. Account → General → **Public Key** (a.k.a. API key).

## 2. Add the keys

Local dev: copy the example and fill it in (`.env.local` is git-ignored):

```bash
cp .env.example .env.local
```

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

Production (Vercel): add the same three variables under **Project → Settings →
Environment Variables**, then redeploy.

## 3. Verify

`npm run dev`, open the contact form, send a test message. On success the button
shows **Sent ✓** and a confirmation line appears. If a key is missing or wrong,
the form falls back to opening the mail client (so it never hard-fails).

## How it behaves in code

`src/components/Contact.jsx`:

- Reads the three `import.meta.env.VITE_EMAILJS_*` vars; `configured` is true
  only when all three are present.
- **Configured** → `emailjs.send(service, template, { from_name, reply_to,
  message }, { publicKey })`, with submitting / success / error states + a
  honeypot spam guard.
- **Not configured** → builds a `mailto:` with the message and opens the
  visitor's mail app.

No secrets live in the repo, only `.env.example` (blank) is tracked.
