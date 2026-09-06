let originalArray=[55,23,78,12,90,34,5],array=[...originalArray],i=0,j=0,comparisons=0,swaps=0,swapped=false,isRunning=false,isComplete=false,timer=null,speed=500;
const $=id=>document.getElementById(id);
const els={arrayContainer:$("arrayContainer"),arrayInput:$("arrayInput"),error:$("errorMessage"),explanation:$("explanation"),statusText:$("statusText"),sortStatus:$("sortStatus"),progressFill:$("progressFill"),progressText:$("progressText"),comparisons:$("comparisons"),swaps:$("swaps"),pass:$("currentPass"),index:$("currentIndex"),size:$("arraySize"),exec:$("executionStatus"),start:$("startBtn"),pause:$("pauseBtn"),next:$("nextBtn"),reset:$("resetBtn"),clear:$("clearBtn"),speed:$("speedSlider"),speedValue:$("speedValue")};

function renderArray(compare=[],swap=[]){
 els.arrayContainer.innerHTML="";
 if(!array.length)return;
 const max=Math.max(...array.map(v=>Math.abs(v)),1);
 array.forEach((v,k)=>{
  const item=document.createElement("div"); item.className="array-item";
  if(isComplete || (i>0 && k>=array.length-i))item.classList.add("sorted");
  if(compare.includes(k))item.classList.add("comparing");
  if(swap.includes(k))item.classList.add("swapping");
  const bar=document.createElement("div");bar.className="array-bar";bar.style.height=(40+Math.abs(v)/max*180)+"px";bar.textContent=v;
  const idx=document.createElement("div");idx.className="array-index";idx.textContent="index "+k;
  item.append(bar,idx);els.arrayContainer.append(item);
 });
}
function explain(t){els.explanation.innerHTML="💡 <span>"+t+"</span>"}
function highlight(n){document.querySelectorAll("#codeBlock code span").forEach(x=>x.classList.toggle("active",x.dataset.line==n))}
function stats(){els.comparisons.textContent=comparisons;els.swaps.textContent=swaps;els.pass.textContent=isComplete?"-":i+1;els.index.textContent=isComplete?"-":j;els.size.textContent=array.length;updateButtons()}
function progress(){if(array.length<2){els.progressFill.style.width="0%";els.progressText.textContent="0%";return}let max=array.length*(array.length-1)/2,p=isComplete?100:Math.min(100,comparisons/max*100);els.progressFill.style.width=p+"%";els.progressText.textContent=Math.round(p)+"%"}
function updateButtons(){els.start.disabled=!array.length||isRunning||isComplete;els.pause.disabled=!isRunning;els.next.disabled=array.length<2||isRunning||isComplete;els.reset.disabled=!array.length;els.clear.disabled=!array.length}
function finish(){isRunning=false;isComplete=true;clearTimeout(timer);i=array.length;renderArray();progress();highlight(20);explain("🎉 Sorting Complete! ข้อมูลทั้งหมดถูกเรียงจากน้อยไปมากแล้ว");els.statusText.textContent="เรียงข้อมูลสำเร็จแล้ว!";els.sortStatus.textContent="COMPLETE";els.sortStatus.className="sort-status complete";els.exec.textContent="Complete";stats()}
function step(){
 if(isComplete||array.length<2)return;
 if(j>=array.length-i-1){
  if(!swapped){finish();return}
  i++;j=0;swapped=false;
  if(i>=array.length-1){finish();return}
  explain("เริ่ม Pass "+(i+1)+" — ตัวเลขที่มากที่สุดของส่วนที่เหลือจะถูกส่งไปด้านท้าย");highlight(4);renderArray();stats();return;
 }
 const a=array[j],b=array[j+1];comparisons++;highlight(9);renderArray([j,j+1]);explain("กำลังเปรียบเทียบ "+a+" กับ "+b);
 if(a>b){highlight(10);explain(a+" มากกว่า "+b+" → สลับตำแหน่งกัน 🔄");renderArray([j,j+1],[j,j+1]);[array[j],array[j+1]]=[array[j+1],array[j]];swaps++;swapped=true;highlight(13)}
 else explain(a+" ≤ "+b+" → ไม่ต้องสลับ");
 j++;highlight(7);renderArray();stats();progress()
}
function run(){if(!isRunning||isComplete)return;step();if(isRunning&&!isComplete)timer=setTimeout(run,speed)}
function start(){if(isRunning||isComplete||array.length<2)return;isRunning=true;els.exec.textContent="Running";els.statusText.textContent="กำลังทำงาน...";els.sortStatus.textContent="SORTING";els.sortStatus.className="sort-status sorting";updateButtons();run()}
function pause(){isRunning=false;clearTimeout(timer);els.exec.textContent="Paused";els.statusText.textContent="หยุดชั่วคราว";els.sortStatus.textContent="PAUSED";els.sortStatus.className="sort-status";updateButtons()}
function reset(){clearTimeout(timer);timer=null;isRunning=false;isComplete=false;array=[...originalArray];i=0;j=0;comparisons=0;swaps=0;swapped=false;els.statusText.textContent="พร้อมเริ่มการเรียงข้อมูล";els.sortStatus.textContent="READY";els.sortStatus.className="sort-status";els.exec.textContent="Ready";explain("กด Start เพื่อเริ่มต้น Bubble Sort");highlight(1);renderArray();stats();progress()}
function apply(){const raw=els.arrayInput.value.trim();const vals=raw.split(",").map(x=>x.trim()).filter(Boolean).map(Number);if(vals.length<2||vals.length>30||vals.some(v=>!Number.isFinite(v))){els.error.textContent="กรุณาใส่ตัวเลข 2–30 ตัว เช่น 55, 23, 78";return}originalArray=vals;els.error.textContent="";reset()}
function random(){const n=Math.floor(Math.random()*11)+5;originalArray=Array.from({length:n},()=>Math.floor(Math.random()*95)+5);els.arrayInput.value=originalArray.join(", ");reset()}
$("applyBtn").onclick=apply;$("randomBtn").onclick=random;$("clearBtn").onclick=()=>{clearTimeout(timer);isRunning=false;originalArray=[];array=[];i=j=comparisons=swaps=0;isComplete=false;els.arrayInput.value="";els.arrayContainer.innerHTML="";els.statusText.textContent="ยังไม่มีข้อมูล";els.sortStatus.textContent="EMPTY";els.exec.textContent="Empty";explain("🧹 ข้อมูลถูกล้างแล้ว กรุณาใส่ตัวเลขใหม่");stats();progress()};
els.start.onclick=start;els.pause.onclick=pause;els.next.onclick=()=>{if(!isRunning)step()};els.reset.onclick=reset;
els.speed.oninput=()=>{speed=+els.speed.value;els.speedValue.textContent=speed+" ms"};
els.arrayInput.onkeydown=e=>{if(e.key==="Enter")apply()};
renderArray();stats();progress();highlight(1);