
import React, { useState, useEffect, useCallback } from "react";
import {
  Shield, Users, Wallet, LogOut, Eye, EyeOff, Search, Check, X, Loader2, Mail, Phone, Lock,
  User as UserIcon, ArrowRight, ShieldCheck, Briefcase, ChevronRight, ChevronDown, AlertCircle,
  FileText, IdCard, Home, Landmark, Plus, Edit3, Clock, ThumbsUp, ThumbsDown, Banknote,
  Percent, TrendingDown, CheckCircle2, CircleDot, Upload, ScanLine, Bell, MessageSquare,
  Smartphone, Image as ImageIcon, Banknote as CashIcon,
} from "lucide-react";
import "./styles.css";

const C = {
  ink:"#12213B", ink2:"#1B324F", river:"#1F5D74", gold:"#C99A2E", goldSoft:"#E7C871",
  sand:"#F3EEE3", sandDeep:"#EAE2D2", white:"#FFFFFF", success:"#2F7A4F", danger:"#A8402A",
  ink60:"rgba(18,33,59,.6)", ink40:"rgba(18,33,59,.4)"
};
const BRAND="CHAMPA LAIYVAN";
const ROLE_META={
  admin:{label:"ຜູ້ດູແລລະບົບ",icon:ShieldCheck,color:C.gold},
  officer:{label:"ພະນັກງານສິນເຊື່ອ",icon:Briefcase,color:C.river},
  customer:{label:"ລູກຄ້າ/ຜູ້ກູ້",icon:UserIcon,color:C.success}
};
const STATUS_META={
  pending:{label:"ລໍຖ້າກວດສອບ",color:C.gold,icon:Clock},
  approved:{label:"ອະນຸມັດແລ້ວ",color:C.river,icon:ThumbsUp},
  rejected:{label:"ປະຕິເສດ",color:C.danger,icon:ThumbsDown},
  disbursed:{label:"ຈ່າຍເງິນແລ້ວ",color:C.success,icon:Banknote}
};
const INTEREST_TYPES={flat:"ອັດຕາຄົງທີ່ (Flat Rate)",effective:"ຫຼຸດຕົ້ນຫຼຸດດອກ (Effective Rate)"};
const LATE_FEE_RATE=.03;

const SEED_USERS=[
 {id:"u_admin",name:"ຄຳມະນີ ວົງສະຫວັນ",contact:"admin@laoloan.la",contactType:"email",password:"admin123",role:"admin",status:"active",createdAt:"2026-01-10",kyc:null},
 {id:"u_officer",name:"ບຸນມີ ພົມມະວົງ",contact:"officer@laoloan.la",contactType:"email",password:"officer123",role:"officer",status:"active",createdAt:"2026-02-03",kyc:null},
 {id:"u_customer",name:"ສົມສີ ແກ້ວມະນີ",contact:"020 5555 1234",contactType:"phone",password:"customer123",role:"customer",status:"active",createdAt:"2026-03-18",
  kyc:{idType:"ບັດປະຈຳຕົວ",idNumber:"23-081-00234",address:"ບ້ານໂພນສະຫວ່າງ, ນະຄອນຫຼວງວຽງຈັນ",occupation:"ຄ້າຂາຍ",collateral:"ລົດຈັກ Honda Wave 2022"}}
];
const SEED_APPLICATIONS=[
 {id:"a_1001",customerId:"u_customer",customerName:"ສົມສີ ແກ້ວມະນີ",amount:5000000,termMonths:6,interestType:"effective",purpose:"ທຶນໝູນວຽນຄ້າຂາຍ",status:"disbursed",submittedAt:"2026-04-02",annualRate:24,disbursedAt:"2026-04-05",paidCount:2,reviewNote:"",
  payments:[
   {id:"p_1",installmentNo:1,amount:895000,method:"cash",date:"2026-05-05",reference:"",hasReceipt:false},
   {id:"p_2",installmentNo:2,amount:878000,method:"transfer",date:"2026-06-06",reference:"BCEL-77213",hasReceipt:true}
  ]},
 {id:"a_1002",customerId:"u_customer",customerName:"ສົມສີ ແກ້ວມະນີ",amount:3000000,termMonths:12,interestType:"flat",purpose:"ສ້ອມແປງເຮືອນ",status:"pending",submittedAt:"2026-08-10",annualRate:null,disbursedAt:null,paidCount:0,reviewNote:"",payments:[]}
];

