// Original prototype. Uses static terrain routes; not yet tested against the game engine.
(() => {
  const FP=65536, FULL=4096;
  let rules, map, objectiveFields=[];
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function field(point) {
    const w=map.width,h=map.height,total=w*h,d=new Int32Array(total),queue=new Int32Array(total); d.fill(-1);
    const x=Math.max(0,Math.min(w-1,Math.floor(point.x/FP))),y=Math.max(0,Math.min(h-1,Math.floor(point.y/FP))),start=y*w+x;
    let head=0,tail=0; queue[tail++]=start;d[start]=0;
    while(head<tail){const p=queue[head++],px=p%w,py=Math.floor(p/w);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=px+dx,ny=py+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const n=ny*w+nx;if(d[n]!==-1||!(rules.terrainSpeed[map.terrain[n]]>0))continue;d[n]=d[p]+1;queue[tail++]=n;}}
    return d;
  }
  function waypoint(u,p,d) {
    const w=map.width,h=map.height,x=Math.floor(u.x/FP),y=Math.floor(u.y/FP);
    if(x<0||y<0||x>=w||y>=h)return p;
    let best=-1,value=d[y*w+x];
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const n=ny*w+nx;if(d[n]>=0&&(value<0||d[n]<value)){best=n;value=d[n];}}
    return best<0?p:{x:(best%w)*FP+FP/2,y:Math.floor(best/w)*FP+FP/2};
  }
  function move(u,p){const desired=((Math.round(Math.atan2(p.y-u.y,p.x-u.x)*FULL/(2*Math.PI))%FULL)+FULL)%FULL;const delta=((desired-u.heading+6144)%FULL)-2048;return {steer:Math.max(-FP,Math.min(FP,Math.round(delta*FP/160))),throttle:Math.abs(delta)>750?0:FP};}
  globalThis.controller={
    draft(h){const a=['apc','apc','scout','mbt'];return a.every(k=>h.draft.roster.includes(k))&&a.reduce((n,k)=>n+h.draft.costs[k],0)<=h.draft.budget&&a.length>=h.draft.min&&a.length<=h.draft.max?a:h.draft.default;},
    hello(h){rules=h.rules;map=h.map;objectiveFields=(h.objectives||[]).map(field);},
    tick(o){const points=o.objectives||[];return {units:o.units.filter(u=>u.alive).map((u,i)=>{const ranked=points.map((p,j)=>({p,j,score:p.weight*2-distance(u,p)/FP/20})).sort((a,b)=>b.score-a.score);const chosen=ranked[i%Math.max(1,ranked.length)];let order={id:u.id,throttle:0};if(chosen&&distance(u,chosen.p)>chosen.p.radius*0.65&&o.canMove){const target=u.kind==='drone'?chosen.p:waypoint(u,chosen.p,objectiveFields[chosen.j]);Object.assign(order,move(u,target));}const c=(o.contacts||[]).slice().sort((a,b)=>distance(u,a)-distance(u,b))[0];if(c&&u.kind!=='drone'){const gun=rules.units[u.kind].gun;if(gun&&distance(u,c)<=gun.maxRange&&distance(u,c)>=(gun.minRange||0)){order.aimAt=[c.x,c.y];if(u.reload===0&&u.ammo!==0)order.fire=[c.x,c.y];}}return order;})};}
  };
})();

