var http = require("http")
var qs = require('querystring');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "157.50.118.159",
  port: '3306',
  user: "qaproot",
  password: "root123",
  database: "qap"
});

function runQuery(query,callback){
	con.connect(function(err) {
	  if (err){
	  	throw err;
	  }
	  console.log("connected");
	  // var sql = 'select * from department';
	  var sql = query;
	  con.query(sql, function(err, result, fields){
	  	if(err){
	  		throw err;
	  	}
	  	/*
	
			result is an object array
			to access elements inside it
			use:
			 result[0].dname
			 result[0].dnumber
	  	*/

	  	// console.log(result[0].dname);


	  	con.end();
	  	callback(result);
	  })
	});
}


http.createServer(function(req,res,){
	console.log(req.url,req.method)
	if (req.method == "POST" && req.url == "/n/") {
		console.log("HIT")
		var body = '';

        	req.on('data', function (data) {
	            body += data;

	            // Too much POST data, kill the connection!
	            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
	            if (body.length > 1e6)
	                req.connection.destroy();
	        });

			req.on('end', function () {
	            var post = qs.parse(body);
	            console.log(post)
	            query = runQuery("select * from attendance where date='2018-04-01';",
	            	function(result){
	            		res.writeHead(200,{"Content-type":"text/plain"});
			            // var msg = `{ "roll":"`+result.rno+`"}`;
			            var msg = [];
			            for(var i=0;i<result.length;i++){
			            	msg[i] = `{ "roll":"`+result[i].rno+`"}`;
			            }
			            console.log(msg);
			            res.write(msg[0])
			            res.end();		
	            	})
	            
	        })
	}
	
}).listen(3000,function(){console.log("started.. 3000")})