const readJSON=(key,fallback)=>{
 try{const v=localStorage.getItem(key); return v?JSON.parse(v):fallback}catch{return fallback}
};
const writeJSON=(key,v)=>localStorage.setItem(key,JSON.stringify(v));
async function loadUsers(){const x=readJSON("champa-users",null);if(x)return x;writeJSON("champa-users",SEED_USERS);return SEED_USERS}
async function loadApplications(){const x=readJSON("champa-applications",null);if(x)return x;writeJSON("champa-applications",SEED_APPLICATIONS);return SEED_APPLICATIONS}
async function saveUsers(v){writeJSON("champa-users",v)}
async function saveApplications(v){writeJSON("champa-applications",v)}
async function loadSession(){return readJSON("champa-session",null)}
async function saveSession(userId){writeJSON("champa-session",{userId})}
async function clearSession(){localStorage.removeItem("champa-session")}
const fmtKip=n=>Math.round(Number(n||0)).toLocaleString("en-US")+" ₭";

function addMonths(dateStr,n){const d=new Date(dateStr);d.setMonth(d.getMonth()+n);return d.toISOString().slice(0,10)}
function generateSchedule({amount,termMonths,interestType,annualRate,startDate}){
 const rows=[]; if(!annualRate||!startDate)return rows;
 if(interestType==="flat"){
  const totalInterest=amount*(annualRate/100)*(termMonths/12), ip=totalInterest/termMonths, pp=amount/termMonths; let bal=amount;
  for(let i=1;i<=termMonths;i++){bal-=pp;rows.push({no:i,dueDate:addMonths(startDate,i),installment:pp+ip,principal:pp,interest:ip,balance:Math.max(bal,0)})}
 }else{
  const r=annualRate/100/12,n=termMonths,emi=r===0?amount/n:(amount*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);let bal=amount;
  for(let i=1;i<=n;i++){const interest=bal*r;let principal=emi-interest;if(i===n)principal=bal;bal=Math.max(bal-principal,0);rows.push({no:i,dueDate:addMonths(startDate,i),installment:principal+interest,principal,interest,balance:bal})}
 }
 return rows
}
function lateFeeFor(row,today){if(!row)return 0;const due=new Date(row.dueDate);if(today<=due)return 0;const days=Math.floor((today-due)/86400000);return row.installment*LATE_FEE_RATE*Math.ceil(days/30)}

function Field({icon:Icon,...props}){return <div className="relative">{Icon&&<Icon size={17} className="field-icon"/>}<input {...props} className={"field "+(Icon?"with-icon":"")}/></div>}
function Select({icon:Icon,children,...props}){return <div className="relative">{Icon&&<Icon size={17} className="field-icon"/>}<select {...props} className={"field select "+(Icon?"with-icon":"")}>{children}</select><ChevronDown size={15} className="select-arrow"/></div>}
function Badge({role}){const m=ROLE_META[role],Icon=m.icon;return <span className="badge" style={{background:m.color+"1A",color:m.color}}><Icon size={13}/>{m.label}</span>}
function StatusBadge({status}){const m=STATUS_META[status],Icon=m.icon;return <span className="badge" style={{background:m.color+"1A",color:m.color}}><Icon size={12}/>{m.label}</span>}
function StaircaseMark(){const hs=[88,70,55,42,30,20,12];return <svg width="245" height="100">{hs.map((h,i)=><rect key={i} className="step" x={i*35} y={100-h} width="26" height={h} rx="4" fill={i%2===0?C.gold:C.goldSoft}/>)}</svg>}
function StatCard({label,value,color,icon:Icon}){return <div className="stat"><div className="stat-top"><span>{label}</span><Icon size={15} style={{color}}/></div><b>{value}</b></div>}
function ComingSoon({items}){return <div className="panel"><b>ໂມດູນຕໍ່ໄປ (ກຳລັງພັດທະນາ)</b>{items.map((x,i)=><div className="soon" key={i}><span>{x}</span><ChevronRight size={14}/></div>)}</div>}

