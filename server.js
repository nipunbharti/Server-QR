var http = require("http")
var qs = require('querystring');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "har@localhost",
  password: "abcdef123",
  database: "IRMS"
});

con.connect(function(err){
	if(err) throw err;
})

function runQuery1(query,callback){

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


	  	callback(result);
	  })

}

function runQuery2(query,callback){

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


	  	callback(result);
	  })

}


http.createServer(function(req,res,){
	console.log(req.url,req.method)
	if (req.method == "POST" && req.url == "/n1/") {
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
	            console.log(body.first)
	            query = runQuery1("select * from CR;",
	            	function(result){
	            		res.writeHead(200,{"Content-type":"text/plain"});
			            // var msg = `[`;
			            // for(var i=0;i<result.length;i++){
			            // 	msg += (`{"name":"`+result[i].name+`","roll":"`+result[i].rno+`","attendance":"`+result[i].attendance+`"}`);
			            // 	if(i != result.length-1){
			            // 		msg+=`,`
			            // 	}
			            // }
			            // msg += `]`


			            // console.log(msg);
			            // res.write(0)
			            res.end();
	            	})

	        })
	}
	if (req.method == "POST" && req.url == "/n2/") {
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
	            query = runQuery2("select b.name, a.rno from attendance a, student b where a.rno = b.rollno and a.cno='1' and a.attendance = 'A' group by a.rno having count(a.rno)>1;",
	            	function(result){
	            		res.writeHead(200,{"Content-type":"text/plain"});
			            var msg = `[`;
			            for(var i=0;i<result.length;i++){
			            	msg += (`{"name":"`+result[i].name+`","roll":"`+result[i].rno+`"}`);
			            	if(i != result.length-1){
			            		msg+=`,`
			            	}
			            }
			            msg += `]`

			            console.log(msg);
			            // console.log(msg);
			            res.write(msg)
			            res.end();
	            	})

	        })
	}

}).listen(3000,function(){console.log("started.. 3000")})
