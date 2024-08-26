var Ye=Object.defineProperty;var Qe=(c,n,r)=>n in c?Ye(c,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):c[n]=r;var m=(c,n,r)=>Qe(c,typeof n!="symbol"?n+"":n,r);import{j as e,r as i,a as Ze}from"./react-B1CnsdDo.js";import{c as et}from"./react-dom-BZxf7_L4.js";import{n as be,f as tt,v as nt,g as st,a as ot,R as rt}from"./nostr-tools-Q5Wvsv94.js";import{B as y,T as l,a as K,b as x,c as at,d as it,I as ee,e as te,C as ne,f,F,S as G,g as q,L as ct,h as lt,i as dt,j as R}from"./@mui-DzPUhUvT.js";import{C as ut,P as mt,O as pt,u as gt}from"./@react-three-B8lueQ9K.js";import{C as je}from"./three-CCrdGQtI.js";import"./@babel-DgsEKXq2.js";import"./@noble-CxapbStt.js";import"./@scure-B8cFRZlm.js";import"./@emotion-h_Tdtukl.js";import"./hoist-non-react-statics-DQogQWOa.js";import"./stylis-BqmD5Vow.js";import"./clsx-B-dksMZM.js";import"./react-transition-group-BR8QdbAW.js";import"./react-is-DcfIKM1A.js";import"./@popperjs-BQBsAJpH.js";import"./debounce-Cd30_yT5.js";import"./its-fine-BPHwE9FS.js";import"./react-reconciler-CJGypQHA.js";import"./scheduler-CzFDRTuY.js";import"./three-stdlib-DZXZtruj.js";import"./zustand-BsR6LOud.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))d(u);new MutationObserver(u=>{for(const h of u)if(h.type==="childList")for(const S of h.addedNodes)S.tagName==="LINK"&&S.rel==="modulepreload"&&d(S)}).observe(document,{childList:!0,subtree:!0});function r(u){const h={};return u.integrity&&(h.integrity=u.integrity),u.referrerPolicy&&(h.referrerPolicy=u.referrerPolicy),u.crossOrigin==="use-credentials"?h.credentials="include":u.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function d(u){if(u.ep)return;u.ep=!0;const h=r(u);fetch(u.href,h)}})();class ht{constructor(){m(this,"kind");m(this,"tags");m(this,"created_at");m(this,"pubkey");m(this,"id");m(this,"sig");m(this,"content","")}}class b{static hasNostrConnect(){var n,r;return typeof window.nostr<"u"&&typeof((r=(n=window.nostr)==null?void 0:n.nip04)==null?void 0:r.encrypt)=="function"}static async encryptWithNostrConnectAsync(n,r){if(!b.hasNostrConnect())throw new Error("encryptAsync failed. NostrConnect is not supported in this browser.");return window.nostr.nip04.encrypt(r,n)}static async decryptWithNostrConnectAsync(n,r){if(!b.hasNostrConnect())throw new Error("decryptAsync failed. NostrConnect is not supported in this browser.");return window.nostr.nip04.decrypt(r,n)}static async encryptAsync(n,r,d){return be.encrypt(d,r,n)}static async decryptAsync(n,r,d){return be.decrypt(d,r,n)}static signEventAsync(n){return window.nostr.signEvent(n)}static finalizeEvent(n,r){return tt(n,r)}static verifyEvent(n){return nt(n)}}class U{constructor(n=""){m(this,"_publicKey");m(this,"_privateKey");n!==""?this._publicKey=n:(this._privateKey=st(),this._publicKey=ot(this._privateKey))}get publicKey(){return this._publicKey}get privateKey(){return this._privateKey}toJsonString(){return JSON.stringify({privateKey:this._privateKey?Array.from(this._privateKey):null,publicKey:this._publicKey})}static fromJsonString(n){const r=JSON.parse(n),d=new U(r.publicKey);return r.privateKey&&(d._privateKey=new Uint8Array(r.privateKey)),d}}class E{static isValidPublicKey(n){return/^[0-9a-fA-F]{64}$/.test(n)}}m(E,"formatPublicKeyShort",n=>n.slice(0,4)+"..."+n.slice(-4));const k=({title:c,children:n,className:r})=>e.jsxs(y,{mb:2,borderRadius:4,boxShadow:3,overflow:"hidden",className:r,children:[e.jsx(y,{p:2,bgcolor:"primary.main",color:"primary.contrastText",children:e.jsx(l,{component:"div",children:c})}),e.jsx(y,{p:2,bgcolor:"background.paper",children:n})]}),yt=({gameState:c,onCubeClick:n})=>e.jsxs(y,{flexDirection:"column",display:"flex",alignItems:"left",justifyContent:"center",children:[e.jsx(l,{sx:{marginBottom:2}}),e.jsx(l,{variant:"caption",children:"Game State Renderer 2D"}),e.jsx(K,{variant:"contained","aria-label":"outlined primary button group",children:c.cubeDatas.map((r,d)=>e.jsx(x,{disabled:!r.isAvailable,onClick:()=>n(r),color:"secondary",children:r.x},d))}),e.jsx(l,{variant:"body1",component:"div",sx:{marginBottom:2}})]});function ft(c){const n=-W.RoundIndexMax/2-2,r=new je(7649264),d=new je(14737632),u=i.useRef(null),[h,S]=i.useState(!1);gt((C,j)=>{h?u.current.scale.set(1,1,1):u.current.scale.set(.9,.9,.9),u.current.rotation.x+=j*.2});const P=()=>c.cubeData.isAvailable?r:d;return e.jsxs("mesh",{...c,ref:u,scale:[.9,.9,.9],position:[n+c.cubeData.x,c.cubeData.y,c.cubeData.z],onPointerDown:C=>c.cubeData.isAvailable&&c.onCubeClick(c.cubeData),onPointerOver:C=>S(!0),onPointerOut:C=>S(!1),children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:P()})]})}const xt=({gameState:c,onCubeClick:n})=>e.jsxs(y,{maxHeight:150,flexDirection:"column",display:"flex",alignItems:"left",justifyContent:"top",children:[e.jsx(l,{sx:{marginBottom:2}}),e.jsx(l,{variant:"caption",children:"Game State Renderer 3D"}),e.jsxs(ut,{camera:{manual:!0},children:[e.jsx(mt,{makeDefault:!0,position:[0,1,20],rotation:[0,0,0],fov:10,near:.1,far:1e3}),e.jsx(pt,{makeDefault:!0}),e.jsx("ambientLight",{intensity:Math.PI/2}),e.jsx("spotLight",{position:[10,10,10],angle:.15,penumbra:1,decay:0,intensity:Math.PI}),e.jsx("pointLight",{position:[-10,-10,-10],decay:0,intensity:Math.PI}),c.cubeDatas.map((r,d)=>e.jsx(ft,{cubeData:r,onCubeClick:n},d))]})]}),X=class X{constructor(){m(this,"gameId",ve.GameId);m(this,"roundIndexCurrent",0);m(this,"cubeDto",new A(0,0,0,!1))}toJsonString(){return JSON.stringify({roundIndexCurrent:this.roundIndexCurrent,gameId:this.gameId,cubeData:this.cubeDto.toJsonString()})}static fromJsonString(n){const r=JSON.parse(n),d=new X;return d.roundIndexCurrent=r.roundIndexCurrent,d.gameId=r.gameId,d.cubeDto=A.fromJsonString(r.cubeData),d}};m(X,"TagName","playerMoveDto");let I=X;class A{constructor(n,r,d,u=!0){m(this,"x",0);m(this,"y",0);m(this,"z",0);m(this,"isAvailable",!0);this.x=n,this.y=r,this.z=d,this.isAvailable=u}toJsonString(){return JSON.stringify({x:this.x,y:this.y,z:this.z})}static fromJsonString(n){const r=JSON.parse(n);return new A(r.x,r.y,r.z)}}class W{}m(W,"GameId","0003"),m(W,"RoundIndexMax",10);class ve{constructor(){m(this,"roundIndexCurrent",0);m(this,"cubeDatas",[]);this.cubeDatas=new Array(W.RoundIndexMax).fill(null).map((n,r)=>new A(r+1,1,1,!0))}}const bt=()=>{const c=at({palette:{primary:{light:R[300],main:R[500],dark:R[700]},secondary:{light:R[100],main:R[200],dark:R[300]}}}),[n,r]=i.useState(()=>{const t=localStorage.getItem("useLocalStorage");return t?JSON.parse(t):!0}),[d,u]=i.useState([]),[h,S]=i.useState([]),[P,C]=i.useState(""),[j,Se]=i.useState(new ve),[J,_]=i.useState(new I),[L,se]=i.useState(()=>{const t=localStorage.getItem("messagesIsFiltered");return n&&t?JSON.parse(t):!1}),[M,oe]=i.useState(()=>{const t=localStorage.getItem("messageIsEncrypted");return n&&t?JSON.parse(t):!1}),[D,Ie]=i.useState(null),[N,Ne]=i.useState(()=>{const t=localStorage.getItem("relayUrl");return n&&t?JSON.parse(t):!1}),[s,z]=i.useState(()=>{const t=localStorage.getItem("nostrUser");if(t=="undefined"){console.log("TODO: Debug why this is happening"),localStorage.removeItem("nostrUser");return}return t?U.fromJsonString(t):void 0}),[re,Y]=i.useState(null),[w,ae]=i.useState(()=>{const t=localStorage.getItem("isUsingNostrConnect");return n&&t?JSON.parse(t):!1}),[T,ie]=i.useState(null),ce=i.useRef(!1),[B,we]=i.useState(()=>{const t=localStorage.getItem("aboutSectionIsOpen");return n&&t?JSON.parse(t):!0}),[$,Ce]=i.useState(()=>{const t=localStorage.getItem("inputSectionIsOpen");return n&&t?JSON.parse(t):!0}),[V,Me]=i.useState(()=>{const t=localStorage.getItem("outputSectionIsOpen");return n&&t?JSON.parse(t):!0});let O=i.useMemo(()=>{const t=localStorage.getItem("eventMode");return t||"Null"},[]);const H=i.useRef(null),Ke=i.useRef(null),Ee=L?d:h;i.useEffect(()=>{if(!ce.current){ce.current=!0;return}return console.log("App mounted"),(async()=>{await he(),await ge(),n?await me(N):(await ue(),w||await le())})().catch(console.error),()=>{console.log("App unmounted")}},[]),i.useEffect(()=>{D&&s&&(s!=null&&s.publicKey)?Z():Q()},[D,s]),i.useEffect(()=>{De()},[h,d,L]),i.useEffect(()=>{const t=h.filter(o=>o.pubkey===(s==null?void 0:s.publicKey));u(t)},[h,s]),i.useEffect(()=>{n&&localStorage.setItem("messageIsEncrypted",JSON.stringify(M))},[M,n]),i.useEffect(()=>{n&&s!==void 0?localStorage.setItem("nostrUser",s.toJsonString()):localStorage.removeItem("nostrUser")},[s,n]),i.useEffect(()=>{n&&localStorage.setItem("isUsingNostrConnect",JSON.stringify(w))},[w,n]),i.useEffect(()=>{n&&localStorage.setItem("messagesIsFiltered",JSON.stringify(L))},[L,n]),i.useEffect(()=>{n&&localStorage.setItem("relayUrl",JSON.stringify(N))},[N,n]),i.useEffect(()=>{n||(localStorage.clear(),se(!1),oe(!1),ae(!1),z(void 0)),localStorage.setItem("useLocalStorage",JSON.stringify(n))},[n]);const De=()=>{H.current&&(H.current.scrollTop=H.current.scrollHeight)},Oe=async()=>{Y(null);try{if(typeof window.nostr>"u")throw new Error("Nostr extension not found. Please install a Nostr extension.");const t=await window.nostr.getPublicKey(),o=new U(t);z(o)}catch(t){Y(t instanceof Error?t.message:"An unknown error occurred")}},Re=()=>{z(void 0),n&&localStorage.removeItem("nostrUser")},le=()=>{const t=new U;z(t)},de=()=>{s!=null&&s.publicKey&&window.open(`https://primal.net/p/${s.publicKey}`,"_blank")},ue=async()=>{const t=["wss://ch.purplerelay.com","wss://ir.purplerelay.com"];let o=t[0];if(t.length>1)for(;o===N;)o=t[Math.floor(Math.random()*t.length)];o?(await Ne(o),await me(o)):console.error("No relay found")},ke=t=>t.kind===4,Ae=t=>t.tags.some(o=>o[0]===I.TagName),Pe=t=>{const o=["tracking strings detected and removed"];return t=t.toLowerCase(),!o.some(a=>t.includes(a.toLowerCase()))},Je=t=>new Date(t*1e3).toLocaleTimeString(),Le=t=>{const o=t.content,a=/(https?:\/\/[^\s]+)/g,g=/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i;return o.split(a).map((v,xe)=>a.test(v)?g.test(v)?e.jsx("img",{src:v,alt:"content",style:{maxWidth:"100%",height:"auto"}},xe):e.jsx("a",{href:v,target:"_blank",rel:"noopener noreferrer",children:v},xe):v)},ze=t=>{const o=t.tags.some(a=>a[0]==="p")?"🔐":"🔓";return e.jsxs(l,{variant:"body2",children:[o," From ",e.jsx("b",{children:E.formatPublicKeyShort(t.pubkey)})," At ",e.jsx("b",{children:Je(t.created_at)})]})},Q=()=>{T&&!T.closed&&(T.close(),ie(null),console.log("Relay Unsubscribe Complete"))},Z=async()=>{if(!D)return;T&&!T.closed&&Q();const t=D.subscribe([{kinds:[1,4],limit:20}],{async onevent(o){if(ke(o)){console.log(o);const a=o.pubkey===(s==null?void 0:s.publicKey);a&&console.log("Decrypted event is for me!");let g=o.content;if(a){if(w){if(b.hasNostrConnect())throw new Error("Nostr extension does not support NIP-04 encryption.");o.content=await b.decryptWithNostrConnectAsync(o.content,s.publicKey)}else if(s.privateKey)o.content=await b.decryptAsync(o.content,s.publicKey,s.privateKey);else throw new Error("Unable to encrypt message: No private key available.");console.log("Decrypted:",g,"->",o.content)}}if(Ae(o)){const a=o.tags.find(g=>g[0]===I.TagName)[1];try{const g=I.fromJsonString(a);g.gameId===W.GameId&&(j.roundIndexCurrent=g.roundIndexCurrent+1,j.cubeDatas.map(p=>{p.x===g.cubeDto.x&&p.y===g.cubeDto.y&&p.z===g.cubeDto.z&&(p.isAvailable=!1)}),j.cubeDatas.map((p,v)=>{console.log(`cube [${v}]: `+p.isAvailable)}),Se(j))}catch(g){console.error("Decryption??? Failed to parse game data:",g)}}Pe(o.content)&&S(a=>a.some(p=>p.id===o.id)?a:[...a,o].slice(-10))},oneose(){console.log("Relay Subscribe Complete")}});ie(t)},me=async t=>{const o=new rt(t);try{await o.connect(),console.log(`Connected to ${t}`),Ie(o),await Z()}catch(a){console.error("Failed to connect to relay:",a)}},Te=()=>{const t=N.replace("wss://","https://");t&&window.open(`${t}`,"_blank")},Fe=()=>{S([]),u([]),Q(),Z()},Ge=()=>{se(t=>!t)},pe=()=>{oe(t=>!t)},Ue=()=>{Y(""),z(void 0),ae(t=>!t)},We=()=>{r(t=>!t)},_e=t=>{C(t.target.value)},Be=t=>{const o=I.fromJsonString(t.target.value);_(o)},ge=async()=>{const t=["Hello","Greetings","Salutations"],o=["World","People","Universe"],a=t[Math.floor(Math.random()*t.length)],g=o[Math.floor(Math.random()*o.length)],p=Math.floor(Math.random()*100),v=`${a}, ${g}! ...${p}`;C(v)},he=async()=>{console.log("gameState.roundIndexCurrent: "+j.roundIndexCurrent+" and next : "+(j.roundIndexCurrent+1));const t=j.roundIndexCurrent+1,o=Math.floor(Math.random()*10),a=Math.floor(Math.random()*10),g=Math.floor(Math.random()*10),p=new I;p.roundIndexCurrent=t,p.cubeDto=new A(o,a,g),_(p)},$e=async()=>{O="Message",await ye(P),C("")},Ve=async()=>{O="GameData",J?await ye(J.toJsonString()):console.error("sendEventGameDataAsync failed. nextPlayerMoveDto is not set"),_(void 0)},ye=async t=>{if(t.trim()===""){console.error("contentText is not set");return}if(!s||!(s!=null&&s.publicKey)){console.error("Must have userKeyPublic first.");return}if(!w&&(!s||!(s!=null&&s.privateKey))){console.error("Private key is not set and Nostr Connect is not enabled");return}if(!D){console.error("Relay is not connected");return}try{let o=t;if(M){const p=s.publicKey;if(w){if(b.hasNostrConnect())throw new Error("Nostr extension does not support NIP-04 encryption.");o=await b.encryptWithNostrConnectAsync(t,p)}else if(s.privateKey)o=await b.encryptAsync(t,p,s.privateKey);else throw new Error("Unable to encrypt message: No private key available.")}let a=new ht;switch(a.created_at=Math.floor(Date.now()/1e3),a.pubkey=s.publicKey,a.kind=M?4:1,a.tags=[],M&&a.tags.push(["p",s.publicKey]),O){case"Message":a.content=o;break;case"GameData":a.content=o,a.tags.push([I.TagName,o]);break;default:console.error("Unknown eventMode")}if(w){if(!b.hasNostrConnect())throw Error("Nostr extension does not support NIP-04 encryption.");a=await b.signEventAsync(a)}else if(s.privateKey)a=b.finalizeEvent(a,s.privateKey);else throw new Error("Unable to sign event: No private key available.");if(!b.verifyEvent(a)){console.error("Event is not valid");return}console.log(`Message send ${O.toString()}, with tags ${a.tags.length} to ${N}`),await D.publish(a),console.log("Message sent:",a),O=="Message"?S(p=>[...p,{...a,content:o}].slice(-10)):O=="GameData"&&console.log("do something for clearing OUTPUT ui for game data?")}catch(o){console.error("Failed to send message:",o)}},He=()=>{Ce(!$),n&&localStorage.setItem("inputSectionIsOpen",JSON.stringify(!$))},qe=()=>{Me(!V),n&&localStorage.setItem("outputSectionIsOpen",JSON.stringify(!V))},Xe=()=>{we(!B),n&&localStorage.setItem("aboutSectionIsOpen",JSON.stringify(!B))};function fe(t){console.log("Cube clicked:",t);const o=new I;o.roundIndexCurrent=j.roundIndexCurrent+1,o.cubeDto=t,_(o)}return e.jsx(it,{theme:c,children:e.jsx("div",{className:"app-container",children:e.jsx(y,{className:"app",children:e.jsxs(y,{children:[e.jsx("div",{style:{display:"flex",alignItems:"center"},children:e.jsxs(ee,{onClick:Xe,className:"collapse-toggle",children:[e.jsx(te,{style:{transform:B?"rotate(0deg)":"rotate(-90deg)",transition:"transform 0.3s"}}),e.jsx(l,{variant:"h5",children:"About"})]})}),e.jsx(ne,{in:B,className:"collapse",children:e.jsxs(k,{title:"About",className:"content-area",children:[e.jsxs("div",{children:[e.jsx(l,{variant:"body1",children:"Send and receive encrypted messages using the Nostr web3 protocol."}),e.jsx(l,{variant:"body1",component:"div",sx:{marginBottom:2}}),e.jsx(l,{variant:"body1",component:"div",sx:{marginBottom:2}}),e.jsxs(l,{variant:"body1",children:["Technologies: ",e.jsx("a",{href:"https://reactjs.org/",children:"React"}),", ",e.jsx("a",{href:"https://mui.com/",children:"Material-UI"}),", and"," ",e.jsx("a",{href:"https://github.com/fiatjaf/nostr-tools",children:"Nostr Tools"}),"."]}),e.jsx(l,{variant:"body1",component:"div",sx:{marginBottom:2}}),e.jsx(l,{variant:"body1",component:"div",sx:{marginBottom:2}}),e.jsxs(l,{variant:"body1",children:["Source: ",e.jsx("a",{href:"https://github.com/SamuelAsherRivello/react-nostr-chat",children:"GitHub.com/SamuelAsherRivello/react-nostr-chat"}),"."]})]}),e.jsxs(y,{className:"content-area-nav",children:[e.jsx(K,{className:"content-area-button-group"}),e.jsx(f,{title:"Use Local Storage",children:e.jsx(F,{control:e.jsx(G,{checked:n,onChange:We,name:"useLocalStorage",color:"primary"}),label:"Use LocalStorage"})})]})]})}),e.jsx("div",{style:{display:"flex",alignItems:"center"},children:e.jsxs(ee,{onClick:He,className:"collapse-toggle",children:[e.jsx(te,{style:{transform:$?"rotate(0deg)":"rotate(-90deg)",transition:"transform 0.3s"}}),e.jsx(l,{variant:"h5",children:"Input"})]})}),e.jsxs(ne,{in:$,className:"collapse",children:[e.jsxs(k,{title:"User",className:"content-area",children:[e.jsx(q,{className:"textField",label:"Public Key",value:s?s.publicKey:"",fullWidth:!0,InputLabelProps:{shrink:!0},InputProps:{readOnly:!0},variant:"outlined",margin:"normal"}),e.jsxs(y,{className:"content-area-nav",children:[e.jsx(K,{className:"content-area-button-group",children:w?e.jsxs(e.Fragment,{children:[e.jsx(f,{title:"Connect To Nostr Connect",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",onClick:Oe,disabled:s&&E.isValidPublicKey(s==null?void 0:s.publicKey),children:"Nostr Connect"})})}),e.jsx(f,{title:"Disconnect From Nostr Connect",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",onClick:Re,disabled:!s||!s.publicKey,color:"primary",children:"Nostr Disconnect"})})}),e.jsx(f,{title:"Verify User Public Key",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",onClick:de,disabled:!s||!s.publicKey,color:"secondary",children:"Verify"})})})]}):e.jsxs(e.Fragment,{children:[e.jsx(f,{title:"Randomize User Public Key",children:e.jsx("span",{children:e.jsx(x,{onClick:le,variant:"contained",color:"primary",children:"Randomize"})})}),e.jsx(f,{title:"Verify User Public Key",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",onClick:de,disabled:!s||!(s!=null&&s.publicKey),color:"secondary",children:"Verify"})})})]})}),e.jsx(F,{control:e.jsx(G,{checked:w,onChange:Ue,name:"useNostrConnect",color:"primary"}),label:"Use Nostr Connect"})]}),re&&e.jsx(l,{color:"error",children:re})]}),e.jsxs(k,{title:"Relay",className:"content-area",children:[e.jsx(q,{label:"Url",value:N,fullWidth:!0,InputLabelProps:{shrink:!0},InputProps:{readOnly:!0},variant:"outlined",margin:"normal"}),e.jsx(y,{className:"content-area-nav",children:e.jsxs(K,{className:"content-area-button-group",children:[e.jsx(f,{title:"Randomize Relay",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",onClick:ue,color:"primary",children:"Randomize"})})}),e.jsx(f,{title:"Verify Relay",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",onClick:Te,color:"secondary",children:"Verify"})})})]})})]}),e.jsxs(k,{title:"Send Message",className:"content-area",children:[e.jsxs(l,{children:["Send a ",e.jsx("b",{children:"message"})," from"," ",e.jsx(l,{component:"span",fontWeight:"bold",children:s&&E.formatPublicKeyShort(s==null?void 0:s.publicKey)})," ","to"," ",e.jsx(l,{component:"span",fontWeight:"bold",children:s&&E.formatPublicKeyShort(s==null?void 0:s.publicKey)})," ","on"," ",e.jsx(l,{component:"span",fontWeight:"bold",children:N}),"."]}),e.jsx(q,{label:"New Message",multiline:!1,value:P,onChange:_e,fullWidth:!0,variant:"outlined",margin:"normal"}),e.jsxs(y,{className:"content-area-nav",children:[e.jsxs(K,{className:"content-area-button-group",children:[e.jsx(f,{title:"Send Message",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",color:"primary",onClick:$e,disabled:P.length==0||!s,children:"Send"})})}),e.jsx(f,{title:"Randomize Message",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",color:"secondary",onClick:ge,disabled:!s,children:"Randomize"})})})]}),e.jsx(F,{control:e.jsx(G,{checked:M,onChange:pe,name:"messageIsEncrypted",color:"primary"}),label:"Message Is Encrypted"})]})]}),e.jsxs(k,{title:"Send Game Data",className:"content-area",children:[e.jsxs(l,{children:["Send ",e.jsx("b",{children:"game data"})," from"," ",e.jsx(l,{component:"span",fontWeight:"bold",children:s&&E.formatPublicKeyShort(s==null?void 0:s.publicKey)})," ","to"," ",e.jsx(l,{component:"span",fontWeight:"bold",children:s&&E.formatPublicKeyShort(s==null?void 0:s.publicKey)})," ","on"," ",e.jsx(l,{component:"span",fontWeight:"bold",children:N}),"."]}),e.jsx(yt,{gameState:j,onCubeClick:fe}),e.jsx(xt,{gameState:j,onCubeClick:fe}),e.jsx(q,{label:"New Game Data",multiline:!1,value:J?J.toJsonString():"",onChange:Be,fullWidth:!0,inputProps:{readOnly:!0},variant:"outlined",margin:"normal"}),e.jsxs(y,{className:"content-area-nav",children:[e.jsxs(K,{className:"content-area-button-group",children:[e.jsx(f,{title:"Send Game Data",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",color:"primary",onClick:Ve,disabled:!J||!s,children:"Send"})})}),e.jsx(f,{title:"Randomize Message",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",color:"secondary",onClick:he,disabled:!s,children:"Randomize"})})})]}),e.jsx(F,{control:e.jsx(G,{checked:M,onChange:pe,name:"messageIsEncrypted",color:"primary"}),label:"Message Is Encrypted"})]})]})]}),e.jsx("div",{style:{display:"flex",alignItems:"center"},children:e.jsxs(ee,{onClick:qe,className:"collapse-toggle",children:[e.jsx(te,{style:{transform:V?"rotate(0deg)":"rotate(-90deg)",transition:"transform 0.3s"}}),e.jsx(l,{variant:"h5",children:"Output"})]})}),e.jsx(ne,{in:V,className:"collapse",children:e.jsxs(k,{title:"List Messages",className:"content-area",children:[e.jsx(y,{ref:H,sx:{minHeight:"200px",height:"100%",overflowY:"auto",overflowX:"hidden",border:"1px solid #ccc",marginBottom:2},children:e.jsxs(ct,{className:"message-list",children:[Ee.map(t=>e.jsx(lt,{className:"message-list-item",children:e.jsx(dt,{primary:e.jsx(l,{children:Le(t)}),secondary:ze(t)})},t.id)),e.jsx("div",{ref:Ke})]})}),e.jsxs(y,{className:"content-area-nav",children:[e.jsx(K,{variant:"contained",className:"content-area-button-group",children:e.jsx(f,{title:"Refresh Message List",children:e.jsx("span",{children:e.jsx(x,{variant:"contained",color:"primary",onClick:Fe,children:"Refresh"})})})}),e.jsx(F,{control:e.jsx(G,{checked:L,onChange:Ge,name:"messageFilter",color:"primary"}),label:"Show only my messages"})]})]})})]})})})})};et.createRoot(document.getElementById("root")).render(e.jsx(Ze.StrictMode,{children:e.jsx(bt,{})}));