function AuthScreen({users,onLogin,onRegister,error,setError,busy}){
 const [mode,setMode]=useState("login"),[contactType,setContactType]=useState("email"),[showPw,setShowPw]=useState(false);
 const [f,setF]=useState({name:"",contact:"",password:"",confirm:""}),up=k=>e=>setF(s=>({...s,[k]:e.target.value}));
 const submit=e=>{e.preventDefault();setError("");if(mode==="login")onLogin(f.contact.trim(),f.password);else{
  if(!f.name.trim())return setError("ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ");
  if(!f.contact.trim())return setError(contactType==="email"?"ກະລຸນາປ້ອນອີເມວ":"ກະລຸນາປ້ອນເບີໂທ");
  if(f.password.length<6)return setError("ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ໂຕອັກສອນ");
  if(f.password!==f.confirm)return setError("ລະຫັດຜ່ານບໍ່ກົງກັນ");
  onRegister({name:f.name.trim(),contact:f.contact.trim(),contactType,password:f.password})
 }};
 return <div className="auth"><aside><div><div className="brand"><span className="logo"><Wallet size={17}/></span><b>{BRAND}</b></div><small>Loan Management System</small></div><div><StaircaseMark/><h2>ຄຸ້ມຄອງເງິນກູ້<br/>ຢ່າງເປັນລະບົບ ແລະ ໂປ່ງໃສ</h2><p>ຈາກການສະໝັກກູ້ ຈົນເຖິງການຊຳລະງວດສຸດທ້າຍ — ທຸກຂັ້ນຕອນຢູ່ບ່ອນດຽວ.</p></div><div className="role-row">{Object.entries(ROLE_META).map(([k,m])=><span key={k}><m.icon size={14}/>{m.label}</span>)}</div></aside>
 <main className="auth-main"><div className="auth-box"><div className="mobile-brand"><div className="brand"><span className="logo"><Wallet size={16}/></span><b>{BRAND}</b></div></div><div className="tabs">{["login","register"].map(m=><button key={m} className={mode===m?"active":""} onClick={()=>{setMode(m);setError("")}}>{m==="login"?"ເຂົ້າສູ່ລະບົບ":"ລົງທະບຽນ"}</button>)}</div>
 <form onSubmit={submit} className="form">
 {mode==="register"&&<Field icon={UserIcon} placeholder="ຊື່ ແລະ ນາມສະກຸນ" value={f.name} onChange={up("name")}/>}
 {mode==="register"&&<div className="pills">{["email","phone"].map(t=><button type="button" key={t} onClick={()=>setContactType(t)} className={contactType===t?"on":""}>{t==="email"?"ອີເມວ":"ເບີໂທ"}</button>)}</div>}
 <Field icon={mode==="register"?(contactType==="email"?Mail:Phone):Mail} placeholder={mode==="login"?"ອີເມວ ຫຼື ເບີໂທ":contactType==="email"?"example@email.com":"020 xxxx xxxx"} value={f.contact} onChange={up("contact")}/>
 <div className="pw"><Field icon={Lock} type={showPw?"text":"password"} placeholder="ລະຫັດຜ່ານ" value={f.password} onChange={up("password")}/><button type="button" onClick={()=>setShowPw(s=>!s)}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
 {mode==="register"&&<Field icon={Lock} type={showPw?"text":"password"} placeholder="ຢືນຢັນລະຫັດຜ່ານ" value={f.confirm} onChange={up("confirm")}/>}
 {error&&<div className="error"><AlertCircle size={14}/>{error}</div>}
 <button className="primary" disabled={busy}>{busy?<Loader2 size={16} className="spin"/>:mode==="login"?<ArrowRight size={16}/>:<Check size={16}/>} {mode==="login"?"ເຂົ້າສູ່ລະບົບ":"ສ້າງບັນຊີ"}</button></form>
 {mode==="login"&&<><div className="or"><span/>ຫຼື<span/></div><button className="google" onClick={()=>onLogin("__google_demo__","")}><b>G</b> ເຂົ້າສູ່ລະບົບດ້ວຍ Google (ຕົວຢ່າງ)</button><div className="demo">ບັນຊີທົດລອງ:<br/>admin@laoloan.la / admin123<br/>officer@laoloan.la / officer123<br/>020 5555 1234 / customer123</div></>}</div></main></div>
}

function TopBar({user,onLogout}){return <header><div className="brand"><span className="logo"><Wallet size={14}/></span><b>{BRAND}</b></div><div className="top-right"><div className="user-name"><b>{user.name}</b><Badge role={user.role}/></div><button className="logout" onClick={onLogout}><LogOut size={14}/>ອອກຈາກລະບົບ</button></div></header>}

