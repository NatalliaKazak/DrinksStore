var DrinkStorage = new ThashStorage( AddBlock,remBlock );
document.addEventListener("DOMContentLoaded", DrinkStorage.LoadServerStorage, false)
//DrinkStorage.AddToServer добавляем новыую строку на сервер        
   
function AddListeners()     {
  var addReceiptBtn = document.getElementById("addReceipt");
  addReceiptBtn.addEventListener("click",  NewDrink, false);
  var getReceiptBtn = document.getElementById("getReceipt");
  getReceiptBtn.addEventListener("click",  getReceipt, false);
  var getAllNamesBtn = document.getElementById("getAllNames");
  getAllNamesBtn.addEventListener("click",  GetАllDrinksName, false);
  var deleteReceiptBtn = document.getElementById("deleteReceipt");
  deleteReceiptBtn.addEventListener("click",  DeleteItem, false);
  var resetReceiptBtn = document.getElementById("resetReceipts");
  resetReceiptBtn.addEventListener("click", DeleteAllItems, false);
}
AddListeners();
function AddBlock()     {
  var arrayBtn = document.getElementsByClassName("formItem");
  for (var i =0; i< arrayBtn.length; i++) {
    arrayBtn[i].disabled = true;
  }
}
function remBlock()     {
  var arrayBtn = document.getElementsByClassName("formItem");
  for (var i =0; i< arrayBtn.length; i++) {
    arrayBtn[i].disabled = false;
  }
}
function ErrorHandler(jqXHR,StatusStr,ErrorStr) {
    alert('Сервер временно недоступен'); 
    console.log(StatusStr+' '+ErrorStr);
}
function NewDrink() {
  var DrinkName = document.getElementById('dname-field').value; 
  var DrinkIngredients = document.getElementById('ingredients-field').value;
  var DrinkReceipt = document.getElementById('receipt-field').value;
  var DrinkAlcohol = document.getElementById('alcohol-field').value;
  DrinkStorage.AddValue(DrinkName, {'ингредиенты':  DrinkIngredients, 'способ приготовления': DrinkReceipt, 'алкогольный': DrinkAlcohol});
  form1.reset();
}
function getReceipt() {
  var item= document.getElementById('GetDrinksName-field').value;
  var result = DrinkStorage.GetValue(item);
  if ( !result) {
    document.getElementById("GetReceipt-field").innerHTML = 'Такого напитка нет в базе данных'; 
  } else {
    var str = '';
    for (var key in result){
      str += key + ': '+ result[key] + ';' + '\n';
      document.getElementById("GetReceipt-field").innerHTML = str;
    }
  }
}
function GetАllDrinksName() {
  var arr = DrinkStorage.GetKeys();
  if (arr === undefined) {
    document.getElementById('АllDrinksName-field').innerHTML = ""; 
  }else {
    document.getElementById('АllDrinksName-field').innerHTML = arr  
  }
}
function DeleteItem() {
  var item = document.getElementById('DeleteDrinksName-field').value;
  var result = DrinkStorage.DeleteValue(item);
  if (result===true) {
    alert ('Напиток \'' + item + '\' был удален.')
  } else {
    alert ('Такого напитка нет в базе данных.');
  }
}
function DeleteAllItems() {
  DrinkStorage.Reset();
}
function ThashStorage( add, remove) {
	var self = this;
	var StorageA = null;
  var UpdatePassword = null;
  var AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";
  var keyH = 'KAZAK_FD2_DrinksStor'
  self.LoadServerStorage = function (  ) { 
    add();
   	  /* $.ajax(
          { url : AjaxHandlerScript, type : 'POST', cache : false,
            data : { f : 'READ', n : keyH }, success : DrinkStorage.ReadReady, error : ErrorHandler,   xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", Progress, false);
                return xhr;
              } 
            }
        );
     } */
    $.ajax(
      { url : AjaxHandlerScript, type : 'POST', cache : false,
        data : { f : 'READ', n : keyH }, success : ReadReady, error : ErrorHandler }
        );
  }
       
  function ReadReady (ResultH)   {
    if ( ResultH.error!=undefined )
      alert(ResultH.error); 
    else if ( ResultH.result!="" )    {
      StorageA = JSON.parse(ResultH.result);
      remove();
    }
  }
  self.AddValue = function (key,value){
    StorageA[key] = value;
    StoreInfo() ;
  }

  self.DeleteValue = function (key) {
  	if ( key in StorageA){
  		delete StorageA[key];
  		StoreInfo();
      return true; 
    } else {
  		return false;
    }
  }

  self.Reset = function() {
    StorageA = {};
    StoreInfo();
  }

  self.GetKeys = function() {   
    return Object.keys(StorageA);
  }

  self.GetValue = function (key) { 
    return StorageA[key];
  }
  
  function StoreInfo() {
    UpdatePassword=Math.random();
    $.ajax(
      {    url : AjaxHandlerScript, type : 'POST', cache : false,
      data : { f : 'LOCKGET', n : keyH, p : UpdatePassword },
      success : LockGetReady, error : ErrorHandler  }
      );
  } 

  function LockGetReady(ResultH)  {
    if ( ResultH.error!=undefined )
      alert(ResultH.error); 
    else  {
      $.ajax(
        { url : AjaxHandlerScript, type : 'POST', cache : false,
          data : { f : 'UPDATE', n :  keyH, v : JSON.stringify(StorageA), p : UpdatePassword}, success : UpdateReady, error : ErrorHandler  } 
        );
    }
  }

  function UpdateReady(ResultH)      {
    if ( ResultH.error!=undefined )
      alert(ResultH.error); 
  }
    
  self.AddToServer = function ( )  {
    $.ajax(
      {  url : AjaxHandlerScript, type : 'POST', cache : false,
        data : { f : 'INSERT', n : keyH, v : JSON.stringify(StorageA)},
        success : AddInfoReady, error : ErrorHandler}
      );
  } 

  function AddInfoReady(ResultH) {
    if ( ResultH.error!=undefined )
      alert('Сервер временно недоступен');  
  }
}



