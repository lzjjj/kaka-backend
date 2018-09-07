var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : '111.230.228.102',       
  user     : 'root',              
  password : 'ab18826107953',       
  port: '3306',                   
  database: 'kaka_node_server', 
  multipleStatements: true,
  dateStrings:true
}); 
connection.connect();

module.exports=connection;
