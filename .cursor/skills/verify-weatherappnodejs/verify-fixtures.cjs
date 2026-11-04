#!/usr/bin/env node
const {chromium}=require('@playwright/test');
const {spawn}=require('node:child_process');const fs=require('node:fs');const assert=require('node:assert/strict');
const out=process.env.VERIFY_EVIDENCE_DIR || fs.mkdtempSync(require('node:path').join(require('node:os').tmpdir(),'weather-fixture-proof-'));fs.mkdirSync(out,{recursive:true});
let child;
(async()=>{const port=await new Promise(resolve=>{const server=require('node:net').createServer();server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});
const base=`http://127.0.0.1:${port}`;
child=spawn(process.execPath,['-r',require('node:path').join(__dirname,'fixtures/provider.cjs'),'index.js'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),OPENWEATHER_API_KEY:'fixture-not-provider-credential'},stdio:'ignore'});
for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,50));}
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
try {for(const width of [320,390,1365]) {const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base);await page.screenshot({path:`${out}/empty-${width}.png`,fullPage:true,animations:'disabled'});
await page.locator('#city').fill('Rain fixture');await page.getByRole('button',{name:'Look outside'}).click();await page.getByRole('heading',{name:'Rain fixture'}).waitFor();assert((await page.locator('.temperature').innerText()).includes('26'));assert((await page.locator('.details').innerText()).includes('m/s'));await page.screenshot({path:`${out}/rain-fixture-${width}.png`,fullPage:true,animations:'disabled'});
await page.locator('#units').selectOption('imperial');await page.locator('#city').fill('Clear fixture');await page.getByRole('button',{name:'Look outside'}).click();await page.getByRole('heading',{name:'Clear fixture'}).waitFor();assert((await page.locator('.temperature').innerText()).includes('79'));assert((await page.locator('.details').innerText()).includes('mph'));await page.screenshot({path:`${out}/clear-fixture-${width}.png`,fullPage:true,animations:'disabled'});
for(const value of ['Bad JSON','Offline','Missing']){await page.locator('#city').fill(value);await page.getByRole('button',{name:'Look outside'}).click();await page.locator('.error-message').waitFor();assert(!await page.locator('.forecast').count());}await page.screenshot({path:`${out}/error-${width}.png`,fullPage:true,animations:'disabled'});
await page.emulateMedia({reducedMotion:'reduce'});assert(await page.evaluate(()=>Array.from(document.querySelectorAll('*')).every(e=>getComputedStyle(e).animationName==='none')));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);await page.close();}}
finally{await browser.close();}fs.writeFileSync(out+'/proof.json',JSON.stringify({result:'passed',boundary:'All successful weather values are explicit provider-boundary fixtures, not live or validated provider readings.',widths:[320,390,1365],checks:['metric Celsius/m-s','imperial Fahrenheit/mph','bad JSON','network error','missing city','reduced motion','no horizontal overflow','no page errors']},null,2));}
)().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{child?.kill();console.log(JSON.stringify({fixtureOnly:true,evidence:out}));});
