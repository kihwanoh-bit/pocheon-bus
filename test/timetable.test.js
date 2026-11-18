const fs=require("fs"),a=require("assert");
const html=fs.readFileSync(__dirname+"/../index.html","utf8");
const src=html.split("/*LOGIC-START*/")[1].split("/*LOGIC-END*/")[0];
const L=new Function(src+";return {list,toMin,left,kstNow,autoDay,is3006,is7600,busesFor,compute,B7600_TO,B7600_FROM,B7600_STOPS_TO,B7600_STOPS_FROM,b7600DefaultStop,b7600Note};")();

// existing routes still work
a.strictEqual(L.busesFor("p2d").length, 23);
a.strictEqual(L.busesFor("p2d")[0].t, "06:50");
a.strictEqual(L.busesFor("p2d").slice(-1)[0].t, "19:50");
a.strictEqual(L.busesFor("d2p").length, 25);
a.strictEqual(L.busesFor("d2p").filter(b=>b.note).length, 2);
a.ok(L.busesFor("p2j","wk").length > L.busesFor("p2j","hol").length);
a.strictEqual(L.busesFor("j2p","wk")[0].t, "05:50");
a.strictEqual(L.busesFor("j2p","hol")[0].t, "06:20");

// 7600 shape
a.strictEqual(L.B7600_STOPS_TO.length, 14);
a.strictEqual(L.B7600_STOPS_FROM.length, 14);
a.deepStrictEqual(L.B7600_TO.pocheon, ["05:30","08:30","13:30","17:00"]);
a.deepStrictEqual(L.B7600_TO.t1, ["07:15","10:15","15:15","18:45"]);
a.deepStrictEqual(L.B7600_TO.t2, ["07:35","10:35","15:35","19:05"]);
a.deepStrictEqual(L.B7600_TO.dongsong, ["04:30","07:30","12:30","16:00"]);
a.deepStrictEqual(L.B7600_FROM.t2, ["08:40","11:40","16:40","20:20"]);
a.deepStrictEqual(L.B7600_FROM.t1, ["09:00","12:00","17:00","20:40"]);
a.deepStrictEqual(L.B7600_FROM.pocheon, ["10:50","13:50","18:50","22:30"]);
a.deepStrictEqual(L.B7600_FROM.dongsong, ["11:45","14:45","19:45","23:25"]);
a.deepStrictEqual(L.B7600_FROM.songyang, ["10:25","13:25","18:25","22:05"]);

function assertMono(stops, tab){
  for (let run=0; run<4; run++){
    let prev=-1;
    for (const s of stops){
      const m=L.toMin(tab[s.id][run]);
      a.ok(m>prev, s.id+" run "+run+" "+tab[s.id][run]);
      prev=m;
    }
  }
}
assertMono(L.B7600_STOPS_TO, L.B7600_TO);
assertMono(L.B7600_STOPS_FROM, L.B7600_FROM);

// default stops
a.strictEqual(L.b7600DefaultStop("p2a"), "pocheon");
a.strictEqual(L.b7600DefaultStop("a2p"), "t2");
a.strictEqual(L.busesFor("p2a","wk")[0].t, "05:30");
a.strictEqual(L.busesFor("a2p","wk")[0].t, "08:40");
a.strictEqual(L.busesFor("p2a","wk","songuri")[0].t, "05:45");
a.strictEqual(L.busesFor("a2p","wk","t1")[0].t, "09:00");

// 2026-11-18 09:00 KST = 2026-11-18 00:00 UTC (Wednesday)
const now=L.kstNow(Date.UTC(2026,10,18,0,0));
a.strictEqual(now.min, 9*60);
a.ok(now.label.indexOf("9일")===-1);
a.ok(now.label.indexOf("09:00")>=0);
const out=L.compute("p2a","wk",now,"pocheon");
a.strictEqual(out.next3[0].t, "13:30");
a.strictEqual(out.next3[1].t, "17:00");
a.strictEqual(out.next3.length, 2);
a.ok(out.next3[0].note.indexOf("T1 15:15")>=0);
a.ok(out.next3[0].note.indexOf("T2 15:35")>=0);

const back=L.compute("a2p","wk",now,"t2");
a.strictEqual(back.next3[0].t, "11:40");
a.strictEqual(back.next3[1].t, "16:40");
a.strictEqual(back.next3[2].t, "20:20");
a.ok(back.next3[0].note.indexOf("포천공영 13:50")>=0);

// after last outbound bus
const eve=L.kstNow(Date.UTC(2026,10,18,9,0)); // 18:00 KST
a.strictEqual(eve.min, 18*60);
const done=L.compute("p2a","wk",eve,"pocheon");
a.strictEqual(done.next3.length, 0);
a.strictEqual(done.tomorrowFirst, "05:30");
a.strictEqual(done.firstLabel, "내일 첫차는 ");

// inbound last from T2 is 20:20; at 21:00 next is tomorrow 08:40
const night=L.kstNow(Date.UTC(2026,10,18,12,0)); // 21:00 KST
const doneIn=L.compute("a2p","wk",night,"t2");
a.strictEqual(doneIn.next3.length, 0);
a.strictEqual(doneIn.tomorrowFirst, "08:40");

// existing 시외 compute still works at 09:00 — next p2d is 09:10
const p2d=L.compute("p2d","wk",now);
a.strictEqual(p2d.next3[0].t, "09:10");

console.log("timetable ok");
