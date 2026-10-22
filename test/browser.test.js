const fs=require("fs"),a=require("assert");
const src=fs.readFileSync(__dirname+"/../index.html","utf8").split("/*PWA-START*/")[1].split("if (typeof module")[0];
const PB=new Function(src+";return PB;")();
const U={
 whale:"Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Whale/3.25.232.19 Mobile Safari/537.36",
 samsung:"Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
 chrome:"Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
 ios:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
 naver:"Mozilla/5.0 (Linux; Android 14; SM-S918N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 NAVER(inapp; search; 2000; 12.5.1)",
 daum:"Mozilla/5.0 (Linux; Android 14; SM-S918N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 DaumApps/8.0",
 line:"Mozilla/5.0 (Linux; Android 14; SM-S918N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 Line/14.0.0",
 kakao:"Mozilla/5.0 (Linux; Android 14; SM-S918N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 KAKAOTALK 10.8.0",
};
const exp={whale:"whale",samsung:"samsung",chrome:"chrome",ios:"ios",naver:null,daum:null,line:null,kakao:null};
for(const k in U){a.strictEqual(PB.browser(U[k]),exp[k],k);
 const g=PB.guide(U[k]);
 if(exp[k]){a.ok(g.indexOf('<div class="how me"')===0,k+" first");a.strictEqual(g.split("지금 쓰시는 창").length,2,k);}
 else a.ok(!g.includes("지금 쓰시는 창"),k+" no tag");}
a.ok(PB.guide(U.whale).startsWith('<div class="how me"><b>네이버 웨일'));
a.ok(PB.guide(U.whale).includes("주소창 왼쪽"));
a.strictEqual(PB.guide("").split('class="how').length-1,4);
console.log("ok",Object.keys(U).length);
