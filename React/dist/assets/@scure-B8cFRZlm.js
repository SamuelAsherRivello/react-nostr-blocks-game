/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */function p(r){if(!Number.isSafeInteger(r))throw new Error(`Wrong integer: ${r}`)}function l(...r){const e=(t,o)=>i=>t(o(i)),n=Array.from(r).reverse().reduce((t,o)=>t?e(t,o.encode):o.encode,void 0),c=r.reduce((t,o)=>t?e(t,o.decode):o.decode,void 0);return{encode:n,decode:c}}function w(r){return{encode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="number")throw new Error("alphabet.encode input should be an array of numbers");return e.map(n=>{if(p(n),n<0||n>=r.length)throw new Error(`Digit index outside alphabet: ${n} (alphabet: ${r.length})`);return r[n]})},decode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="string")throw new Error("alphabet.decode input should be array of strings");return e.map(n=>{if(typeof n!="string")throw new Error(`alphabet.decode: not string element=${n}`);const c=r.indexOf(n);if(c===-1)throw new Error(`Unknown letter: "${n}". Allowed: ${r}`);return c})}}}function u(r=""){if(typeof r!="string")throw new Error("join separator should be string");return{encode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="string")throw new Error("join.encode input should be array of strings");for(let n of e)if(typeof n!="string")throw new Error(`join.encode: non-string input=${n}`);return e.join(r)},decode:e=>{if(typeof e!="string")throw new Error("join.decode input should be string");return e.split(r)}}}function A(r,e="="){if(p(r),typeof e!="string")throw new Error("padding chr should be string");return{encode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!="string")throw new Error("padding.encode input should be array of strings");for(let c of n)if(typeof c!="string")throw new Error(`padding.encode: non-string input=${c}`);for(;n.length*r%8;)n.push(e);return n},decode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!="string")throw new Error("padding.encode input should be array of strings");for(let t of n)if(typeof t!="string")throw new Error(`padding.decode: non-string input=${t}`);let c=n.length;if(c*r%8)throw new Error("Invalid padding: string should have whole number of bytes");for(;c>0&&n[c-1]===e;c--)if(!((c-1)*r%8))throw new Error("Invalid padding: string has too much padding");return n.slice(0,c)}}}function S(r){if(typeof r!="function")throw new Error("normalize fn should be function");return{encode:e=>e,decode:e=>r(e)}}function k(r,e,n){if(e<2)throw new Error(`convertRadix: wrong from=${e}, base cannot be less than 2`);if(n<2)throw new Error(`convertRadix: wrong to=${n}, base cannot be less than 2`);if(!Array.isArray(r))throw new Error("convertRadix: data should be array");if(!r.length)return[];let c=0;const t=[],o=Array.from(r);for(o.forEach(i=>{if(p(i),i<0||i>=e)throw new Error(`Wrong integer: ${i}`)});;){let i=0,f=!0;for(let d=c;d<o.length;d++){const b=o[d],s=e*i+b;if(!Number.isSafeInteger(s)||e*i/e!==i||s-b!==e*i)throw new Error("convertRadix: carry overflow");if(i=s%n,o[d]=Math.floor(s/n),!Number.isSafeInteger(o[d])||o[d]*n+i!==s)throw new Error("convertRadix: carry overflow");if(f)o[d]?f=!1:c=d;else continue}if(t.push(i),f)break}for(let i=0;i<r.length-1&&r[i]===0;i++)t.push(0);return t.reverse()}const W=(r,e)=>e?W(e,r%e):r,x=(r,e)=>r+(e-W(r,e));function v(r,e,n,c){if(!Array.isArray(r))throw new Error("convertRadix2: data should be array");if(e<=0||e>32)throw new Error(`convertRadix2: wrong from=${e}`);if(n<=0||n>32)throw new Error(`convertRadix2: wrong to=${n}`);if(x(e,n)>32)throw new Error(`convertRadix2: carry overflow from=${e} to=${n} carryBits=${x(e,n)}`);let t=0,o=0;const i=2**n-1,f=[];for(const d of r){if(p(d),d>=2**e)throw new Error(`convertRadix2: invalid data word=${d} from=${e}`);if(t=t<<e|d,o+e>32)throw new Error(`convertRadix2: carry overflow pos=${o} from=${e}`);for(o+=e;o>=n;o-=n)f.push((t>>o-n&i)>>>0);t&=2**o-1}if(t=t<<n-o&i,!c&&o>=e)throw new Error("Excess padding");if(!c&&t)throw new Error(`Non-zero padding: ${t}`);return c&&o>0&&f.push(t>>>0),f}function D(r){return p(r),{encode:e=>{if(!(e instanceof Uint8Array))throw new Error("radix.encode input should be Uint8Array");return k(Array.from(e),2**8,r)},decode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="number")throw new Error("radix.decode input should be array of strings");return Uint8Array.from(k(e,r,2**8))}}}function g(r,e=!1){if(p(r),r<=0||r>32)throw new Error("radix2: bits should be in (0..32]");if(x(8,r)>32||x(r,8)>32)throw new Error("radix2: carry overflow");return{encode:n=>{if(!(n instanceof Uint8Array))throw new Error("radix2.encode input should be Uint8Array");return v(Array.from(n),8,r,!e)},decode:n=>{if(!Array.isArray(n)||n.length&&typeof n[0]!="number")throw new Error("radix2.decode input should be array of strings");return Uint8Array.from(v(n,r,8,e))}}}function B(r){if(typeof r!="function")throw new Error("unsafeWrapper fn should be function");return function(...e){try{return r.apply(null,e)}catch{}}}const M=l(g(4),w("0123456789ABCDEF"),u("")),G=l(g(5),w("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"),A(5),u(""));l(g(5),w("0123456789ABCDEFGHIJKLMNOPQRSTUV"),A(5),u(""));l(g(5),w("0123456789ABCDEFGHJKMNPQRSTVWXYZ"),u(""),S(r=>r.toUpperCase().replace(/O/g,"0").replace(/[IL]/g,"1")));const H=l(g(6),w("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),A(6),u("")),P=l(g(6),w("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),A(6),u("")),m=r=>l(D(58),w(r),u("")),R=m("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");m("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");m("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");const T=[0,2,3,5,6,7,9,10,11],z={encode(r){let e="";for(let n=0;n<r.length;n+=8){const c=r.subarray(n,n+8);e+=R.encode(c).padStart(T[c.length],"1")}return e},decode(r){let e=[];for(let n=0;n<r.length;n+=11){const c=r.slice(n,n+11),t=T.indexOf(c.length),o=R.decode(c);for(let i=0;i<o.length-t;i++)if(o[i]!==0)throw new Error("base58xmr: wrong padding");e=e.concat(Array.from(o.slice(o.length-t)))}return Uint8Array.from(e)}},C=l(w("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),u("")),I=[996825010,642813549,513874426,1027748829,705979059];function E(r){const e=r>>25;let n=(r&33554431)<<5;for(let c=0;c<I.length;c++)(e>>c&1)===1&&(n^=I[c]);return n}function O(r,e,n=1){const c=r.length;let t=1;for(let o=0;o<c;o++){const i=r.charCodeAt(o);if(i<33||i>126)throw new Error(`Invalid prefix (${r})`);t=E(t)^i>>5}t=E(t);for(let o=0;o<c;o++)t=E(t)^r.charCodeAt(o)&31;for(let o of e)t=E(t)^o;for(let o=0;o<6;o++)t=E(t);return t^=n,C.encode(v([t%2**30],30,5,!1))}function j(r){const e=r==="bech32"?1:734539939,n=g(5),c=n.decode,t=n.encode,o=B(c);function i(s,a,h=90){if(typeof s!="string")throw new Error(`bech32.encode prefix should be string, not ${typeof s}`);if(!Array.isArray(a)||a.length&&typeof a[0]!="number")throw new Error(`bech32.encode words should be array of numbers, not ${typeof a}`);const y=s.length+7+a.length;if(h!==!1&&y>h)throw new TypeError(`Length ${y} exceeds limit ${h}`);return s=s.toLowerCase(),`${s}1${C.encode(a)}${O(s,a,e)}`}function f(s,a=90){if(typeof s!="string")throw new Error(`bech32.decode input should be string, not ${typeof s}`);if(s.length<8||a!==!1&&s.length>a)throw new TypeError(`Wrong string length: ${s.length} (${s}). Expected (8..${a})`);const h=s.toLowerCase();if(s!==h&&s!==s.toUpperCase())throw new Error("String must be lowercase or uppercase");s=h;const y=s.lastIndexOf("1");if(y===0||y===-1)throw new Error('Letter "1" must be present between prefix and data only');const L=s.slice(0,y),$=s.slice(y+1);if($.length<6)throw new Error("Data must be at least 6 characters long");const U=C.decode($).slice(0,-6),N=O(L,U,e);if(!$.endsWith(N))throw new Error(`Invalid checksum in ${s}: expected "${N}"`);return{prefix:L,words:U}}const d=B(f);function b(s){const{prefix:a,words:h}=f(s,!1);return{prefix:a,words:h,bytes:c(h)}}return{encode:i,decode:f,decodeToBytes:b,decodeUnsafe:d,fromWords:c,fromWordsUnsafe:o,toWords:t}}const Q=j("bech32");j("bech32m");const F={encode:r=>new TextDecoder().decode(r),decode:r=>new TextEncoder().encode(r)},K=l(g(4),w("0123456789abcdef"),u(""),S(r=>{if(typeof r!="string"||r.length%2)throw new TypeError(`hex.decode: expected string, got ${typeof r} with length ${r.length}`);return r.toLowerCase()})),J={utf8:F,hex:K,base16:M,base32:G,base64:H,base64url:P,base58:R,base58xmr:z};`${Object.keys(J).join(", ")}`;export{H as a,Q as b};
