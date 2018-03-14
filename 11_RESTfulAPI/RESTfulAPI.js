// 詳細教學
// https://nodejust.com/node-js-restful-api-tutorial/


var Http = require( 'http' ),
    Router = require( 'router' ),
    server,
    router;
router = new Router();

//
var BodyParser = require( 'body-parser' );
router.use( BodyParser.text() );

server = Http.createServer( function( request, response ) {
  router( request, response, function( error ) {
    if ( !error ) {
      console.log( "No error.");
      // 感覺writeHead寫狀態碼的時候就算這裡寫4040，一樣會被end("XXX")給蓋過去，導致404不起作用
      response.writeHead( 200 );
    } else {
      // Handle errors
      console.log( error.message, error.stack );
      response.writeHead( 400 );
    }
    response.write("HI~~")
    response.end();
  });
});

server.listen( 3000, function() {
  console.log( 'Listening on port 3000' );
});

// POST
var counter = 0,
    todoList = {};
    
function createItem( request, response ) {
    var id = counter += 1;
    item = request.body;
    console.log( 'Create item', id , item);
    todoList[ id ] = item;
    response.writeHead( 201, {
        'Content-Type' : 'text/plain',
        'Location' : '/todo/' + id
      });
    response.end( 'Item ' + item );
}
router.post( '/todo', createItem );


function readItem( request, response ) {
    var id = request.params.id,
    item = todoList[ id ];
    
    if ( typeof item !== 'string' ) {
    console.log( 'Item not found', id );
    response.writeHead( 404 );
    response.end( 'Item not found\n' );
    return;
    }
    
    console.log( 'Read item', id, item);
    
    response.writeHead( 200, {
    'Content-Type' : 'text/plain'
    });
    response.end( item );
   }
router.get( '/todo/:id', readItem );

// 總之就是了解GET、POST......等等都會用URL來當基本輸入資訊，然後在網址列輸入的預設就是GET
// 然後POST和PUT等除了URL還會在body傳資料，就不會那麼容易被看到有什麼資料往來
// 所以習慣上GET只會用來要資料，不會更動到server的東西
// 疑問是，像POST跟PUT除了方法名字不同，內容差在哪?
// DELETE跟GET不能傳body嗎

/*
你沒辦法直接在HTML的<form>裡面使用GET 與 POST以外的Method

因為瀏覽器都還不知權，如果你想要發送Restful request

一般都要後台程式的支援，而且必須要在<form>裡面藏一個<input name="_method" value="你的HTTP Request方法">

才有辦法送出去喔！
https://progressbar.tw/posts/53
*/