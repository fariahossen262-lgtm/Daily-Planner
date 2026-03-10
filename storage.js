// storage.js
function loadPlannerData(date){
  const planner = JSON.parse(localStorage.getItem("planner")) || {};
  return planner[date] || {habits:[], progress:{}, notes:""};
}

function savePlannerData(date, data){
  const planner = JSON.parse(localStorage.getItem("planner")) || {};
  planner[date] = data;
  localStorage.setItem("planner", JSON.stringify(planner));
}

function getStreak(){
  return JSON.parse(localStorage.getItem("streak"))||0;
}

function setStreak(value){
  localStorage.setItem("streak",JSON.stringify(value));
}

// Export backup
function exportBackup(){
  const planner = JSON.parse(localStorage.getItem("planner")) || {};
  const data = { planner, streak: getStreak() };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "planner_backup.json";
  link.click();
}