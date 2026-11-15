const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={Math,Int32Array};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/controller.js','utf8'),ctx);
const c=ctx.controller,FP=65536;const h={draft:{roster:['apc','scout','mbt'],costs:{apc:3,scout:2,mbt:4},budget:12,min:3,max:5,default:['scout','mbt']},rules:{terrainSpeed:[1,0],units:{mbt:{gun:{maxRange:2000000}}}},map:{width:4,height:3,terrain:[0,1,0,0,0,1,0,0,0,0,0,0]},objectives:[{x:3*FP+FP/2,y:FP/2,radius:FP,weight:2}]};
assert.equal(c.draft(h).join(','),'apc,apc,scout,mbt');c.hello(h);
const out=c.tick({canMove:true,units:[{id:1,kind:'mbt',alive:true,x:FP/2,y:FP/2,heading:0,reload:0,ammo:-1}],contacts:[{id:2,x:100000,y:0}],objectives:h.objectives});
assert.equal(out.units[0].id,1);assert.deepEqual(Array.from(out.units[0].fire),[100000,0]);assert(out.units[0].steer>0,'routes south around blocked east tile');
console.log('Draft, aim, and obstacle-routing smoke tests passed; no game-engine benchmark.');

