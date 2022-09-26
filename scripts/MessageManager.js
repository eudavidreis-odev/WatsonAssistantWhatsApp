
function clientSendTxtMsg(client,from , msg){
    client
    .sendText(from, msg)
    .then((result) => {
      //console.log('Result: ', result); //return object success
      console.log("Mensagem enviada com sucesso para o N"+from+".")
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
    });
}

function makeMsg(res){
    var result = res.result.output.generic;
    var msg = "";

    for(var key in result ){

      if(result[key].response_type === "text"){
        console.log(result[key].text);
        msg = msg+result[key].text+" ";

      }else if(result[key].response_type === "option"){
        console.log(result[key].title)
        msg = msg+"*"+result[key].title+"* \n";

        var options = result[key].options;
        for(var key in options){
          msg = msg+"- "+options[key].label+"\n";
                      

        }
      }else if(result[key].response_type === "image") 
      msg = msg+" \n "            
    }

    return msg;
}



module.exports = {clientSendTxtMsg, makeMsg};