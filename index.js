const wa = require('@open-wa/wa-automate');
var sessManager = require('./scripts/SessionManager');
const msgManager = require('./scripts/MessageManager')

const TWENTY_MINUTES = 1200000;

dateLog('Started index.js')

//=======================IBM WATSON
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const clientSendTxtMsg = require('./scripts/MessageManager');


/*Use suas credenciais aqui.*/ 
const assistantID = '[ASSISTANT ID]';

const assistant = new AssistantV2({
  version: '[Uma data no formato 2022-09-13]',
  authenticator: new IamAuthenticator({
    apikey: '[API KEY]',
  }),
  serviceUrl: '[URI DO WATSON ASSISTANT]',
});


var result;
var sessionID;


//====================================================================


wa.create({
  sessionId: "My Assistant",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: false,
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(_client) {
    var client = _client;  
    

    client.onMessage(async (message) => {

      var session;

      if(sessManager.checkSessionExist(message.from)){
        session = sessManager.getSessionByPhone(message.from);
      }else{
        session = await initIBMSession();
        sessManager.addSession(message.from,session);
      }

    assistant.message({
        assistantId: assistantID,
        sessionId: session,
        input: {
            'message_type': 'text',
            'text': message.body
            }
        })
        .then(res => {
            //console.log(JSON.stringify(res.result, null, 2));  
            
            let msg = msgManager.makeMsg(res);

            msgManager.clientSendTxtMsg(client,message.from,msg);
            
                })
        .catch(err => {
          dateError(err);
        })
    
    });

    
}

async function initIBMSession(){
    var session_res = null;
    await assistant.createSession({
      assistantId: assistantID
      })
      .then(res => {
  
        dateLog("Session IBM ID = "+res.result.session_id);
        session_res = res.result.session_id; 
      })
      .catch(err => {
        dateError(err);
      });
  
      return session_res;
  }
  
  function dateLog(text) {
      console.log(new Date(), ' - ', text)
  }
  
  function dateError(text){
    console.error(new Date(), ' - ERROR- ', text)
  }
  