function KycForm({user,onSave}){
 const [editing,setEditing]=useState(!user.kyc),[f,setF]=useState(user.kyc||{idType:"ບັດປະຈຳຕົວ",idNumber:"",address:"",occupation:"",collateral:""});
 const up=k=>e=>setF(s=>({...s,[k]:e.target.value}));
 if(!editing)return <div className="panel"><div className="panel-title"><b><IdCard size={15}/>ຂໍ້ມູນ KYC</b><button className="link" onClick={()=>setEditing(true)}><Edit3 size={12}/>ແກ້ໄຂ</button></div><div className="kyc-view"><p>{f.idType}: <b>{f.idNumber}</b></p><p>ທີ່ຢູ່: <b>{f.address}</b></p><p>ອາຊີບ: <b>{f.occupation||"—"}</b></p><p>ຫຼັກຊັບ: <b>{f.collateral||"—"}</b></p></div></div>;
 return <form className="panel form" onSubmit={e=>{e.preventDefault();if(!f.idNumber.trim()||!f.address.trim())return;onSave(f);setEditing(false)}}><b><IdCard size={15}/>ຢືນຢັນຕົວຕົນ (KYC)</b><Select value={f.idType} onChange={up("idType")}><option>ບັດປະຈຳຕົວ</option><option>ໜັງສືຜ່ານແດນ</option><option>ສຳມະໂນຄົວ</option></Select><Field icon={IdCard} placeholder="ເລກທີເອກະສານ" value={f.idNumber} onChange={up("idNumber")}/><Field icon={Home} placeholder="ທີ່ຢູ່ປັດຈຸບັນ" value={f.address} onChange={up("address")}/><Field icon={Briefcase} placeholder="ອາຊີບ" value={f.occupation} onChange={up("occupation")}/><Field icon={Landmark} placeholder="ຫຼັກຊັບປະກັນ (ຖ້າມີ)" value={f.collateral} onChange={up("collateral")}/><button className="primary">ບັນທຶກຂໍ້ມູນ KYC</button></form>
}

function LoanApplicationForm({onSubmit,hasKyc}){
 const [open,setOpen]=useState(false),[f,setF]=useState({amount:"",termMonths:"12",interestType:"flat",purpose:""}),up=k=>e=>setF(s=>({...s,[k]:e.target.value}));
 if(!hasKyc)return <div className="notice"><AlertCircle size={15}/>ກະລຸນາຕື່ມຂໍ້ມູນ KYC ໃຫ້ຄົບກ່ອນສົ່ງຄຳຮ້ອງ</div>;
 if(!open)return <button className="new-loan" onClick={()=>setOpen(true)}><Plus size={16}/>ສົ່ງຄຳຮ້ອງກູ້ເງິນໃໝ່</button>;
 return <form className="panel form" onSubmit={e=>{e.preventDefault();if(!f.amount||Number(f.amount)<=0||!f.purpose.trim())return;onSubmit({...f,amount:Number(f.amount),termMonths:Number(f.termMonths),purpose:f.purpose.trim()});setF({amount:"",termMonths:"12",interestType:"flat",purpose:""});setOpen(false)}}><b>ຄຳຮ້ອງກູ້ເງິນໃໝ່</b><Field type="number" min="0" placeholder="ຈຳນວນເງິນ (ກີບ)" value={f.amount} onChange={up("amount")}/><div className="grid2"><Select value={f.termMonths} onChange={up("termMonths")}>{[3,6,12,18,24,36].map(m=><option key={m} value={m}>{m} ເດືອນ</option>)}</Select><Select value={f.interestType} onChange={up("interestType")}><option value="flat">{INTEREST_TYPES.flat}</option><option value="effective">{INTEREST_TYPES.effective}</option></Select></div><Field placeholder="ຈຸດປະສົງການກູ້" value={f.purpose} onChange={up("purpose")}/><div className="grid2"><button type="button" className="secondary" onClick={()=>setOpen(false)}>ຍົກເລີກ</button><button className="primary">ສົ່ງຄຳຮ້ອງ</button></div></form>
}

