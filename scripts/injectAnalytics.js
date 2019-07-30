const fs = require('fs');

let index = fs.readFileSync("./public/index.html", "utf-8");




let googleAnalyticsTag = `<!-- Google Tag Manager -->`
let googleAnalyticsTagPayload =` 
<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TKQR8KP');</script>
`


let WDFNAnalyticsTag = `<!-- Global site tag (gtag.js) - Google Analytics -->`
let WDFNAnalyticsTagPayload = `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-25350863-3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());  

  gtag('config', 'UA-25350863-3');
</script>`




index = index.replace(googleAnalyticsTag, googleAnalyticsTagPayload);
index = index.replace(WDFNAnalyticsTag, WDFNAnalyticsTagPayload);


fs.writeFileSync("./public/index.html", index);


// perform injection



