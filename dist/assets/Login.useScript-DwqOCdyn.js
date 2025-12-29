import{r as h}from"./index-DXUichdn.js";import{a as n,u as g}from"./KcPage-DTvYue0j.js";import{w as l}from"./waitForElementMountedOnDom-qpCjLZnq.js";n();n();function b(r){const{webAuthnButtonId:t,kcContext:s,i18n:i}=r,{url:o,isUserIdentified:a,challenge:u,userVerification:c,rpId:m,createTimeout:p}=s,{msgStr:d,isFetchingTranslations:e}=i,{insertScriptTags:f}=g({componentOrHookName:"Login",scriptTags:[{type:"module",textContent:()=>`

                    import { authenticateByWebAuthn } from "${o.resourcesPath}/js/webauthnAuthenticate.js";
                    const authButton = document.getElementById('${t}');
                    authButton.addEventListener("click", function() {
                        const input = {
                            isUserIdentified : ${a},
                            challenge : '${u}',
                            userVerification : '${c}',
                            rpId : '${m}',
                            createTimeout : ${p},
                            errmsg : ${JSON.stringify(d("webauthn-unsupported-browser-text"))}
                        };
                        authenticateByWebAuthn(input);
                    });
                `}]});h.useEffect(()=>{e||(async()=>(await l({elementId:t}),f()))()},[e])}export{b as u};
