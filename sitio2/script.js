const q = (sel) => document.querySelector(sel);

function toKg(value, unit){
  return unit==='kg'?value:value*0.45359237;
}

function format(num){return Number(num).toFixed(1)}

const ageEl = q('#age');
const heightEl = q('#height');
const weightEl = q('#weight');
const calcBtn = q('#calcBtn');
const resetBtn = q('#resetBtn');
const resultBox = q('#resultBox');

calcBtn.addEventListener('click', ()=>{
  const age = parseInt(ageEl.value);
  const height = parseFloat(heightEl.value);
  const weightRaw = parseFloat(weightEl.value);
  const unit = q('input[name="unit"]:checked').value;

  if(!age || !height || !weightRaw || age<=0 || height<=0 || weightRaw<=0){
    resultBox.innerHTML='Por favor ingresa valores válidos en todos los campos.';
    return;
  }

  const weightKg = toKg(weightRaw,unit);
  const hM = height/100;
  const bmi = weightKg/(hM*hM);

  const minIMC = 18.5;
  const maxIMC = 24.9;
  const minIdeal = minIMC*(hM*hM);
  const maxIdeal = maxIMC*(hM*hM);
  const idealAvg = (minIdeal+maxIdeal)/2;

  let html = `<div>Edad: <strong>${age} años</strong></div>`;
  html += `<div>Tu IMC: <strong>${format(bmi)}</strong></div>`;
  html += `<div>Rango peso ideal: <strong>${format(minIdeal)} kg</strong> — <strong>${format(maxIdeal)} kg</strong></div>`;
  html += `<div>Promedio: <strong>${format(idealAvg)} kg</strong></div>`;

  if(bmi<minIMC){
    html+=`<div style="margin-top:.6rem;color:#ffd633">Tu IMC(indice de masa corporal) indica bajo peso. Recomendado iniciar con ejercicios ligeros y mejorar nutrición.</div>`;
  } else if(bmi>maxIMC){
    html+=`<div style="margin-top:.6rem;color:#ffd633">Tu IMC(indice de masa corporal) indica sobrepeso. Se recomienda ejercicio regular y dieta equilibrada.</div>`;
  } else {
    html+=`<div style="margin-top:.6rem;color:#ffd633">Tu IMC(indice de masa corporal) está en rango saludable. Mantén tu rutina y alimentación equilibrada.</div>`;
  }

  // Extra: guía según edad
  if(age<18) html+=`<div style="margin-top:.4rem;font-size:.9rem;color:#ddd">Recuerda: para menores de 18, consulta con tu médico antes de iniciar rutina intensa.</div>`;
  else if(age>=18 && age<=40) html+=`<div style="margin-top:.4rem;font-size:.9rem;color:#ddd">Ideal para tu edad, busca equilibrio entre cardio, fuerza y flexibilidad.</div>`;
  else if(age>40) html+=`<div style="margin-top:.4rem;font-size:.9rem;color:#ddd">A tu edad, prioriza ejercicios seguros y progresivos, evitando sobrecarga.</div>`;

  // Si la unidad era lbs, mostramos rango en lbs también
  if(unit==='lbs'){
    const minLbs = minIdeal/0.45359237;
    const maxLbs = maxIdeal/0.45359237;
    html+=`<div style="margin-top:.4rem;font-size:.9rem;color:#ddd">En tus unidades: rango ideal ≈ <strong>${format(minLbs)} lbs</strong> — <strong>${format(maxLbs)} lbs</strong></div>`;
  }
html += `
<div class="bmi-bar">
  <div class="bmi-scale">
    <div class="bmi-range low"></div>
    <div class="bmi-range healthy"></div>
    <div class="bmi-range overweight"></div>
    <div class="bmi-range obese"></div>
  </div>
  <div class="bmi-marker" style="left:${bmiPercent}%"></div>
</div>
`;
  resultBox.innerHTML=html;
});
let html = `<div>Edad: <strong>${age} años</strong></div>`;
html += `<div>Tu IMC: <strong>${format(bmi)}</strong></div>`;
html += `<div>Rango peso ideal: <strong>${format(minIdeal)} kg</strong> — <strong>${format(maxIdeal)} kg</strong></div>`;
html += `<div>Promedio: <strong>${format(idealAvg)} kg</strong></div>`;


resultBox.innerHTML = html;

resetBtn.addEventListener('click',()=>{
  ageEl.value='';
  heightEl.value='';
  weightEl.value='';
  resultBox.innerHTML='';
  q('input[name="unit"][value="kg"]').checked=true;
});
