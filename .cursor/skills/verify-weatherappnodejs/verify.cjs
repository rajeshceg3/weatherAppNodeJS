#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const {spawn, spawnSync} = require('node:child_process');
const net = require('node:net');
const root = process.cwd();
const out = process.env.VERIFY_EVIDENCE_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'verify-weatherAppNodeJS-'));
fs.mkdirSync(out, {recursive:true});
const evidence = {app:'weatherAppNodeJS', startedAt:new Date().toISOString(), actions:[]};
const children=[];const sockets=[];
const reserve=()=>new Promise(r=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>r(p));});});
function launch(cmd,args,env){const log=fs.openSync(path.join(out,`process-${children.length}.log`),'a');const child=spawn(cmd,args,{cwd:root,env:{...process.env,...env},stdio:['ignore',log,log]});fs.closeSync(log);children.push(child);child.on('error',e=>{evidence.processError=e.message;});return child;}
async function request(url, options={}) {const res=await fetch(url,{...options,signal:AbortSignal.timeout(5000)});const text=await res.text(); evidence.actions.push({method:options.method||'GET',url,status:res.status,body:text});return {status:res.status,text,json:()=>JSON.parse(text)};}
async function ready(base,route,child){for(let i=0;i<100;i++){if(evidence.processError)throw Error(evidence.processError);if(child.exitCode!==null)throw Error(`server exited ${child.exitCode}`);try{const r=await fetch(base+route,{signal:AbortSignal.timeout(300)});if(r.ok)return;}catch{} await new Promise(r=>setTimeout(r,100));}throw Error('readiness timeout');}
(async()=>{
const port=await reserve();const base=`http://127.0.0.1:${port}`;
const child=launch(process.execPath,['index.js'],{PORT:String(port),OPENWEATHER_API_KEY:''});
await ready(base,'/',child);
const home=await request(base+'/');assert.equal(home.status,200);assert(home.text.includes('name="city"'));assert(home.text.includes('Look outside'));
const css=await request(base+'/css/style.css');assert.equal(css.status,200);
const response=await request(base+'/',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:'city=Chennai'});
assert.equal(response.status,200);assert(response.text.includes('Weather service is not configured.'));assert(!response.text.includes('class="weather-info'));
evidence.boundary='No provider key supplied. Config guard returns before request(). Weather success/provider failures NOT verified.';
if(process.env.VERIFY_BROWSER==='1') {
 const {chromium}=require('@playwright/test');
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
 try {const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base);await page.locator('[name="city"]').fill('Chennai');await page.screenshot({path:path.join(out,'weather-form.png'),fullPage:true});await page.getByRole('button',{name:'Look outside'}).click();await page.getByText('Weather service is not configured.',{exact:false}).waitFor();await page.screenshot({path:path.join(out,'weather-not-configured.png'),fullPage:true});
 fs.writeFileSync(path.join(out,'final-page.txt'),await page.locator('body').innerText());
 assert.deepEqual(errors,[]);evidence.actions.push({browser:'user journey passed',initialViewport:'390x844',finalViewport:page.viewportSize(),errors});
 } finally {await browser.close();}
}
 evidence.result='passed';
})().catch(e=>{evidence.result='failed';evidence.error=e.stack;process.exitCode=1;}).finally(async()=>{
 for(const s of sockets)s.close();
 for(const c of children.reverse()){if(c.exitCode===null){c.kill('SIGTERM');await Promise.race([new Promise(r=>c.once('exit',r)),new Promise(r=>setTimeout(r,2000))]);if(c.exitCode===null)c.kill('SIGKILL');}}
 evidence.cleaned=children.every(c=>c.exitCode!==null||c.signalCode!==null);
 fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify(evidence,null,2));
 assert(fs.existsSync(path.join(out,'evidence.json')));console.log(JSON.stringify({result:evidence.result,evidence:out,cleaned:evidence.cleaned}));
});
