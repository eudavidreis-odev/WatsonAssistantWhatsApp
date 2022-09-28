const wa = require('@open-wa/wa-automate');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const log = require('./scripts/Logger');
const sessManager = require('./scripts/SessionManager');
const msgManager = require('./scripts/MessageManager');

const TWENTY_MINUTES = 1200000;

log.dateLog('Started index.js');



/**Configuração Watson.
 * Use suas credenciais aqui. */ 
const assistantID = '[ASSISTANT ID]';

const assistant = new AssistantV2({
  version: '[Uma data no formato 2022-09-13]',
  authenticator: new IamAuthenticator({
    apikey: '[API KEY]',
  }),
  serviceUrl: '[URI DO WATSON ASSISTANT]',
});

/**Inicia o cliente Wa Automate. */ 
wa.create({
  sessionId: "My Assistant",
  multiDevice: true, //ativa o suporte a multidevices
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: false,
  chromiumArgs: [
    /*
    Argumentos passados ao Chromium do Wa Automate NodeJS (Puppeter) para aumentar a compatibilidade com a Heroku.
    */
   '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  qrTimeout: 0, //0 Faz o QR esperar infinitamente pelo scan.
}).then(client => start(client)).catch(err=>{
  log.dateError(err);
});


/**Função executada após o Wa client ser iniciado. */
function start(_client) {
    let client = _client;  
    
    /**Ao receber uma mensagem, o client executa uma função. */
    client.onMessage(async (message) => {

      /**Variavel que guardará (neste escopo) a sessão do Watson Assistant. */
      let session;

      /**Checa se já existe uma sessão ativa para esse numero. */
      if(sessManager.checkSessionExist(message.from)){
        /**Se sim, busca a sessão com base no telefone.*/
        session = sessManager.getSessionByPhone(message.from);
      }else{
        /**Se não, inicia uma nova sessão com o Watson. */
        session = await initIBMSession();
        /**E adiciona essa sessão para fins de controle. */
        sessManager.addSession(message.from,session);
      }

    /**Envia a mensagem para o Watson analisar. */  
    assistant.message({
        assistantId: assistantID,
        sessionId: session,
        input: {
            'message_type': 'text',
            'text': message.body
            }
        })
        .then(res => {
          /**Monta a string da mensagem. */  
          let msg = msgManager.makeMsg(res);

          /**Envia a mensagem de resposta. */
          msgManager.clientSendTxtMsg(client,message.from,msg);
        
        })
        .catch(err => {
          log.dateError(err);
        })
    
    });

    
}

/**Inicia uma sessão do Watson Assistant e retorna o sessionID. */
async function initIBMSession(){
    let session_res = null;
    await assistant.createSession({
      assistantId: assistantID
      })
      .then(res => {
        log.dateLog("Session IBM ID = "+res.result.session_id);
        session_res = res.result.session_id; 
      })
      .catch(err => {
        log.dateError(err);
      });
  
      return session_res;
  }
