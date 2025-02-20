const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { stringify } = require("csv-stringify");
const amphtmlValidator = require('amphtml-validator');

pass_count=0

async function getValidationStatus(content, index) {
  try {
    // Get AMP validator instance
    const validator = await amphtmlValidator.getInstance();
    // Validate the HTML content
    const result = validator.validateString(content);

    // Check the validation status
    if (result.status === 'PASS') {
      // console.log('[Pass]', index);
      return true
    } else {
      // Log the errors
      const errorMessages = result.errors.map((error) => {
        let msg = `Line ${error.line}, Col ${error.col}: ${error.message}`;
        if (error.specUrl) {
          msg += ` (See: ${error.specUrl})`;
        }
        return error.severity === 'ERROR' ? msg : `Warning: ${msg}`;
      }).join(' | ');
      return errorMessages
    }
  } catch (error) {
    console.error('Error validating AMP:', error, index);
  }
}

function writefile(content) {
  const fileName = `amp-validation-failure-${Date.now()}.html`;
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Source HTML saved to ${filePath}`);
}

async function checkValidationStatus(htmlContents) {
  let pass = 0, error = 0;
  const errorRecords=[]
  for (const element of htmlContents) {
    const content = `<!DOCTYPE html>${element.post_content}`;
    // if (error > 9) break;

    const isValid = await getValidationStatus(content, element.ID);

    if (isValid === true) {
      pass++;
    } else {
      error++;
      // Capture errors for CSV
      // const escapedContent = content.replace(/"/g, '""');
      errorRecords.push({
        ID: element.ID,
        slug: element.post_name,
        error: isValid, // Add meaningful error message
        // content: content.replace(/"/g, '""') // Escape double quotes for CSV
      });
      // writefile(content);
    }
  }

  console.log(`Pass: ${pass}, Error: ${error}`);

  // Write errors to CSV
  if (errorRecords.length > 0) {
    // const csvPath = path.join(__dirname, );
    const csvPath = path.join(__dirname, 'amp_validation_errors_2.csv');
    const writableStream = fs.createWriteStream(csvPath);
    
    const stringifier = stringify({
      header: true,
      columns: ['ID', 'slug', 'error']
    });

    stringifier.pipe(writableStream); // Pipe stringifier output to file

    errorRecords.forEach(row => stringifier.write(row)); // Write all rows
    stringifier.end(); // Close the stream properly

    console.log(`Errors written to ${csvPath}`);
  }
}
(async () => {

  var html = `

  <!DOCTYPE html>
  <html amp="" lang="en-US" transformed="self;v=1" i-amphtml-layout=""><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,minimum-scale=1"><link rel="modulepreload" href="https://cdn.ampproject.org/v0.mjs" as="script" crossorigin="anonymous"><link rel="preconnect" href="https://cdn.ampproject.org"><link rel="preload" as="script" href="https://cdn.ampproject.org/v0/amp-story-1.0.js"><style amp-runtime="" i-amphtml-version="012501142147000">html{overflow-x:hidden!important}html.i-amphtml-fie{height:100%!important;width:100%!important}html:not([amp4ads]),html:not([amp4ads]) body{height:auto!important}html:not([amp4ads]) body{margin:0!important}body{-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;-ms-text-size-adjust:100%;text-size-adjust:100%}html.i-amphtml-singledoc.i-amphtml-embedded{-ms-touch-action:pan-y pinch-zoom;touch-action:pan-y pinch-zoom}html.i-amphtml-fie>body,html.i-amphtml-singledoc>body{overflow:visible!important}html.i-amphtml-fie:not(.i-amphtml-inabox)>body,html.i-amphtml-singledoc:not(.i-amphtml-inabox)>body{position:relative!important}html.i-amphtml-ios-embed-legacy>body{overflow-x:hidden!important;overflow-y:auto!important;position:absolute!important}html.i-amphtml-ios-embed{overflow-y:auto!important;position:static}#i-amphtml-wrapper{overflow-x:hidden!important;overflow-y:auto!important;position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;margin:0!important;display:block!important}html.i-amphtml-ios-embed.i-amphtml-ios-overscroll,html.i-amphtml-ios-embed.i-amphtml-ios-overscroll>#i-amphtml-wrapper{-webkit-overflow-scrolling:touch!important}#i-amphtml-wrapper>body{position:relative!important;border-top:1px solid transparent!important}#i-amphtml-wrapper+body{visibility:visible}#i-amphtml-wrapper+body .i-amphtml-lightbox-element,#i-amphtml-wrapper+body[i-amphtml-lightbox]{visibility:hidden}#i-amphtml-wrapper+body[i-amphtml-lightbox] .i-amphtml-lightbox-element{visibility:visible}#i-amphtml-wrapper.i-amphtml-scroll-disabled,.i-amphtml-scroll-disabled{overflow-x:hidden!important;overflow-y:hidden!important}amp-instagram{padding:54px 0px 0px!important;background-color:#fff}amp-iframe iframe{box-sizing:border-box!important}[amp-access][amp-access-hide]{display:none}[subscriptions-dialog],body:not(.i-amphtml-subs-ready) [subscriptions-action],body:not(.i-amphtml-subs-ready) [subscriptions-section]{display:none!important}amp-experiment,amp-live-list>[update]{display:none}amp-list[resizable-children]>.i-amphtml-loading-container.amp-hidden{display:none!important}amp-list [fetch-error],amp-list[load-more] [load-more-button],amp-list[load-more] [load-more-end],amp-list[load-more] [load-more-failed],amp-list[load-more] [load-more-loading]{display:none}amp-list[diffable] div[role=list]{display:block}amp-story-page,amp-story[standalone]{min-height:1px!important;display:block!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important;width:100%!important}amp-story[standalone]{background-color:#000!important;position:relative!important}amp-story-page{background-color:#757575}amp-story .amp-active>div,amp-story .i-amphtml-loader-background{display:none!important}amp-story-page:not(:first-of-type):not([distance]):not([active]){transform:translateY(1000vh)!important}amp-autocomplete{position:relative!important;display:inline-block!important}amp-autocomplete>input,amp-autocomplete>textarea{padding:0.5rem;border:1px solid rgba(0,0,0,.33)}.i-amphtml-autocomplete-results,amp-autocomplete>input,amp-autocomplete>textarea{font-size:1rem;line-height:1.5rem}[amp-fx^=fly-in]{visibility:hidden}amp-script[nodom],amp-script[sandboxed]{position:fixed!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;visibility:hidden}
  /*# sourceURL=/css/ampdoc.css*/[hidden]{display:none!important}.i-amphtml-element{display:inline-block}.i-amphtml-blurry-placeholder{transition:opacity 0.3s cubic-bezier(0.0,0.0,0.2,1)!important;pointer-events:none}[layout=nodisplay]:not(.i-amphtml-element){display:none!important}.i-amphtml-layout-fixed,[layout=fixed][width][height]:not(.i-amphtml-layout-fixed){display:inline-block;position:relative}.i-amphtml-layout-responsive,[layout=responsive][width][height]:not(.i-amphtml-layout-responsive),[width][height][heights]:not([layout]):not(.i-amphtml-layout-responsive),[width][height][sizes]:not(img):not([layout]):not(.i-amphtml-layout-responsive){display:block;position:relative}.i-amphtml-layout-intrinsic,[layout=intrinsic][width][height]:not(.i-amphtml-layout-intrinsic){display:inline-block;position:relative;max-width:100%}.i-amphtml-layout-intrinsic .i-amphtml-sizer{max-width:100%}.i-amphtml-intrinsic-sizer{max-width:100%;display:block!important}.i-amphtml-layout-container,.i-amphtml-layout-fixed-height,[layout=container],[layout=fixed-height][height]:not(.i-amphtml-layout-fixed-height){display:block;position:relative}.i-amphtml-layout-fill,.i-amphtml-layout-fill.i-amphtml-notbuilt,[layout=fill]:not(.i-amphtml-layout-fill),body noscript>*{display:block;overflow:hidden!important;position:absolute;top:0;left:0;bottom:0;right:0}body noscript>*{position:absolute!important;width:100%;height:100%;z-index:2}body noscript{display:inline!important}.i-amphtml-layout-flex-item,[layout=flex-item]:not(.i-amphtml-layout-flex-item){display:block;position:relative;-ms-flex:1 1 auto;flex:1 1 auto}.i-amphtml-layout-fluid{position:relative}.i-amphtml-layout-size-defined{overflow:hidden!important}.i-amphtml-layout-awaiting-size{position:absolute!important;top:auto!important;bottom:auto!important}i-amphtml-sizer{display:block!important}@supports (aspect-ratio:1/1){i-amphtml-sizer.i-amphtml-disable-ar{display:none!important}}.i-amphtml-blurry-placeholder,.i-amphtml-fill-content{display:block;height:0;max-height:100%;max-width:100%;min-height:100%;min-width:100%;width:0;margin:auto}.i-amphtml-layout-size-defined .i-amphtml-fill-content{position:absolute;top:0;left:0;bottom:0;right:0}.i-amphtml-replaced-content,.i-amphtml-screen-reader{padding:0!important;border:none!important}.i-amphtml-screen-reader{position:fixed!important;top:0px!important;left:0px!important;width:4px!important;height:4px!important;opacity:0!important;overflow:hidden!important;margin:0!important;display:block!important;visibility:visible!important}.i-amphtml-screen-reader~.i-amphtml-screen-reader{left:8px!important}.i-amphtml-screen-reader~.i-amphtml-screen-reader~.i-amphtml-screen-reader{left:12px!important}.i-amphtml-screen-reader~.i-amphtml-screen-reader~.i-amphtml-screen-reader~.i-amphtml-screen-reader{left:16px!important}.i-amphtml-unresolved{position:relative;overflow:hidden!important}.i-amphtml-select-disabled{-webkit-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.i-amphtml-notbuilt,[layout]:not(.i-amphtml-element),[width][height][heights]:not([layout]):not(.i-amphtml-element),[width][height][sizes]:not(img):not([layout]):not(.i-amphtml-element){position:relative;overflow:hidden!important;color:transparent!important}.i-amphtml-notbuilt:not(.i-amphtml-layout-container)>*,[layout]:not([layout=container]):not(.i-amphtml-element)>*,[width][height][heights]:not([layout]):not(.i-amphtml-element)>*,[width][height][sizes]:not([layout]):not(.i-amphtml-element)>*{display:none}amp-img:not(.i-amphtml-element)[i-amphtml-ssr]>img.i-amphtml-fill-content{display:block}.i-amphtml-notbuilt:not(.i-amphtml-layout-container),[layout]:not([layout=container]):not(.i-amphtml-element),[width][height][heights]:not([layout]):not(.i-amphtml-element),[width][height][sizes]:not(img):not([layout]):not(.i-amphtml-element){color:transparent!important;line-height:0!important}.i-amphtml-ghost{visibility:hidden!important}.i-amphtml-element>[placeholder],[layout]:not(.i-amphtml-element)>[placeholder],[width][height][heights]:not([layout]):not(.i-amphtml-element)>[placeholder],[width][height][sizes]:not([layout]):not(.i-amphtml-element)>[placeholder]{display:block;line-height:normal}.i-amphtml-element>[placeholder].amp-hidden,.i-amphtml-element>[placeholder].hidden{visibility:hidden}.i-amphtml-element:not(.amp-notsupported)>[fallback],.i-amphtml-layout-container>[placeholder].amp-hidden,.i-amphtml-layout-container>[placeholder].hidden{display:none}.i-amphtml-layout-size-defined>[fallback],.i-amphtml-layout-size-defined>[placeholder]{position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;z-index:1}amp-img[i-amphtml-ssr]:not(.i-amphtml-element)>[placeholder]{z-index:auto}.i-amphtml-notbuilt>[placeholder]{display:block!important}.i-amphtml-hidden-by-media-query{display:none!important}.i-amphtml-element-error{background:red!important;color:#fff!important;position:relative!important}.i-amphtml-element-error:before{content:attr(error-message)}i-amp-scroll-container,i-amphtml-scroll-container{position:absolute;top:0;left:0;right:0;bottom:0;display:block}i-amp-scroll-container.amp-active,i-amphtml-scroll-container.amp-active{overflow:auto;-webkit-overflow-scrolling:touch}.i-amphtml-loading-container{display:block!important;pointer-events:none;z-index:1}.i-amphtml-notbuilt>.i-amphtml-loading-container{display:block!important}.i-amphtml-loading-container.amp-hidden{visibility:hidden}.i-amphtml-element>[overflow]{cursor:pointer;position:relative;z-index:2;visibility:hidden;display:initial;line-height:normal}.i-amphtml-layout-size-defined>[overflow]{position:absolute}.i-amphtml-element>[overflow].amp-visible{visibility:visible}template{display:none!important}.amp-border-box,.amp-border-box *,.amp-border-box :after,.amp-border-box :before{box-sizing:border-box}amp-pixel{display:none!important}amp-analytics,amp-auto-ads,amp-story-auto-ads{position:fixed!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;visibility:hidden}amp-story{visibility:hidden!important}html.i-amphtml-fie>amp-analytics{position:initial!important}[visible-when-invalid]:not(.visible),form [submit-error],form [submit-success],form [submitting]{display:none}amp-accordion{display:block!important}@media (min-width:1px){:where(amp-accordion>section)>:first-child{margin:0;background-color:#efefef;padding-right:20px;border:1px solid #dfdfdf}:where(amp-accordion>section)>:last-child{margin:0}}amp-accordion>section{float:none!important}amp-accordion>section>*{float:none!important;display:block!important;overflow:hidden!important;position:relative!important}amp-accordion,amp-accordion>section{margin:0}amp-accordion:not(.i-amphtml-built)>section>:last-child{display:none!important}amp-accordion:not(.i-amphtml-built)>section[expanded]>:last-child{display:block!important}
  /*# sourceURL=/css/ampshared.css*/</style><meta name="amp-story-generator-name" content="Web Stories for WordPress"><meta name="amp-story-generator-version" content="1.39.0"><meta name="robots" content="max-image-preview:large"><meta name="description" content=""><meta property="og:type" content="article"><meta property="og:title" content=" "><meta property="og:url" content="https://product8db8114a75.wpcomstaging.com/web-stories/21/"><meta property="og:description" content="Visit the post for more."><meta property="article:published_time" content="2025-02-18T11:01:59+00:00"><meta property="article:modified_time" content="2025-02-18T11:01:59+00:00"><meta property="og:site_name" content="My WordPress Site"><meta property="og:image" content="https://s0.wp.com/i/blank.jpg"><meta property="og:image:alt" content=""><meta property="og:locale" content="en_US"><meta name="twitter:text:title" content="My WordPress Site"><meta name="twitter:image" content="https://s0.wp.com/i/webclip.png"><meta name="twitter:card" content="summary"><meta name="twitter:description" content="Visit the post for more."><meta name="msapplication-TileImage" content="https://s0.wp.com/i/webclip.png"><link rel="dns-prefetch" href="//widgets.wp.com"><link rel="dns-prefetch" href="//jetpack.wordpress.com"><link rel="dns-prefetch" href="//s0.wp.com"><link rel="dns-prefetch" href="//public-api.wordpress.com"><link rel="dns-prefetch" href="//0.gravatar.com"><link rel="dns-prefetch" href="//1.gravatar.com"><link rel="dns-prefetch" href="//2.gravatar.com"><link rel="preconnect" href="//i0.wp.com"><link rel="preconnect" href="//c0.wp.com"><script async="" src="https://cdn.ampproject.org/v0.mjs" type="module" crossorigin="anonymous"></script><script async nomodule src="https://cdn.ampproject.org/v0.js" crossorigin="anonymous"></script><script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.mjs" custom-element="amp-story" type="module" crossorigin="anonymous"></script><script async nomodule src="https://cdn.ampproject.org/v0/amp-story-1.0.js" crossorigin="anonymous" custom-element="amp-story"></script><link rel="icon" href="https://s0.wp.com/i/webclip.png" sizes="32x32"><link rel="icon" href="https://s0.wp.com/i/webclip.png" sizes="192x192"><style amp-custom="">amp-story-page{background-color:#131516}amp-story-grid-layer{overflow:visible}@media (max-aspect-ratio: 9 / 16){@media (min-aspect-ratio: 320 / 678){amp-story-grid-layer.grid-layer{margin-top:calc(( 100% / .5625 - 100% / .66666666666667 ) / 2)}}}.page-fullbleed-area{position:absolute;overflow:hidden;width:100%;left:0;height:calc(1.1851851851852 * 100%);top:calc(( 1 - 1.1851851851852 ) * 100% / 2)}.page-safe-area{overflow:visible;position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:calc(.84375 * 100%);margin:auto 0}.mask{position:absolute;overflow:hidden}.fill{position:absolute;top:0;left:0;right:0;bottom:0;margin:0}._c84718f{background-color:#fff}._6120891{position:absolute;pointer-events:none;left:0;top:-9.25926%;width:100%;height:118.51852%;opacity:1}._89d52dd{pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0;z-index:0}._dc67a5c{will-change:transform}._dabe975{position:absolute;pointer-events:none;left:11.65049%;top:0;width:80.09709%;height:66.66667%;opacity:1}._3bd0c3b{position:absolute;width:100%;height:100.13916%;left:0%;top:-.06958%}

  /*# sourceURL=amp-custom.css */</style><link rel="alternate" type="application/rss+xml" title="My WordPress Site » Feed" href="https://product8db8114a75.wpcomstaging.com/feed/"><link rel="alternate" type="application/rss+xml" title="My WordPress Site » Comments Feed" href="https://product8db8114a75.wpcomstaging.com/comments/feed/"><link rel="alternate" type="application/rss+xml" title="My WordPress Site » Stories Feed" href="https://product8db8114a75.wpcomstaging.com/web-stories/feed/"><title>My WordPress Site</title><script type="application/ld+json">{"@context":"http:\/\/schema.org","publisher":{"@type":"Organization","name":"My WordPress Site"},"@type":"Article","mainEntityOfPage":"https:\/\/product8db8114a75.wpcomstaging.com\/web-stories\/21\/","headline":"","datePublished":"2025-02-18T11:01:59+00:00","dateModified":"2025-02-18T11:01:59+00:00","author":{"@type":"Person","name":"Product PubLive"}}</script><link rel="https://api.w.org/" href="https://product8db8114a75.wpcomstaging.com/wp-json/"><link rel="alternate" title="JSON" type="application/json" href="https://product8db8114a75.wpcomstaging.com/wp-json/web-stories/v1/web-story/21"><link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://product8db8114a75.wpcomstaging.com/xmlrpc.php?rsd"><link rel="canonical" href="https://product8db8114a75.wpcomstaging.com/web-stories/21/"><link rel="alternate" title="oEmbed (JSON)" type="application/json+oembed" href="https://product8db8114a75.wpcomstaging.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fproduct8db8114a75.wpcomstaging.com%2Fweb-stories%2F21%2F"><link rel="alternate" title="oEmbed (XML)" type="text/xml+oembed" href="https://product8db8114a75.wpcomstaging.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fproduct8db8114a75.wpcomstaging.com%2Fweb-stories%2F21%2F&amp;format=xml"><link rel="apple-touch-icon" href="https://s0.wp.com/i/webclip.png"><script amp-onerror="">document.querySelector("script[src*='/v0.js']").onerror=function(){document.querySelector('style[amp-boilerplate]').textContent=''}</script><style amp-boilerplate="">body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript><link rel="stylesheet" amp-extension="amp-story" href="https://cdn.ampproject.org/v0/amp-story-1.0.css"><script amp-story-dvh-polyfill="">"use strict";if(!self.CSS||!CSS.supports||!CSS.supports("height:1dvh")){function e(){document.documentElement.style.setProperty("--story-dvh",innerHeight/100+"px","important")}addEventListener("resize",e,{passive:!0}),e()}</script></head><body><amp-story standalone="" publisher="My WordPress Site" publisher-logo-src="" title="" poster-portrait-src="" data-amp-unvalidated-attrs="publisher-logo-src poster-portrait-src" class="i-amphtml-layout-container" i-amphtml-layout="container"><amp-story-page id="d9bc9361-ca95-45e9-8c9b-468e383bbb0c" auto-advance-after="7s" class="i-amphtml-layout-container" i-amphtml-layout="container"><amp-story-grid-layer template="vertical" aspect-ratio="412:618" class="grid-layer i-amphtml-layout-container" i-amphtml-layout="container" style="--aspect-ratio:412/618;"><div class="_c84718f page-fullbleed-area"><div class="page-safe-area"><div class="_6120891"><div class="_89d52dd mask" id="el-12b814f8-4299-43e5-89b6-12043438d6a3"><div class="_dc67a5c fill"></div></div></div></div></div></amp-story-grid-layer><amp-story-grid-layer template="vertical" aspect-ratio="412:618" class="grid-layer i-amphtml-layout-container" i-amphtml-layout="container" style="--aspect-ratio:412/618;"><div class="page-fullbleed-area"><div class="page-safe-area"><div class="_dabe975"><div class="_89d52dd mask" id="el-3524cf11-63f1-442e-84ff-794bfd97d31e"><div data-leaf-element="true" class="_3bd0c3b"><amp-img layout="fill" src="https://product8db8114a75.wpcomstaging.com/wp-content/uploads/2025/02/8.webp" alt="" srcset="https://product8db8114a75.wpcomstaging.com/wp-content/uploads/2025/02/8.webp 2250w, https://product8db8114a75.wpcomstaging.com/wp-content/uploads/2025/02/8-1638x2048.webp 1638w, https://product8db8114a75.wpcomstaging.com/wp-content/uploads/2025/02/8-1229x1536.webp 1229w, https://product8db8114a75.wpcomstaging.com/wp-content/uploads/2025/02/8-819x1024.webp 819w, https://product8db8114a75.wpcomstaging.com/wp-content/uploads/2025/02/8-768x960.webp 768w, https://product8db8114a75.wpcomstaging.com/wp-content/uploads/2025/02/8-240x300.webp 240w" sizes="(min-width: 1024px) 36vh, 80vw" disable-inline-width="true" class="i-amphtml-layout-fill i-amphtml-layout-size-defined" i-amphtml-layout="fill"></amp-img></div></div></div></div></div></amp-story-grid-layer></amp-story-page><amp-story-social-share layout="nodisplay" class="i-amphtml-layout-nodisplay" hidden="hidden" i-amphtml-layout="nodisplay"><script type="application/json">{"shareProviders":[{"provider":"twitter"},{"provider":"linkedin"},{"provider":"email"},{"provider":"system"}]}</script></amp-story-social-share></amp-story></body></html>

  `

  console.log(await getValidationStatus(html, 1))
})() 
// const error = 

// console.log(error)

// function readAndExtract(filePath) {
//   const htmlContents = [];
//   let index = 0;

//   status_map ={}
//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('headers', (headers) => {
//       console.log('Column names:', headers); // This will log the header row
//     })
//     .on('data', (row) => {
//       if (row['post_content'] && row['post_status'] == 'publish')
//         htmlContents.push(row)
//     })
//     .on('error', (err) => {
//       console.error('Error reading the file:', err);
//     })
//     .on('end', () => {
//       // console.log(status_map)
//       console.log('content length', htmlContents.length)
//       checkValidationStatus(htmlContents)
//     });

//   // console.log(htmlContents.length)
// }
// // Provide the file path of your CSV
// const filePath = '/home/raj/Downloads/tamil_webstory.csv';
// readAndExtract(filePath);



// content length 5611