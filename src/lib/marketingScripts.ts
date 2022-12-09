export const getGoogleAnalyticsSrc = (id: string): string => `https://www.googletagmanager.com/gtag/js?id=${id}`;

export const getGoogleAnalyticsScript = (id: string, adsId?: string): string => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { page_path: window.location.pathname });
${adsId ? `gtag('config', '${adsId}', { allow_enhanced_conversions: true });` : ''}`;

export const getGoogleOptimizeSrc = (id: string): string => `https://www.googleoptimize.com/optimize.js?id=${id}`;

export const getUetScript = (id: string): string => `
(function(w,d,t,r,u) {
  var f, n, i;
  w[u] = w[u] || [], f = function() {
    var o = { ti: '${id}' };
    o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
  },
  n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {
    var s = this.readyState;
    s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
  },
  i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
})(window, document, "script", "//bat.bing.com/bat.js", "uetq");`;

export const getFacebookScript = (id: string): string => `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');`;

export const getPardotScript = (domain: string, accountId: string, campaignId?: string): string => `
piAId = '${accountId}';
piCId = '${campaignId}';
piHostname = '${domain}';

(function() {
  function async_load() {
    var s = document.createElement('script'); s.type = 'text/javascript';
    s.src = ('https:' == document.location.protocol ? 'https://pi' : 'http://cdn') + '.pardot.com/pd.js';
    var c = document.getElementsByTagName('script')[0]; c.parentNode.insertBefore(s, c);
  }
  if (window.attachEvent) {
    window.attachEvent('onload', async_load);
  } else {
    window.addEventListener('load', async_load, false);
  }
})();`;

export const getLivechatScript = (id: number, group?: number): string => `
window.__lc = window.__lc || { };
window.__lc.license = ${id};
window.__lc.chat_between_groups = false;
window.__lc.ga_version = 'gtag';
${group ? `window.__lc.group = ${group};` : ''}
(function(n,t,c) {
  function i(n) {
    return e._h ? e._h.apply(null, n) : e._q.push(n)
  }
  var e={
    _q:[],
    _h:null,
    _v:"2.0",
    on:function(){i(["on", c.call(arguments)])},
    once:function(){i(["once", c.call(arguments)])},
    off:function(){i(["off", c.call(arguments)])},
    get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},
    call:function(){i(["call", c.call(arguments)])},
    init:function(){var n=t.createElement("script");n.defer=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}
  };
  !n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e
}(window,document,[].slice))`;

export const getOptInMonsterScript = (userId: number, accountId: number): string => `
(function(d,u,ac){
  var s=d.createElement('script');
  s.type='text/javascript';
  s.src='https://a.omappapi.com/app/js/api.min.js';
  s.async=true;
  s.dataset.user=u;
  s.dataset.account=ac;
  d.getElementsByTagName('head')[0].appendChild(s);
})(document,${userId},${accountId});`;