function AmortizationTable({app,editable,onOpenPayment}){
 const today=new Date(),schedule=generateSchedule({amount:app.amount,termMonths:app.termMonths,interestType:app.interestType,annualRate:app.annualRate,startDate:app.disbursedAt}),paid=app.paidCount||0;
 return <div className="table-wrap"><div className="chips"><span>ອັດຕາ: <b>{app.annualRate}%/ປີ</b></span><span>ຈ່າຍແລ້ວ: <b>{paid}/{schedule.length} ງວດ</b></span></div><div className="scroll"><table><thead><tr><th>ງວດ</th><th>ວັນຄົບກຳນົດ</th><th>ຄ່າງວດ</th><th>ເງິນຕົ້ນ</th><th>ດອກເບ້ຍ</th><th>ຍອດເຫຼືອ</th><th>ສະຖານະ</th>{editable&&<th/>}</tr></thead><tbody>{schedule.map((r,i)=>{const isPaid=i<paid,fee=isPaid?0:lateFeeFor(r,today),next=i===paid;return <tr key={r.no} className={next?"next":""}><td>{r.no}</td><td>{r.dueDate}</td><td>{fmtKip(r.installment)}</td><td>{fmtKip(r.principal)}</td><td>{fmtKip(r.interest)}</td><td>{fmtKip(r.balance)}</td><td>{isPaid?<span className="ok"><CheckCircle2 size={12}/>ຈ່າຍແລ້ວ</span>:fee>0?<span className="bad"><AlertCircle size={12}/>ຄ້າງ +{fmtKip(fee)}</span>:next?"ງວດຕໍ່ໄປ":"ລໍຖ້າ"}</td>{editable&&<td>{next&&<button className="pay-btn" onClick={()=>onOpenPayment(app)}>ບັນທຶກຊຳລະ</button>}</td>}</tr>})}</tbody></table></div>{app.payments?.length>0&&<div className="payments"><b>ປະຫວັດການຊຳລະ</b>{app.payments.map(p=><div key={p.id}><span>{p.method==="cash"?<CashIcon size={12}/>:<Landmark size={12}/>}ງວດ {p.installmentNo} · {fmtKip(p.amount)}</span><span>{p.date}</span></div>)}</div>}</div>
}

function PaymentModal({app,onClose,onRecord}){
 const today=new Date(),schedule=generateSchedule({amount:app.amount,termMonths:app.termMonths,interestType:app.interestType,annualRate:app.annualRate,startDate:app.disbursedAt}),idx=app.paidCount||0,row=schedule[idx],fee=row?lateFeeFor(row,today):0;
 const [method,setMethod]=useState("transfer"),[amount,setAmount]=useState(String(Math.round((row?.installment||0)+fee))),[date,setDate]=useState(today.toISOString().slice(0,10)),[reference,setReference]=useState(""),[fileName,setFileName]=useState(""),[ocr,setOcr]=useState(false),[done,setDone]=useState(false);
 const runOcr=()=>{setOcr(true);setTimeout(()=>{setAmount(String(Math.round((row?.installment||0)+fee)));setReference("BCEL-"+Math.floor(10000+Math.random()*89999));setOcr(false);setDone(true)},900)};
 return <div className="modal-back"><form className="modal form" onSubmit={e=>{e.preventDefault();if(!amount||Number(amount)<=0)return;onRecord(app.id,{id:"p_"+Date.now(),installmentNo:row?.no||idx+1,amount:Number(amount),method,date,reference,hasReceipt:!!fileName});onClose()}}><div className="modal-head"><b>ບັນທຶກການຊຳລະ · ງວດ {row?.no}</b><button type="button" onClick={onClose}><X size={18}/></button></div><div className="grid2">{[["cash","ເງິນສົດ",CashIcon],["transfer","ໂອນທະນາຄານ",Landmark]].map(([k,l,I])=><button type="button" key={k} className={method===k?"method on":"method"} onClick={()=>setMethod(k)}><I size={13}/>{l}</button>)}</div>{method==="transfer"&&<div className="upload-box"><label><Upload size={14}/> {fileName||"ແນບຮູບສລິບການໂອນເງິນ"}<input type="file" accept="image/*" onChange={e=>setFileName(e.target.files?.[0]?.name||"")}/></label>{fileName&&!done&&<button type="button" onClick={runOcr} className="ocr">{ocr?<Loader2 size={13} className="spin"/>:<ScanLine size={13}/>} {ocr?"ກຳລັງອ່ານ...":"ອ່ານຂໍ້ມູນ OCR"}</button>}{done&&<small className="ok"><CheckCircle2 size={12}/>OCR ຈຳລອງສຳເລັດ</small>}</div>}<Field type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)}/><Field type="date" value={date} onChange={e=>setDate(e.target.value)}/>{method==="transfer"&&<Field placeholder="ເລກທີ່ອ້າງອີງ (Ref)" value={reference} onChange={e=>setReference(e.target.value)}/>}<button className="primary">ບັນທຶກການຊຳລະ</button></form></div>
}

function ApplicationCard({app,children}){
 const [open,setOpen]=useState(false);return <div className="app-card"><button className="app-head" onClick={()=>setOpen(o=>!o)}><div><b>{fmtKip(app.amount)} · {app.termMonths} ເດືອນ</b><small>{app.purpose} · {app.submittedAt}{app.customerName&&" · "+app.customerName}</small></div><div className="head-right"><StatusBadge status={app.status}/><ChevronDown size={15} style={{transform:open?"rotate(180deg)":"none"}}/></div></button>{open&&<div className="app-body">{children}</div>}</div>
}
function ApprovalRateForm({onApprove}){const [r,setR]=useState("18");return <div className="approval"><div className="rate"><Percent size={13}/><input type="number" min="0" step=".1" value={r} onChange={e=>setR(e.target.value)}/></div><button onClick={()=>onApprove(Number(r))}><ThumbsUp size={12}/>ອະນຸມັດ</button></div>}

