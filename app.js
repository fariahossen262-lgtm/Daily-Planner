// app.js - Date-wise Planner

let streak = getStreak();
const dateInput = document.getElementById("date");
dateInput.value = new Date().toISOString().split("T")[0];

let habits = [];
let progress = {};
let notesData = {};

function loadDateData() {
  const today = dateInput.value;
  const data = loadPlannerData(today);
  habits = data.habits;
  progress = data.progress;
  notesData[today] = data.notes || "";
}

function render() {
  loadDateData();
  const list = document.getElementById("habitList");
  list.innerHTML = "";
  const today = dateInput.value;

  habits.forEach((h, i) => {
    const key = today + h.name;
    const checked = progress[key] || false;

    const div = document.createElement("div");
    div.className = "habit";
    div.innerHTML = `
      <div>
        <b>${i+1}. ${h.name}</b><br>
        <small>${h.time}</small>
      </div>
      <div>
        <input type="checkbox" ${checked?"checked":""} onchange="toggleHabit('${h.name}')">
        <button onclick="editHabit(${i})">Edit</button>
        <button onclick="deleteHabit(${i})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });

  updateProgress();
  loadNotes();
}

function addHabit() {
  const name = document.getElementById("habitName").value;
  const time = document.getElementById("habitTime").value;
  const alarm = document.getElementById("habitAlarm").value;
  if(!name) return;
  habits.push({name,time,alarm});
  savePlannerData(dateInput.value, {habits, progress, notes:notesData[dateInput.value]||""});
  document.getElementById("habitName").value="";
  document.getElementById("habitTime").value="";
  document.getElementById("habitAlarm").value="";
  render();
}

function toggleHabit(name){
  const today = dateInput.value;
  const key = today+name;
  progress[key] = !progress[key];
  savePlannerData(today,{habits,progress,notes:notesData[today]||""});
  render();
}

function editHabit(i){
  const today = dateInput.value;
  const newName = prompt("Edit habit name", habits[i].name);
  const newTime = prompt("Edit duration", habits[i].time);
  if(newName){
    habits[i].name=newName;
    habits[i].time=newTime;
    savePlannerData(today,{habits,progress,notes:notesData[today]||""});
    render();
  }
}

function deleteHabit(i){
  const today = dateInput.value;
  if(confirm("Delete this habit?")){
    habits.splice(i,1);
    savePlannerData(today,{habits,progress,notes:notesData[today]||""});
    render();
  }
}

function updateProgress(){
  const today = dateInput.value;
  let done=0;
  habits.forEach(h=>{ if(progress[today+h.name]) done++; });
  const percent = habits.length ? Math.round((done/habits.length)*100) : 0;
  document.getElementById("percent").innerText=percent+"% Completed";
  let msg="";
  if(percent>=90) msg="🔥 Amazing!";
  else if(percent>=70) msg="👏 Great!";
  else if(percent>=50) msg="🙂 Good!";
  else msg="⚡ Improve tomorrow!";
  document.getElementById("message").innerText=msg;

  if(percent>=70){
    streak++;
    setStreak(streak);
  }
  document.getElementById("streak").innerText="Current Streak: "+streak+" days";
}

function saveNotes(){
  const today = dateInput.value;
  notesData[today]=document.getElementById("notes").value;
  savePlannerData(today,{habits,progress,notes:notesData[today]});
}

function loadNotes(){
  const today = dateInput.value;
  document.getElementById("notes").value = notesData[today]||"";
}

function exportData(){ exportBackup(); }

setInterval(()=>{
  const now = new Date();
  const time = now.getHours()+":"+String(now.getMinutes()).padStart(2,"0");
  habits.forEach(h=>{ if(h.alarm===time) alert("⏰ Reminder: "+h.name); });
},60000);

dateInput.onchange=render;

render();