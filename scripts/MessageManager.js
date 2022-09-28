const log = require('./Logger')

/**Função que envia a mensagem de resposta. */
function clientSendTxtMsg(client,from , msg){
    client
    .sendText(from, msg)
    .then((result) => {
      log.dateLog("Mensagem enviada com sucesso para o N"+from+".")
    })
    .catch((erro) => {
      log.error('Error when sending: ', erro);
    });
}

/**Função que monta a String da mensagem. */
function makeMsg(res){
    let result = res.result.output.generic;
    let msg = "";

    /**Verifica as mensagens, e os tipos (texto e opção) de mensagens. */
    for(let key in result ){

      if(result[key].response_type === "text"){
        log.dateLog(result[key].text);
        msg = msg+result[key].text+" ";

      }else if(result[key].response_type === "option"){
        log.dateLog(result[key].title)
        msg = msg+"*"+result[key].title+"* \n";

        let options = result[key].options;
        for(let key in options){
          msg = msg+"- "+options[key].label+"\n";
                      

        }
      }
      msg = msg+" \n "            
    }

    return msg;
}



module.exports = {clientSendTxtMsg, makeMsg};