function ApplicationsQueue({applications,users,onUpdateApp,onOpenPayment}){
 const [filter,setFilter]=useState("all"),arr=applications.filter(a=>filter==="all"||a.status===filter);
 return <div className="queue"><div className="filter-row">{["all","pending","approved","rejected","disbursed"].map(s=><button key={s} className={filter===s?"on":""} onClick={()=>setFilter(s)}>{s==="all"?"ທັງໝົດ":STATUS_META[s].label}</button>)}</div>{arr.map(app=>{const u=users.find(x=>x.id===app.customerId);return <ApplicationCard app={app} key={app.id}>{u?.kyc?<div className="kyc-mini"><p>{u.kyc.idType}: <b>{u.kyc.idNumber}</b></p><p>ທີ່ຢູ່: <b>{u.kyc.address}</b></p><p>ອາຊີບ: <b>{u.kyc.occupation||"—"}</b></p><p>ຫຼັກຊັບ: <b>{u.kyc.collateral||"—"}</b></p><p>ປະເພດດອກເບ້ຍ: <b>{INTEREST_TYPES[app.interestType]}</b></p></div>:<p className="bad">ບໍ່ມີຂໍ້ມູນ KYC</p>}{app.status==="pending"&&<div className="actions"><ApprovalRateForm onApprove={r=>onUpdateApp(app.id,{status:"approved",annualRate:r})}/><button className="danger-btn" onClick={()=>onUpdateApp(app.id,{status:"rejected"})}><ThumbsDown size={12}/>ປະຕິເສດ</button></div>}{app.status==="approved"&&<button className="success-btn" onClick={()=>onUpdateApp(app.id,{status:"disbursed",disbursedAt:new Date().toISOString().slice(0,10)})}><Banknote size={12}/>ຈ່າຍເງິນກູ້ · {app.annualRate}%/ປີ</button>}{app.status==="disbursed"&&<AmortizationTable app={app} editable onOpenPayment={onOpenPayment}/>}</ApplicationCard>})}</div>
}

function computeNotifications(apps){const t=new Date(),out=[];apps.filter(a=>a.status==="disbursed").forEach(a=>{const s=generateSchedule({amount:a.amount,termMonths:a.termMonths,interestType:a.interestType,annualRate:a.annualRate,startDate:a.disbursedAt}),r=s[a.paidCount||0];if(!r)return;const diff=Math.round((new Date(r.dueDate)-t)/86400000);if(diff<0)out.push({appId:a.id,customerName:a.customerName,installmentNo:r.no,amount:r.installment,kind:"overdue",daysLate:-diff});else if(diff<=3)out.push({appId:a.id,customerName:a.customerName,installmentNo:r.no,amount:r.installment,kind:"upcoming",daysLeft:diff})});return out}
function NotificationsPanel({applications}){const ns=computeNotifications(applications),[sent,setSent]=useState([]);if(!ns.length)return <div className="notice"><Bell size={15}/>ບໍ່ມີການແຈ້ງເຕືອນຄ້າງໄວ້</div>;return <div className="panel"><b><Bell size={15}/>ການແຈ້ງເຕືອນລູກຄ້າ</b>{ns.map(n=>{const k=n.appId+n.installmentNo,sentNow=sent.includes(k);return <div className="notif" key={k}><div><b>{n.customerName} · ງວດ {n.installmentNo}</b><small>{n.kind==="overdue"?`ຄ້າງຊຳລະ ${n.daysLate} ວັນ · ${fmtKip(n.amount)}`:`ຄົບກຳນົດອີກ ${n.daysLeft} ວັນ · ${fmtKip(n.amount)}`}</small></div><button className={sentNow?"sent":""} disabled={sentNow} onClick={()=>setSent(s=>[...s,k])}>{sentNow?"✓ ສົ່ງແລ້ວ":"ສົ່ງແຈ້ງເຕືອນ"}</button></div>})}</div>}

