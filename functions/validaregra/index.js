/**
 * Describe Validaregra here.
 *
 * The exported method is the entry point for your code when the function is invoked.
 *
 * Following parameters are pre-configured and provided to your function on execution:
 * @param event: represents the data associated with the occurrence of an event, and
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */
export default async function (event, context, logger) {
/*
  logger.info(`Invoking Validaregra with payload ${JSON.stringify(event.data || {})}`);
  const results = await context.org.dataApi.query('SELECT Id, Name FROM Account');
  logger.info(JSON.stringify(results));
*/
  let results;
  try {
      const dados = event.data;
      let regra = dados.regra;
      let start = new Date().getTime();
      // define regex para adicionar a constante "$data." em cada variavel para ser trocada na formula
      const regex = /[a-zA-Z_]+/g;
      const subst = `\$data.$&`;
      regra = regra.replace(regex, subst);    

      async function wrappedEval(textExpression, contextData){
          let fn = Function(`"use strict"; var $data = this;return (${textExpression})`);
          return fn.bind(contextData)();
      }
      results = JSON.stringify({ resultado : await wrappedEval(regra, dados.parametros) });
      var elapsed = new Date().getTime() - start;
      console.log(elapsed);        
  } catch (e) {
      logger.info(e.message);
  }
  return results;
}
