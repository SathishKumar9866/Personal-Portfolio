import Script from "next/script";

// Microsoft Clarity — free heatmaps + session recordings (turns the predicted
// attention model in docs/EYE-TRACKING-ANALYSIS.md into real data). Loads ONLY
// when NEXT_PUBLIC_CLARITY_ID is set, so there's zero tracking until you opt in.
// Get an ID at https://clarity.microsoft.com → set it in .env.local / Vercel.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export const Clarity = () => {
  if (!CLARITY_ID) return null;
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}")`}
    </Script>
  );
};