function AdminPanel({users,applications,onUpdateUser}){const [q,setQ]=useState(""),arr=users.filter(u=>(u.name+" "+u.contact).toLowerCase().includes(q.toLowerCase())),counts=users.reduce((a,u)=>(a[u.role]=(a[u.role]||0)+1,a),{}),ac=applications.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{});return <div className="content"><h1>ພາບລວມລະບົບ</h1><p className="muted">ຜູ້ໃຊ້ ແລະ ຄຳຮ້ອງກູ້ເງິນທັງໝົດ</p><div className="stats"><StatCard label="ຜູ້ດູແລລະບົບ" value={counts.admin||0} color={C.gold} icon={ShieldCheck}/><StatCard label="ພະນັກງານສິນເຊື່ອ" value={counts.officer||0} color={C.river} icon={Briefcase}/><StatCard label="ລູກຄ້າ" value={counts.customer||0} color={C.success} icon={UserIcon}/></div><div className="stats"><StatCard label="ຄຳຮ້ອງລໍຖ້າ" value={ac.pending||0} color={C.gold} icon={Clock}/><StatCard label="ອະນຸມັດແລ້ວ" value={ac.approved||0} color={C.river} icon={ThumbsUp}/><StatCard label="ຈ່າຍເງິນແລ້ວ" value={ac.disbursed||0} color={C.success} icon={Banknote}/></div><div className="panel user-list"><div className="search"><Search size={15}/><input placeholder="ຄົ້ນຫາຊື່ ຫຼື ອີເມວ/ເບີໂທ..." value={q} onChange={e=>setQ(e.target.value)}/></div>{arr.map(u=><div className="user-row" key={u.id}><div><b>{u.name}</b><small>{u.contact}</small></div><select value={u.role} onChange={e=>onUpdateUser(u.id,{role:e.target.value})}><option value="admin">ຜູ້ດູແລລະບົບ</option><option value="officer">ພະນັກງານສິນເຊື່ອ</option><option value="customer">ລູກຄ້າ</option></select><button className={u.status==="active"?"toggle active":"toggle"} onClick={()=>onUpdateUser(u.id,{status:u.status==="active"?"suspended":"active"})}>{u.status==="active"?"✓ ໃຊ້ງານໄດ້":"✕ ລະງັບ"}</button></div>)}</div></div>}

function OfficerPanel({user,users,applications,onUpdateApp,onRecordPayment}){const [paying,setPaying]=useState(null),customers=users.filter(u=>u.role==="customer").length,pending=applications.filter(a=>a.status==="pending").length;return <div className="content narrow"><h1>ສະບາຍດີ, {user.name}</h1><p className="muted">ພະນັກງານສິນເຊື່ອ — ພາບລວມການເຮັດວຽກ</p><div className="stats"><StatCard label="ລູກຄ້າໃນລະບົບ" value={customers} color={C.river} icon={Users}/><StatCard label="ຄຳຮ້ອງລໍຖ້າ" value={pending} color={C.gold} icon={Clock}/><StatCard label="ປະເພດດອກເບ້ຍ" value="Flat & Effective" color={C.success} icon={TrendingDown}/></div><NotificationsPanel applications={applications}/><section><b>ຄິວຄຳຮ້ອງກູ້ເງິນ</b><ApplicationsQueue applications={applications} users={users} onUpdateApp={onUpdateApp} onOpenPayment={setPaying}/></section><ComingSoon items={["ລາຍງານໜີ້ເກີນກຳນົດ (NPL) ແລະ Export Excel/PDF"]}/>{paying&&<PaymentModal app={paying} onClose={()=>setPaying(null)} onRecord={onRecordPayment}/>}</div>}

function CustomerPanel({user,applications,onSaveKyc,onSubmitApp}){const apps=applications.filter(a=>a.customerId===user.id).sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt)),ns=computeNotifications(apps);return <div className="content narrow"><h1>ສະບາຍດີ, {user.name}</h1><p className="muted">ບັນຊີຂອງທ່ານພ້ອມນຳໃຊ້ແລ້ວ</p>{ns.map(n=><div className="notice" key={n.appId+n.installmentNo}><Bell size={15}/>{n.kind==="overdue"?`ທ່ານຄ້າງຊຳລະງວດ ${n.installmentNo} ${n.daysLate} ວັນ (${fmtKip(n.amount)})`:`ງວດ ${n.installmentNo} ຄົບກຳນົດອີກ ${n.daysLeft} ວັນ (${fmtKip(n.amount)})`}</div>)}<KycForm user={user} onSave={onSaveKyc}/><section><b>ຄຳຮ້ອງກູ້ຂອງຂ້ອຍ</b><LoanApplicationForm onSubmit={onSubmitApp} hasKyc={!!user.kyc}/>{apps.map(a=><ApplicationCard key={a.id} app={a}>{a.status==="disbursed"?<AmortizationTable app={a} editable={false}/>:a.status==="rejected"?<p className="bad">ຄຳຮ້ອງນີ້ຖືກປະຕິເສດ</p>:a.status==="approved"?<p className="info">ອະນຸມັດແລ້ວ ອັດຕາ {a.annualRate}%/ປີ — ລໍຖ້າຈ່າຍເງິນກູ້</p>:<p className="muted">ລໍຖ້າພະນັກງານກວດສອບ</p>}</ApplicationCard>)}</section><ComingSoon items={["ອັບໂຫລດສລິບການໂອນເງິນ"]}/></div>}

