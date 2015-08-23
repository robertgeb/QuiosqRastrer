var http = require('http'),       //Requerendo módulos.
    fs = require('fs'),
    querystring = require('querystring'),
    cheerio = require('cheerio'); //Modulo para tratar DOM html

var contentPOST = querystring.stringify({ //Conteudo do POST
    'edtIdUs': '2014390221',
    'edtIdSen': '150796',
    'btnIdOk': 'Ok'
  });

var headerPOST = {      //header da requisição POST
    host: 'academico.ufrrj.br',
    path: '/quiosque/aluno/quiosque.php',
    method: 'POST',
    headers: {
      'Content-Length': contentPOST.length,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

var cookie = '';
var cliente = http.request(headerPOST, function(resp){
  resp.setEncoding('utf8');
  cookie = resp.headers['set-cookie'][0];
  cookie = cookie.substring(0, cookie.indexOf(';'))
  var html = '';
  resp.on('data', function(data){
    html += data;
  });
  resp.on('end', function(){
    var $ = cheerio.load(html);
    $('a').each(function(index, elem) {
      if(index<15){
        console.log(index+' : '+elem.attribs['href']);
        buscalink(cookie, elem.attribs['href']);
      };
    });
  });
});
cliente.setMaxListeners(0);
cliente.on('error', function(e) {
console.log('DEU ZEBU NA REQUISIçÃO: ' + e.message);
});
cliente.write(contentPOST);
cliente.end();

var headerGET = {
  host: 'academico.ufrrj.br',
  path: '/quiosque/aluno/quiosque.php?pag=horario',
  method: 'GET',
  headers: {
    'Cookie': '',
    'Connection': 'keep-alive'
  }
}

function buscalink(cookie, link){
  headerGET['headers']['Cookie'] = cookie;
  headerGET['path'] = '/quiosque/aluno/'+link;
  var cli = http.request(headerGET, function(resp){
    resp.setEncoding('utf8');
    var html = '';
    resp.on('data', function(data){
      html += data;
    });
    resp.on('end', function(){
      fs.writeFile(link.substring(link.indexOf('=')+'.html'), html,function(){
        console.log(link+' salvo.');
      });
    });
  });
  cliente.on('error', function(e) {
    console.log('DEU ZEBU NA REQUISIçÃO: '+ e.message);
  });
  cli.end();
};