export default function App(){
 const [users,setUsers]=useState(null),[applications,setApplications]=useState(null),[currentUser,setCurrentUser]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[initializing,setInitializing]=useState(true);
 useEffect(()=>{(async()=>{const [u,a]=await Promise.all([loadUsers(),loadApplications()]);setUsers(u);setApplications(a);const s=await loadSession();if(s){const user=u.find(x=>x.id===s.userId);if(user)setCurrentUser(user)}setInitializing(false)})()},[]);
 const handleLogin=useCallback(async(contact,password)=>{setBusy(true);setError("");await new Promise(r=>setTimeout(r,250));if(contact==="__google_demo__"){const d=users.find(u=>u.id==="u_customer");setCurrentUser(d);await saveSession(d.id);setBusy(false);return}const f=users.find(u=>u.contact.toLowerCase()===contact.toLowerCase()&&u.password===password);if(!f)setError("ອີເມວ/ເບີໂທ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");else if(f.status!=="active")setError("ບັນຊີນີ້ຖືກລະງັບ");else{setCurrentUser(f);await saveSession(f.id)}setBusy(false)},[users]);
 const handleRegister=useCallback(async(d)=>{if(users.some(u=>u.contact.toLowerCase()===d.contact.toLowerCase()))return setError("ອີເມວ/ເບີໂທນີ້ຖືກໃຊ້ແລ້ວ");setBusy(true);const u={id:"u_"+Date.now(),...d,role:"customer",status:"active",createdAt:new Date().toISOString().slice(0,10),kyc:null},v=[...users,u];setUsers(v);await saveUsers(v);setCurrentUser(u);await saveSession(u.id);setBusy(false)},[users]);
 const updateUser=useCallback(async(id,patch)=>{const v=users.map(u=>u.id===id?{...u,...patch}:u);setUsers(v);await saveUsers(v);if(currentUser?.id===id)setCurrentUser({...currentUser,...patch})},[users,currentUser]);
 const saveKyc=useCallback(kyc=>updateUser(currentUser.id,{kyc}),[currentUser,updateUser]);
 const submitApp=useCallback(async(data)=>{const a={id:"a_"+Date.now(),customerId:currentUser.id,customerName:currentUser.name,...data,status:"pending",submittedAt:new Date().toISOString().slice(0,10),annualRate:null,disbursedAt:null,paidCount:0,reviewNote:"",payments:[]},v=[a,...applications];setApplications(v);await saveApplications(v)},[applications,currentUser]);
 const updateApp=useCallback(async(id,patch)=>{const v=applications.map(a=>a.id===id?{...a,...patch}:a);setApplications(v);await saveApplications(v)},[applications]);
 const recordPayment=useCallback(async(id,payment)=>{const v=applications.map(a=>a.id===id?{...a,paidCount:(a.paidCount||0)+1,payments:[...(a.payments||[]),payment]}:a);setApplications(v);await saveApplications(v)},[applications]);
 const logout=useCallback(async()=>{setCurrentUser(null);await clearSession()},[]);
 if(initializing)return <div className="loading"><Loader2 className="spin"/></div>;
 if(!currentUser)return <AuthScreen users={users} onLogin={handleLogin} onRegister={handleRegister} error={error} setError={setError} busy={busy}/>;
 return <div className="app"><TopBar user={currentUser} onLogout={logout}/>{currentUser.role==="admin"&&<AdminPanel users={users} applications={applications} onUpdateUser={updateUser}/>} {currentUser.role==="officer"&&<OfficerPanel user={currentUser} users={users} applications={applications} onUpdateApp={updateApp} onRecordPayment={recordPayment}/>} {currentUser.role==="customer"&&<CustomerPanel user={currentUser} applications={applications} onSaveKyc={saveKyc} onSubmitApp={submitApp}/>}</div>
}
